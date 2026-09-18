import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { useAppStore } from '../state/appStore'
import { useSlideEngine } from '../hooks/useSlideEngine'
import { cueText, isCueParagraph, parseInline } from '../utils/prompterFormat'
import { SLIDE_FONT_HARD_MIN, slideText } from '../utils/slides'

/**
 * Shrink ladder for the rare slide the segmenter could not fit — a single
 * unbreakable sentence, or a director cue with unusual typography. Discrete and
 * short on purpose: text that changes size between slides is what makes you lose
 * your line on a beam-splitter, so this is a rescue, not a layout strategy.
 */
const SHRINK_LADDER = [1, 0.9, 0.8, 0.72]

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

  // The measured backstop. The segmenter fits every slide before it exists, but
  // it MODELS the layout rather than performing it — so check the real box and
  // step down if the browser disagrees.
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
      el.style.fontSize = `${isCue ? size * 0.5 : size}px`
      return el.scrollHeight <= budget
    }
    let chosen = Math.round(base)
    for (const step of SHRINK_LADDER) {
      chosen = Math.max(SLIDE_FONT_HARD_MIN, Math.round(base * step))
      if (probe(chosen)) break
    }
    // Leave the winning size applied rather than clearing the property: React
    // only rewrites an inline style when the rendered value changes, so clearing
    // it here would drop the size entirely and the slide would render at the
    // browser default.
    probe(chosen)
    setFitPx((prev) => (prev === chosen ? prev : chosen))
  }, [base, isCue, slideIndex, text, layerRef, typo.lineHeight, typo.marginXPercent])

  const size = fitPx > 0 ? fitPx : base
  const style: CSSProperties = {
    fontSize: `${isCue ? size * 0.5 : size}px`,
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
  let em = slide?.startEm ?? false
  const endEm = slide?.endEm ?? false

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
