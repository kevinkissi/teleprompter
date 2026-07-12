import { useEffect } from 'react'
import { useAppStore } from './state/appStore'
import { LibraryView } from './components/LibraryView'
import { ReaderView } from './components/ReaderView'

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

  return view === 'reader' ? <ReaderView /> : <LibraryView />
}
