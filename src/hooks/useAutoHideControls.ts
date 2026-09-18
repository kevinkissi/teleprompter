import { useEffect } from 'react'
import { useAppStore } from '../state/appStore'

const HIDE_DELAY_MS = 2500

/**
 * Auto-hide the control overlay while prompting. Controls reappear on any pointer
 * or key activity and hide again after a period of inactivity. While paused (and
 * not counting down) the controls always stay visible.
 *
 * Slide Mode needs its own answer to "is the prompter live", because manually
 * advanced slides never set `playing` — nothing is moving on its own. Left at
 * that, the control bar would sit over the lens window for the whole take and be
 * reflected into the glass. So: hide while slides advance on their own, and hide
 * whenever a take is rolling (Studio OS is driving, and the window has to be
 * clean); keep them up when you are stepping slides by hand on the phone, since
 * Next is the button you are reaching for.
 */
export function useAutoHideControls(active: boolean): void {
  const playing = useAppStore((s) => s.playing)
  const countingDown = useAppStore((s) => s.countingDown)
  const autoHide = useAppStore((s) => s.settings.autoHideControls)
  const slideMode = useAppStore((s) => s.config.slide.mode === 'slide')
  const autoAdvance = useAppStore((s) => s.config.slide.advance === 'auto')
  const prompterPaused = useAppStore((s) => s.prompterPaused)
  const recording = useAppStore((s) => s.recording)
  const hasSlides = useAppStore((s) => s.slides.length > 0)

  useEffect(() => {
    if (!active) return
    const slideLive = slideMode && hasSlides && !prompterPaused && (autoAdvance || recording)
    const shouldAutoHide = autoHide && (playing || countingDown || slideLive)

    if (!shouldAutoHide) {
      useAppStore.getState().showControls()
      return
    }

    let timer: number | undefined
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => useAppStore.getState().hideControls(), HIDE_DELAY_MS)
    }
    const onActivity = () => {
      useAppStore.getState().showControls()
      schedule()
    }

    schedule()
    window.addEventListener('pointermove', onActivity)
    window.addEventListener('keydown', onActivity)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointermove', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [
    active,
    playing,
    countingDown,
    autoHide,
    slideMode,
    autoAdvance,
    prompterPaused,
    recording,
    hasSlides,
  ])
}
