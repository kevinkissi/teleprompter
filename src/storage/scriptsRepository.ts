import type { Script } from '../types'
import type { PofEpisode } from '../data/pof'
import { db } from './db'
import { makeId } from '../utils/id'
import { countWords, estimateReadTimeSeconds } from '../utils/estimateReadTime'
import { deriveTitle } from '../utils/textNormalize'

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
 * Bulk-import bundled series episodes by their stable ids. Idempotent and
 * non-destructive: an episode already in the library (matched by id) is skipped,
 * so re-running never overwrites your edits, notes, or scroll position. Returns
 * how many NEW scripts were added.
 *
 * updatedAt is derived from each episode's production-book `seq` (earlier seq =
 * newer timestamp) so the library lists them in filming order out of the box.
 */
export async function importSeedEpisodes(episodes: PofEpisode[]): Promise<number> {
  const existing = new Set((await db.scripts.toArray()).map((s) => s.id))
  // Fixed base so timestamps are deterministic across imports/devices; seq 1 sorts to the top.
  const base = Date.parse('2025-01-01T00:00:00.000Z')
  const toAdd: Script[] = []
  for (const ep of episodes) {
    if (existing.has(ep.id)) continue
    const ts = new Date(base - ep.seq * 60000).toISOString()
    toAdd.push({
      id: ep.id,
      title: ep.title,
      body: ep.body,
      createdAt: ts,
      updatedAt: ts,
      lastPositionPx: 0,
      estimatedReadTimeSeconds: estimateReadTimeSeconds(ep.body, 120),
    })
  }
  if (toAdd.length > 0) await db.scripts.bulkPut(toAdd)
  return toAdd.length
}

export function scriptStats(body: string, wpm: number) {
  const words = countWords(body)
  return {
    words,
    characters: body.length,
    estimatedReadTimeSeconds: estimateReadTimeSeconds(body, wpm),
  }
}
