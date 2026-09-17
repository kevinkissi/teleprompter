import { LENS_MIN_MM, clamp } from '../state/defaults'

/**
 * CSS pixels per millimetre for the target device (iPhone 17 Pro Max):
 * 460 physical ppi ÷ 25.4 mm/in ÷ 3× device-pixel-ratio ≈ 6.04 CSS px/mm.
 * A beam-splitter reflects the screen 1:1, so N mm on screen ≈ N mm over the lens.
 * (Fine-tuning is visual against the real lens, so small density errors don't matter.)
 */
export const LENS_PX_PER_MM = 460 / 25.4 / 3

/** iPhone 17 Pro Max active display size in millimetres (for the Setup preview). */
export const IPHONE_17PM_SCREEN_MM = { width: 72.9, height: 158.4 }

export function mmToPx(mm: number): number {
  return mm * LENS_PX_PER_MM
}

export function pxToMm(px: number): number {
  return px / LENS_PX_PER_MM
}

/**
 * The window is a centered square. Convert the requested mm size to px and cap it to
 * the shorter screen dimension so the whole window stays on screen.
 */
export function lensWindowSizePx(sizeMm: number, viewportW: number, viewportH: number): number {
  const maxPx = Math.max(1, Math.min(viewportW, viewportH))
  return Math.round(clamp(mmToPx(sizeMm), mmToPx(LENS_MIN_MM), maxPx))
}

export interface LensPreset {
  id: string
  label: string
  sizeMm: number
}

/**
 * Window sizes to pick from, smallest first. The filter-thread sizes match a lens
 * front 1:1 through the beam-splitter; the ones below 49mm are smaller than any
 * thread on purpose — the window only has to cover where the eyes travel, and a
 * tighter window is what stops a viewer seeing them read.
 */
export const LENS_PRESETS: LensPreset[] = [
  { id: 'tight-30', label: 'Tight (30mm)', sizeMm: 30 },
  { id: 'tight-35', label: 'Tight (35mm)', sizeMm: 35 },
  { id: 'tight-40', label: 'Tight (40mm)', sizeMm: 40 },
  { id: 'filter-43', label: '43mm filter', sizeMm: 43 },
  { id: 'filter-46', label: '46mm filter', sizeMm: 46 },
  { id: 'filter-49', label: '49mm filter', sizeMm: 49 },
  { id: 'filter-52', label: '52mm filter', sizeMm: 52 },
  { id: 'filter-55', label: '55mm filter', sizeMm: 55 },
  { id: 'filter-58', label: '58mm filter', sizeMm: 58 },
  { id: 'filter-62', label: '62mm filter', sizeMm: 62 },
  { id: 'sony-2470-f4', label: 'Sony 24–70 f/4 (67mm)', sizeMm: 67 },
  { id: 'filter-72', label: '72mm filter', sizeMm: 72 },
  { id: 'filter-77', label: '77mm filter', sizeMm: 77 },
  { id: 'sony-2470-gm', label: 'Sony 24–70 GM (82mm)', sizeMm: 82 },
]

/** The few shown in the reader's overlay, where there is no room for the ladder. */
export const LENS_QUICK_PRESET_IDS = ['tight-35', 'filter-49', 'sony-2470-f4', 'sony-2470-gm']
