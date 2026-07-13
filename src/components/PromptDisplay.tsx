import { Fragment, useMemo, useRef, type CSSProperties } from 'react'
import { useAppStore } from '../state/appStore'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useWakeLock } from '../hooks/useWakeLock'
import { useGestures } from '../hooks/useGestures'
import { useOrientation } from '../hooks/useOrientation'
import { isRotatedQuarter, transformCss } from '../utils/transform'
import { lensWindowSizePx } from '../utils/lens'
import { cueText, isCueParagraph, parseInline } from '../utils/prompterFormat'
import { Countdown } from './Countdown'

const DYSLEXIA_STACK = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', 'Verdana', sans-serif"
const DEFAULT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export function PromptDisplay() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const preRollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const viewport = useOrientation()

  const transform = useAppStore((s) => s.config.transform)
  const typo = useAppStore((s) => s.config.typography)
  const colors = useAppStore((s) => s.config.colors)
  const lens = useAppStore((s) => s.config.lens)
  const gesturesEnabled = useAppStore((s) => s.settings.gesturesEnabled)
  const keepAwake = useAppStore((s) => s.settings.keepAwake)
  const ended = useAppStore((s) => s.ended)
  const body = useAppStore((s) => {
    const id = s.currentScriptId
    return s.scripts.find((x) => x.id === id)?.body ?? ''
  })

  useScrollEngine({ layerRef, scrollerRef, textRef, preRollRef, bottomRef })
  useWakeLock(keepAwake)
  useGestures(viewportRef, gesturesEnabled)

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
    fontFamily: typo.dyslexiaFont ? DYSLEXIA_STACK : DEFAULT_STACK,
  }

  const layerStyle: CSSProperties = {
    width: `${layerW}px`,
    height: `${layerH}px`,
    transform: transformCss(transform),
  }
  if (lens.enabled) {
    if (lens.showBorder) layerStyle.outline = '2px solid rgba(56, 189, 248, 0.65)'
    if (lens.edgeFade) {
      const fade = 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)'
      layerStyle.WebkitMaskImage = fade
      layerStyle.maskImage = fade
    }
  }

  return (
    <div className="reader__viewport" ref={viewportRef} style={{ background: colors.background }}>
      <div className="reader__layer" ref={layerRef} style={layerStyle}>
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
                    {parseInline(p).map((t, j) => (
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
        <Countdown />
      </div>
      {ended && <div className="end-flag">End of script</div>}
    </div>
  )
}
