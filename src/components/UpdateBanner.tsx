import { useEffect, useState } from 'react'
import { useAppStore } from '../state/appStore'
import { applyUpdate, isUpdateReady, subscribeUpdateReady } from '../pwa/swUpdate'

/** How long the banner shows before a safe update applies itself. */
const AUTO_APPLY_MS = 2500

/**
 * Offers a waiting build — and, when nothing would be lost, takes it.
 *
 * Rendered only in the Library, never over the reading screen. On the Scripts
 * tab with no editor open a reload costs nothing (the library restores itself),
 * so the update applies after a short, visible pause rather than sitting behind
 * a button someone has to notice. Anywhere else in the Library it waits for the
 * tap: an unsaved edit or a half-typed pairing code is worth more than a build.
 */
export function UpdateBanner() {
  const [ready, setReady] = useState(isUpdateReady)
  const [applying, setApplying] = useState(false)
  const libraryTab = useAppStore((s) => s.libraryTab)
  const editing = useAppStore((s) => s.editingScriptId)
  const safeToReload = libraryTab === 'scripts' && !editing

  useEffect(() => subscribeUpdateReady(setReady), [])

  useEffect(() => {
    if (!ready || !safeToReload || applying) return
    const t = setTimeout(() => {
      setApplying(true)
      void applyUpdate()
    }, AUTO_APPLY_MS)
    return () => clearTimeout(t)
  }, [ready, safeToReload, applying])

  if (!ready) return null

  return (
    <div className="update-banner" role="status">
      <span>
        {applying
          ? 'Updating…'
          : safeToReload
            ? 'New version ready — updating in a moment.'
            : 'New version ready.'}
      </span>
      <button
        className="btn btn--primary"
        disabled={applying}
        onClick={() => {
          setApplying(true)
          void applyUpdate()
        }}
        type="button"
      >
        {applying ? 'Updating…' : 'Update now'}
      </button>
    </div>
  )
}
