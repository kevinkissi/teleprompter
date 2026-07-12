import { useState } from 'react'
import { useAppStore } from '../state/appStore'
import { findTransformMode } from '../utils/transform'
import { DEFAULT_PRESET_ID } from '../state/defaults'

export function PresetManager() {
  const presets = useAppStore((s) => s.presets)
  const activePresetId = useAppStore((s) => s.activePresetId)
  const config = useAppStore((s) => s.config)
  const saveAsPreset = useAppStore((s) => s.saveAsPreset)
  const overwriteActivePreset = useAppStore((s) => s.overwriteActivePreset)
  const loadPreset = useAppStore((s) => s.loadPreset)
  const renamePreset = useAppStore((s) => s.renamePreset)
  const deletePreset = useAppStore((s) => s.deletePreset)
  const duplicatePreset = useAppStore((s) => s.duplicatePreset)
  const makeDefaultPreset = useAppStore((s) => s.makeDefaultPreset)

  const [newName, setNewName] = useState('')
  const activeMode = findTransformMode(config.transform)

  return (
    <div>
      <div className="preset-card">
        <div className="row__label">Current settings</div>
        <div className="script-card__meta">
          {config.scroll.speedWpm} WPM · {config.typography.fontSizePx}px ·{' '}
          {activeMode?.label ?? 'Custom transform'} · line {config.typography.lineHeight.toFixed(2)}
        </div>
        <div className="wrap" style={{ marginTop: 12 }}>
          <input
            className="search"
            style={{ flex: 1, minWidth: 160 }}
            placeholder="New preset name…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="btn btn--primary"
            disabled={!newName.trim()}
            onClick={async () => {
              await saveAsPreset(newName.trim())
              setNewName('')
            }}
            type="button"
          >
            Save as preset
          </button>
          <button className="btn" onClick={() => overwriteActivePreset()} type="button">
            Update active
          </button>
        </div>
      </div>

      <div className="section-title">Presets</div>
      {presets.map((p) => {
        const isActive = p.id === activePresetId
        const isBuiltin = p.id === DEFAULT_PRESET_ID
        const mode = findTransformMode(p.transform)
        return (
          <div className={'preset-card' + (isActive ? ' preset-card--active' : '')} key={p.id}>
            <div className="script-card__top">
              <div style={{ minWidth: 0 }}>
                <div className="row__label">
                  {p.name}{' '}
                  {p.isDefault && <span className="badge badge--accent">Default</span>}{' '}
                  {isActive && <span className="badge">Active</span>}
                </div>
                <div className="script-card__meta">
                  {p.scroll.speedWpm} WPM · {p.typography.fontSizePx}px · {mode?.label ?? 'Custom'}
                </div>
              </div>
              <button className="btn btn--primary" onClick={() => loadPreset(p.id)} type="button">
                Load
              </button>
            </div>
            <div className="script-card__actions">
              <button
                className="btn btn--ghost"
                onClick={() => makeDefaultPreset(p.id)}
                disabled={p.isDefault}
                type="button"
              >
                Make default
              </button>
              <button
                className="btn btn--ghost"
                disabled={isBuiltin}
                onClick={() => {
                  const name = prompt('Rename preset', p.name)
                  if (name !== null) renamePreset(p.id, name)
                }}
                type="button"
              >
                Rename
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => duplicatePreset(p.id)}
                type="button"
              >
                Duplicate
              </button>
              <span className="spacer" />
              <button
                className="btn btn--danger"
                disabled={isBuiltin}
                onClick={() => {
                  if (confirm(`Delete preset “${p.name}”?`)) deletePreset(p.id)
                }}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
