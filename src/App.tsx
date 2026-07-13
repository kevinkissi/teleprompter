import { useEffect } from 'react'
import { useAppStore } from './state/appStore'
import { LibraryView } from './components/LibraryView'
import { ReaderView } from './components/ReaderView'
import { RemoteControl } from './components/RemoteControl'

export default function App() {
  const hydrated = useAppStore((s) => s.hydrated)
  const view = useAppStore((s) => s.view)
  const hydrate = useAppStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return <div className="app-loading">Loading…</div>
  }

  if (view === 'reader') return <ReaderView />
  if (view === 'remote') return <RemoteControl />
  return <LibraryView />
}
