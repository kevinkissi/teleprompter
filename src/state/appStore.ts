import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppSettings,
  Colors,
  Preset,
  PrompterConfig,
  RotateDeg,
  Script,
  ScrollConfig,
  TransformState,
  Typography,
} from '../types'
import {
  DEFAULT_CONFIG,
  DEFAULT_PRESET_ID,
  DEFAULT_SETTINGS,
  FONT_MAX,
  FONT_MIN,
  WPM_MAX,
  WPM_MIN,
  clamp,
} from './defaults'
import { scrollController } from './scrollController'
import * as scriptsRepo from '../storage/scriptsRepository'
import * as presetsRepo from '../storage/presetsRepository'
import { nextRotation } from '../utils/transform'

type View = 'library' | 'reader'
type LibraryTab = 'scripts' | 'presets' | 'setup' | 'settings'

interface AppState {
  // --- persisted ---
  config: PrompterConfig
  settings: AppSettings
  currentScriptId: string | null
  activePresetId: string

  // --- runtime (not persisted) ---
  hydrated: boolean
  scripts: Script[]
  presets: Preset[]

  view: View
  libraryTab: LibraryTab
  editingScriptId: string | null
  controlsVisible: boolean

  playing: boolean
  countingDown: boolean
  pendingCountdownSeconds: number
  ended: boolean
  progress: number
  remainingSeconds: number

  // --- data lifecycle ---
  hydrate: () => Promise<void>
  refreshScripts: () => Promise<void>
  refreshPresets: () => Promise<void>

  // --- scripts ---
  newScript: () => Promise<string>
  saveScriptBody: (id: string, body: string) => Promise<void>
  renameScript: (id: string, title: string) => Promise<void>
  setScriptNotes: (id: string, notes: string) => Promise<void>
  duplicateScript: (id: string) => Promise<void>
  deleteScript: (id: string) => Promise<void>
  selectScript: (id: string) => Promise<void>
  persistPosition: (id: string, positionPx: number) => Promise<void>

  // --- live config ---
  setTransform: (patch: Partial<TransformState>) => void
  setTransformState: (t: TransformState) => void
  setTypography: (patch: Partial<Typography>) => void
  setScroll: (patch: Partial<ScrollConfig>) => void
  setColors: (patch: Partial<Colors>) => void
  adjustFont: (delta: number) => void
  adjustSpeed: (delta: number) => void
  toggleMirrorX: () => void
  toggleMirrorY: () => void
  rotate: (dir: 1 | -1) => void

  // --- presets ---
  saveAsPreset: (name: string) => Promise<void>
  overwriteActivePreset: () => Promise<void>
  loadPreset: (id: string) => Promise<void>
  renamePreset: (id: string, name: string) => Promise<void>
  deletePreset: (id: string) => Promise<void>
  duplicatePreset: (id: string) => Promise<void>
  makeDefaultPreset: (id: string) => Promise<void>

  // --- settings ---
  setSettings: (patch: Partial<AppSettings>) => void

  // --- view ---
  openReader: (scriptId?: string) => void
  closeReader: () => void
  setLibraryTab: (tab: LibraryTab) => void
  openEditor: (scriptId: string | null) => void
  showControls: () => void
  hideControls: () => void
  toggleControls: () => void

  // --- reader runtime ---
  setPlaying: (playing: boolean) => void
  requestStart: () => void
  togglePlay: () => void
  finishCountdown: () => void
  cancelCountdown: () => void
  setEnded: (ended: boolean) => void
  setProgress: (progress: number, remainingSeconds: number) => void
}

function upsertScriptLocal(scripts: Script[], script: Script): Script[] {
  const rest = scripts.filter((s) => s.id !== script.id)
  return [script, ...rest].sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0,
  )
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      settings: DEFAULT_SETTINGS,
      currentScriptId: null,
      activePresetId: DEFAULT_PRESET_ID,

      hydrated: false,
      scripts: [],
      presets: [],

      view: 'library',
      libraryTab: 'scripts',
      editingScriptId: null,
      controlsVisible: true,

      playing: false,
      countingDown: false,
      pendingCountdownSeconds: 0,
      ended: false,
      progress: 0,
      remainingSeconds: 0,

      async hydrate() {
        await presetsRepo.ensureDefaultPreset()
        const [scripts, presets] = await Promise.all([
          scriptsRepo.listScripts(),
          presetsRepo.listPresets(),
        ])
        // If the previously-active preset was deleted, fall back to default.
        const activePresetId = presets.some((p) => p.id === get().activePresetId)
          ? get().activePresetId
          : DEFAULT_PRESET_ID
        // Drop a dangling current script reference.
        const currentScriptId = scripts.some((s) => s.id === get().currentScriptId)
          ? get().currentScriptId
          : null
        set({ scripts, presets, activePresetId, currentScriptId, hydrated: true })
      },

      async refreshScripts() {
        set({ scripts: await scriptsRepo.listScripts() })
      },
      async refreshPresets() {
        set({ presets: await presetsRepo.listPresets() })
      },

      async newScript() {
        const script = await scriptsRepo.createScript()
        set((s) => ({
          scripts: upsertScriptLocal(s.scripts, script),
          editingScriptId: script.id,
          currentScriptId: script.id,
        }))
        return script.id
      },

      async saveScriptBody(id, body) {
        const updated = await scriptsRepo.updateScript(id, { body })
        if (updated) set((s) => ({ scripts: upsertScriptLocal(s.scripts, updated) }))
      },

      async renameScript(id, title) {
        const updated = await scriptsRepo.updateScript(id, { title: title.trim() || 'Untitled script' })
        if (updated) set((s) => ({ scripts: upsertScriptLocal(s.scripts, updated) }))
      },

      async setScriptNotes(id, notes) {
        const updated = await scriptsRepo.updateScript(id, { notes })
        if (updated) set((s) => ({ scripts: upsertScriptLocal(s.scripts, updated) }))
      },

      async duplicateScript(id) {
        const copy = await scriptsRepo.duplicateScript(id)
        if (copy) set((s) => ({ scripts: upsertScriptLocal(s.scripts, copy) }))
      },

      async deleteScript(id) {
        await scriptsRepo.deleteScript(id)
        set((s) => ({
          scripts: s.scripts.filter((x) => x.id !== id),
          currentScriptId: s.currentScriptId === id ? null : s.currentScriptId,
          editingScriptId: s.editingScriptId === id ? null : s.editingScriptId,
        }))
      },

      async selectScript(id) {
        const script = get().scripts.find((s) => s.id === id)
        set({ currentScriptId: id })
        if (script?.presetId && get().presets.some((p) => p.id === script.presetId)) {
          await get().loadPreset(script.presetId)
        }
      },

      async persistPosition(id, positionPx) {
        await scriptsRepo.saveScriptPosition(id, positionPx)
        set((s) => ({
          scripts: s.scripts.map((x) => (x.id === id ? { ...x, lastPositionPx: positionPx } : x)),
        }))
      },

      setTransform(patch) {
        set((s) => ({ config: { ...s.config, transform: { ...s.config.transform, ...patch } } }))
        scrollController.current.recompute()
      },
      setTransformState(t) {
        set((s) => ({ config: { ...s.config, transform: { ...t } } }))
        scrollController.current.recompute()
      },
      setTypography(patch) {
        set((s) => ({ config: { ...s.config, typography: { ...s.config.typography, ...patch } } }))
        scrollController.current.recompute()
      },
      setScroll(patch) {
        set((s) => ({ config: { ...s.config, scroll: { ...s.config.scroll, ...patch } } }))
        // Pre-roll changes layout bounds; speed changes the remaining-time estimate.
        if (patch.preRollVh !== undefined) scrollController.current.recompute()
        else if (patch.speedWpm !== undefined) scrollController.current.refreshProgress()
      },
      setColors(patch) {
        set((s) => ({ config: { ...s.config, colors: { ...s.config.colors, ...patch } } }))
      },
      adjustFont(delta) {
        set((s) => ({
          config: {
            ...s.config,
            typography: {
              ...s.config.typography,
              fontSizePx: clamp(s.config.typography.fontSizePx + delta, FONT_MIN, FONT_MAX),
            },
          },
        }))
        scrollController.current.recompute()
      },
      adjustSpeed(delta) {
        set((s) => ({
          config: {
            ...s.config,
            scroll: {
              ...s.config.scroll,
              speedWpm: clamp(s.config.scroll.speedWpm + delta, WPM_MIN, WPM_MAX),
            },
          },
        }))
        scrollController.current.refreshProgress()
      },
      toggleMirrorX() {
        get().setTransform({ mirrorX: !get().config.transform.mirrorX })
      },
      toggleMirrorY() {
        get().setTransform({ mirrorY: !get().config.transform.mirrorY })
      },
      rotate(dir) {
        const current: RotateDeg = get().config.transform.rotateDeg
        get().setTransform({ rotateDeg: nextRotation(current, dir) })
      },

      async saveAsPreset(name) {
        const preset = await presetsRepo.createPreset(name, get().config)
        set({ activePresetId: preset.id })
        await get().refreshPresets()
      },
      async overwriteActivePreset() {
        const id = get().activePresetId
        await presetsRepo.updatePreset(id, presetsRepo.structuredCloneConfig(get().config))
        await get().refreshPresets()
      },
      async loadPreset(id) {
        const preset = get().presets.find((p) => p.id === id) ?? (await presetsRepo.getPreset(id))
        if (!preset) return
        set({ config: presetsRepo.presetToConfig(preset), activePresetId: id })
        scrollController.current.recompute()
      },
      async renamePreset(id, name) {
        await presetsRepo.updatePreset(id, { name: name.trim() || 'Preset' })
        await get().refreshPresets()
      },
      async deletePreset(id) {
        await presetsRepo.deletePreset(id)
        if (get().activePresetId === id) set({ activePresetId: DEFAULT_PRESET_ID })
        await get().refreshPresets()
      },
      async duplicatePreset(id) {
        await presetsRepo.duplicatePreset(id)
        await get().refreshPresets()
      },
      async makeDefaultPreset(id) {
        await presetsRepo.setDefaultPreset(id)
        set((s) => ({ settings: { ...s.settings, defaultPresetId: id } }))
        await get().refreshPresets()
      },

      setSettings(patch) {
        set((s) => ({ settings: { ...s.settings, ...patch } }))
      },

      openReader(scriptId) {
        const id = scriptId ?? get().currentScriptId ?? get().scripts[0]?.id ?? null
        if (id) get().selectScript(id)
        set({
          view: 'reader',
          currentScriptId: id,
          controlsVisible: true,
          ended: false,
          progress: 0,
          playing: false,
          countingDown: false,
        })
      },
      closeReader() {
        scrollController.current.pause()
        set({ view: 'library', playing: false, countingDown: false })
      },
      setLibraryTab(tab) {
        set({ libraryTab: tab })
      },
      openEditor(scriptId) {
        set({ editingScriptId: scriptId })
      },
      showControls() {
        set({ controlsVisible: true })
      },
      hideControls() {
        if (!get().settings.autoHideControls) return
        set({ controlsVisible: false })
      },
      toggleControls() {
        set((s) => ({ controlsVisible: !s.controlsVisible }))
      },

      setPlaying(playing) {
        set({ playing })
      },
      requestStart() {
        const { config, ended } = get()
        if (ended) {
          scrollController.current.jumpTop()
          set({ ended: false })
        }
        const cd = config.scroll.countdownSeconds
        if (cd > 0) {
          set({ countingDown: true, pendingCountdownSeconds: cd, controlsVisible: false })
        } else {
          scrollController.current.play()
        }
      },
      togglePlay() {
        const { playing, countingDown } = get()
        if (countingDown) {
          get().cancelCountdown()
        } else if (playing) {
          scrollController.current.pause()
        } else {
          get().requestStart()
        }
      },
      finishCountdown() {
        set({ countingDown: false })
        scrollController.current.play()
      },
      cancelCountdown() {
        set({ countingDown: false })
      },
      setEnded(ended) {
        set({ ended })
      },
      setProgress(progress, remainingSeconds) {
        set({ progress, remainingSeconds })
      },
    }),
    {
      name: 'teleprompter-state',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        config: s.config,
        settings: s.settings,
        currentScriptId: s.currentScriptId,
        activePresetId: s.activePresetId,
      }),
    },
  ),
)
