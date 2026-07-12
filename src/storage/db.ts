import Dexie, { type Table } from 'dexie'
import type { Preset, Script } from '../types'

/** IndexedDB store for scripts and presets (bodies can be large; use IndexedDB). */
export class PrompterDB extends Dexie {
  scripts!: Table<Script, string>
  presets!: Table<Preset, string>

  constructor() {
    super('teleprompter')
    this.version(1).stores({
      // Only indexed fields are listed; the full object is still stored.
      scripts: 'id, updatedAt, title',
      presets: 'id, name',
    })
  }
}

export const db = new PrompterDB()
