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
let registration: ServiceWorkerRegistration | null = null

/** How often a running app re-checks for a new build. */
const UPDATE_CHECK_MS = 30 * 60 * 1000

export function initServiceWorker(): void {
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateReady = true
      for (const l of listeners) l(true)
    },
    onRegisteredSW(_swUrl, reg) {
      if (!reg) return
      registration = reg
      // A phone can keep this app alive for days. Without a poll the only update
      // check is a cold start, so a deploy can sit unnoticed indefinitely.
      const check = () => {
        if (document.visibilityState === 'visible') void reg.update()
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

let reloading = false

/**
 * Hand the page to a worker that has finished installing, then reload once it
 * is in control.
 *
 * This owns the reload rather than leaning on the plugin's. That one is wired
 * up only inside its "waiting" event handler, so a worker found by asking for
 * an update — a beat before that handler has run — would take the SKIP_WAITING,
 * activate, claim the page (clientsClaim) and leave it running the old bundle
 * with a new worker underneath. Measured, not theorised: that is exactly what
 * the end-to-end test caught.
 */
function activate(worker: ServiceWorker): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      if (reloading) return
      reloading = true
      resolve()
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', done, { once: true })
    worker.postMessage({ type: 'SKIP_WAITING' })
    // If the claim never reaches this page but the worker moved on anyway,
    // reload rather than sit on the old bundle.
    setTimeout(() => {
      if (registration?.waiting !== worker) done()
    }, 4000)
  })
}

/** Activate the waiting build and reload. Only ever called from the Library. */
export async function applyUpdate(): Promise<void> {
  const waiting = registration?.waiting
  if (waiting) return activate(waiting)
  await updateServiceWorker?.(true)
}

export type UpdateCheck = 'applied' | 'none' | 'unsupported'

/**
 * Look for a new build right now and, if one is waiting, switch to it.
 *
 * This is the path that does not depend on a banner having appeared: a reload
 * only ever ASKS the browser to check, and a worker found waiting is offered,
 * not applied. Someone tapping "Check for update" wants the other half too.
 */
export async function checkForUpdate(): Promise<UpdateCheck> {
  if (!registration) return 'unsupported'
  await registration.update().catch(() => undefined)
  const waiting = registration.waiting ?? (await waitForWaiting(registration, 6000))
  if (!waiting) return 'none'
  await activate(waiting)
  return 'applied'
}

/** A new worker downloads and installs asynchronously; give it a moment to land. */
function waitForWaiting(reg: ServiceWorkerRegistration, timeoutMs: number): Promise<ServiceWorker | null> {
  return new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      if (reg.waiting) return resolve(reg.waiting)
      if (Date.now() - started > timeoutMs) return resolve(null)
      setTimeout(tick, 250)
    }
    tick()
  })
}
