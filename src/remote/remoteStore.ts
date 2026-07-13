import { create } from 'zustand'
import type { RemoteCommand, RemoteState, WireMessage } from './protocol'
import { startController, startHost, type TransportHandle, type TransportStatus } from './transport'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'

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
  return {
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
  }
  publishState(true)
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
