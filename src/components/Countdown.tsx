import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../state/appStore'

/**
 * Full-screen countdown shown before scrolling starts. Rendered inside the
 * transform layer so it is mirrored/rotated to match the reading text.
 */
export function Countdown() {
  const countingDown = useAppStore((s) => s.countingDown)
  const seconds = useAppStore((s) => s.pendingCountdownSeconds)
  const finishCountdown = useAppStore((s) => s.finishCountdown)
  const [value, setValue] = useState(seconds)
  const finishRef = useRef(finishCountdown)
  finishRef.current = finishCountdown

  useEffect(() => {
    if (!countingDown) return
    setValue(seconds)
    let remaining = seconds
    const timer = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        window.clearInterval(timer)
        finishRef.current()
      } else {
        setValue(remaining)
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [countingDown, seconds])

  if (!countingDown) return null
  return <div className="countdown">{value}</div>
}
