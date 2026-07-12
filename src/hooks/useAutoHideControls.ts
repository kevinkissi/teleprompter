import { useEffect } from 'react'
import { useAppStore } from '../state/appStore'

const HIDE_DELAY_MS = 2500

/**
 * Auto-hide the control overlay while prompting. Controls reappear on any pointer
 * or key activity and hide again after a period of inactivity. While paused (and
 * not counting down) the controls always stay visible.
 */
export function useAutoHideControls(active: boolean): void {
  const playing = useAppStore((s) => s.playing)
  const countingDown = useAppStore((s) => s.countingDown)
  const autoHide = useAppStore((s) => s.settings.autoHideControls)

  useEffect(() => {
    if (!active) return
    const shouldAutoHide = autoHide && (playing || countingDown)

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
  }, [active, playing, countingDown, autoHide])
}
