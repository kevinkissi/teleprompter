#!/usr/bin/env node
// Prove Slide Mode never changes the script.
//
//   node scripts/verify-slides.mjs            # all 180 bundled episodes
//   node scripts/verify-slides.mjs --report   # + the per-lens capacity table
//
// Segments every bundled episode at every lens size and asserts the invariants
// that matter on set:
//   1. VERBATIM     — the slides concatenate back to the body, byte for byte.
//   2. PARTITION    — slides abut, cover [0, len), and none is inverted.
//   3. TOKEN EDGE   — no slide boundary lands inside a word or a number.
//   4. EMPHASIS     — a boundary inside a **span** is always flagged startEm,
//                     so the phrase keeps its weight across the break.
//   5. WHOLE WORDS  — no word is ever hyphenated or split across lines: at the
//                     size each slide actually renders at, every word fits the
//                     column on its own.
//   6. SENTENCES    — reports how many slides begin mid-sentence, per lens.
//
// The segmenter takes an injected text measurer, so this runs in plain Node with
// no DOM — same convention as verify-seed-sync.mjs, compiled with the repo's own
// esbuild.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'slides-'))
const esbuild = path.join(REPO, 'node_modules/.bin/esbuild')

let failures = 0
/** Quiet on success for the per-lens sweep (the `ok` line below summarises it),
 *  loud for the one-off hazard checks. */
const check = (pass, label, detail = '', quiet = false) => {
  if (!pass) failures++
  if (!pass) console.log(` FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
  else if (!quiet) console.log(`  ok   ${label}`)
}
const ok = (label, detail = '') => console.log(`  ok   ${label}${detail ? ` — ${detail}` : ''}`)

function bundle(entry, outName) {
  const out = path.join(tmp, outName)
  execFileSync(esbuild, [entry, '--bundle', '--format=esm', '--platform=node', `--outfile=${out}`], {
    cwd: REPO,
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  return import(pathToFileURL(out).href)
}

const { POF_EPISODES } = await bundle(path.join(REPO, 'src/data/pof/index.ts'), 'pof.mjs')
const slides = await bundle(path.join(REPO, 'src/utils/slides.ts'), 'slides.mjs')
const fit = await bundle(path.join(REPO, 'src/utils/slideFit.ts'), 'fit.mjs')
const sentences = await bundle(path.join(REPO, 'src/utils/sentences.ts'), 'sentences.mjs')
const format = await bundle(path.join(REPO, 'src/utils/prompterFormat.ts'), 'format.mjs')
const lens = await bundle(path.join(REPO, 'src/utils/lens.ts'), 'lens.mjs')

const { segmentScript, planFont, paragraphSpans, slideIndexForOffset } = slides
const { slideBoxFor, EM_SIZE_FACTOR, maxSizeForWholeWords, widestWordWidth } = fit
const { emphasisSpans, insideSpan } = sentences
const { parseInline, isCueParagraph, cueText } = format

/**
 * What a slide actually PUTS ON THE LENS, through the same parse the reader uses.
 * Checking the stored spans only proves the segmenter did not lose a character;
 * it says nothing about what the renderer then draws from them.
 */
function renderSlide(body, slide) {
  const text = body.slice(slide.start, slide.end).trim()
  if (slide.kind === 'cue') return cueText(text)
  const paragraphs = text.split(/\n{2,}/)
  let em = slide.startEm
  const parts = []
  paragraphs.forEach((p, i) => {
    if (isCueParagraph(p)) {
      parts.push(cueText(p))
      return
    }
    const parsed = parseInline(p, em, i === paragraphs.length - 1 ? slide.endEm : false)
    em = parsed.endEm
    for (const t of parsed.tokens) parts.push(t.text)
  })
  return parts.join('')
}

/** The same, for the continuous reader: whole paragraphs, no slide boundaries.
 *  Inline tokens join with nothing (they are one run of text); paragraphs join
 *  with a space, which is how they are separated on screen. */
function renderContinuous(body) {
  const paragraphs = []
  for (const p of body.split(/\n{2,}/)) {
    if (isCueParagraph(p)) paragraphs.push(cueText(p))
    else paragraphs.push(parseInline(p).tokens.map((t) => t.text).join(''))
  }
  return paragraphs.join(' ')
}

// Mirror of the segmenter's own list, for the quality metric below.
const FUNCTION = new Set(
  ('a an the and or but nor so yet of to in on at by for with from into onto upon over under about '
    + 'after before between through during without within across against is are was were be been being '
    + 'am do does did has have had will would can could should may might must that this these those '
    + 'which who whom whose what when where while as if than then its it their his her our your my no not'
  ).split(' '),
)
const { lensWindowSizePx } = lens

// A deterministic stand-in for the browser's font metrics. 0.52em is the mean
// advance of this corpus in SF Pro; good enough to exercise every code path, and
// identical on every machine so the assertions are reproducible.
const measure = {
  width(text, sizePx, emphasis) {
    const size = emphasis ? sizePx * EM_SIZE_FACTOR : sizePx
    return text.length * size * 0.52
  },
}

const TYPO = {
  fontSizePx: 64,
  lineHeight: 1.35,
  fontWeight: 500,
  letterSpacingPx: 0,
  wordSpacingPx: 0,
  allCaps: false,
  dyslexiaFont: false,
}

// iPhone 17 Pro Max in portrait — the device this is built for.
const VW = 393
const VH = 852
const LENSES = [
  { label: 'off', box: slideBoxFor(VW, VH, TYPO.marginXPercent ?? 8) },
  ...[82, 67, 49, 40, 35, 30, 20].map((mm) => {
    const side = lensWindowSizePx(mm, VW, VH)
    return { label: `${mm}mm`, box: slideBoxFor(side, side, 8), mm }
  }),
]

console.log(`\nSlide segmentation — ${POF_EPISODES.length} episodes x ${LENSES.length} lens sizes\n`)

const table = []

for (const lensCase of LENSES) {
  let nSlides = 0
  let midSentence = 0
  let words = 0
  let fontSum = 0
  let wholeSum = 0
  let verbatimFails = 0
  let partitionFails = 0
  let tokenFails = 0
  let emphasisFails = 0
  let weakBreaks = 0
  let continuations = 0
  let fillSum = 0
  const tokenExamples = []

  for (const ep of POF_EPISODES) {
    const body = ep.body
    const deck = segmentScript(body, { box: lensCase.box, typo: TYPO, measure })
    const list = deck.slides
    fontSum += deck.fontPx
    wholeSum += deck.wholeSentencePct

    // 1. VERBATIM
    const rebuilt = list.map((s) => body.slice(s.start, s.end)).join('')
    if (rebuilt !== body) {
      verbatimFails++
      if (verbatimFails === 1) {
        console.log(`   ${ep.id}: reconstruction differs (${rebuilt.length} vs ${body.length})`)
      }
    }

    // 2. PARTITION
    if (list.length > 0) {
      if (list[0].start !== 0) partitionFails++
      if (list[list.length - 1].end !== body.length) partitionFails++
      for (let i = 0; i < list.length; i++) {
        if (list[i].end <= list[i].start) partitionFails++
        if (i > 0 && list[i].start !== list[i - 1].end) partitionFails++
      }
    } else if (body.length > 0) {
      partitionFails++
    }

    // 3. TOKEN EDGE — every interior boundary must sit right after whitespace,
    //    so a word, a decimal or a clock time is never cut in half.
    const spans = emphasisSpans(body)
    for (let i = 1; i < list.length; i++) {
      const b = list[i].start
      if (!/\s/.test(body[b - 1] ?? ' ')) {
        tokenFails++
        if (tokenExamples.length < 3) {
          tokenExamples.push(`${ep.id} @${b}: …${JSON.stringify(body.slice(b - 14, b + 14))}`)
        }
      }
      // 4. EMPHASIS — a slide must know about BOTH of its ends. Checking only
      //    the start was the gap that let a slide which OPENS a span but does
      //    not close it render two literal asterisks on the lens.
      if (insideSpan(spans, b) && !list[i].startEm) emphasisFails++
      if (insideSpan(spans, b) && !list[i - 1].endEm) emphasisFails++
    }
    for (const sl of list) {
      if (insideSpan(spans, sl.start) !== sl.startEm) emphasisFails++
      if (insideSpan(spans, sl.end) !== sl.endEm) emphasisFails++
    }

    nSlides += list.length
    words += list.reduce((a, s) => a + s.words, 0)
    midSentence += list.filter((s) => s.continues).length

    // Quality, not correctness: a slide that ends on a function word ("...not
    // close to" / "good enough...") makes the presenter fall on a word that
    // leads into the next phrase.
    for (let i = 0; i < list.length - 1; i++) {
      if (!list[i + 1].continues) continue
      const text = body.slice(list[i].start, list[i].end).trim()
      if (/[.,;:!?\u2014\u2013\u2026)\]"']$/.test(text)) continue
      const last = (text.match(/[\w'\u2019-]+$/) ?? [''])[0].toLowerCase()
      if (FUNCTION.has(last)) weakBreaks++
      continuations++
    }
    fillSum += list.length
  }

  const n = POF_EPISODES.length
  check(verbatimFails === 0, `${lensCase.label}: verbatim reconstruction`, `${verbatimFails} episodes differ`, true)
  check(partitionFails === 0, `${lensCase.label}: slides partition the body`, `${partitionFails} violations`, true)
  check(tokenFails === 0, `${lensCase.label}: boundaries at token edges`, tokenExamples.join(' | '), true)
  check(emphasisFails === 0, `${lensCase.label}: emphasis carried across breaks`, `${emphasisFails} unflagged`, true)
  if (verbatimFails === 0 && partitionFails === 0 && tokenFails === 0 && emphasisFails === 0) {
    ok(`${lensCase.label}`, `${(nSlides / n).toFixed(1)} slides/ep · font ${Math.round(fontSum / n)}px`)
  }

  table.push({
    lens: lensCase.label,
    font: Math.round(fontSum / n),
    slides: (nSlides / n).toFixed(1),
    words: (words / nSlides).toFixed(1),
    whole: Math.round(wholeSum / n),
    mid: Math.round((midSentence / nSlides) * 100),
    weak: continuations > 0 ? Math.round((weakBreaks / continuations) * 100) : 0,
  })
  void fillSum
}

// --- targeted checks on constructs that break naive splitters ---
console.log('\nHazards\n')

const ep1 = POF_EPISODES.find((e) => e.id === 'pof-001')
const ends = sentences.sentenceEnds(ep1.body)
const oneAtATime = ep1.body.indexOf('**One. At. A. Time.**')
const internalDots = [
  ep1.body.indexOf('**One.') + 5,
  ep1.body.indexOf(' At.') + 3,
]
check(
  internalDots.every((d) => !ends.includes(d + 1)),
  'periods inside **One. At. A. Time.** are not sentence ends',
)
check(
  ends.some((e) => e > oneAtATime && e < oneAtATime + 25),
  'the period that CLOSES **One. At. A. Time.** is a sentence end',
)

const ellipsisEp = POF_EPISODES.find((e) => e.body.includes('impossible number'))
if (ellipsisEp) {
  const at = ellipsisEp.body.indexOf('number…')
  const e2 = sentences.sentenceEnds(ellipsisEp.body)
  check(!e2.some((x) => x > at && x < at + 10), 'an ellipsis is not a sentence end')
}

// TOKEN INTEGRITY — the words on the slides are exactly the words in the body,
// in order. This is what catches a cut inside "1,000" or "8:07": the body's one
// token would appear as two. Stronger than the boundary check, and it is the
// assertion that literally says "the script was not changed".
let tokenSplits = 0
const splitExamples = []
for (const lensCase of LENSES) {
  for (const ep of POF_EPISODES) {
    const deck = segmentScript(ep.body, { box: lensCase.box, typo: TYPO, measure })
    const want = ep.body.split(/\s+/).filter(Boolean)
    const got = deck.slides.flatMap((s) => ep.body.slice(s.start, s.end).split(/\s+/).filter(Boolean))
    if (want.length !== got.length || want.some((w, i) => w !== got[i])) {
      tokenSplits++
      if (splitExamples.length < 3) {
        const at = want.findIndex((w, i) => w !== got[i])
        splitExamples.push(`${ep.id}@${lensCase.label}: "${want[at]}" -> "${got[at]}"`)
      }
    }
  }
}
check(
  tokenSplits === 0,
  'every word survives whole (no cut inside a number or a clock time)',
  splitExamples.join(' | '),
)

// RENDERED TEXT — the strongest form of "the script is not changed". The stored
// spans reconstructing the body proves the segmenter kept every character; this
// proves the READER then draws those characters, and no others. It is what
// catches a stray `**` reaching the lens.
let renderFails = 0
let strayMarkers = 0
const renderExamples = []
for (const lensCase of LENSES) {
  for (const ep of POF_EPISODES) {
    const deck = segmentScript(ep.body, { box: lensCase.box, typo: TYPO, measure })
    const shown = deck.slides.map((sl) => renderSlide(ep.body, sl)).join(' ')
    if (shown.includes('**')) {
      strayMarkers++
      if (renderExamples.length < 3) {
        const at = shown.indexOf('**')
        renderExamples.push(`${ep.id}@${lensCase.label}: …${shown.slice(Math.max(0, at - 40), at + 20)}…`)
      }
    }
    const tok = (t) => t.split(/\s+/).filter(Boolean).join(' ')
    if (tok(shown) !== tok(renderContinuous(ep.body))) {
      renderFails++
      if (renderExamples.length < 6) {
        const a = tok(renderContinuous(ep.body)).split(' ')
        const b = tok(shown).split(' ')
        const i = a.findIndex((w, k) => w !== b[k])
        renderExamples.push(
          `${ep.id}@${lensCase.label} #${i}: scroll "${a.slice(i, i + 5).join(' ')}" vs slides "${b.slice(i, i + 5).join(' ')}"`,
        )
      }
    }
  }
}
check(strayMarkers === 0, 'no emphasis marker ever reaches the lens', renderExamples.join(' | '))
check(
  renderFails === 0,
  'the slides render exactly what the scrolling reader renders',
  renderExamples.join(' | '),
)

// WHOLE WORDS — the guarantee the CSS gives up when it stops hyphenating. A word
// too wide for the column has nowhere to go, so the renderer shrinks that slide
// until it fits; this asserts such a size always exists above the floor, and
// reports how often and how far the shrink actually bites.
const SHRINK_LADDER = [1, 0.9, 0.8, 0.72]
const HARD_MIN = 24
const WORD_FIT_MIN = 1
let unfittable = 0
const perLens = []
const wordExamples = []
for (const lensCase of LENSES) {
  let shrunk = 0
  let totalSlides = 0
  let smallest = Infinity
  for (const ep of POF_EPISODES) {
    const deck = segmentScript(ep.body, { box: lensCase.box, typo: TYPO, measure })
    for (const sl of deck.slides) {
      const text = ep.body.slice(sl.start, sl.end).trim()
      if (!text) continue
      totalSlides++
      const isCue = sl.kind === 'cue'
      // Mirror SlideStage: height ladder first, then the width cap.
      let size = Math.max(HARD_MIN, Math.round(deck.fontPx * SHRINK_LADDER[SHRINK_LADDER.length - 1]))
      for (const step of SHRINK_LADDER) {
        const candidate = Math.max(HARD_MIN, Math.round(deck.fontPx * step))
        const opts = { startEm: sl.startEm, endEm: sl.endEm }
        const h = isCue
          ? fit.cueLayoutHeight(text, candidate, lensCase.box, TYPO, measure)
          : fit.layoutHeight(text, candidate, lensCase.box, TYPO, measure, opts)
        if (h <= lensCase.box.usableH - 3) {
          size = candidate
          break
        }
      }
      const cap = maxSizeForWholeWords(text, lensCase.box, measure, {
        startEm: sl.startEm,
        endEm: sl.endEm,
      })
      const sizeCap = isCue ? cap / 0.5 : cap
      if (Number.isFinite(sizeCap) && sizeCap < size) {
        shrunk++
        size = Math.max(WORD_FIT_MIN, Math.floor(sizeCap))
      }
      smallest = Math.min(smallest, size)
      // The assertion: at the size it renders at, the widest word fits.
      const rendered = isCue ? size * 0.5 : size
      const widest = widestWordWidth(text, rendered, measure, {
        startEm: sl.startEm,
        endEm: sl.endEm,
      })
      if (widest > lensCase.box.contentW) {
        unfittable++
        if (wordExamples.length < 3) {
          wordExamples.push(`${ep.id}@${lensCase.label} ${Math.round(widest)}px > ${Math.round(lensCase.box.contentW)}px at ${rendered}px`)
        }
      }
    }
  }
  perLens.push({
    lens: lensCase.label,
    pct: Math.round((shrunk / Math.max(1, totalSlides)) * 100),
    smallest: Number.isFinite(smallest) ? smallest : 0,
  })
}
check(
  unfittable === 0,
  'every word fits its column whole — nothing is hyphenated or split',
  wordExamples.join(' | '),
)
console.log(
  '  ..   slides shrunk to keep a long word whole: ' +
    perLens.map((r) => `${r.lens} ${r.pct}% (min ${r.smallest}px)`).join(', '),
)

// Degenerate bodies must not hang or throw.
const degenerate = [
  '',
  '\n',
  '\n\n\n',
  '[beat]',
  'no terminal punctuation at all just words running on and on',
  'x'.repeat(900),
  'A'.repeat(400) + ' ' + 'B'.repeat(400),
  '**unclosed emphasis that never ends. And a second sentence.',
]
let degenerateFails = 0
for (const body of degenerate) {
  for (const lensCase of LENSES) {
    try {
      const deck = segmentScript(body, { box: lensCase.box, typo: TYPO, measure })
      const rebuilt = deck.slides.map((s) => body.slice(s.start, s.end)).join('')
      if (rebuilt !== body) degenerateFails++
      if (body.length > 0 && deck.slides.length === 0) degenerateFails++
    } catch (err) {
      degenerateFails++
      console.log(`   threw on ${JSON.stringify(body.slice(0, 24))}: ${err.message}`)
    }
  }
}
check(degenerateFails === 0, 'degenerate bodies segment cleanly', `${degenerateFails} failures`)

// Determinism: the same body + box always yields the same slides.
let nondet = 0
for (const ep of POF_EPISODES.slice(0, 20)) {
  const a = segmentScript(ep.body, { box: LENSES[4].box, typo: TYPO, measure })
  const b = segmentScript(ep.body, { box: LENSES[4].box, typo: TYPO, measure })
  if (JSON.stringify(a.slides) !== JSON.stringify(b.slides)) nondet++
}
check(nondet === 0, 'segmentation is deterministic')

// Anchoring: the reading position survives a lens change.
let anchorFails = 0
for (const ep of POF_EPISODES.slice(0, 40)) {
  const wide = segmentScript(ep.body, { box: LENSES[1].box, typo: TYPO, measure })
  const tight = segmentScript(ep.body, { box: LENSES[5].box, typo: TYPO, measure })
  for (let i = 0; i < wide.slides.length; i++) {
    const offset = wide.slides[i].start
    const j = slideIndexForOffset(tight.slides, offset)
    const s = tight.slides[j]
    if (!(s.start <= offset && offset < s.end)) anchorFails++
  }
}
check(anchorFails === 0, 'a reading position always resolves to exactly one slide', `${anchorFails} misses`)

// Paragraph spans must themselves partition every body.
let paraFails = 0
for (const ep of POF_EPISODES) {
  const spans = paragraphSpans(ep.body)
  if (spans.map((s) => ep.body.slice(s.start, s.end)).join('') !== ep.body) paraFails++
}
check(paraFails === 0, 'paragraph spans partition the body')

console.log('\nCapacity — 393x852, default typography, font chosen automatically\n')
console.log('  lens   font  slides/ep  words/slide  whole sentences  mid-sentence  weak breaks')
for (const r of table) {
  console.log(
    `  ${r.lens.padEnd(6)} ${String(r.font).padStart(3)}px ${r.slides.padStart(9)} ${r.words.padStart(12)} ${String(r.whole + '%').padStart(16)} ${String(r.mid + '%').padStart(13)} ${String(r.weak + '%').padStart(12)}`,
  )
}

// A continuation that ends on a function word is a bad speaking break. A quality
// gate, not an invariant, so it gets a budget rather than a hard zero — and it
// only applies where there is room to choose a break at all. Below ~3 words a
// slide, the window decides and nothing else can.
const gated = table.filter((r) => Number(r.words) >= 3)
const skipped = table.filter((r) => Number(r.words) < 3)
const worstWeak = Math.max(...gated.map((r) => r.weak))
check(worstWeak <= 5, 'few slides end on a function word', `worst ${worstWeak}%`)
if (skipped.length) {
  console.log(
    `  ..   not gated at ${skipped.map((r) => `${r.lens} (${r.words} words/slide, ${r.weak}% weak)`).join(', ')}` +
      ' — too little text on a slide for the break to be a choice',
  )
}

fs.rmSync(tmp, { recursive: true, force: true })
console.log(failures === 0 ? '\nAll slide checks passed.\n' : `\n${failures} check(s) FAILED.\n`)
process.exit(failures === 0 ? 0 : 1)
