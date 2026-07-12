import { useAppStore } from '../state/appStore'
import { Row, Toggle } from './ui'
import { db } from '../storage/db'

export function SettingsPanel() {
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)
  const hydrate = useAppStore((s) => s.hydrate)

  async function clearAll() {
    if (!confirm('Delete ALL scripts and presets from this device? This cannot be undone.')) return
    await db.scripts.clear()
    await db.presets.clear()
    localStorage.removeItem('teleprompter-state')
    await hydrate()
    location.reload()
  }

  return (
    <div>
      <div className="section-title">Reading behaviour</div>
      <Row label="Auto-hide controls" desc="Hide the control bar while scrolling; tap to reveal.">
        <Toggle
          checked={settings.autoHideControls}
          onChange={(v) => setSettings({ autoHideControls: v })}
          label="Auto-hide controls"
        />
      </Row>
      <Row label="Keep screen awake" desc="Prevent the display from sleeping while prompting.">
        <Toggle
          checked={settings.keepAwake}
          onChange={(v) => setSettings({ keepAwake: v })}
          label="Keep screen awake"
        />
      </Row>
      <Row
        label="Continue from last position"
        desc="Resume each script where you left off instead of the top."
      >
        <Toggle
          checked={settings.continueFromLastPosition}
          onChange={(v) => setSettings({ continueFromLastPosition: v })}
          label="Continue from last position"
        />
      </Row>

      <div className="section-title">Input</div>
      <Row
        label="Keyboard / remote shortcuts"
        desc="Space play/pause, arrows speed & seek, +/- font, M mirror, R reset, F full-screen."
      >
        <Toggle
          checked={settings.keyboardShortcutsEnabled}
          onChange={(v) => setSettings({ keyboardShortcutsEnabled: v })}
          label="Keyboard shortcuts"
        />
      </Row>
      <Row
        label="Touch gestures"
        desc="Double-tap play/pause, swipe to seek/speed, pinch to resize. Off by default to avoid accidents."
      >
        <Toggle
          checked={settings.gesturesEnabled}
          onChange={(v) => setSettings({ gesturesEnabled: v })}
          label="Touch gestures"
        />
      </Row>

      <div className="section-title">Data</div>
      <Row label="Storage" desc="Scripts and presets are stored locally on this device (IndexedDB).">
        <button className="btn btn--danger" onClick={clearAll} type="button">
          Clear all data
        </button>
      </Row>

      <p className="field__hint" style={{ marginTop: 24 }}>
        Teleprompter · works offline · add to Home Screen from the Share menu in Safari for a
        full-screen app.
      </p>
    </div>
  )
}
