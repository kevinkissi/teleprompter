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

/** Common camera lens front-opening sizes (front filter thread, in mm). */
export const LENS_PRESETS: LensPreset[] = [
  { id: 'sony-2470-gm', label: 'Sony 24–70 GM (82mm)', sizeMm: 82 },
  { id: 'sony-2470-f4', label: 'Sony 24–70 f/4 (67mm)', sizeMm: 67 },
  { id: 'filter-77', label: '77mm filter', sizeMm: 77 },
  { id: 'filter-72', label: '72mm filter', sizeMm: 72 },
  { id: 'filter-58', label: '58mm filter', sizeMm: 58 },
]
