import type { AppSettings, PrompterConfig } from '../types'

/** Built-in preset id, always present. */
export const DEFAULT_PRESET_ID = 'default'

export const DEFAULT_CONFIG: PrompterConfig = {
  transform: { rotateDeg: 0, mirrorX: false, mirrorY: false },
  typography: {
    fontSizePx: 64,
    lineHeight: 1.35,
    fontWeight: 500,
    textAlign: 'center',
    letterSpacingPx: 0,
    wordSpacingPx: 0,
    marginXPercent: 8,
    allCaps: false,
    dyslexiaFont: false,
  },
  scroll: {
    speedWpm: 120,
    countdownSeconds: 3,
    preRollVh: 33,
    loop: false,
  },
  colors: { background: '#000000', text: '#ffffff' },
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultPresetId: DEFAULT_PRESET_ID,
  autoHideControls: true,
  gesturesEnabled: false,
  keyboardShortcutsEnabled: true,
  continueFromLastPosition: true,
  keepAwake: true,
}

// --- Control limits (single source of truth used across UI + keyboard) ---
export const FONT_MIN = 24
export const FONT_MAX = 160
export const FONT_STEP = 4

export const WPM_MIN = 10
export const WPM_MAX = 300
export const WPM_STEP_SMALL = 5
export const WPM_STEP_LARGE = 10

export const LINE_HEIGHT_MIN = 1.1
export const LINE_HEIGHT_MAX = 2.0

export const MARGIN_MIN = 0
export const MARGIN_MAX = 25

export const LETTER_SPACING_MIN = -2
export const LETTER_SPACING_MAX = 12

export const WORD_SPACING_MIN = 0
export const WORD_SPACING_MAX = 32

export const PREROLL_MIN = 0
export const PREROLL_MAX = 90

/** Seconds jumped by rewind / forward controls. */
export const NUDGE_SECONDS = 5

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
