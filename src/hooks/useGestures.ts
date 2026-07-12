import { useEffect, type RefObject } from 'react'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'
import { FONT_MAX, FONT_MIN, NUDGE_SECONDS, WPM_STEP_LARGE, clamp } from '../state/defaults'

const TAP_MOVE_MAX = 12
const TAP_TIME_MAX = 300
const DOUBLE_TAP_MS = 280
const SWIPE_MIN = 55

/**
 * Reader gestures. A single tap always toggles the controls (essential for
 * revealing them). Double-tap / swipe / pinch are opt-in via settings and are
 * ignored otherwise so accidental touches during recording don't disrupt a take.
 */
export function useGestures(elRef: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    const el = elRef.current
    if (!el) return

    let startX = 0
    let startY = 0
    let startTime = 0
    let moved = false
    let pinching = false
    let pinchStartDist = 0
    let pinchStartFont = 0
    let lastTapTime = 0
    let singleTapTimer: number | undefined

    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && enabled) {
        pinching = true
        pinchStartDist = dist(e.touches)
        pinchStartFont = useAppStore.getState().config.typography.fontSizePx
        e.preventDefault()
        return
      }
      const t = e.touches[0]
      startX = t.clientX
      startY = t.clientY
      startTime = performance.now()
      moved = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (pinching && e.touches.length === 2) {
        const ratio = dist(e.touches) / (pinchStartDist || 1)
        const next = clamp(Math.round(pinchStartFont * ratio), FONT_MIN, FONT_MAX)
        useAppStore.getState().setTypography({ fontSizePx: next })
        e.preventDefault()
        return
      }
      const t = e.touches[0]
      if (!t) return
      if (Math.hypot(t.clientX - startX, t.clientY - startY) > TAP_MOVE_MAX) moved = true
    }

    const handleTap = () => {
      const now = performance.now()
      if (enabled && now - lastTapTime < DOUBLE_TAP_MS) {
        // Double tap → play/pause
        window.clearTimeout(singleTapTimer)
        lastTapTime = 0
        useAppStore.getState().togglePlay()
        return
      }
      lastTapTime = now
      if (!enabled) {
        useAppStore.getState().toggleControls()
        return
      }
      // Wait to see if a second tap follows.
      window.clearTimeout(singleTapTimer)
      singleTapTimer = window.setTimeout(() => {
        useAppStore.getState().toggleControls()
      }, DOUBLE_TAP_MS)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (pinching) {
        if (e.touches.length === 0) pinching = false
        return
      }
      const dt = performance.now() - startTime
      const changed = e.changedTouches[0]
      const dx = changed ? changed.clientX - startX : 0
      const dy = changed ? changed.clientY - startY : 0
      const move = Math.hypot(dx, dy)

      if (!moved && move < TAP_MOVE_MAX && dt < TAP_TIME_MAX) {
        handleTap()
        return
      }

      if (enabled && move >= SWIPE_MIN) {
        if (Math.abs(dx) > Math.abs(dy)) {
          scrollController.current.nudgeSeconds(dx < 0 ? -NUDGE_SECONDS : NUDGE_SECONDS)
        } else {
          // Swipe up = faster, swipe down = slower
          useAppStore.getState().adjustSpeed(dy < 0 ? WPM_STEP_LARGE : -WPM_STEP_LARGE)
        }
      }
    }

    // Desktop: click toggles controls (touch handled above).
    const onClick = () => {
      if ('ontouchstart' in window) return
      useAppStore.getState().toggleControls()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    el.addEventListener('click', onClick)
    return () => {
      window.clearTimeout(singleTapTimer)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('click', onClick)
    }
  }, [elRef, enabled])
}
