import { create } from 'zustand'
import { PROTOCOL_VERSION, type RemoteCommand, type RemoteState, type WireMessage } from './protocol'
import { startController, startHost, type TransportHandle, type TransportStatus } from './transport'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'
import {
  LENS_MAX_MM,
  LENS_MIN_MM,
  SLIDE_GAP_MAX,
  SLIDE_GAP_MIN,
  SLIDE_WPM_MAX,
  SLIDE_WPM_MIN,
  clamp,
} from '../state/defaults'
import { slideText } from '../utils/slides'

export type RemoteRole = 'off' | 'host' | 'controller'
export type RemoteStatus = 'idle' | 'connecting' | 'waiting' | 'connected' | 'disconnected' | 'error'

interface RemoteStoreState {
  role: RemoteRole
  status: RemoteStatus
  code: string
  error: string | null
  /** The controller's mirror of the phone's live state (null until first update). */
  remoteState: RemoteState | null

  enableHost: () => Promise<void>
  connectController: (code: string) => Promise<void>
  disconnect: () => void
  sendCommand: (cmd: RemoteCommand) => void
}

const PUBLISH_MIN_MS = 150
const HEARTBEAT_MS = 2000
const STALE_MS = 6000

// Live transport + timers live outside React state (they aren't serializable).
let handle: TransportHandle | null = null
let unsubscribeApp: (() => void) | null = null
let heartbeat: ReturnType<typeof setInterval> | null = null
let staleTimer: ReturnType<typeof setInterval> | null = null
let trailingTimer: ReturnType<typeof setTimeout> | null = null
let lastSentAt = 0
let lastRecvAt = 0
let hostRetried = false
// Bumped on every (dis)connect so an in-flight async setup can detect it was superseded.
let generation = 0

/** 5 unambiguous chars (no 0/O/1/I) — random enough to avoid broker id collisions. */
function makeCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

function buildState(): RemoteState {
  const s = useAppStore.getState()
  const current = s.scripts.find((x) => x.id === s.currentScriptId)
  const body = current?.body ?? ''
  const slide = s.slides[s.slideIndex]
  const nextSlide = s.slides[s.slideIndex + 1]
  return {
    protocolVersion: PROTOCOL_VERSION,
    view: s.view,
    currentScriptId: s.currentScriptId,
    currentTitle: current?.title ?? '',
    playing: s.playing,
    countingDown: s.countingDown,
    ended: s.ended,
    progress: s.progress,
    remainingSeconds: s.remainingSeconds,
    speedWpm: s.config.scroll.speedWpm,
    fontSizePx: s.config.typography.fontSizePx,
    lensEnabled: s.config.lens.enabled,
    lensSizeMm: s.config.lens.sizeMm,
    playbackMode: s.config.slide.mode,
    slideAdvance: s.config.slide.advance,
    slideIndex: s.slides.length > 0 ? s.slideIndex : -1,
    slideCount: s.slides.length,
    slideText: slide ? slideText(body, slide) : '',
    nextSlideText: nextSlide ? slideText(body, nextSlide) : '',
    slideContinues: slide?.continues ?? false,
    slideSeconds: s.slides.length > 0 ? s.slideSecondsFor(s.slideIndex) : 0,
    slideRemainingSeconds: s.slideRemainingSeconds,
    slideSecondsOverridden:
      slide !== undefined &&
      s.slideSecondsOverrides[`${s.currentScriptId ?? ''}:${slide.start}`] !== undefined,
    prompterPaused: s.prompterPaused,
    slideFontPx: s.slideFontPx,
    wholeSentencePct: s.wholeSentencePct,
    slideWpm: s.config.slide.wpm,
    slideGapSeconds: s.config.slide.gapSeconds,
    recording: s.recording,
    scripts: s.scripts.filter((x) => !x.archived).map((x) => ({ id: x.id, title: x.title })),
  }
}

/**
 * Send the phone's state to the laptop, rate-limited — but with a trailing edge so
 * the FINAL state of a burst is never dropped (e.g. end-of-scroll fires progress,
 * then playing:false, then ended:true in one tick; without a trailing send the
 * laptop would be stuck showing "Playing" and a Play/Pause tap could restart it).
 */
function publishState(force = false): void {
  if (!handle) return
  const now = Date.now()
  const since = now - lastSentAt
  if (!force && since < PUBLISH_MIN_MS) {
    if (!trailingTimer) {
      trailingTimer = setTimeout(() => {
        trailingTimer = null
        publishState(true)
      }, PUBLISH_MIN_MS - since + 5)
    }
    return
  }
  if (trailingTimer) {
    clearTimeout(trailingTimer)
    trailingTimer = null
  }
  lastSentAt = now
  handle.send({ t: 'state', state: buildState() })
}

/** Millimetres off the wire → a whole number the phone's own slider could have produced. */
function clampLensMm(mm: number): number {
  return clamp(Math.round(mm), LENS_MIN_MM, LENS_MAX_MM)
}

/**
 * Actions a controller can emit as fast as a key repeats. These publish through
 * the 150ms limiter instead of forcing a send, so holding Next cannot turn into
 * a burst of full state frames — the trailing edge still guarantees the final
 * state of the burst is delivered.
 */
const HIGH_RATE_ACTIONS = new Set<RemoteCommand['action']>([
  'gotoSlide',
  'slideDelta',
  'setSlideTiming',
  'lensSize',
  'lensDelta',
])

/** Run a controller command on the phone, reusing the exact same actions as the local UI. */
function applyCommand(cmd: RemoteCommand): void {
  const s = useAppStore.getState()
  const sc = scrollController.current
  // Scroll-engine controls only do anything while the reader is mounted (view==='reader');
  // ignore them otherwise so we never strand state (e.g. a countdown that can't resolve).
  const inReader = s.view === 'reader'
  switch (cmd.action) {
    case 'togglePlay':
      if (inReader) s.togglePlay()
      break
    case 'play':
      if (inReader) sc.play()
      break
    case 'pause':
      if (inReader) sc.pause()
      break
    case 'restart':
      if (inReader) {
        sc.jumpTop()
        sc.play()
      }
      break
    case 'top':
      if (inReader) sc.jumpTop()
      break
    case 'bottom':
      if (inReader) sc.jumpBottom()
      break
    case 'nudge':
      if (inReader) sc.nudgeSeconds(cmd.seconds)
      break
    case 'speedDelta':
      s.adjustSpeed(cmd.delta)
      break
    case 'fontDelta':
      s.adjustFont(cmd.delta)
      break
    case 'openScript':
      s.openReader(cmd.id)
      break
    case 'closeReader':
      s.closeReader()
      break
    case 'mirror':
      s.toggleMirrorX()
      break
    case 'rotate':
      s.rotate(1)
      break
    // Lens window: same setLens the reader's own slider and switch call, so the
    // window resizes live whether the reader is open or not.
    case 'lensSize':
      if (Number.isFinite(cmd.sizeMm)) s.setLens({ sizeMm: clampLensMm(cmd.sizeMm) })
      break
    case 'lensDelta':
      if (Number.isFinite(cmd.delta)) s.setLens({ sizeMm: clampLensMm(s.config.lens.sizeMm + cmd.delta) })
      break
    case 'lensEnabled':
      s.setLens({ enabled: cmd.enabled === true })
      break

    // --- Slide Mode -------------------------------------------------------
    // Presentation only. Nothing below can reach a camera or a microphone:
    // the phone has no capture, and on the Mac these are sent by a controller
    // that holds no reference to a recording object.
    case 'setPlaybackMode':
      if (cmd.mode === 'continuous' || cmd.mode === 'slide') s.setPlaybackMode(cmd.mode)
      break
    case 'setSlideAdvance':
      if (cmd.advance === 'manual' || cmd.advance === 'auto') s.setSlideAdvance(cmd.advance)
      break
    case 'gotoSlide':
      if (inReader && Number.isFinite(cmd.index)) s.gotoSlide(cmd.index)
      break
    case 'slideDelta':
      if (inReader && Number.isFinite(cmd.delta)) s.stepSlide(cmd.delta)
      break
    case 'setSlideTiming': {
      const patch: { wpm?: number; gapSeconds?: number } = {}
      if (Number.isFinite(cmd.wpm)) {
        patch.wpm = clamp(Math.round(cmd.wpm as number), SLIDE_WPM_MIN, SLIDE_WPM_MAX)
      }
      if (Number.isFinite(cmd.gapSeconds)) {
        patch.gapSeconds =
          Math.round(clamp(cmd.gapSeconds as number, SLIDE_GAP_MIN, SLIDE_GAP_MAX) * 10) / 10
      }
      if (Object.keys(patch).length > 0) s.setSlideConfig(patch)
      break
    }
    case 'setSlideSeconds':
      if (Number.isFinite(cmd.index)) {
        s.setSlideSeconds(cmd.index, Number.isFinite(cmd.seconds) ? (cmd.seconds as number) : null)
      }
      break
    // Freeze / resume the teleprompter ONLY. `sc.pause()` stops the scroll loop
    // or the slide timer, whichever stage is mounted; neither knows anything
    // about capture, which is why recording is unaffected by definition.
    case 'pausePrompter':
      if (inReader) sc.pause()
      break
    case 'resumePrompter':
      if (inReader) sc.play()
      break
    case 'setRecording':
      s.setRecording(cmd.recording === true)
      break
  }
  publishState(!HIGH_RATE_ACTIONS.has(cmd.action))
}

export const useRemoteStore = create<RemoteStoreState>((set, get) => ({
  role: 'off',
  status: 'idle',
  code: '',
  error: null,
  remoteState: null,

  async enableHost() {
    get().disconnect()
    const gen = generation
    hostRetried = false
    const code = makeCode()
    set({ role: 'host', status: 'connecting', code, error: null })
    try {
      const h = await startHost(code, {
        onStatus: (st: TransportStatus, errorType) => {
          if (gen !== generation) return
          if (st === 'error' && errorType === 'unavailable-id' && !hostRetried) {
            hostRetried = true
            void get().enableHost()
            return
          }
          if (st === 'connected') {
            set({ status: 'connected', error: null })
            publishState(true)
          } else if (st === 'disconnected') {
            set({ status: 'waiting' }) // controller left; keep hosting
          } else if (st === 'error') {
            set({ status: 'error', error: errorType ?? 'error' })
          } else {
            set({ status: st, error: null })
          }
        },
        onMessage: (msg: WireMessage) => {
          if (gen !== generation) return
          if (msg.t === 'cmd') applyCommand(msg.cmd)
          else if (msg.t === 'reqState') publishState(true)
        },
      })
      if (gen !== generation) {
        h.close() // torn down while the peerjs import / setup was in flight
        return
      }
      handle = h
      unsubscribeApp = useAppStore.subscribe(() => publishState())
      heartbeat = setInterval(() => publishState(true), HEARTBEAT_MS)
    } catch (e) {
      if (gen === generation) set({ status: 'error', error: e instanceof Error ? e.message : String(e) })
    }
  },

  async connectController(codeInput) {
    get().disconnect()
    const gen = generation
    const code = codeInput.trim().toUpperCase()
    set({ role: 'controller', status: 'connecting', code, error: null, remoteState: null })
    try {
      const h = await startController(code, {
        onStatus: (st: TransportStatus, errorType) => {
          if (gen !== generation) return
          if (st === 'connected') {
            lastRecvAt = Date.now()
            set({ status: 'connected', error: null })
            h.send({ t: 'reqState' })
          } else if (st === 'error') {
            set({ status: 'error', error: errorType ?? 'error' })
          } else {
            set({ status: st, error: null })
          }
        },
        onMessage: (msg: WireMessage) => {
          if (gen !== generation) return
          lastRecvAt = Date.now()
          if (get().status === 'disconnected') set({ status: 'connected' })
          if (msg.t === 'state') set({ remoteState: msg.state })
        },
      })
      if (gen !== generation) {
        h.close()
        return
      }
      handle = h
      // Detect a dead link (phone WiFi drop / tab killed) when heartbeats stop arriving.
      staleTimer = setInterval(() => {
        if (gen !== generation) return
        if (get().status === 'connected' && Date.now() - lastRecvAt > STALE_MS) {
          set({ status: 'disconnected' })
        }
      }, HEARTBEAT_MS)
    } catch (e) {
      if (gen === generation) set({ status: 'error', error: e instanceof Error ? e.message : String(e) })
    }
  },

  disconnect() {
    generation++ // invalidate any in-flight enableHost/connectController
    if (trailingTimer) {
      clearTimeout(trailingTimer)
      trailingTimer = null
    }
    if (heartbeat) {
      clearInterval(heartbeat)
      heartbeat = null
    }
    if (staleTimer) {
      clearInterval(staleTimer)
      staleTimer = null
    }
    if (unsubscribeApp) {
      unsubscribeApp()
      unsubscribeApp = null
    }
    if (handle) {
      handle.close()
      handle = null
    }
    set({ role: 'off', status: 'idle', error: null, remoteState: null })
  },

  sendCommand(cmd) {
    handle?.send({ t: 'cmd', cmd })
  },
}))
