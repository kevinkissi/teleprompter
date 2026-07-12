import { useEffect, useRef, type RefObject } from 'react'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'
import { clamp } from '../state/defaults'
import { countWords } from '../utils/estimateReadTime'

interface ScrollEngineRefs {
  /** The clipping reading window (full-screen normally, or the lens square). */
  layerRef: RefObject<HTMLDivElement | null>
  scrollerRef: RefObject<HTMLDivElement | null>
  textRef: RefObject<HTMLDivElement | null>
  preRollRef: RefObject<HTMLDivElement | null>
  bottomRef: RefObject<HTMLDivElement | null>
}

interface Metrics {
  textHeight: number
  readingLen: number
  preRollPx: number
  maxScroll: number
}

const PROGRESS_INTERVAL_MS = 200
const PERSIST_INTERVAL_MS = 2000

/**
 * The requestAnimationFrame scroll loop. Keeps the authoritative position in a
 * ref and writes it straight to the DOM via a translate3d transform, so scrolling
 * never triggers React renders. Progress is pushed to the store at ~5Hz only.
 */
export function useScrollEngine(refs: ScrollEngineRefs): void {
  const posRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const metricsRef = useRef<Metrics>({ textHeight: 0, readingLen: 0, preRollPx: 0, maxScroll: 0 })
  const wordCountRef = useRef(0)
  const lastProgressTsRef = useRef(0)
  const lastPersistTsRef = useRef(0)

  useEffect(() => {
    const { layerRef, scrollerRef, textRef, preRollRef, bottomRef } = refs

    function applyTransform(): void {
      const scroller = scrollerRef.current
      if (scroller) scroller.style.transform = `translate3d(0, ${-posRef.current}px, 0)`
    }

    function computeSpeedPxPerSec(): number {
      const { config } = useAppStore.getState()
      const { textHeight } = metricsRef.current
      const words = wordCountRef.current
      const wpm = config.scroll.speedWpm
      if (words <= 0 || textHeight <= 0 || wpm <= 0) return 0
      // WPM controls pace independent of font size: traversing the text block
      // (height textHeight) should take words/wpm minutes.
      return (textHeight * wpm) / (words * 60)
    }

    function pushProgress(force = false): void {
      const now = performance.now()
      if (!force && now - lastProgressTsRef.current < PROGRESS_INTERVAL_MS) return
      lastProgressTsRef.current = now
      const { maxScroll } = metricsRef.current
      const progress = maxScroll > 0 ? clamp(posRef.current / maxScroll, 0, 1) : 0
      const { config } = useAppStore.getState()
      const wpm = config.scroll.speedWpm
      const remainingWords = wordCountRef.current * (1 - progress)
      const remainingSeconds = wpm > 0 ? (remainingWords / wpm) * 60 : 0
      useAppStore.getState().setProgress(progress, remainingSeconds)
    }

    function persistPosition(force = false): void {
      const now = performance.now()
      if (!force && now - lastPersistTsRef.current < PERSIST_INTERVAL_MS) return
      lastPersistTsRef.current = now
      const id = useAppStore.getState().currentScriptId
      if (id) void useAppStore.getState().persistPosition(id, Math.round(posRef.current))
    }

    function recompute(): void {
      const layer = layerRef.current
      const text = textRef.current
      if (!layer || !text) return
      const { config, currentScriptId, scripts } = useAppStore.getState()

      const prev = metricsRef.current
      const frac = prev.maxScroll > 0 ? posRef.current / prev.maxScroll : null

      // The reading window's extent along the scroll (local Y) axis. This is the full
      // screen height normally, or the lens square's side when the lens window is on.
      const readingLen = layer.clientHeight
      const textHeight = text.scrollHeight
      const preRollPx = (config.scroll.preRollVh / 100) * readingLen
      // Bottom padding lets the final line settle at the reading line (centre).
      const bottomPad = readingLen / 2
      const maxScroll = Math.max(0, preRollPx + textHeight - readingLen / 2)

      if (preRollRef.current) preRollRef.current.style.height = `${preRollPx}px`
      if (bottomRef.current) bottomRef.current.style.height = `${bottomPad}px`

      const body = scripts.find((s) => s.id === currentScriptId)?.body ?? ''
      wordCountRef.current = countWords(body)

      metricsRef.current = { textHeight, readingLen, preRollPx, maxScroll }

      // Preserve reading position (as a fraction) across layout changes.
      if (frac !== null) posRef.current = clamp(frac * maxScroll, 0, maxScroll)
      else posRef.current = clamp(posRef.current, 0, maxScroll)

      applyTransform()
      pushProgress(true)
    }

    function stopLoop(): void {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTsRef.current = null
    }

    function frame(ts: number): void {
      if (lastTsRef.current === null) {
        lastTsRef.current = ts
        rafRef.current = requestAnimationFrame(frame)
        return
      }
      // Clamp dt so a background tab / stall doesn't produce a giant jump.
      const dt = Math.min(0.1, (ts - lastTsRef.current) / 1000)
      lastTsRef.current = ts

      const { maxScroll } = metricsRef.current
      const pxPerSec = computeSpeedPxPerSec()
      posRef.current += pxPerSec * dt

      if (posRef.current >= maxScroll) {
        const { config } = useAppStore.getState()
        if (config.scroll.loop && maxScroll > 0) {
          posRef.current = 0
        } else {
          posRef.current = maxScroll
          applyTransform()
          pushProgress(true)
          persistPosition(true)
          stopLoop()
          useAppStore.getState().setPlaying(false)
          useAppStore.getState().setEnded(true)
          return
        }
      }

      applyTransform()
      pushProgress()
      persistPosition()
      rafRef.current = requestAnimationFrame(frame)
    }

    function play(): void {
      if (rafRef.current !== null) return
      recompute()
      const { maxScroll } = metricsRef.current
      if (posRef.current >= maxScroll) {
        posRef.current = 0
        useAppStore.getState().setEnded(false)
      }
      useAppStore.getState().setPlaying(true)
      lastTsRef.current = null
      rafRef.current = requestAnimationFrame(frame)
    }

    function pause(): void {
      stopLoop()
      useAppStore.getState().setPlaying(false)
      pushProgress(true)
      persistPosition(true)
    }

    function jumpTo(px: number, markEnded: boolean): void {
      const { maxScroll } = metricsRef.current
      posRef.current = clamp(px, 0, maxScroll)
      applyTransform()
      pushProgress(true)
      persistPosition(true)
      useAppStore.getState().setEnded(markEnded)
    }

    scrollController.current = {
      play,
      pause,
      jumpTop: () => jumpTo(0, false),
      jumpBottom: () => jumpTo(metricsRef.current.maxScroll, true),
      nudgeSeconds: (seconds: number) => {
        // Fallback speed (40px/s) keeps the sign of `seconds` so rewind stays backward
        // even when the WPM-derived speed resolves to 0 (e.g. an empty script).
        const delta = computeSpeedPxPerSec() * seconds || seconds * 40
        jumpTo(posRef.current + delta, false)
      },
      recompute,
      refreshProgress: () => pushProgress(true),
      getProgress: () => {
        const { maxScroll } = metricsRef.current
        return maxScroll > 0 ? clamp(posRef.current / maxScroll, 0, 1) : 0
      },
    }

    // --- initial layout + position restore ---
    recompute()
    const { settings, currentScriptId, scripts } = useAppStore.getState()
    if (settings.continueFromLastPosition && currentScriptId) {
      const last = scripts.find((s) => s.id === currentScriptId)?.lastPositionPx ?? 0
      posRef.current = clamp(last, 0, metricsRef.current.maxScroll)
    } else {
      posRef.current = 0
    }
    applyTransform()
    pushProgress(true)

    // Recompute when the text block or the reading window changes size
    // (font, rotation, orientation, or toggling/resizing the lens window).
    const ro = new ResizeObserver(() => recompute())
    if (textRef.current) ro.observe(textRef.current)
    if (layerRef.current) ro.observe(layerRef.current)
    const onResize = () => recompute()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      persistPosition(true)
      stopLoop()
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      scrollController.current = {
        play: () => {},
        pause: () => {},
        jumpTop: () => {},
        jumpBottom: () => {},
        nudgeSeconds: () => {},
        recompute: () => {},
        refreshProgress: () => {},
        getProgress: () => 0,
      }
    }
    // Refs are stable for the reader's lifetime; set up the engine once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
