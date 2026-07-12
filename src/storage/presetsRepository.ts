import type { Preset, PrompterConfig } from '../types'
import { db } from './db'
import { makeId } from '../utils/id'
import { DEFAULT_CONFIG, DEFAULT_PRESET_ID } from '../state/defaults'

function nowIso(): string {
  return new Date().toISOString()
}

/** All presets; the built-in default is always kept first. */
export async function listPresets(): Promise<Preset[]> {
  const all = await db.presets.toArray()
  return all.sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export async function getPreset(id: string): Promise<Preset | undefined> {
  return db.presets.get(id)
}

/** Ensure the built-in default preset exists (seeded on first run). */
export async function ensureDefaultPreset(): Promise<Preset> {
  const existing = await db.presets.get(DEFAULT_PRESET_ID)
  if (existing) return existing
  const ts = nowIso()
  const preset: Preset = {
    id: DEFAULT_PRESET_ID,
    name: 'Default',
    isDefault: true,
    createdAt: ts,
    updatedAt: ts,
    ...structuredCloneConfig(DEFAULT_CONFIG),
  }
  await db.presets.put(preset)
  return preset
}

export async function createPreset(name: string, config: PrompterConfig): Promise<Preset> {
  const ts = nowIso()
  const preset: Preset = {
    id: makeId(),
    name: name.trim() || 'Preset',
    isDefault: false,
    createdAt: ts,
    updatedAt: ts,
    ...structuredCloneConfig(config),
  }
  await db.presets.put(preset)
  return preset
}

export async function updatePreset(
  id: string,
  patch: Partial<Omit<Preset, 'id' | 'createdAt'>>,
): Promise<Preset | undefined> {
  const existing = await db.presets.get(id)
  if (!existing) return undefined
  const next: Preset = { ...existing, ...patch, id, updatedAt: nowIso() }
  await db.presets.put(next)
  return next
}

export async function deletePreset(id: string): Promise<void> {
  if (id === DEFAULT_PRESET_ID) return // never delete the built-in default
  await db.presets.delete(id)
}

export async function duplicatePreset(id: string): Promise<Preset | undefined> {
  const existing = await db.presets.get(id)
  if (!existing) return undefined
  const ts = nowIso()
  const copy: Preset = {
    ...existing,
    id: makeId(),
    name: `${existing.name} (copy)`,
    isDefault: false,
    createdAt: ts,
    updatedAt: ts,
  }
  await db.presets.put(copy)
  return copy
}

/** Mark one preset as default and clear the flag on all others. */
export async function setDefaultPreset(id: string): Promise<void> {
  const all = await db.presets.toArray()
  await Promise.all(
    all.map((p) => db.presets.put({ ...p, isDefault: p.id === id, updatedAt: nowIso() })),
  )
}

/** Extract just the config portion of a preset. */
export function presetToConfig(preset: Preset): PrompterConfig {
  return structuredCloneConfig({
    transform: preset.transform,
    typography: preset.typography,
    scroll: preset.scroll,
    colors: preset.colors,
  })
}

/** Deep-ish clone so stored/loaded configs never share references with live state. */
export function structuredCloneConfig(config: PrompterConfig): PrompterConfig {
  return {
    transform: { ...config.transform },
    typography: { ...config.typography },
    scroll: { ...config.scroll },
    colors: { ...config.colors },
  }
}
