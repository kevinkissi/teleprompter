import { useMemo, useRef, useState } from 'react'
import { useAppStore } from '../state/appStore'
import { Icon } from './Icon'
import { countWords, estimateReadTimeSeconds, formatDuration } from '../utils/estimateReadTime'
import { normalizeText } from '../utils/textNormalize'
import { createScript } from '../storage/scriptsRepository'

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function ScriptList() {
  const scripts = useAppStore((s) => s.scripts)
  const speedWpm = useAppStore((s) => s.config.scroll.speedWpm)
  const newScript = useAppStore((s) => s.newScript)
  const openEditor = useAppStore((s) => s.openEditor)
  const openReader = useAppStore((s) => s.openReader)
  const duplicateScript = useAppStore((s) => s.duplicateScript)
  const deleteScript = useAppStore((s) => s.deleteScript)
  const refreshScripts = useAppStore((s) => s.refreshScripts)
  const importSeries = useAppStore((s) => s.importSeries)

  const [query, setQuery] = useState('')
  const [loadingSeries, setLoadingSeries] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return scripts
    return scripts.filter(
      (s) => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q),
    )
  }, [scripts, query])

  async function handleNew() {
    await newScript()
  }

  async function handleImport(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      const text = normalizeText(await file.text())
      const title = file.name.replace(/\.(txt|md|markdown)$/i, '')
      await createScript({ title: title || undefined, body: text })
    }
    await refreshScripts()
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleLoadSeries() {
    setLoadingSeries(true)
    try {
      const { added, total } = await importSeries()
      alert(
        added === 0
          ? `All ${total} “Point of Failure” scripts are already in your library.`
          : `Loaded ${added} new script${added === 1 ? '' : 's'} (of ${total} in the series so far).`,
      )
    } finally {
      setLoadingSeries(false)
    }
  }

  return (
    <div>
      <div className="list-toolbar">
        <input
          className="search"
          placeholder="Search scripts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn--primary" onClick={handleNew} type="button">
          <Icon name="plusCircle" size={20} /> New
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()} type="button">
          Import
        </button>
        <button
          className="btn"
          onClick={handleLoadSeries}
          disabled={loadingSeries}
          type="button"
          title="Load all The Point of Failure scripts (safe to re-tap; never overwrites your edits)"
        >
          {loadingSeries ? 'Loading…' : 'Load series'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.markdown,text/plain,text/markdown"
          multiple
          hidden
          onChange={(e) => handleImport(e.target.files)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          {scripts.length === 0 ? (
            <>
              <p>No scripts yet.</p>
              <button className="btn btn--primary" onClick={handleNew} type="button">
                Create your first script
              </button>
            </>
          ) : (
            <p>No scripts match “{query}”.</p>
          )}
        </div>
      ) : (
        <div className="script-list">
          {filtered.map((s) => {
            const words = countWords(s.body)
            const secs = estimateReadTimeSeconds(s.body, speedWpm)
            return (
              <div className="script-card" key={s.id}>
                <div className="script-card__top">
                  <div style={{ minWidth: 0 }}>
                    <div className="script-card__title">{s.title || 'Untitled script'}</div>
                    <div className="script-card__meta">
                      {words.toLocaleString()} words · ~{formatDuration(secs)} at {speedWpm} WPM ·{' '}
                      {relativeTime(s.updatedAt)}
                    </div>
                  </div>
                  <button
                    className="btn btn--primary"
                    onClick={() => openReader(s.id)}
                    type="button"
                  >
                    <Icon name="play" size={18} /> Prompt
                  </button>
                </div>
                <div className="script-card__actions">
                  <button className="btn btn--ghost" onClick={() => openEditor(s.id)} type="button">
                    <Icon name="edit" size={18} /> Edit
                  </button>
                  <button
                    className="btn btn--ghost"
                    onClick={() => duplicateScript(s.id)}
                    type="button"
                  >
                    <Icon name="copy" size={18} /> Duplicate
                  </button>
                  <span className="spacer" />
                  <button
                    className="btn btn--danger"
                    onClick={() => {
                      if (confirm(`Delete “${s.title}”? This cannot be undone.`)) deleteScript(s.id)
                    }}
                    type="button"
                  >
                    <Icon name="trash" size={18} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
