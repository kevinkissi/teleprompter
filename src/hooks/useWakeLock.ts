import { useEffect } from 'react'

type WakeLockSentinelLike = { release: () => Promise<void>; released: boolean }
type NavigatorWithWakeLock = Navigator & {
  wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
}

/**
 * Keep the screen awake while `active` (best-effort; Screen Wake Lock API where
 * supported). Re-acquires the lock when the page becomes visible again, since the
 * OS releases it on tab/app switch.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const nav = navigator as NavigatorWithWakeLock
    if (!nav.wakeLock) return

    let sentinel: WakeLockSentinelLike | null = null
    let cancelled = false

    const acquire = async () => {
      try {
        const granted = await nav.wakeLock!.request('screen')
        // The effect may have been cleaned up while the request was pending —
        // release immediately instead of leaking a lock that keeps the screen on.
        if (cancelled) {
          void granted.release().catch(() => {})
          return
        }
        sentinel = granted
      } catch {
        // Denied (e.g. low battery) — ignore, this is best-effort.
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !cancelled) void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      if (sentinel && !sentinel.released) void sentinel.release().catch(() => {})
    }
  }, [active])
}
