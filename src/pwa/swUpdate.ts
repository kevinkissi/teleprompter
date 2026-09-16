import { registerSW } from 'virtual:pwa-register'

/**
 * Service-worker registration with an explicit update handoff.
 *
 * The app is registered as 'prompt', not 'autoUpdate', so a new build never
 * reloads the page on its own — an update must not be able to interrupt a live
 * prompting session or throw away a scroll position. But a waiting worker with
 * nobody to prompt just waits forever: on a home-screen app that means the phone
 * keeps serving the old bundle until every window is fully terminated. So the
 * waiting build is surfaced here, and the reader applies it from the Library.
 */

type Listener = (ready: boolean) => void

let updateReady = false
const listeners = new Set<Listener>()
let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null

/** How often a running app re-checks for a new build. */
const UPDATE_CHECK_MS = 30 * 60 * 1000

export function initServiceWorker(): void {
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateReady = true
      for (const l of listeners) l(true)
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      // A phone can keep this app alive for days. Without a poll the only update
      // check is a cold start, so a deploy can sit unnoticed indefinitely.
      const check = () => {
        if (document.visibilityState === 'visible') void registration.update()
      }
      setInterval(check, UPDATE_CHECK_MS)
      document.addEventListener('visibilitychange', check)
    },
  })
}

/** Subscribe to "a new build is waiting". Returns an unsubscribe function. */
export function subscribeUpdateReady(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isUpdateReady(): boolean {
  return updateReady
}

/** Activate the waiting build and reload. Only ever called from the Library. */
export async function applyUpdate(): Promise<void> {
  await updateServiceWorker?.(true)
}
