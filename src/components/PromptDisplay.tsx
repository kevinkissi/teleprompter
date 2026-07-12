import { useMemo, useRef, type CSSProperties } from 'react'
import { useAppStore } from '../state/appStore'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useWakeLock } from '../hooks/useWakeLock'
import { useGestures } from '../hooks/useGestures'
import { useOrientation } from '../hooks/useOrientation'
import { isRotatedQuarter, transformCss } from '../utils/transform'
import { Countdown } from './Countdown'

const DYSLEXIA_STACK = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', 'Verdana', sans-serif"
const DEFAULT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export function PromptDisplay() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const preRollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const viewport = useOrientation()

  const transform = useAppStore((s) => s.config.transform)
  const typo = useAppStore((s) => s.config.typography)
  const colors = useAppStore((s) => s.config.colors)
  const gesturesEnabled = useAppStore((s) => s.settings.gesturesEnabled)
  const keepAwake = useAppStore((s) => s.settings.keepAwake)
  const ended = useAppStore((s) => s.ended)
  const body = useAppStore((s) => {
    const id = s.currentScriptId
    return s.scripts.find((x) => x.id === id)?.body ?? ''
  })

  useScrollEngine({ viewportRef, scrollerRef, textRef, preRollRef, bottomRef })
  useWakeLock(keepAwake)
  useGestures(viewportRef, gesturesEnabled)

  const rotated = isRotatedQuarter(transform.rotateDeg)
  const layerW = rotated ? viewport.height : viewport.width
  const layerH = rotated ? viewport.width : viewport.height

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

  return (
    <div className="reader__viewport" ref={viewportRef} style={{ background: colors.background }}>
      <div className="reader__layer" style={layerStyle}>
        <div className="reader__scroller" ref={scrollerRef}>
          <div ref={preRollRef} aria-hidden="true" />
          <div className="prompt-text" ref={textRef} style={textStyle}>
            {body.trim().length === 0 ? (
              <p style={{ opacity: 0.5 }}>Your script is empty. Add text in the editor.</p>
            ) : (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
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
