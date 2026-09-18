import {
  Fragment,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { useAppStore } from '../state/appStore'
import { useSlideEngine } from '../hooks/useSlideEngine'
import { cueText, isCueParagraph, parseInline } from '../utils/prompterFormat'
import { SLIDE_FONT_HARD_MIN, SLIDE_FONT_WORD_FIT_MIN, slideText } from '../utils/slides'
import { CUE_SIZE_FACTOR, canvasMeasurer, maxSizeForWholeWords, slideBoxFor } from '../utils/slideFit'

/**
 * Shrink ladder for the rare slide the segmenter could not fit — a single
 * unbreakable sentence, or a director cue with unusual typography. Discrete and
 * short on purpose: text that changes size between slides is what makes you lose
 * your line on a beam-splitter, so this is a rescue, not a layout strategy.
 */
const SHRINK_LADDER = [1, 0.9, 0.8, 0.72]

/**
 * The canvas width model runs about 1% optimistic against real layout — kerning
 * and letter-spacing are applied slightly differently — so the size it picks is
 * held just inside the column rather than exactly at it.
 */
const WIDTH_SAFETY = 0.97

/**
 * Width of the widest single rendered word, measured in place.
 *
 * A Range over the word in its own text node gets the font that word is actually
 * drawn with, including the larger, heavier `**emphasis**` runs that a single
 * probe font would under-measure. If a word ever DID break across lines its
 * range would span them and come back at least a column wide, so this catches
 * that too.
 */
function widestRenderedWord(root: HTMLElement): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let widest = 0
  let node = walker.nextNode()
  while (node) {
    const text = node.textContent ?? ''
    const re = /\S+/g
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const w = range.getBoundingClientRect().width
      if (w > widest) widest = w
    }
    node = walker.nextNode()
  }
  return widest
}

/**
 * One section of the script, centred in the lens window.
 *
 * The slides are a presentation of the SAME body the scrolling reader uses —
 * `slide.start`/`slide.end` index straight into it, so what you read here is the
 * script, verbatim, never a rewritten copy.
 */
export function SlideStage({ layerRef }: { layerRef: RefObject<HTMLDivElement | null> }) {
  const textRef = useRef<HTMLDivElement>(null)
  /** Size this slide actually renders at, after the fit check below. */
  const [fitPx, setFitPx] = useState(0)

  useSlideEngine({ layerRef })

  const typo = useAppStore((s) => s.config.typography)
  const colors = useAppStore((s) => s.config.colors)
  const slides = useAppStore((s) => s.slides)
  const slideIndex = useAppStore((s) => s.slideIndex)
  const fontPx = useAppStore((s) => s.slideFontPx)
  const recording = useAppStore((s) => s.recording)
  const body = useAppStore((s) => {
    const id = s.currentScriptId
    return s.scripts.find((x) => x.id === id)?.body ?? ''
  })

  const slide = slides[slideIndex]
  const text = slide ? slideText(body, slide) : ''
  const isCue = slide?.kind === 'cue'
  const base = fontPx > 0 ? fontPx : typo.fontSizePx
  const startEm = slide?.startEm ?? false
  const endEm = slide?.endEm ?? false

  const fitTypo = useMemo(
    () => ({
      fontSizePx: typo.fontSizePx,
      lineHeight: typo.lineHeight,
      fontWeight: typo.fontWeight,
      letterSpacingPx: typo.letterSpacingPx,
      wordSpacingPx: typo.wordSpacingPx,
      allCaps: typo.allCaps,
      dyslexiaFont: typo.dyslexiaFont,
    }),
    [typo],
  )

  // The measured backstop, in two parts.
  //
  // HEIGHT: the segmenter fits every slide before it exists, but it MODELS the
  // layout rather than performing it, so check the real box and step down if the
  // browser disagrees.
  //
  // WIDTH: words are never hyphenated and never split, so a word wider than the
  // column has nowhere to go — it would hang off the side of the lens window and
  // be clipped. Rather than break it, shrink this slide until the longest word
  // fits on one line. Width scales linearly with size, so the largest size that
  // works is arithmetic, not a search.
  //
  // The chosen size is held in state, not written straight to the node: the same
  // element's font-size is React-controlled, so a re-render for any other reason
  // (the recording dot appearing, a colour change) would silently reset a direct
  // style write and leave the slide overflowing.
  useLayoutEffect(() => {
    const el = textRef.current
    const layer = layerRef.current
    if (!el || !layer) return
    const budget = layer.clientHeight
    const probe = (size: number) => {
      el.style.fontSize = `${isCue ? size * CUE_SIZE_FACTOR : size}px`
      return el.scrollHeight <= budget
    }

    let chosen = Math.round(base)
    for (const step of SHRINK_LADDER) {
      chosen = Math.max(SLIDE_FONT_HARD_MIN, Math.round(base * step))
      if (probe(chosen)) break
    }

    // Now make sure every word fits the column whole.
    const box = slideBoxFor(layer.clientWidth, layer.clientHeight, typo.marginXPercent)
    const measure = canvasMeasurer(fitTypo)
    const cap = maxSizeForWholeWords(text, box, measure, { startEm, endEm })
    // A cue renders at half size, so its words allow twice the nominal size.
    const sizeCap = isCue ? cap / CUE_SIZE_FACTOR : cap
    if (Number.isFinite(sizeCap) && sizeCap * WIDTH_SAFETY < chosen) {
      chosen = Math.max(SLIDE_FONT_WORD_FIT_MIN, Math.floor(sizeCap * WIDTH_SAFETY))
    }
    probe(chosen)

    // Belt and braces, against real layout rather than the model. Scale straight
    // to what the measurement says instead of stepping, so one pass is enough
    // even when the overshoot is large.
    const cs = getComputedStyle(el)
    const column =
      el.clientWidth - parseFloat(cs.paddingLeft || '0') - parseFloat(cs.paddingRight || '0')
    let guard = 4
    let widest = widestRenderedWord(el)
    while (widest > column && chosen > SLIDE_FONT_WORD_FIT_MIN && guard-- > 0) {
      const next = Math.max(
        SLIDE_FONT_WORD_FIT_MIN,
        Math.floor(chosen * Math.min(0.99, (column / widest) * WIDTH_SAFETY)),
      )
      if (next >= chosen) break
      chosen = next
      probe(chosen)
      widest = widestRenderedWord(el)
    }

    setFitPx((prev) => (prev === chosen ? prev : chosen))
  }, [
    base,
    isCue,
    slideIndex,
    text,
    layerRef,
    fitTypo,
    typo.lineHeight,
    typo.marginXPercent,
    startEm,
    endEm,
  ])

  const size = fitPx > 0 ? fitPx : base
  const style: CSSProperties = {
    fontSize: `${isCue ? size * CUE_SIZE_FACTOR : size}px`,
    lineHeight: isCue ? 1.3 : typo.lineHeight,
    fontWeight: typo.fontWeight,
    textAlign: typo.textAlign,
    letterSpacing: `${typo.letterSpacingPx}px`,
    wordSpacing: `${typo.wordSpacingPx}px`,
    paddingLeft: `${typo.marginXPercent}%`,
    paddingRight: `${typo.marginXPercent}%`,
    color: colors.text,
    textTransform: typo.allCaps && !isCue ? 'uppercase' : 'none',
  }

  if (slides.length === 0) {
    return (
      <div className="slide-stage">
        <div className="slide-stage__text" style={{ ...style, opacity: 0.5 }} ref={textRef}>
          Preparing slides…
        </div>
      </div>
    )
  }

  const paragraphs = text.split(/\n{2,}/)
  let em = startEm

  return (
    <div className="slide-stage">
      {/* A sentence that could not fit the window is continued here. The marker
          tells you the thought carries over so you keep the line reading. */}
      {slide?.continues && <div className="slide-stage__carry" aria-hidden="true">…</div>}
      <div
        className={'slide-stage__text' + (isCue ? ' pf-cue' : '')}
        style={style}
        ref={textRef}
        key={slideIndex}
      >
        {isCue
          ? cueText(text)
          : paragraphs.map((p, i) => {
              if (isCueParagraph(p)) return <p key={i} className="pf-cue">{cueText(p)}</p>
              // Only the LAST paragraph of a slide can end mid-span; the ones
              // before it are followed by a blank line, which no span crosses.
              const parsed = parseInline(p, em, i === paragraphs.length - 1 ? endEm : false)
              em = parsed.endEm
              return (
                <p key={i}>
                  {parsed.tokens.map((t, j) => (
                    <Fragment key={j}>
                      {t.em ? <strong className="pf-em">{t.text}</strong> : t.text}
                    </Fragment>
                  ))}
                </p>
              )
            })}
      </div>
      {recording && <div className="slide-stage__rec" aria-hidden="true" />}
    </div>
  )
}
