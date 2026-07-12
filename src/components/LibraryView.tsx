import { useAppStore } from '../state/appStore'
import { ScriptList } from './ScriptList'
import { ScriptEditor } from './ScriptEditor'
import { SettingsPanel } from './SettingsPanel'
import { PresetManager } from './PresetManager'
import { CalibrationView } from './CalibrationView'

const TABS: { id: 'scripts' | 'setup' | 'presets' | 'settings'; label: string }[] = [
  { id: 'scripts', label: 'Scripts' },
  { id: 'setup', label: 'Setup' },
  { id: 'presets', label: 'Presets' },
  { id: 'settings', label: 'Settings' },
]

export function LibraryView() {
  const libraryTab = useAppStore((s) => s.libraryTab)
  const setLibraryTab = useAppStore((s) => s.setLibraryTab)
  const editingScriptId = useAppStore((s) => s.editingScriptId)

  return (
    <div className="library">
      <div className="library__header">
        <div className="library__title">
          <span className="dot" />
          <h1 style={{ fontSize: 20 }}>Teleprompter</h1>
        </div>
      </div>

      {!editingScriptId && (
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={'tab' + (libraryTab === t.id ? ' tab--active' : '')}
              onClick={() => setLibraryTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="library__content">
        {editingScriptId ? (
          <ScriptEditor scriptId={editingScriptId} />
        ) : libraryTab === 'scripts' ? (
          <ScriptList />
        ) : libraryTab === 'setup' ? (
          <CalibrationView />
        ) : libraryTab === 'presets' ? (
          <PresetManager />
        ) : (
          <SettingsPanel />
        )}
      </div>
    </div>
  )
}
