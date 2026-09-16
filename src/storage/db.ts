import Dexie, { type Table } from 'dexie'
import type { Preset, Script } from '../types'

/** A small key/value row — app-level bookkeeping that is not a script or a preset. */
export interface MetaRow {
  key: string
  value: string
}

/** IndexedDB store for scripts and presets (bodies can be large; use IndexedDB). */
export class PrompterDB extends Dexie {
  scripts!: Table<Script, string>
  presets!: Table<Preset, string>
  meta!: Table<MetaRow, string>

  constructor() {
    super('teleprompter')
    this.version(1).stores({
      // Only indexed fields are listed; the full object is still stored.
      scripts: 'id, updatedAt, title',
      presets: 'id, name',
    })
    // v2 adds `meta`, which holds the version of the bundled episode set this
    // library was last synced to. Purely additive: Dexie carries v1 rows over
    // untouched, so an existing library keeps every script, preset and position.
    this.version(2).stores({
      scripts: 'id, updatedAt, title',
      presets: 'id, name',
      meta: 'key',
    })
  }
}

export const db = new PrompterDB()

export async function getMeta(key: string): Promise<string | undefined> {
  return (await db.meta.get(key))?.value
}

export async function setMeta(key: string, value: string): Promise<void> {
  await db.meta.put({ key, value })
}
