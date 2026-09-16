import type { Script } from '../types'
import type { PofEpisode } from '../data/pof'
import { db } from './db'
import { makeId } from '../utils/id'
import { countWords, estimateReadTimeSeconds } from '../utils/estimateReadTime'
import { deriveTitle } from '../utils/textNormalize'
import { planSeedSync, type SeedHistory, type SeedSyncResult } from './seedSync'

function nowIso(): string {
  return new Date().toISOString()
}

/** All scripts, most-recently-updated first. */
export async function listScripts(): Promise<Script[]> {
  const all = await db.scripts.toArray()
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0))
}

export async function getScript(id: string): Promise<Script | undefined> {
  return db.scripts.get(id)
}

export async function createScript(partial?: Partial<Script>): Promise<Script> {
  const ts = nowIso()
  const body = partial?.body ?? ''
  const script: Script = {
    id: makeId(),
    title: partial?.title ?? deriveTitle(body),
    body,
    notes: partial?.notes,
    createdAt: ts,
    updatedAt: ts,
    lastPositionPx: 0,
    estimatedReadTimeSeconds: estimateReadTimeSeconds(body, 120),
    presetId: partial?.presetId,
  }
  await db.scripts.put(script)
  return script
}

/** Patch a script and bump updatedAt. Returns the updated record. */
export async function updateScript(
  id: string,
  patch: Partial<Omit<Script, 'id' | 'createdAt'>>,
): Promise<Script | undefined> {
  // Write ONLY the patched fields (plus derived metadata). A full-object put from a
  // pre-await snapshot would silently revert any field another writer changed in the
  // meantime (e.g. a body autosave racing a title/notes save, or the reader's position).
  const changes: Partial<Script> = { ...patch, updatedAt: nowIso() }
  if (patch.body !== undefined) {
    changes.estimatedReadTimeSeconds = estimateReadTimeSeconds(patch.body, 120)
  }
  const updated = await db.scripts.update(id, changes)
  if (updated === 0) return undefined
  return db.scripts.get(id)
}

/**
 * Persist only the scroll position without bumping updatedAt (called frequently
 * from the scroll engine, so it must stay cheap and must not reorder the list).
 */
export async function saveScriptPosition(id: string, positionPx: number): Promise<void> {
  // Partial update patches only lastPositionPx — it won't bump updatedAt (so the
  // list order is stable) and won't clobber a concurrent body/title write.
  await db.scripts.update(id, { lastPositionPx: positionPx })
}

export async function deleteScript(id: string): Promise<void> {
  await db.scripts.delete(id)
}

/**
 * Archive / unarchive a script. Does NOT bump updatedAt, so restoring a script
 * returns it to its original place in the list; archivedAt orders the archive bucket.
 */
export async function setArchived(id: string, archived: boolean): Promise<Script | undefined> {
  await db.scripts.update(id, { archived, archivedAt: archived ? nowIso() : undefined })
  return db.scripts.get(id)
}

export async function duplicateScript(id: string): Promise<Script | undefined> {
  const existing = await db.scripts.get(id)
  if (!existing) return undefined
  const ts = nowIso()
  const copy: Script = {
    ...existing,
    id: makeId(),
    title: `${existing.title} (copy)`,
    createdAt: ts,
    updatedAt: ts,
    lastPositionPx: 0,
  }
  await db.scripts.put(copy)
  return copy
}

/**
 * Bring the library in line with the bundled series, keyed by each episode's
 * stable id. The decision of what may be touched lives in ./seedSync; this only
 * reads the library and writes the plan back.
 */
export async function syncSeedEpisodes(
  episodes: PofEpisode[],
  seedVersion: string,
  history: SeedHistory,
): Promise<SeedSyncResult> {
  const existing = new Map((await db.scripts.toArray()).map((s) => [s.id, s]))
  const { puts, result } = planSeedSync(episodes, existing, seedVersion, history)
  if (puts.length > 0) await db.scripts.bulkPut(puts)
  return result
}

export function scriptStats(body: string, wpm: number) {
  const words = countWords(body)
  return {
    words,
    characters: body.length,
    estimatedReadTimeSeconds: estimateReadTimeSeconds(body, wpm),
  }
}
