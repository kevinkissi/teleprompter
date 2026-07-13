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

/**
 * "Lens window" — confines the reading text to a centered square roughly the size of
 * the camera's lens opening, so the reader's eyes stay over the lens and always appear
 * to look straight into the camera. Everything outside the window is masked.
 */
export interface LensWindow {
  enabled: boolean
  /** Window side length in millimetres (mapped to px via the device density). */
  sizeMm: number
  /** Draw a thin outline around the window. */
  showBorder: boolean
  /** Soft fade at the top/bottom edges of the window instead of a hard clip. */
  edgeFade: boolean
}

/** The full live prompter configuration. A Preset is a saved snapshot of this. */
export interface PrompterConfig {
  transform: TransformState
  typography: Typography
  scroll: ScrollConfig
  colors: Colors
  lens: LensWindow
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
  /** Archived ("done") scripts are hidden from the active list but kept and restorable. */
  archived?: boolean
  /** When it was archived (ISO); used to sort the archive bucket most-recent-first. */
  archivedAt?: string
}

export interface AppSettings {
  defaultPresetId: string
  autoHideControls: boolean
  gesturesEnabled: boolean
  keyboardShortcutsEnabled: boolean
  continueFromLastPosition: boolean
  keepAwake: boolean
}
