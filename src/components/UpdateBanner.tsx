import { useEffect, useState } from 'react'
import { applyUpdate, isUpdateReady, subscribeUpdateReady } from '../pwa/swUpdate'

/**
 * Offers a waiting build. Rendered only in the Library, never over the reading
 * screen, so updating stays a deliberate act between takes.
 */
export function UpdateBanner() {
  const [ready, setReady] = useState(isUpdateReady)
  const [applying, setApplying] = useState(false)

  useEffect(() => subscribeUpdateReady(setReady), [])

  if (!ready) return null

  return (
    <div className="update-banner">
      <span>New version ready — includes the latest episode numbering.</span>
      <button
        className="btn btn--primary"
        disabled={applying}
        onClick={() => {
          setApplying(true)
          void applyUpdate()
        }}
        type="button"
      >
        {applying ? 'Updating…' : 'Update'}
      </button>
    </div>
  )
}
