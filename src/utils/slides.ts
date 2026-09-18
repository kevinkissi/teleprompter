/**
 * Slide Mode segmentation — the slide version of a script.
 *
 * A script has exactly one body. Continuous Mode scrolls it; Slide Mode presents
 * the SAME body as a sequence of sections. Segmentation only ever decides where
 * to put the boundaries, so:
 *
 *   THE VERBATIM INVARIANT
 *   Slides abut and together cover the body:
 *     slides[0].start === 0,  slides[i].end === slides[i+1].start,
 *     slides[n-1].end === body.length
 *   Therefore `slides.map(s => body.slice(s.start, s.end)).join('') === body`,
 *   byte for byte. No word is added, removed, reordered or rewritten — ever.
 *   scripts/verify-slides.mjs asserts this over all 180 bundled episodes at
 *   seven lens sizes.
 *
 * Boundary preference, strongest first:
 *   1. paragraph break        — the author's own section break
 *   2. a [director cue] line  — a written rest; it gets a card of its own
 *   3. sentence end
 *   4. (only when a single sentence cannot physically fit the lens window)
 *      em dash > ellipsis > colon/semicolon > comma > word gap
 *
 * Step 4 is not a preference, it is geometry. At the 40mm default lens the
 * reading box is 241x241 CSS px; the median sentence in the bundled series needs
 * more room than that at any font you can read off a beam-splitter. Rather than
 * shrink the type into illegibility, a sentence that cannot fit is continued
 * onto the next slide at the most natural pause it contains, and that slide is
 * flagged `continues` so the reader can see the thought carries over.
 */

import { countWords } from './estimateReadTime'
import { isCueParagraph } from './prompterFormat'
import { emphasisSpans, insideSpan, sentenceSpans, type Span } from './sentences'
import {
  cueLayoutHeight,
  fits,
  layoutHeight,
  wordsOf,
  type FitBox,
  type FitTypography,
  type TextMeasurer,
} from './slideFit'

export interface Slide {
  /** Span of the ORIGINAL body this slide presents. */
  start: number
  end: number
  kind: 'speech' | 'cue'
  /** This slide continues a sentence the previous one began. */
  continues: boolean
  /** The slice opens inside an emphasis span the previous slide left open. */
  startEm: boolean
  /** The slice ends still inside an emphasis span, which the next one continues. */
  endEm: boolean
  /** Spoken words (cues and `**` excluded) — what the dwell time is derived from. */
  words: number
}

export interface SlideDeck {
  slides: Slide[]
  /** Font size the deck was segmented for. */
  fontPx: number
  /** Percentage of speech slides that end on a complete sentence (0..100). */
  wholeSentencePct: number
}

/** Smallest type Slide Mode will choose on its own. Below this, a beam-splitter
 *  at talking-head distance stops being readable. */
export const SLIDE_FONT_MIN = 28
/** Absolute floor for the render-time shrink that rescues an outlier slide. */
export const SLIDE_FONT_HARD_MIN = 24
/**
 * Keeping a word whole has NO legibility floor, only this sanity bound.
 *
 * Every other size decision stops at a readable minimum, because the thing it
 * trades away is worth less than legibility. This one trades away a whole word:
 * the only ways to make an over-wide word fit a column are to hyphenate it, to
 * let it run off the side of the lens window, or to make the slide smaller — and
 * the first two mean the reader does not get the word at all. So a slide shrinks
 * as far as it must. Measured over the bundled series that is 0.2% of slides at
 * 67mm and 2% at 40mm; it only becomes common below 30mm, where the window is
 * already down to a few words a slide and the reader is told so before rolling.
 */
export const SLIDE_FONT_WORD_FIT_MIN = 1
/** Step of the font ladder. Discrete on purpose: a continuous search would make
 *  the slide count wobble on sub-pixel noise. */
export const SLIDE_FONT_STEP = 2
/** Aim for this share of sentences landing whole on a slide. */
export const WHOLE_SENTENCE_TARGET = 0.8
/**
 * Share of the script's WORDS that must fit the column at the deck size.
 *
 * Words are never split, so one wider than the column forces its slide to shrink
 * on its own. That is the right rescue for a rare outlier and the wrong default
 * for a whole deck: type that changes size every few slides is what makes you
 * lose your line on a beam-splitter. Capping the deck size here means only the
 * genuine outliers shrink — with the lens open it takes slides that need it from
 * 13% to a handful.
 */
export const WORD_FIT_TARGET = 0.99
/** Never strand fewer than this many words on a continuation slide. */
const MIN_TAIL_WORDS = 3
/** Only consider a break in the last 45% of what fits, so a strong-but-early
 *  pause cannot waste half the window. */
const LOW_WATER = 0.55

/**
 * Closed-class words, used twice over when ranking a word gap.
 *
 * Ending a slide ON one ("...the biggest security companies on" / "earth,
 * pushes...") strands a word that leads into the next phrase, and the presenter
 * delivers a falling cadence on it. Conversely, STARTING the next slide with one
 * is a good sign: a determiner or a preposition usually opens a phrase, so the
 * break has fallen between two complete groups ("...for something" / "the entire
 * bank stood on."). Preferring the second and avoiding the first is what "keep
 * related phrases together" amounts to in practice.
 */
const FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'so', 'yet', 'of', 'to', 'in', 'on', 'at', 'by',
  'for', 'with', 'from', 'into', 'onto', 'upon', 'over', 'under', 'about', 'after', 'before',
  'between', 'through', 'during', 'without', 'within', 'across', 'against', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did', 'has', 'have', 'had', 'will', 'would',
  'can', 'could', 'should', 'may', 'might', 'must', 'that', 'this', 'these', 'those', 'which',
  'who', 'whom', 'whose', 'what', 'when', 'where', 'while', 'as', 'if', 'than', 'then', 'its',
  'it', 'their', 'his', 'her', 'our', 'your', 'my', 'no', 'not',
])

/** Paragraph spans that abut and cover the whole body. */
export function paragraphSpans(body: string): Span[] {
  if (body.length === 0) return []
  const spans: Span[] = []
  const re = /\n[ \t]*\n\s*/g
  let start = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    // The blank line rides on the paragraph before it, so spans stay abutting.
    const end = m.index + m[0].length
    if (end > start) spans.push({ start, end })
    start = end
  }
  if (start < body.length) spans.push({ start, end: body.length })
  return spans
}

interface Candidate {
  /** Offset in the body at which the next slide would begin. */
  at: number
  /** Higher is a more natural place to stop speaking. */
  rank: number
  /** The continuation opens inside an emphasis span. */
  opensEm: boolean
}

/** Where a sentence could be continued onto another slide, if it has to be. */
function breakCandidates(body: string, span: Span, spans: Span[]): Candidate[] {
  const out: Candidate[] = []
  const seen = new Set<number>()
  const add = (at: number, rank: number, opensEm: boolean) => {
    if (at <= span.start || at >= span.end || seen.has(at)) return
    seen.add(at)
    out.push({ at, rank, opensEm })
  }
  const skipSpace = (i: number) => {
    let j = i
    while (j < span.end && /\s/.test(body[j])) j++
    return j
  }

  for (let i = span.start; i < span.end; i++) {
    const c = body[i]

    // An em dash opens the clause that follows it, so break BEFORE the dash —
    // the next slide then reads "— and they are taught", not a dangling "—".
    if ((c === '—' || c === '–') && /\s/.test(body[i - 1] ?? '')) {
      if (!insideSpan(spans, i)) add(i, 5, false)
      continue
    }

    if (c === '…' || (c === '.' && body[i + 1] === '.' && body[i + 2] === '.')) {
      const after = c === '…' ? i + 1 : i + 3
      if (/\s/.test(body[after] ?? '')) {
        const at = skipSpace(after)
        if (!insideSpan(spans, at)) add(at, 4, false)
      }
      continue
    }

    if (c === ':' || c === ';' || c === ',') {
      // 8:07 and 1,024 are one token. Cutting there would put "a clean 1," on
      // one slide and "000 points." on the next.
      if (/\d/.test(body[i - 1] ?? '') && /\d/.test(body[i + 1] ?? '')) continue
      if (!/\s/.test(body[i + 1] ?? '')) continue
      const at = skipSpace(i + 1)
      if (!insideSpan(spans, at)) add(at, c === ',' ? 2 : 3, false)
      continue
    }

    if (/\s/.test(c)) {
      const at = skipSpace(i)
      if (at >= span.end) continue
      // Inside an emphasis span is the last resort: the phrase was written as
      // one unit, so only geometry may break it.
      if (insideSpan(spans, at)) {
        add(at, -2, true)
        continue
      }
      const before = body.slice(span.start, i).trimEnd()
      const lastWord = (before.match(/[\w'’-]+$/) ?? [''])[0].toLowerCase()
      const trailingPunct = /[.,;:!?—–…)\]"'”’]$/.test(before)
      const nextWord = (body.slice(at, span.end).match(/^[\w'’-]+/) ?? [''])[0].toLowerCase()
      // Ending on a function word strands a word that leads into the next
      // phrase; STARTING the next slide with one means the break fell between
      // two complete groups. Same list, read both ways.
      if (!trailingPunct && FUNCTION_WORDS.has(lastWord)) add(at, -1, false)
      else if (FUNCTION_WORDS.has(nextWord)) add(at, 1, false)
      else add(at, 0, false)
    }
  }
  out.sort((a, b) => a.at - b.at)
  return out
}

function wordsIn(body: string, start: number, end: number): number {
  return countWords(body.slice(start, end))
}

/**
 * Split one sentence that cannot fit the window into the fewest, most natural
 * pieces. Always makes progress, so it can never loop.
 */
function splitSentence(
  body: string,
  span: Span,
  spans: Span[],
  fontPx: number,
  box: FitBox,
  typo: FitTypography,
  measure: TextMeasurer,
  push: (start: number, end: number, continues: boolean, startEm: boolean) => void,
): void {
  const cands = breakCandidates(body, span, spans)
  let cur = span.start
  let startEm = false
  let first = true

  while (cur < span.end) {
    if (fits(body.slice(cur, span.end), fontPx, box, typo, measure, { startEm })) {
      push(cur, span.end, !first, startEm)
      return
    }
    // Every candidate whose prefix still fits the window, in order.
    const fitting: Candidate[] = []
    for (const c of cands) {
      if (c.at <= cur) continue
      if (!fits(body.slice(cur, c.at), fontPx, box, typo, measure, { startEm })) break
      fitting.push(c)
    }
    if (fitting.length === 0) {
      // Not even the first break fits — take it anyway rather than clip, or, if
      // there is no break at all, emit the rest and let the render-time shrink
      // deal with it. Either way `cur` advances, so this terminates.
      const fallback = cands.find((c) => c.at > cur)
      const end = fallback ? fallback.at : span.end
      push(cur, end, !first, startEm)
      startEm = fallback ? fallback.opensEm : false
      cur = end
      first = false
      continue
    }

    const furthest = fitting[fitting.length - 1]
    // Only consider the last stretch of what fits, so a strong-but-early pause
    // cannot waste half the window.
    const lowWater = cur + (furthest.at - cur) * LOW_WATER
    // Never leave a two-word fragment alone on the final slide — but only when
    // the rest really would BE the final slide. If more chunks follow anyway
    // there is no orphan to avoid, and the constraint would just waste room.
    const leavesOrphan = (c: Candidate) =>
      wordsIn(body, c.at, span.end) < MIN_TAIL_WORDS &&
      fits(body.slice(c.at, span.end), fontPx, box, typo, measure, { startEm: c.opensEm })

    let pool = fitting.filter((c) => c.at >= lowWater && !leavesOrphan(c))
    if (pool.length === 0) pool = fitting.filter((c) => c.at >= lowWater)
    if (pool.length === 0) pool = fitting

    // The most natural pause available; among equals, the one that fills the
    // window best.
    let chosen = pool[0]
    for (const c of pool) if (c.rank >= chosen.rank) chosen = c

    push(cur, chosen.at, !first, startEm)
    startEm = chosen.opensEm
    cur = chosen.at
    first = false
  }
}

export interface SegmentOptions {
  box: FitBox
  typo: FitTypography
  measure: TextMeasurer
  /** Font to segment at. Omit to let `planFont` choose. */
  fontPx?: number
}

/** Segment `body` into slides for the given box. Pure — `body` is never mutated. */
export function segmentScript(body: string, opts: SegmentOptions): SlideDeck {
  const { box, typo, measure } = opts
  const fontPx = opts.fontPx ?? planFont(body, opts).fontPx
  const slides: Slide[] = []
  if (body.length === 0) return { slides, fontPx, wholeSentencePct: 100 }

  const spans = emphasisSpans(body)
  const push = (start: number, end: number, continues: boolean, startEm: boolean) => {
    if (end <= start) return
    slides.push({
      start,
      end,
      kind: 'speech',
      continues,
      startEm,
      endEm: false, // filled in below, from the final boundaries
      words: wordsIn(body, start, end),
    })
  }

  for (const para of paragraphSpans(body)) {
    const text = body.slice(para.start, para.end)
    if (text.trim().length === 0) {
      // Whitespace-only tail: keep it attached so the slides still cover the body.
      if (slides.length > 0) slides[slides.length - 1].end = para.end
      else {
        slides.push({
          ...para, kind: 'speech', continues: false, startEm: false, endEm: false, words: 0,
        })
      }
      continue
    }
    if (isCueParagraph(text.trim())) {
      // A written rest gets a card of its own — that is what it is for.
      slides.push({
        ...para, kind: 'cue', continues: false, startEm: false, endEm: false, words: 0,
      })
      continue
    }

    const sentences = sentenceSpans(text, para.start)
    let open: number | null = null
    let openEnd = para.start
    for (const s of sentences) {
      if (open !== null) {
        if (fits(body.slice(open, s.end), fontPx, box, typo, measure)) {
          openEnd = s.end
          continue
        }
        push(open, openEnd, false, false)
        open = null
      }
      if (fits(body.slice(s.start, s.end), fontPx, box, typo, measure)) {
        open = s.start
        openEnd = s.end
      } else {
        splitSentence(body, s, spans, fontPx, box, typo, measure, push)
      }
    }
    if (open !== null) push(open, openEnd, false, false)
  }

  // The invariant, made true by construction rather than by hope: slides abut,
  // the first starts at 0 and the last ends at the end of the body.
  if (slides.length > 0) {
    slides[0].start = 0
    for (let i = 1; i < slides.length; i++) slides[i].start = slides[i - 1].end
    slides[slides.length - 1].end = body.length
  }

  // Emphasis state is derived from the FINAL boundaries, not carried along the
  // way, so it cannot disagree with where the slides actually ended up. A slide
  // needs both ends: without `endEm`, one that opens a span but does not close
  // it renders the opening `**` as two literal asterisks on the lens and loses
  // the bold — on this series, usually on the episode's punchline.
  for (const slide of slides) {
    slide.startEm = insideSpan(spans, slide.start)
    slide.endEm = insideSpan(spans, slide.end)
  }

  const speech = slides.filter((s) => s.kind === 'speech')
  const whole = speech.filter((s, i) => !s.continues && !(speech[i + 1]?.continues ?? false))
  return {
    slides,
    fontPx,
    wholeSentencePct: speech.length ? Math.round((whole.length / speech.length) * 100) : 100,
  }
}

/**
 * The largest font at which most sentences still land whole on a slide.
 *
 * Capped by the reader's own font-size setting (Slide Mode never makes text
 * BIGGER than they asked for) and floored at SLIDE_FONT_MIN, because past that
 * the window is winning an argument it should lose.
 */
export function planFont(
  body: string,
  opts: { box: FitBox; typo: FitTypography; measure: TextMeasurer },
): { fontPx: number; wholeSentencePct: number } {
  const { box, typo, measure } = opts
  const ceiling = Math.max(SLIDE_FONT_MIN, Math.round(typo.fontSizePx))
  const sentences: Span[] = []
  for (const para of paragraphSpans(body)) {
    const text = body.slice(para.start, para.end)
    if (text.trim().length === 0 || isCueParagraph(text.trim())) continue
    sentences.push(...sentenceSpans(text, para.start))
  }
  if (sentences.length === 0) return { fontPx: ceiling, wholeSentencePct: 100 }

  // The largest size at which WORD_FIT_TARGET of the script's words still fit
  // the column on one line. Widths scale with size, so one pass over the words
  // at a probe size answers it.
  const PROBE = 100
  const widths: number[] = []
  for (const sp of sentences) {
    for (const w of wordsOf(body.slice(sp.start, sp.end))) {
      widths.push(measure.width(w.text, PROBE, w.em))
    }
  }
  widths.sort((a, b) => a - b)
  const quantile = widths.length
    ? widths[Math.min(widths.length - 1, Math.floor(widths.length * WORD_FIT_TARGET))]
    : 0
  const widthCeiling = quantile > 0 ? Math.floor((PROBE * box.contentW) / quantile) : ceiling

  const share = (f: number): number => {
    let ok = 0
    for (const s of sentences) {
      if (fits(body.slice(s.start, s.end), f, box, typo, measure)) ok++
    }
    return ok / sentences.length
  }

  // Smaller type fits more, so scan down and take the first size that clears the
  // target. The ladder is stepped, so the floor is tried explicitly at the end
  // rather than being skipped when the range isn't a whole number of steps.
  const start = Math.max(SLIDE_FONT_MIN, Math.min(ceiling, widthCeiling))
  let lastPct = 0
  for (let f = start; f > SLIDE_FONT_MIN; f -= SLIDE_FONT_STEP) {
    lastPct = share(f)
    if (lastPct >= WHOLE_SENTENCE_TARGET) {
      return { fontPx: f, wholeSentencePct: Math.round(lastPct * 100) }
    }
  }
  const floorPct = share(SLIDE_FONT_MIN)
  return { fontPx: SLIDE_FONT_MIN, wholeSentencePct: Math.round(Math.max(floorPct, 0) * 100) }
}

/** The slide containing `offset` — how a reading position survives re-segmentation. */
export function slideIndexForOffset(slides: Slide[], offset: number): number {
  if (slides.length === 0) return 0
  let lo = 0
  let hi = slides.length - 1
  let ans = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (slides[mid].start <= offset) {
      ans = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return ans
}

/** Text to draw for a slide (display only — the stored span is untouched). */
export function slideText(body: string, slide: Slide): string {
  return body.slice(slide.start, slide.end).trim()
}

/** Height of a slide's rendered text, used by the render-time shrink. */
export function slideHeight(
  body: string,
  slide: Slide,
  fontPx: number,
  box: FitBox,
  typo: FitTypography,
  measure: TextMeasurer,
): number {
  const text = slideText(body, slide)
  if (slide.kind === 'cue') return cueLayoutHeight(text, fontPx, box, typo, measure)
  return layoutHeight(text, fontPx, box, typo, measure, {
    startEm: slide.startEm,
    endEm: slide.endEm,
  })
}
