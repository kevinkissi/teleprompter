// Wire protocol for laptop <-> phone remote control (WebRTC data channel).
//
// MIRRORED BY HAND in two files in the Studio OS repo:
//   zofstudio/Sources/ZofStudio/Resources/remote/controller.js  (forwardState)
//   zofstudio/Sources/ZofStudio/TeleprompterController.swift    (applyState)
// `npm run verify:protocol` fails the build if the three drift apart.

/**
 * Bumped whenever a field or command is added. The phone is a PWA that only
 * picks up a new build on a deploy, so a newer Studio OS can easily be talking
 * to an older phone; Studio OS reads this and disables the controls that phone
 * cannot honour, instead of sending commands that silently do nothing.
 *
 *   1 — original remote (playback, speed, font, scripts, orientation)
 *   2 — lens window (lensSize / lensDelta / lensEnabled)
 *   3 — Slide Mode, teleprompter pause/resume, recording state
 */
export const PROTOCOL_VERSION = 3

/** A control the laptop (controller) sends to the phone (host). */
export type RemoteCommand =
  | { action: 'togglePlay' }
  | { action: 'play' }
  | { action: 'pause' }
  | { action: 'restart' } // jump to top and start scrolling
  | { action: 'top' }
  | { action: 'bottom' }
  | { action: 'nudge'; seconds: number }
  | { action: 'speedDelta'; delta: number }
  | { action: 'fontDelta'; delta: number }
  | { action: 'openScript'; id: string }
  | { action: 'closeReader' }
  | { action: 'mirror' }
  | { action: 'rotate' }
  // Lens window — the reading square over the camera lens. Sizes are real
  // millimetres and are clamped on the phone to LENS_MIN_MM..LENS_MAX_MM.
  // `lensSize` is absolute so a slider on the controller can never drift from
  // what the phone is showing; `lensDelta` suits a key or a step button.
  | { action: 'lensSize'; sizeMm: number }
  | { action: 'lensDelta'; delta: number }
  | { action: 'lensEnabled'; enabled: boolean }
  // --- Slide Mode (protocol 3) ---------------------------------------------
  // These only ever change how the teleprompter PRESENTS the script. None of
  // them touches capture: the phone does not record, and on the Mac they all
  // terminate in TeleprompterController, which cannot name a recording object.
  /** Continuous scrolling, or one section at a time. */
  | { action: 'setPlaybackMode'; mode: 'continuous' | 'slide' }
  /** Who advances the slides — you, or the timer. */
  | { action: 'setSlideAdvance'; advance: 'manual' | 'auto' }
  /** Absolute, so a controller's own slide number can never drift from the
   *  phone's. Next/Previous on the desktop send this, not a delta. */
  | { action: 'gotoSlide'; index: number }
  /** Relative step, for a key or a phone gesture where there is no local mirror. */
  | { action: 'slideDelta'; delta: number }
  /** Global slide timing. Either field may be omitted. */
  | { action: 'setSlideTiming'; wpm?: number; gapSeconds?: number }
  /** Override one slide's display time in seconds; null restores the derived one. */
  | { action: 'setSlideSeconds'; index: number; seconds: number | null }
  /** Freeze / resume the TELEPROMPTER only. Recording is a separate system and
   *  keeps rolling either way. */
  | { action: 'pausePrompter' }
  | { action: 'resumePrompter' }
  /** Studio OS tells the phone a take is rolling, so the reader can show it.
   *  Purely informational — the phone has no capture of its own to start or
   *  stop, and no behaviour branches on it. A lens change mid-take is handled by
   *  the reading anchor instead: re-segmenting keeps your place and your
   *  remaining time, so there is nothing to defer. */
  | { action: 'setRecording'; recording: boolean }

export interface RemoteScriptRef {
  id: string
  title: string
}

/** The phone's live state, streamed to the laptop so it mirrors what's happening. */
export interface RemoteState {
  protocolVersion: number
  view: 'library' | 'reader' | 'remote'
  currentScriptId: string | null
  currentTitle: string
  playing: boolean
  countingDown: boolean
  ended: boolean
  progress: number // 0..1
  remainingSeconds: number
  speedWpm: number
  fontSizePx: number
  lensEnabled: boolean
  lensSizeMm: number
  // --- Slide Mode (protocol 3) ---
  /** '' from a phone too old to know about modes — never a legal value. */
  playbackMode: 'continuous' | 'slide' | ''
  slideAdvance: 'manual' | 'auto'
  /** -1 when not applicable; 0 is a real slide, so it cannot be the sentinel. */
  slideIndex: number
  /** 0 until a segmentation exists; a segmented body always yields at least 1. */
  slideCount: number
  /** The words on the lens right now, and the ones coming next. */
  slideText: string
  nextSlideText: string
  /** This slide continues a sentence the previous one began. */
  slideContinues: boolean
  /** Whole display time of the current slide, in seconds. */
  slideSeconds: number
  /** Seconds left AS OF THE LAST CHANGE — not a running countdown. The phone
   *  only rewrites it on an edge (slide change, pause, resume, retiming), so a
   *  controller can anchor on it and count down against its own clock without
   *  the two devices needing a shared one. */
  slideRemainingSeconds: number
  /** True when this slide's time was set by hand rather than derived. */
  slideSecondsOverridden: boolean
  /** The teleprompter is frozen. Says nothing about camera or microphone. */
  prompterPaused: boolean
  /** Type size the slides are laid out at, and how much of the script lands on
   *  a slide as whole sentences at the current lens size. */
  slideFontPx: number
  wholeSentencePct: number
  slideWpm: number
  slideGapSeconds: number
  /** Studio OS's recording state as last pushed, echoed for confirmation. */
  recording: boolean
  scripts: RemoteScriptRef[] // active (non-archived) scripts to choose from
}

export type WireMessage =
  | { t: 'cmd'; cmd: RemoteCommand }
  | { t: 'state'; state: RemoteState }
  | { t: 'reqState' }
