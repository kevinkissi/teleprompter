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
  lens: {
    // On by default: the window is the reason the app is on a beam-splitter at
    // all. It stays adjustable, and the switch turns it OFF.
    enabled: true,
    // 40mm, not 70: the phone is 73mm wide, so a 70mm window was 98% of the
    // screen and enabling it looked like nothing had happened. This one is
    // visibly a window, and the presets go tighter still.
    sizeMm: 40,
    showBorder: true,
    edgeFade: true,
  },
  slide: {
    // Continuous is what the app has always done, so that is what it still does
    // until you choose otherwise.
    mode: 'continuous',
    advance: 'manual',
    // 165 wpm: the bundled scripts declare ~90s for ~280 spoken words, which is
    // ~185 wpm delivered. 165 leaves a little room rather than chasing you.
    wpm: 165,
    gapSeconds: 0.6,
    fontPx: 0, // 0 = automatic, sized to the lens window
  },
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

export const LENS_MIN_MM = 20
export const LENS_MAX_MM = 120

// --- Slide Mode ---
export const SLIDE_WPM_MIN = 60
export const SLIDE_WPM_MAX = 300
export const SLIDE_WPM_STEP = 5
export const SLIDE_GAP_MIN = 0
export const SLIDE_GAP_MAX = 5
export const SLIDE_GAP_STEP = 0.1
/** Floor on a slide's display time, so a two-word slide is never a flash. */
export const SLIDE_MIN_SECONDS = 1.2
/** Time to find your place on a fresh slide, before the first word. Continuous
 *  scrolling gives you the next lines in peripheral vision; a slide does not. */
export const SLIDE_READ_IN_BASE = 0.25
export const SLIDE_READ_IN_PER_WORD = 0.05
export const SLIDE_READ_IN_MAX = 1.2

/** Seconds jumped by rewind / forward controls. */
export const NUDGE_SECONDS = 5

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
