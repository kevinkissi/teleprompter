// Wire protocol for laptop <-> phone remote control (WebRTC data channel).

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

export interface RemoteScriptRef {
  id: string
  title: string
}

/** The phone's live state, streamed to the laptop so it mirrors what's happening. */
export interface RemoteState {
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
  scripts: RemoteScriptRef[] // active (non-archived) scripts to choose from
}

export type WireMessage =
  | { t: 'cmd'; cmd: RemoteCommand }
  | { t: 'state'; state: RemoteState }
  | { t: 'reqState' }
