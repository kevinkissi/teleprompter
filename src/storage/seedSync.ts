import type { PofEpisode } from '../data/pof/types'
import type { Script } from '../types'
import { estimateReadTimeSeconds } from '../utils/estimateReadTime'

/**
 * Deciding what a new bundle may change in an existing library. Pure: no Dexie,
 * no clock, no randomness — given the same library and bundle it always plans
 * the same writes, which is what makes it checkable (scripts/verify-seed-sync.mjs).
 */

/** Small non-cryptographic fingerprint (FNV-1a), used only to notice changes. */
export function fingerprint(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Drop the episode number from a title or body so the same script compares equal
 * across a renumbering: the "EP 12 · " title prefix, the "[EP 12 · …]" opening
 * cue, and the spoken "…, episode twelve." in the first line.
 */
export function withoutNumbering(s: string): string {
  return s
    .replace(/^\[(?:EP\s*\d+|#\d+)\s*·\s*/, '[')
    .replace(/^(?:EP\s*\d+|#\d+)\s*·\s*/, '')
    .replace(/(The Point of Failure,\s*episode\s*)(?:\[N\]|[a-z]+(?:\s+[a-z]+){0,2})(?=\s*[.,])/gi, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Is this field still exactly what we last seeded — i.e. safe to replace?
 *
 * For a script seeded by a build that recorded a hash, that is an exact answer.
 * For one seeded before hashes existed there is no record, so ask instead
 * whether it is still any version this project has ever shipped (`shipped`), or
 * failing that the incoming script with only the numbering different. Anything
 * else is treated as the reader's own work and left alone.
 */
export function isUntouched(
  current: string,
  lastSeeded: string | undefined,
  incoming: string,
  shipped: string[] = [],
): boolean {
  if (lastSeeded !== undefined) return fingerprint(current) === lastSeeded
  if (shipped.includes(fingerprint(current))) return true
  return withoutNumbering(current) === withoutNumbering(incoming)
}

export interface SeedSyncResult {
  /** Episodes not previously in the library. */
  added: number
  /** Episodes whose numbering/title/text was refreshed in place. */
  updated: number
  /** Episodes left alone because the reader had edited them. */
  keptEdited: number
  total: number
}

/** Fingerprints of every title and body previously shipped, by episode id. */
export type SeedHistory = Record<string, { title: string[]; body: string[] }>

export interface SeedSyncPlan {
  /** The records to write. Everything not listed is left exactly as it was. */
  puts: Script[]
  result: SeedSyncResult
}

/**
 * Fixed base so seeded timestamps are deterministic across syncs and devices;
 * seq 1 (the first release) sorts to the top of the library.
 */
const SEED_EPOCH = Date.parse('2025-01-01T00:00:00.000Z')
export const seededAt = (seq: number): string => new Date(SEED_EPOCH - seq * 60000).toISOString()

/**
 * Plan the writes that bring `existing` in line with `episodes`.
 *
 * Non-destructive in the way that matters: an episode the reader has edited is
 * never overwritten, and notes, scroll position, archive state, preset and
 * createdAt are preserved on every episode. An episode still exactly as it was
 * seeded IS refreshed — the only way a corrected script or a new episode number
 * reaches a phone that already loaded the series.
 */
export function planSeedSync(
  episodes: PofEpisode[],
  existing: Map<string, Script>,
  seedVersion: string,
  history: SeedHistory = {},
): SeedSyncPlan {
  const puts: Script[] = []
  let added = 0
  let updated = 0
  let keptEdited = 0

  for (const ep of episodes) {
    const titleHash = fingerprint(ep.title)
    const bodyHash = fingerprint(ep.body)
    const current = existing.get(ep.id)

    if (!current) {
      const ts = seededAt(ep.seq)
      puts.push({
        id: ep.id,
        title: ep.title,
        body: ep.body,
        createdAt: ts,
        updatedAt: ts,
        lastPositionPx: 0,
        estimatedReadTimeSeconds: estimateReadTimeSeconds(ep.body, 120),
        seedVersion,
        seedTitleHash: titleHash,
        seedBodyHash: bodyHash,
      })
      added++
      continue
    }

    const shipped = history[ep.id]
    const titleFree = isUntouched(current.title, current.seedTitleHash, ep.title, shipped?.title)
    const bodyFree = isUntouched(current.body, current.seedBodyHash, ep.body, shipped?.body)
    const next: Script = { ...current, seedVersion }
    let changed = false

    if (titleFree) {
      if (current.title !== ep.title) {
        next.title = ep.title
        changed = true
      }
      next.seedTitleHash = titleHash
    }
    if (bodyFree) {
      if (current.body !== ep.body) {
        next.body = ep.body
        next.estimatedReadTimeSeconds = estimateReadTimeSeconds(ep.body, 120)
        changed = true
      }
      next.seedBodyHash = bodyHash
    }
    // Only re-file an episode the reader has left entirely alone; an edited one
    // keeps the place its own updatedAt gave it.
    if (titleFree && bodyFree) {
      const ts = seededAt(ep.seq)
      if (current.updatedAt !== ts) {
        next.updatedAt = ts
        changed = true
      }
    } else {
      keptEdited++
    }

    if (changed) updated++
    if (changed || current.seedVersion !== seedVersion) puts.push(next)
  }

  return { puts, result: { added, updated, keptEdited, total: episodes.length } }
}
