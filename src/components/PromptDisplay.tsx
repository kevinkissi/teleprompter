import { Fragment, useMemo, useRef, type CSSProperties, type RefObject } from 'react'
import { useAppStore } from '../state/appStore'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useWakeLock } from '../hooks/useWakeLock'
import { useGestures } from '../hooks/useGestures'
import { useOrientation } from '../hooks/useOrientation'
import { isRotatedQuarter, transformCss } from '../utils/transform'
import { lensWindowSizePx } from '../utils/lens'
import { cueText, isCueParagraph, parseInline } from '../utils/prompterFormat'
import { Countdown } from './Countdown'
import { SlideStage } from './SlideStage'

const DYSLEXIA_STACK = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', 'Verdana', sans-serif"
const DEFAULT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/**
 * The continuously scrolling reader. Owns the rAF scroll engine and the DOM
 * nodes it drives.
 */
function ScrollStage({ layerRef }: { layerRef: RefObject<HTMLDivElement | null> }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const preRollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const typo = useAppStore((s) => s.config.typography)
  const colors = useAppStore((s) => s.config.colors)
  const body = useAppStore((s) => {
    const id = s.currentScriptId
    return s.scripts.find((x) => x.id === id)?.body ?? ''
  })

  useScrollEngine({ layerRef, scrollerRef, textRef, preRollRef, bottomRef })

  const paragraphs = useMemo(() => body.split(/\n{2,}/), [body])

  const textStyle: CSSProperties = {
    fontSize: `${typo.fontSizePx}px`,
    lineHeight: typo.lineHeight,
    fontWeight: typo.fontWeight,
    textAlign: typo.textAlign,
    letterSpacing: `${typo.letterSpacingPx}px`,
    wordSpacing: `${typo.wordSpacingPx}px`,
    paddingLeft: `${typo.marginXPercent}%`,
    paddingRight: `${typo.marginXPercent}%`,
    color: colors.text,
    textTransform: typo.allCaps ? 'uppercase' : 'none',
  }

  return (
    <div className="reader__scroller" ref={scrollerRef}>
      <div ref={preRollRef} aria-hidden="true" />
      <div className="prompt-text" ref={textRef} style={textStyle}>
        {body.trim().length === 0 ? (
          <p style={{ opacity: 0.5 }}>Your script is empty. Add text in the editor.</p>
        ) : (
          paragraphs.map((p, i) =>
            isCueParagraph(p) ? (
              <p key={i} className="pf-cue">
                {cueText(p)}
              </p>
            ) : (
              <p key={i}>
                {parseInline(p).tokens.map((t, j) => (
                  <Fragment key={j}>
                    {t.em ? <strong className="pf-em">{t.text}</strong> : t.text}
                  </Fragment>
                ))}
              </p>
            ),
          )
        )}
      </div>
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}

/**
 * The reading surface: the lens window, the orientation transform, and whichever
 * playback stage the current mode calls for.
 *
 * The two stages present the SAME script body — one scrolls it, one shows it a
 * section at a time. Switching between them changes nothing about the script and
 * nothing about recording.
 *
 * The countdown lives HERE, outside the stages, so it is mounted in both modes.
 * If it only existed inside one of them, a Play that arrived while the other was
 * up would set `countingDown` with nothing able to finish it — and a stuck
 * countdown is what makes Studio OS stop starting the prompter on later takes.
 */
export function PromptDisplay() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  const viewport = useOrientation()

  const transform = useAppStore((s) => s.config.transform)
  const typo = useAppStore((s) => s.config.typography)
  const colors = useAppStore((s) => s.config.colors)
  const lens = useAppStore((s) => s.config.lens)
  const mode = useAppStore((s) => s.config.slide.mode)
  const gesturesEnabled = useAppStore((s) => s.settings.gesturesEnabled)
  const keepAwake = useAppStore((s) => s.settings.keepAwake)
  const ended = useAppStore((s) => s.ended)

  useWakeLock(keepAwake)
  useGestures(viewportRef, gesturesEnabled)

  const slideMode = mode === 'slide'
  const rotated = isRotatedQuarter(transform.rotateDeg)
  let layerW: number
  let layerH: number
  if (lens.enabled) {
    // Centered square window sized to the lens opening (capped to fit the screen).
    const side = lensWindowSizePx(lens.sizeMm, viewport.width, viewport.height)
    layerW = side
    layerH = side
  } else {
    layerW = rotated ? viewport.height : viewport.width
    layerH = rotated ? viewport.width : viewport.height
  }

  const layerStyle: CSSProperties = {
    width: `${layerW}px`,
    height: `${layerH}px`,
    transform: transformCss(transform),
    fontFamily: typo.dyslexiaFont ? DYSLEXIA_STACK : DEFAULT_STACK,
  }
  if (lens.enabled) {
    if (lens.showBorder) layerStyle.outline = '2px solid rgba(56, 189, 248, 0.65)'
    // The edge fade softens text ENTERING and LEAVING a scroll window. A slide
    // is static and centred, so the same mask would just dim its first and last
    // line — and cost about a quarter of the window at the tighter lens sizes.
    if (lens.edgeFade && !slideMode) {
      const fade = 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)'
      layerStyle.WebkitMaskImage = fade
      layerStyle.maskImage = fade
    }
  }

  return (
    <div className="reader__viewport" ref={viewportRef} style={{ background: colors.background }}>
      <div className="reader__layer" ref={layerRef} style={layerStyle}>
        {slideMode ? <SlideStage layerRef={layerRef} /> : <ScrollStage layerRef={layerRef} />}
        <Countdown />
      </div>
      {ended && <div className="end-flag">End of script</div>}
    </div>
  )
}
