import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppSettings,
  Colors,
  LensWindow,
  PlaybackMode,
  Preset,
  PrompterConfig,
  RotateDeg,
  Script,
  ScrollConfig,
  SlideAdvance,
  SlideConfig,
  TransformState,
  Typography,
} from '../types'
import {
  DEFAULT_CONFIG,
  DEFAULT_PRESET_ID,
  DEFAULT_SETTINGS,
  FONT_MAX,
  FONT_MIN,
  SLIDE_GAP_MAX,
  SLIDE_GAP_MIN,
  SLIDE_MIN_SECONDS,
  SLIDE_READ_IN_BASE,
  SLIDE_READ_IN_MAX,
  SLIDE_READ_IN_PER_WORD,
  SLIDE_WPM_MAX,
  SLIDE_WPM_MIN,
  WPM_MAX,
  WPM_MIN,
  clamp,
} from './defaults'
import { scrollController } from './scrollController'
import * as scriptsRepo from '../storage/scriptsRepository'
import { getMeta, setMeta } from '../storage/db'
import type { SeedSyncResult } from '../storage/seedSync'
import * as presetsRepo from '../storage/presetsRepository'
import { nextRotation } from '../utils/transform'
import { slideIndexForOffset, type Slide } from '../utils/slides'
import { POF_EPISODES, POF_SEED_HISTORY, POF_SEED_VERSION } from '../data/pof'

/** meta key holding the bundled-episode version this library was last synced to. */
const SEED_VERSION_KEY = 'pofSeedVersion'

type View = 'library' | 'reader' | 'remote'
type LibraryTab = 'scripts' | 'presets' | 'setup' | 'settings' | 'remote'

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
  /** Names of expanded collection groups in the script list (default: all collapsed). */
  expandedGroups: string[]
  editingScriptId: string | null
  controlsVisible: boolean

  playing: boolean
  countingDown: boolean
  pendingCountdownSeconds: number
  ended: boolean
  progress: number
  remainingSeconds: number

  // --- Slide Mode runtime ---
  /** The slide version of the current script. Derived from the SAME body the
   *  continuous reader scrolls; segmentation never rewrites a word. */
  slides: Slide[]
  slideFontPx: number
  wholeSentencePct: number
  /** Reading position as a character offset into the body. The slide index is
   *  derived from it, so changing the lens size mid-take re-segments without
   *  ever losing your place. */
  anchorOffset: number
  slideIndex: number
  /** Seconds left on this slide as of the last edge — not a running countdown.
   *  See `slideRemainingSeconds` in remote/protocol.ts for why. */
  slideRemainingSeconds: number
  /** The teleprompter is frozen. Says nothing about camera or microphone: the
   *  phone has no capture of its own, and on the Mac they are separate systems. */
  prompterPaused: boolean
  /** Studio OS reports a take is rolling. Drives the reader's indicator and
   *  nothing else — the phone records nothing. */
  recording: boolean
  /** The prompter was running when the mode changed, so the engine that mounts
   *  next should pick it up. Switching presentation mid-take must not leave the
   *  reader stopped while the camera is still rolling. */
  pendingResume: boolean
  /** Per-slide display-time overrides, keyed `scriptId:bodyOffset` so an
   *  override follows the words rather than a slide number that moves. */
  slideSecondsOverrides: Record<string, number>

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
  archiveScript: (id: string) => Promise<void>
  unarchiveScript: (id: string) => Promise<void>
  importSeries: () => Promise<SeedSyncResult>
  syncSeriesIfStale: (scripts: Script[]) => Promise<void>
  selectScript: (id: string) => Promise<void>
  persistPosition: (id: string, positionPx: number) => Promise<void>

  // --- live config ---
  setTransform: (patch: Partial<TransformState>) => void
  setTransformState: (t: TransformState) => void
  setTypography: (patch: Partial<Typography>) => void
  setScroll: (patch: Partial<ScrollConfig>) => void
  setColors: (patch: Partial<Colors>) => void
  setLens: (patch: Partial<LensWindow>) => void
  toggleLens: () => void
  setSlideConfig: (patch: Partial<SlideConfig>) => void
  setPlaybackMode: (mode: PlaybackMode) => void
  setSlideAdvance: (advance: SlideAdvance) => void
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
  openRemote: () => void
  closeRemote: () => void
  setLibraryTab: (tab: LibraryTab) => void
  toggleGroup: (name: string) => void
  setExpandedGroups: (names: string[]) => void
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

  // --- Slide Mode ---
  setSlides: (slides: Slide[], fontPx: number, wholeSentencePct: number) => void
  gotoSlide: (index: number) => void
  stepSlide: (delta: number) => void
  setSlideSeconds: (index: number, seconds: number | null) => void
  /** Display time for a slide: its own override, or read-in + speaking + pause. */
  slideSecondsFor: (index: number) => number
  setSlideRemaining: (seconds: number) => void
  setPrompterPaused: (paused: boolean) => void
  setRecording: (recording: boolean) => void
  setPendingResume: (pending: boolean) => void
}

/** Key for a per-slide time override. Anchored to the words, not the number. */
function overrideKey(scriptId: string | null, offset: number): string {
  return `${scriptId ?? ''}:${offset}`
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
      expandedGroups: [],
      editingScriptId: null,
      controlsVisible: true,

      playing: false,
      countingDown: false,
      pendingCountdownSeconds: 0,
      ended: false,
      progress: 0,
      remainingSeconds: 0,

      slides: [],
      slideFontPx: 0,
      wholeSentencePct: 100,
      anchorOffset: 0,
      slideIndex: 0,
      slideRemainingSeconds: 0,
      prompterPaused: false,
      recording: false,
      pendingResume: false,
      slideSecondsOverrides: {},

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
        await get().syncSeriesIfStale(scripts)
      },

      /**
       * Bring an already-loaded series up to date with this build. Runs once per
       * bundle version, only for a library that actually holds series scripts —
       * a reader who has never tapped "Load series" is left with an empty
       * library, exactly as before. Edited scripts are never overwritten.
       */
      async syncSeriesIfStale(scripts) {
        try {
          const seeded = POF_EPISODES.some((ep) => scripts.some((s) => s.id === ep.id))
          if (!seeded) return
          if ((await getMeta(SEED_VERSION_KEY)) === POF_SEED_VERSION) return
          const result = await scriptsRepo.syncSeedEpisodes(POF_EPISODES, POF_SEED_VERSION, POF_SEED_HISTORY)
          await setMeta(SEED_VERSION_KEY, POF_SEED_VERSION)
          if (result.added > 0 || result.updated > 0) await get().refreshScripts()
        } catch (err) {
          // Never let a failed re-sync take the app down with it — the library
          // still works, just on the previous numbering. "Load series" retries.
          console.error('Episode re-sync failed; tap "Load series" to retry.', err)
        }
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

      async archiveScript(id) {
        const updated = await scriptsRepo.setArchived(id, true)
        if (updated) set((s) => ({ scripts: upsertScriptLocal(s.scripts, updated) }))
      },

      async unarchiveScript(id) {
        const updated = await scriptsRepo.setArchived(id, false)
        if (updated) set((s) => ({ scripts: upsertScriptLocal(s.scripts, updated) }))
      },

      async importSeries() {
        const result = await scriptsRepo.syncSeedEpisodes(POF_EPISODES, POF_SEED_VERSION, POF_SEED_HISTORY)
        await setMeta(SEED_VERSION_KEY, POF_SEED_VERSION)
        if (result.added > 0 || result.updated > 0) await get().refreshScripts()
        return result
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
      setLens(patch) {
        set((s) => ({ config: { ...s.config, lens: { ...s.config.lens, ...patch } } }))
        // Toggling / resizing the window changes the reading bounds.
        scrollController.current.recompute()
      },
      toggleLens() {
        get().setLens({ enabled: !get().config.lens.enabled })
      },
      setSlideConfig(patch) {
        set((s) => ({ config: { ...s.config, slide: { ...s.config.slide, ...patch } } }))
        // Anything here can change how much text a slide holds, so the reader
        // re-segments; the anchor keeps the reading position across it.
        scrollController.current.recompute()
      },
      setPlaybackMode(mode) {
        if (get().config.slide.mode === mode) return
        // Switching presentation must never disturb a running take. It only
        // touches prompter state — and if the prompter WAS running, the engine
        // that mounts next picks it straight back up rather than leaving the
        // reader stopped with the camera still rolling. A count-in counts as
        // running: cancelling it silently would be the worst of both.
        const live = get().playing || get().countingDown
        if (live) scrollController.current.pause()
        set({ pendingResume: live })
        get().setSlideConfig({ mode })
      },
      setSlideAdvance(advance) {
        get().setSlideConfig({ advance })
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
          // Slide Mode always opens on the first slide: a take starts at the
          // top, and "continue from last position" is a scrolling idea.
          slides: [],
          anchorOffset: 0,
          slideIndex: 0,
          slideRemainingSeconds: 0,
          prompterPaused: false,
        })
      },
      closeReader() {
        scrollController.current.pause()
        // Don't trust the engine to have cleared these — the reader can close
        // while no playback controller is installed at all.
        set({ view: 'library', playing: false, countingDown: false, prompterPaused: false })
      },
      openRemote() {
        set({ view: 'remote' })
      },
      closeRemote() {
        set({ view: 'library' })
      },
      setLibraryTab(tab) {
        set({ libraryTab: tab })
      },
      toggleGroup(name) {
        set((s) => ({
          expandedGroups: s.expandedGroups.includes(name)
            ? s.expandedGroups.filter((n) => n !== name)
            : [...s.expandedGroups, name],
        }))
      },
      setExpandedGroups(names) {
        set({ expandedGroups: names })
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

      setSlides(slides, fontPx, wholeSentencePct) {
        // Re-derive the index from the character anchor rather than keeping the
        // old number: the words you were about to say stay on screen even when
        // the slide count changes underneath you.
        const index = slideIndexForOffset(slides, get().anchorOffset)
        set({ slides, slideFontPx: fontPx, wholeSentencePct, slideIndex: index })
      },

      gotoSlide(index) {
        const { slides } = get()
        if (slides.length === 0) return
        const i = clamp(Math.round(index), 0, slides.length - 1)
        set({
          slideIndex: i,
          anchorOffset: slides[i].start,
          ended: i >= slides.length - 1 && get().ended,
          slideRemainingSeconds: get().slideSecondsFor(i),
        })
      },

      stepSlide(delta) {
        const { slides, slideIndex } = get()
        if (slides.length === 0) return
        const next = slideIndex + Math.round(delta)
        if (next >= slides.length) {
          // Off the end: stop at the last slide and flag the script as finished,
          // exactly as the scrolling reader does at the bottom. Only stop the
          // engine when something was actually running — in manual advancement
          // nothing is, and calling pause there would report the prompter as
          // held when the reader simply reached the last slide.
          set({ ended: true })
          if (get().config.slide.advance === 'auto') scrollController.current.pause()
          return
        }
        get().gotoSlide(next)
      },

      setSlideSeconds(index, seconds) {
        const { slides, currentScriptId } = get()
        const slide = slides[index]
        if (!slide) return
        const key = overrideKey(currentScriptId, slide.start)
        set((s) => {
          const next = { ...s.slideSecondsOverrides }
          if (seconds === null || !Number.isFinite(seconds)) delete next[key]
          else next[key] = clamp(seconds, 0.2, 120)
          return { slideSecondsOverrides: next }
        })
        if (index === get().slideIndex) set({ slideRemainingSeconds: get().slideSecondsFor(index) })
      },

      slideSecondsFor(index) {
        const { slides, config, currentScriptId, slideSecondsOverrides } = get()
        const slide = slides[index]
        if (!slide) return 0
        const override = slideSecondsOverrides[overrideKey(currentScriptId, slide.start)]
        if (override !== undefined) return override
        const wpm = clamp(config.slide.wpm, SLIDE_WPM_MIN, SLIDE_WPM_MAX)
        const speak = wpm > 0 ? (slide.words / wpm) * 60 : 0
        // A slide gives you no peripheral preview of what is coming, so it has
        // to pay for the glance that continuous scrolling gives you for free.
        const readIn = Math.min(
          SLIDE_READ_IN_MAX,
          SLIDE_READ_IN_BASE + SLIDE_READ_IN_PER_WORD * slide.words,
        )
        const gap = clamp(config.slide.gapSeconds, SLIDE_GAP_MIN, SLIDE_GAP_MAX)
        return Math.max(SLIDE_MIN_SECONDS, readIn + speak + gap)
      },

      setSlideRemaining(seconds) {
        set({ slideRemainingSeconds: Math.max(0, seconds) })
      },

      setPrompterPaused(paused) {
        set({ prompterPaused: paused })
      },

      setRecording(recording) {
        set({ recording })
      },

      setPendingResume(pending) {
        set({ pendingResume: pending })
      },
    }),
    {
      name: 'teleprompter-state',
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (persisted, version) => {
        const s = persisted as { config?: Partial<PrompterConfig> } | undefined
        // v2 added config.lens — backfill it for state persisted before the feature.
        if (s?.config && !s.config.lens && version < 2) {
          s.config.lens = { ...DEFAULT_CONFIG.lens }
        }
        // v3 made the lens window the default. `enabled: false` persisted before
        // then is the OLD default, not a decision: the switch that could have
        // turned it on did not respond to touch, so nobody ever chose either way.
        if (s?.config?.lens && version < 3) {
          s.config.lens.enabled = true
        }
        // v4 added Slide Mode. State persisted before it has no `slide` block;
        // backfilling the default keeps such a device on Continuous, which is
        // what it was already doing.
        if (s?.config && !s.config.slide && version < 4) {
          s.config.slide = { ...DEFAULT_CONFIG.slide }
        }
        return s as unknown as AppState
      },
      partialize: (s) => ({
        config: s.config,
        settings: s.settings,
        currentScriptId: s.currentScriptId,
        activePresetId: s.activePresetId,
        // Keep the most recent hand-set slide times. Capped so a library of 180
        // episodes can't grow this without bound.
        slideSecondsOverrides: Object.fromEntries(
          Object.entries(s.slideSecondsOverrides).slice(-200),
        ),
      }),
    },
  ),
)
