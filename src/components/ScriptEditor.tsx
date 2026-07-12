import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../state/appStore'
import { Icon } from './Icon'
import { countWords, estimateReadTimeSeconds, formatDuration } from '../utils/estimateReadTime'
import { normalizeText } from '../utils/textNormalize'

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ScriptEditor({ scriptId }: { scriptId: string }) {
  const script = useAppStore((s) => s.scripts.find((x) => x.id === scriptId))
  const speedWpm = useAppStore((s) => s.config.scroll.speedWpm)
  const saveScriptBody = useAppStore((s) => s.saveScriptBody)
  const renameScript = useAppStore((s) => s.renameScript)
  const setScriptNotes = useAppStore((s) => s.setScriptNotes)
  const openEditor = useAppStore((s) => s.openEditor)
  const openReader = useAppStore((s) => s.openReader)

  const [title, setTitle] = useState(script?.title ?? '')
  const [body, setBody] = useState(script?.body ?? '')
  const [notes, setNotes] = useState(script?.notes ?? '')
  const [showNotes, setShowNotes] = useState(Boolean(script?.notes))
  const [saved, setSaved] = useState(true)
  const saveTimer = useRef<number | undefined>(undefined)

  // Re-seed local state when switching to a different script.
  useEffect(() => {
    setTitle(script?.title ?? '')
    setBody(script?.body ?? '')
    setNotes(script?.notes ?? '')
    setShowNotes(Boolean(script?.notes))
    setSaved(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId])

  const scheduleSave = (nextBody: string) => {
    setSaved(false)
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      void saveScriptBody(scriptId, nextBody).then(() => setSaved(true))
    }, 500)
  }

  const flushSave = () => {
    window.clearTimeout(saveTimer.current)
    void saveScriptBody(scriptId, body).then(() => setSaved(true))
  }

  useEffect(() => {
    return () => window.clearTimeout(saveTimer.current)
  }, [])

  if (!script) {
    return (
      <div className="editor">
        <p className="muted">Script not found.</p>
        <button className="btn" onClick={() => openEditor(null)} type="button">
          Back
        </button>
      </div>
    )
  }

  const words = countWords(body)
  const secs = estimateReadTimeSeconds(body, speedWpm)

  return (
    <div className="editor">
      <div className="editor__toolbar">
        <button
          className="btn btn--ghost"
          onClick={() => {
            flushSave()
            openEditor(null)
          }}
          type="button"
        >
          <Icon name="back" size={18} /> Scripts
        </button>
        <span className="spacer" />
        {saved ? <span className="saved-tag">Saved</span> : <span className="muted">Saving…</span>}
      </div>

      <input
        className="editor__title"
        value={title}
        placeholder="Script title"
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => renameScript(scriptId, title)}
      />

      <textarea
        className="editor__textarea"
        value={body}
        placeholder="Paste or type your script here…"
        onChange={(e) => {
          setBody(e.target.value)
          scheduleSave(e.target.value)
        }}
        spellCheck
      />

      <div className="editor__stats">
        <span>{words.toLocaleString()} words</span>
        <span>{body.length.toLocaleString()} characters</span>
        <span>~{formatDuration(secs)} at {speedWpm} WPM</span>
      </div>

      {showNotes ? (
        <textarea
          className="editor__textarea"
          style={{ minHeight: 100, flex: 'none' }}
          value={notes}
          placeholder="Presenter notes (not shown in the prompter)…"
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => setScriptNotes(scriptId, notes)}
        />
      ) : (
        <button className="btn btn--ghost" onClick={() => setShowNotes(true)} type="button">
          + Add notes
        </button>
      )}

      <div className="editor__toolbar">
        <button
          className="btn btn--primary"
          onClick={() => {
            flushSave()
            openReader(scriptId)
          }}
          type="button"
        >
          <Icon name="play" size={18} /> Prompt
        </button>
        <button
          className="btn"
          onClick={() => {
            const cleaned = normalizeText(body)
            setBody(cleaned)
            scheduleSave(cleaned)
          }}
          type="button"
        >
          Clean up
        </button>
        <button className="btn" onClick={() => download(`${title || 'script'}.txt`, body)} type="button">
          Export .txt
        </button>
        <button className="btn" onClick={() => download(`${title || 'script'}.md`, body)} type="button">
          Export .md
        </button>
        <button
          className="btn"
          onClick={() => void navigator.clipboard?.writeText(body)}
          type="button"
        >
          Copy
        </button>
        <button
          className="btn btn--danger"
          onClick={() => {
            if (confirm('Clear all text in this script?')) {
              setBody('')
              scheduleSave('')
            }
          }}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
