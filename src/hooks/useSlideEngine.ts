import { useEffect, useRef, type RefObject } from 'react'
import { useAppStore } from '../state/appStore'
import { idleController, scrollController } from '../state/scrollController'
import { clamp } from '../state/defaults'
import { canvasMeasurer, slideBoxFor, type FitBox } from '../utils/slideFit'
import { segmentScript, slideIndexForOffset } from '../utils/slides'

interface SlideEngineRefs {
  /** The clipping reading window — the lens square, or the full screen. */
  layerRef: RefObject<HTMLDivElement | null>
}

/** How often the auto-advance timer ticks. Fine enough to fire on time. */
const TICK_MS = 100
/** Wait for a lens drag to settle before re-segmenting. */
const RESEGMENT_DEBOUNCE_MS = 180

/**
 * Slide Mode's playback engine.
 *
 * Two jobs, and it does nothing else:
 *  1. Segment the current script for the reading box that is actually on screen,
 *     re-doing it whenever the box or the typography changes, and keeping the
 *     reader's place across every re-segmentation via the character anchor.
 *  2. Run the auto-advance timer, and install a playback controller so pause,
 *     resume, next, previous, top and end all mean something in this mode too.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: touch recording. The phone captures nothing,
 * and on the Mac the camera and microphone are separate systems that no
 * teleprompter command can reach. Pausing here freezes the script and nothing
 * else — the take keeps rolling.
 *
 * The running countdown lives in a ref and is written to the store only on an
 * edge (slide change, pause, resume, retiming). The store is what the WiFi
 * remote publishes from, so a per-frame countdown there would push a full state
 * frame at the limiter's ceiling for the whole take; instead the controller gets
 * the slide's duration once and counts down against its own clock.
 */
export function useSlideEngine(refs: SlideEngineRefs): void {
  const remainingRef = useRef(0)
  /** Whole duration of the slide `remainingRef` is counting down. */
  const totalRef = useRef(0)
  const runningRef = useRef(false)
  const lastKeyRef = useRef('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const { layerRef } = refs

    /** Everything that changes how much script fits on one slide. */
    function layoutKey(box: FitBox): string {
      const { config, currentScriptId } = useAppStore.getState()
      const t = config.typography
      return [
        currentScriptId,
        Math.round(box.contentW),
        Math.round(box.usableH),
        config.slide.fontPx,
        t.fontSizePx,
        t.lineHeight,
        t.fontWeight,
        t.letterSpacingPx,
        t.wordSpacingPx,
        t.allCaps ? 1 : 0,
        t.dyslexiaFont ? 1 : 0,
        t.marginXPercent,
      ].join('|')
    }

    function currentBox(): FitBox | null {
      const layer = layerRef.current
      if (!layer) return null
      const { config } = useAppStore.getState()
      return slideBoxFor(layer.clientWidth, layer.clientHeight, config.typography.marginXPercent)
    }

    function segment(force = false): void {
      const box = currentBox()
      if (!box) return
      const state = useAppStore.getState()
      const body = state.scripts.find((s) => s.id === state.currentScriptId)?.body ?? ''
      const key = `${layoutKey(box)}|${body.length}`
      if (!force && key === lastKeyRef.current) return
      lastKeyRef.current = key

      const typo = {
        fontSizePx: state.config.typography.fontSizePx,
        lineHeight: state.config.typography.lineHeight,
        fontWeight: state.config.typography.fontWeight,
        letterSpacingPx: state.config.typography.letterSpacingPx,
        wordSpacingPx: state.config.typography.wordSpacingPx,
        allCaps: state.config.typography.allCaps,
        dyslexiaFont: state.config.typography.dyslexiaFont,
      }
      const measure = canvasMeasurer(typo)
      const chosen = state.config.slide.fontPx
      const deck = segmentScript(body, {
        box,
        typo,
        measure,
        fontPx: chosen > 0 ? chosen : undefined,
      })
      // The anchor, not the index, is the reading position — so a lens change
      // mid-take lands on the slide holding the same words.
      state.setSlides(deck.slides, deck.fontPx, deck.wholeSentencePct)
      const index = slideIndexForOffset(deck.slides, state.anchorOffset)
      const seconds = useAppStore.getState().slideSecondsFor(index)
      // Keep whatever fraction of the slide is still ahead of you, so nudging
      // the lens mid-take does not hand back time you already spent speaking.
      const fractionLeft = totalRef.current > 0 ? remainingRef.current / totalRef.current : 1
      remainingRef.current = runningRef.current
        ? clamp(fractionLeft * seconds, 0, seconds)
        : seconds
      totalRef.current = seconds
      useAppStore.getState().setSlideRemaining(remainingRef.current)
    }

    function scheduleSegment(): void {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        segment()
      }, RESEGMENT_DEBOUNCE_MS)
    }

    function resetSlideTimer(): void {
      const s = useAppStore.getState()
      remainingRef.current = s.slideSecondsFor(s.slideIndex)
      totalRef.current = remainingRef.current
      s.setSlideRemaining(remainingRef.current)
    }

    let timer: ReturnType<typeof setInterval> | null = null

    function stopTimer(): void {
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
    }

    function tick(): void {
      const s = useAppStore.getState()
      if (s.config.slide.advance !== 'auto') return
      remainingRef.current -= TICK_MS / 1000
      if (remainingRef.current <= 0) {
        const last = s.slideIndex >= s.slides.length - 1
        if (last) {
          // End of the script. Stop the prompter — and only the prompter.
          runningRef.current = false
          stopTimer()
          s.setPlaying(false)
          s.setEnded(true)
          remainingRef.current = 0
          s.setSlideRemaining(0)
          return
        }
        s.stepSlide(1)
        resetSlideTimer()
        return
      }
      // Only publish whole seconds: the store is what the WiFi remote streams
      // from, and a 10Hz countdown there would flood the channel for a number
      // the controller can work out for itself.
      const whole = Math.ceil(remainingRef.current)
      if (whole !== Math.ceil(s.slideRemainingSeconds)) s.setSlideRemaining(whole)
    }

    function startTimer(): void {
      stopTimer()
      if (useAppStore.getState().config.slide.advance !== 'auto') return
      timer = setInterval(tick, TICK_MS)
    }

    function play(): void {
      const s = useAppStore.getState()
      if (s.slides.length === 0) segment(true)
      if (useAppStore.getState().ended) {
        useAppStore.getState().gotoSlide(0)
        useAppStore.getState().setEnded(false)
      }
      runningRef.current = true
      s.setPrompterPaused(false)
      // In manual mode nothing advances on its own, so `playing` stays false —
      // it means "the prompter is moving", and here it is you who moves it.
      s.setPlaying(useAppStore.getState().config.slide.advance === 'auto')
      if (useAppStore.getState().slideRemainingSeconds <= 0) resetSlideTimer()
      else {
        remainingRef.current = useAppStore.getState().slideRemainingSeconds
        if (totalRef.current <= 0) totalRef.current = remainingRef.current
        // Republish even though the number is unchanged: a controller anchors
        // its own countdown on this field CHANGING, and a resume that says
        // nothing leaves it frozen at whatever it had reached.
        s.setSlideRemaining(0)
        s.setSlideRemaining(remainingRef.current)
      }
      startTimer()
    }

    function pause(): void {
      const s = useAppStore.getState()
      runningRef.current = false
      stopTimer()
      s.setPlaying(false)
      s.setPrompterPaused(true)
      if (s.countingDown) s.cancelCountdown()
      // Publish where the freeze happened so a controller's own countdown stops
      // at the same number this one did.
      s.setSlideRemaining(Math.max(0, remainingRef.current))
    }

    scrollController.current = {
      play,
      pause,
      jumpTop: () => {
        useAppStore.getState().gotoSlide(0)
        useAppStore.getState().setEnded(false)
        resetSlideTimer()
      },
      jumpBottom: () => {
        const s = useAppStore.getState()
        s.gotoSlide(Math.max(0, s.slides.length - 1))
        s.setEnded(true)
        resetSlideTimer()
      },
      // A seek in a mode with no continuous position is a slide step. This is
      // also what makes a Bluetooth remote's arrow keys and Studio OS's existing
      // -5s / +5s buttons do the sensible thing without knowing about slides.
      nudgeSeconds: (seconds: number) => {
        useAppStore.getState().stepSlide(seconds < 0 ? -1 : 1)
        resetSlideTimer()
      },
      recompute: () => segment(),
      refreshProgress: () => {
        const s = useAppStore.getState()
        const count = Math.max(1, s.slides.length)
        s.setProgress(clamp(s.slideIndex / Math.max(1, count - 1), 0, 1), 0)
      },
      getProgress: () => {
        const s = useAppStore.getState()
        return clamp(s.slideIndex / Math.max(1, s.slides.length - 1), 0, 1)
      },
    }

    segment(true)
    resetSlideTimer()

    // The mode changed while the prompter was running: carry it over.
    if (useAppStore.getState().pendingResume) {
      useAppStore.getState().setPendingResume(false)
      play()
    }

    // Re-segment when the reading window changes size — a lens resize, a
    // rotation, an orientation change.
    const ro = new ResizeObserver(() => scheduleSegment())
    if (layerRef.current) ro.observe(layerRef.current)
    const onResize = () => scheduleSegment()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    // Follow the store for the things that change segmentation or timing.
    let prevKey = ''
    let prevIndex = useAppStore.getState().slideIndex
    const unsubscribe = useAppStore.subscribe((state) => {
      // The slide moved. It can move from four places — this engine's own
      // controller, the reader's buttons, a keyboard shortcut, or a gotoSlide
      // off the wire — and only the first went through resetSlideTimer(). Sync
      // the running countdown here so the others cannot leave a new slide
      // counting down the PREVIOUS one's leftover time, which at the end of a
      // slide would skip the next one outright.
      if (state.slideIndex !== prevIndex) {
        prevIndex = state.slideIndex
        // The store's value is already correct (gotoSlide recomputes it); only
        // this engine's refs are stale. Don't write back — that would re-enter.
        remainingRef.current = state.slideRemainingSeconds
        totalRef.current = state.slideRemainingSeconds
      }
      const t = state.config.typography
      const key = [
        state.currentScriptId,
        state.config.slide.fontPx,
        t.fontSizePx,
        t.lineHeight,
        t.marginXPercent,
        t.allCaps,
        t.dyslexiaFont,
        state.config.lens.enabled,
        state.config.lens.sizeMm,
      ].join('|')
      if (key !== prevKey) {
        prevKey = key
        scheduleSegment()
      }
      // Switching between manual and auto starts or stops the timer; it never
      // touches anything outside the prompter.
      const wantTimer = runningRef.current && state.config.slide.advance === 'auto'
      if (wantTimer && timer === null) startTimer()
      if (!wantTimer && timer !== null) stopTimer()
    })

    // Fonts resolve after first paint; segmenting before they do would produce
    // a slide count that silently changes a moment later.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(() => segment(true)).catch(() => {})
    }

    return () => {
      stopTimer()
      if (debounceRef.current) clearTimeout(debounceRef.current)
      ro.disconnect()
      unsubscribe()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      scrollController.current = idleController
    }
    // Refs are stable for the reader's lifetime; set the engine up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
