import { useMemo, useRef, useState } from 'react'
import { useAppStore } from '../state/appStore'
import { Icon } from './Icon'
import { countWords, estimateReadTimeSeconds, formatDuration } from '../utils/estimateReadTime'
import { normalizeText } from '../utils/textNormalize'
import { createScript } from '../storage/scriptsRepository'
import { collectionFor, POF_COLLECTION_ORDER } from '../data/pof/collections'
import type { Script } from '../types'

const UNGROUPED = 'My scripts'

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
  const expandedGroups = useAppStore((s) => s.expandedGroups)
  const newScript = useAppStore((s) => s.newScript)
  const openEditor = useAppStore((s) => s.openEditor)
  const openReader = useAppStore((s) => s.openReader)
  const duplicateScript = useAppStore((s) => s.duplicateScript)
  const deleteScript = useAppStore((s) => s.deleteScript)
  const archiveScript = useAppStore((s) => s.archiveScript)
  const unarchiveScript = useAppStore((s) => s.unarchiveScript)
  const refreshScripts = useAppStore((s) => s.refreshScripts)
  const importSeries = useAppStore((s) => s.importSeries)
  const toggleGroup = useAppStore((s) => s.toggleGroup)
  const setExpandedGroups = useAppStore((s) => s.setExpandedGroups)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'active' | 'archived'>('active')
  const [loadingSeries, setLoadingSeries] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeCount = useMemo(() => scripts.filter((s) => !s.archived).length, [scripts])
  const archivedCount = scripts.length - activeCount

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return scripts.filter((s) => {
      if (filter === 'active' ? s.archived : !s.archived) return false
      if (!q) return true
      return s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
    })
  }, [scripts, query, filter])

  // Partition the (already filming-order-sorted) list into collapsible collection groups.
  const { order, groups } = useMemo(() => {
    const groups = new Map<string, Script[]>()
    for (const s of visible) {
      const key = collectionFor(s.id) ?? UNGROUPED
      const arr = groups.get(key)
      if (arr) arr.push(s)
      else groups.set(key, [s])
    }
    const order: string[] = []
    if (groups.has(UNGROUPED)) order.push(UNGROUPED)
    for (const g of POF_COLLECTION_ORDER) if (groups.has(g)) order.push(g)
    for (const g of groups.keys()) if (!order.includes(g)) order.push(g)
    return { order, groups }
  }, [visible])

  const searching = query.trim() !== ''
  const allExpanded = order.length > 0 && order.every((g) => expandedGroups.includes(g))

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
          : `Loaded ${added} new script${added === 1 ? '' : 's'} (of ${total} in the series).`,
      )
    } finally {
      setLoadingSeries(false)
    }
  }

  function renderCard(s: Script) {
    const words = countWords(s.body)
    const secs = estimateReadTimeSeconds(s.body, speedWpm)
    const isArch = !!s.archived
    const menuOpen = menuId === s.id
    return (
      <div className="script-card" key={s.id}>
        <div className="script-card__top">
          <div style={{ minWidth: 0 }}>
            <div className="script-card__title">{s.title || 'Untitled script'}</div>
            <div className="script-card__meta">
              {words.toLocaleString()} words · ~{formatDuration(secs)} at {speedWpm} WPM ·{' '}
              {isArch && s.archivedAt
                ? `archived ${relativeTime(s.archivedAt)}`
                : relativeTime(s.updatedAt)}
            </div>
          </div>
          <button className="btn btn--primary" onClick={() => openReader(s.id)} type="button">
            <Icon name="play" size={18} /> Prompt
          </button>
        </div>
        <div className="script-card__actions">
          <button className="btn btn--ghost" onClick={() => openEditor(s.id)} type="button">
            <Icon name="edit" size={18} /> Edit
          </button>
          {isArch ? (
            <button
              className="btn btn--ghost"
              onClick={() => {
                void unarchiveScript(s.id)
                setMenuId(null)
              }}
              type="button"
            >
              <Icon name="restore" size={18} /> Restore
            </button>
          ) : (
            <button
              className="btn btn--ghost"
              onClick={() => {
                void archiveScript(s.id)
                setMenuId(null)
              }}
              type="button"
            >
              <Icon name="archive" size={18} /> Archive
            </button>
          )}
          <span className="spacer" />
          <button
            className="btn btn--icon btn--ghost"
            aria-label="More actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuId((m) => (m === s.id ? null : s.id))}
            type="button"
          >
            <Icon name="more" size={18} />
          </button>
        </div>
        {menuOpen && (
          <div className="card-menu">
            <button
              className="card-menu__item"
              onClick={() => {
                void duplicateScript(s.id)
                setMenuId(null)
              }}
              type="button"
            >
              <Icon name="copy" size={18} /> Duplicate
            </button>
            <button
              className="card-menu__item card-menu__item--danger"
              onClick={() => {
                if (confirm(`Delete “${s.title}”? This cannot be undone.`)) void deleteScript(s.id)
                setMenuId(null)
              }}
              type="button"
            >
              <Icon name="trash" size={18} /> Delete
            </button>
          </div>
        )}
      </div>
    )
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

      {scripts.length > 0 && (
        <div className="list-filters">
          <div className="seg" role="tablist" aria-label="Filter scripts">
            <button
              className={'seg__opt' + (filter === 'active' ? ' seg__opt--active' : '')}
              onClick={() => setFilter('active')}
              type="button"
            >
              To film ({activeCount})
            </button>
            <button
              className={'seg__opt' + (filter === 'archived' ? ' seg__opt--active' : '')}
              onClick={() => setFilter('archived')}
              type="button"
            >
              Done ({archivedCount})
            </button>
          </div>
          {order.length > 1 && !searching && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setExpandedGroups(allExpanded ? [] : order)}
              type="button"
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty">
          {scripts.length === 0 ? (
            <>
              <p>No scripts yet.</p>
              <button className="btn btn--primary" onClick={handleNew} type="button">
                Create your first script
              </button>
              <p className="empty__hint">
                …or tap <strong>Load series</strong> above to add all 180 episodes.
              </p>
            </>
          ) : searching ? (
            <p>No scripts match “{query}”.</p>
          ) : filter === 'archived' ? (
            <p>Nothing here yet. Scripts you tap “Archive” on land here — and you can restore them anytime.</p>
          ) : (
            <p>
              Everything’s archived. Tap{' '}
              <button className="linklike" onClick={() => setFilter('archived')} type="button">
                Done
              </button>{' '}
              to see finished scripts.
            </p>
          )}
        </div>
      ) : (
        <div className="script-groups">
          {order.map((name) => {
            const items = groups.get(name) ?? []
            // Series arcs collapse by default; your own scripts and a lone group stay open.
            const open =
              searching ||
              name === UNGROUPED ||
              order.length === 1 ||
              expandedGroups.includes(name)
            return (
              <section className="script-group" key={name}>
                <button
                  className="group-header"
                  onClick={() => toggleGroup(name)}
                  aria-expanded={open}
                  type="button"
                >
                  <Icon
                    name="chevron"
                    size={16}
                    style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
                  />
                  <span className="group-header__name">{name}</span>
                  <span className="group-header__count">{items.length}</span>
                </button>
                {open && <div className="script-list">{items.map(renderCard)}</div>}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
