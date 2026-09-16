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

export function initServiceWorker(): void {
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateReady = true
      for (const l of listeners) l(true)
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
