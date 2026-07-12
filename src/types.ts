// Core domain types for the teleprompter app.

export type RotateDeg = 0 | 90 | -90 | 180
export type FontWeight = 400 | 500 | 600 | 700
export type TextAlign = 'left' | 'center'
export type CountdownSeconds = 0 | 3 | 5 | 10

/** Screen/mirror orientation applied to the reading content. */
export interface TransformState {
  rotateDeg: RotateDeg
  mirrorX: boolean
  mirrorY: boolean
}

export interface Typography {
  fontSizePx: number
  lineHeight: number
  fontWeight: FontWeight
  textAlign: TextAlign
  letterSpacingPx: number
  wordSpacingPx: number
  /** Horizontal margin per side, as a percentage of the reading column width. */
  marginXPercent: number
  allCaps: boolean
  dyslexiaFont: boolean
}

export interface ScrollConfig {
  speedWpm: number
  countdownSeconds: CountdownSeconds
  /** Blank top padding before the first line, as a fraction (%) of the reading window. */
  preRollVh: number
  loop: boolean
}

export interface Colors {
  background: string
  text: string
}

/** The full live prompter configuration. A Preset is a saved snapshot of this. */
export interface PrompterConfig {
  transform: TransformState
  typography: Typography
  scroll: ScrollConfig
  colors: Colors
}

export interface Preset extends PrompterConfig {
  id: string
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Script {
  id: string
  title: string
  body: string
  notes?: string
  createdAt: string
  updatedAt: string
  lastPositionPx: number
  estimatedReadTimeSeconds?: number
  presetId?: string
}

export interface AppSettings {
  defaultPresetId: string
  autoHideControls: boolean
  gesturesEnabled: boolean
  keyboardShortcutsEnabled: boolean
  continueFromLastPosition: boolean
  keepAwake: boolean
}
