/**
 * How much script fits in the lens window.
 *
 * Slide Mode has to answer one question over and over: "does this run of text
 * fit the reading box at this font size?" A character-count heuristic gets that
 * wrong in exactly the place it matters — the bundled scripts are full of
 * `**emphasis**`, which renders at 1.06em/800 weight and is measurably wider
 * than the plain text around it — so the answer here is MEASURED, with the same
 * font the reader will actually draw.
 *
 * Measurement is injectable so the segmenter stays testable in plain Node (see
 * scripts/verify-slides.mjs); in the app it is a cached canvas 2D context, which
 * costs one pass over the unique words of an episode and no DOM layout at all.
 */

import { parseInline } from './prompterFormat'

export const DYSLEXIA_STACK =
  "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', 'Verdana', sans-serif"
export const DEFAULT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/** Emphasis renders at 1.06em (global.css `.prompt-text .pf-em`). */
export const EM_SIZE_FACTOR = 1.06
/** …plus 0.01em of tracking, which the width model must not forget. */
export const EM_TRACKING_EM = 0.01
/** Emphasis weight, likewise from `.pf-em`. */
export const EM_WEIGHT = 800

/** Director cues render at 0.5em with their own line-height (`.pf-cue`). */
export const CUE_SIZE_FACTOR = 0.5
export const CUE_LINE_HEIGHT = 1.3
export const CUE_TRACKING_EM = 0.08

/** The typography inputs that change how text lays out. */
export interface FitTypography {
  fontSizePx: number
  lineHeight: number
  fontWeight: number
  letterSpacingPx: number
  wordSpacingPx: number
  allCaps: boolean
  dyslexiaFont: boolean
}

/** The reading box a slide has to fit inside, in CSS pixels. */
export interface FitBox {
  /** Width available to text, after the side margins. */
  contentW: number
  /** Height available to text. */
  usableH: number
}

/** Measures the advance width of a run of text. Injected so this is testable. */
export interface TextMeasurer {
  width(text: string, sizePx: number, emphasis: boolean): number
}

/**
 * A couple of pixels of slack between the model and the browser's own layout.
 * A slide that measures exactly at the budget must not be the one that clips.
 */
export const FIT_SAFETY_PX = 3

/** Canvas-backed measurer for the running app. Results are cached per font. */
export function canvasMeasurer(typo: FitTypography): TextMeasurer {
  const stack = typo.dyslexiaFont ? DYSLEXIA_STACK : DEFAULT_STACK
  const ctx = getMeasureContext()
  const cache = new Map<string, number>()
  return {
    width(text, sizePx, emphasis) {
      const size = emphasis ? sizePx * EM_SIZE_FACTOR : sizePx
      const weight = emphasis ? EM_WEIGHT : typo.fontWeight
      const shown = typo.allCaps ? text.toUpperCase() : text
      const key = `${weight}|${size}|${shown}`
      const hit = cache.get(key)
      if (hit !== undefined) return hit
      let w: number
      if (ctx) {
        ctx.font = `${weight} ${size}px ${stack}`
        w = ctx.measureText(shown).width
      } else {
        // No canvas (SSR / a locked-down engine): fall back to the corpus-mean
        // advance so the app degrades to a heuristic instead of failing.
        w = shown.length * size * 0.52
      }
      // Canvas does not apply CSS letter-spacing; add it per character, plus the
      // extra tracking `.pf-em` carries.
      w += typo.letterSpacingPx * shown.length
      if (emphasis) w += EM_TRACKING_EM * size * shown.length
      cache.set(key, w)
      return w
    },
  }
}

let measureCtx: CanvasRenderingContext2D | null | undefined
function getMeasureContext(): CanvasRenderingContext2D | null {
  if (measureCtx !== undefined) return measureCtx
  try {
    measureCtx = document.createElement('canvas').getContext('2d')
  } catch {
    measureCtx = null
  }
  return measureCtx
}

interface Word {
  text: string
  em: boolean
}

/** Split a source slice into words, remembering which fall inside `**…**`.
 *  `startEm`/`endEm` seed the emphasis state for a slice that begins or ends
 *  mid-span, so the model measures the same bold the reader will draw. */
export function wordsOf(source: string, startEm = false, endEm?: boolean): Word[] {
  const words: Word[] = []
  for (const token of parseInline(source, startEm, endEm).tokens) {
    for (const w of token.text.split(/\s+/)) {
      if (w.length > 0) words.push({ text: w, em: token.em })
    }
  }
  return words
}

/**
 * Height in px that `source` occupies when wrapped to `box.contentW`.
 *
 * Greedy wrapping, matching what the browser does for slides: words are never
 * hyphenated and never split, so one that does not fit the remaining space moves
 * WHOLE to the next line. A word too wide for the column at all still occupies
 * exactly one line — it overflows sideways rather than wrapping, which is why
 * `fits` also checks `widestWordWidth` and the renderer shrinks the slide until
 * that word fits. A line holding emphasis is 1.06x taller, because the taller
 * glyphs set the line box.
 */
export function layoutHeight(
  source: string,
  sizePx: number,
  box: FitBox,
  typo: FitTypography,
  measure: TextMeasurer,
  opts: { startEm?: boolean; endEm?: boolean } = {},
): number {
  const words = wordsOf(source, opts.startEm, opts.endEm)
  if (words.length === 0) return 0
  const space = measure.width(' ', sizePx, false) + typo.wordSpacingPx
  const lineBox = sizePx * typo.lineHeight
  const colW = Math.max(1, box.contentW)

  let height = 0
  let lineW = 0
  let lineHasEm = false
  let lineOpen = false

  const closeLine = () => {
    if (!lineOpen) return
    height += lineBox * (lineHasEm ? EM_SIZE_FACTOR : 1)
    lineW = 0
    lineHasEm = false
    lineOpen = false
  }

  for (const word of words) {
    const w = measure.width(word.text, sizePx, word.em)
    if (w > colW) {
      // Wider than the column. Nothing splits it, so it sits alone on one line
      // and overflows; the width check below is what actually catches this.
      closeLine()
      height += lineBox * (word.em ? EM_SIZE_FACTOR : 1)
      continue
    }
    const advance = lineOpen ? space + w : w
    if (lineOpen && lineW + advance > colW) {
      closeLine()
      lineW = w
      lineHasEm = word.em
      lineOpen = true
      continue
    }
    lineW += advance
    lineHasEm = lineHasEm || word.em
    lineOpen = true
  }
  closeLine()
  return height
}

/**
 * Width of the widest single word, in px, at `sizePx`. Width scales linearly
 * with font size, so measuring once tells you the largest size at which the
 * word still fits a column: `sizePx * contentW / widestWordWidth(...)`.
 */
export function widestWordWidth(
  source: string,
  sizePx: number,
  measure: TextMeasurer,
  opts: { startEm?: boolean; endEm?: boolean } = {},
): number {
  let widest = 0
  for (const word of wordsOf(source, opts.startEm, opts.endEm)) {
    const w = measure.width(word.text, sizePx, word.em)
    if (w > widest) widest = w
  }
  return widest
}

/**
 * Does `source` fit the box at `sizePx`? HEIGHT only, deliberately.
 *
 * Width is not a segmentation question. A word wider than the column stays too
 * wide however the text around it is divided, so folding width in here just
 * drives the splitter to cut and cut and never succeed — measured, it took the
 * 30mm deck from 67 slides an episode to 77, and ended a fifth of them on a
 * dangling function word. The only thing that can fix an over-wide word is a
 * smaller size, so that is where it is fixed: `maxSizeForWholeWords`, applied
 * per slide by the renderer.
 */
export function fits(
  source: string,
  sizePx: number,
  box: FitBox,
  typo: FitTypography,
  measure: TextMeasurer,
  opts: { startEm?: boolean; endEm?: boolean } = {},
): boolean {
  return layoutHeight(source, sizePx, box, typo, measure, opts) <= box.usableH - FIT_SAFETY_PX
}

/**
 * The largest size at which every word in `source` fits the column on its own.
 * `Infinity` when there is nothing to constrain.
 */
export function maxSizeForWholeWords(
  source: string,
  box: FitBox,
  measure: TextMeasurer,
  opts: { startEm?: boolean; endEm?: boolean } = {},
): number {
  const PROBE = 100
  const widest = widestWordWidth(source, PROBE, measure, opts)
  if (widest <= 0) return Infinity
  return (PROBE * box.contentW) / widest
}

/**
 * Height of a director-cue slide. Cues render at 0.5em with their own
 * line-height and tracking, so measuring them with the speech metrics would
 * over-estimate a `[beat]` card by a factor of two.
 */
export function cueLayoutHeight(
  text: string,
  sizePx: number,
  box: FitBox,
  typo: FitTypography,
  measure: TextMeasurer,
): number {
  const size = sizePx * CUE_SIZE_FACTOR
  const cueTypo: FitTypography = {
    ...typo,
    lineHeight: CUE_LINE_HEIGHT,
    letterSpacingPx: typo.letterSpacingPx + CUE_TRACKING_EM * size,
    allCaps: true,
  }
  return layoutHeight(text, size, box, cueTypo, measure)
}

/** The reading box for a slide, given the transform layer's size. */
export function slideBoxFor(layerW: number, layerH: number, marginXPercent: number): FitBox {
  const contentW = Math.max(1, layerW * (1 - (2 * marginXPercent) / 100))
  return { contentW, usableH: Math.max(1, layerH) }
}
