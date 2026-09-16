#!/usr/bin/env node
// Regenerate src/data/pof/* from the editorial source of truth.
//
//   node scripts/sync-episodes.mjs [--check]
//   TPOF_BOOK_DIR=/path/to/content/book node scripts/sync-episodes.mjs
//
// The source of truth is the production-book data in the distributor repo
// (assetdistro/content/book): launch-order.json for the public release order,
// index.json for arcs and protocol registers, episodes/master-NNN.json for the
// briefs. See that directory's _README.md for the numbering rules. The two that
// matter here:
//
//   * masterNumber (1-180) is the stable catalog identity.
//   * launchOrder  (1-180) is the public release position, and lives ONLY in
//     launch-order.json. Never derive one from the other: release 1 is master #27.
//
// What this script DOES regenerate: ids, release numbering (seq + the "EP n ·"
// title prefix + the spoken episode number inside each script), titles, and the
// arc grouping in collections.ts.
//
// What it does NOT regenerate: the script bodies. Those were hand-cleaned for
// the reader (**emphasis** and [cue] markup that the book has no notion of), and
// the book's own spoken text carries PDF-extraction artifacts. Bodies are carried
// forward from the existing vol*.ts and only touched for numbering; any other
// drift against the book is REPORTED for a human to resolve, never silently
// overwritten. --check reports and writes nothing.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(REPO, 'src/data/pof')
const BOOK = path.resolve(REPO, process.env.TPOF_BOOK_DIR || '../assetdistro/content/book')
const CHECK = process.argv.includes('--check')

/**
 * Frozen. These 15 masters shipped in July under release-position ids, and a
 * library id is a primary key on every phone that has already loaded the series
 * — changing one would orphan the reader's edits and duplicate the episode.
 * Every other episode is keyed by its stable master number, forever.
 */
const LEGACY_IDS = {
  27: 'pof-001', 1: 'pof-002', 63: 'pof-003', 4: 'pof-004', 165: 'pof-005',
  42: 'pof-006', 28: 'pof-007', 10: 'pof-008', 82: 'pof-009', 65: 'pof-010',
  78: 'pof-011', 126: 'pof-012', 171: 'pof-013', 109: 'pof-014', 162: 'pof-015',
}

/**
 * Editorial corrections the book applied after these scripts were bundled.
 * Applied by exact match and idempotent (a correction already in place is a
 * no-op). Kept here, not in the vol files, so a regeneration can never lose them.
 */
const CORRECTIONS = [
  {
    id: 'pof-012', master: 126,
    why: 'Ericsson certificate expiry hit 11 countries, not 2 — the book retitled the episode around it.',
    from: 'phones in two countries lost data', to: 'phones in **eleven countries** lost data',
  },
  {
    id: 'pof-m180', master: 180,
    why: 'The finale names master #128 by release position. Release order is not master order: #128 is release 93.',
    from: 'that is episode one twenty eight', to: 'that is episode ninety three',
    verify: { master: 128, release: 93 },
  },
  {
    id: 'pof-m180', master: 180,
    why: 'The finale counts back to master #178, which is release 174 — six before the 180 finale, not two.',
    from: 'two episodes ago', to: 'six episodes ago',
    verify: { master: 178, release: 174 },
  },
]

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/**
 * Spoken form of an episode number, in the show's own style: "twelve",
 * "ninety three" (no hyphen), "one twenty eight". Both multi-word samples come
 * from the book itself — the finale's corrected cross-references. The hundreds
 * are read the way a year is, so 102 is "one oh two", not "one hundred two".
 */
function spokenNumber(n) {
  if (n < 20) return ONES[n]
  if (n < 100) return ONES[n % 10] ? `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}` : TENS[Math.floor(n / 10)]
  if (n === 100) return 'one hundred'
  if (n < 110) return `one oh ${ONES[n - 100]}`
  return `one ${spokenNumber(n - 100)}`
}

const pad3 = n => String(n).padStart(3, '0')
const idFor = master => LEGACY_IDS[master] ?? `pof-m${pad3(master)}`
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'))

// ---------------------------------------------------------------- book side

function loadBook() {
  if (!fs.existsSync(BOOK)) {
    console.error(`No production book at ${BOOK}\nSet TPOF_BOOK_DIR to the distributor's content/book directory.`)
    process.exit(1)
  }
  const launch = readJson(path.join(BOOK, 'launch-order.json'))
  const index = readJson(path.join(BOOK, 'index.json'))

  const releaseOf = new Map(launch.releases.map(r => [r.masterNumber, r.release]))
  const positions = new Set(launch.releases.map(r => r.release))
  if (positions.size !== launch.releases.length) throw new Error('launch-order.json: duplicate release position')
  if (releaseOf.size !== launch.releases.length) throw new Error('launch-order.json: a master holds two positions')

  const episodes = index.episodes.map(e => {
    const release = releaseOf.get(e.masterNumber)
    if (!release) throw new Error(`master #${e.masterNumber} has no release position in launch-order.json`)
    if (e.launchOrder !== release) {
      throw new Error(`master #${e.masterNumber}: index.json says release ${e.launchOrder}, launch-order.json says ${release}`)
    }
    return {
      master: e.masterNumber,
      release,
      arc: e.arc,
      arcNumber: e.arcNumber,
      protocol: e.protocol,
      volume: e.volume,
      title: e.title,
      id: idFor(e.masterNumber),
      spoken: (readJson(path.join(BOOK, `episodes/master-${pad3(e.masterNumber)}.json`)).script || [])
        .map(s => s.spoken).filter(Boolean).join(' '),
    }
  })
  if (episodes.length !== index.episodeCount) throw new Error('index.json: episodes[] disagrees with episodeCount')
  return { episodes, publishedThrough: launch.publishedThrough, releaseOf }
}

// ------------------------------------------------------------- existing side

/** Parse id -> { title, body } out of a set of vol*.ts sources. */
function parseBundle(read) {
  const found = new Map()
  for (let v = 1; v <= 9; v++) {
    const src = read(`vol${v}.ts`)
    if (src == null) continue
    const re = /id:\s*'([^']+)',\s*\n\s*seq:\s*\d+,\s*\n\s*title:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'),\s*\n\s*body:\s*`([\s\S]*?)`,\n\s*\},/g
    let m
    while ((m = re.exec(src)) !== null) {
      found.set(m[1], { title: JSON.parse(m[2][0] === "'" ? `"${m[2].slice(1, -1).replace(/"/g, '\\"')}"` : m[2]), body: m[3] })
    }
  }
  return found
}

const readFromDir = dir => name => {
  const f = path.join(dir, name)
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null
}

const readFromGitHead = name => {
  try {
    return execFileSync('git', ['show', `HEAD:src/data/pof/${name}`], { cwd: REPO, encoding: 'utf8', maxBuffer: 64 << 20 })
  } catch {
    return null
  }
}

/**
 * FNV-1a, byte-for-byte the same function as fingerprint() in
 * src/storage/seedSync.ts — the two must agree or the history below is useless.
 * scripts/verify-seed-sync.mjs asserts they do.
 */
function fingerprint(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Read the append-only record of every title and body this project has shipped
 * for each episode. A phone seeded before we tracked that carries no per-script
 * fingerprint, so this is the only way to tell "still exactly as we shipped it"
 * — and therefore safe to refresh — from "the reader rewrote it".
 */
function loadHistory() {
  const f = path.join(OUT, 'history.ts')
  if (!fs.existsSync(f)) return {}
  const src = fs.readFileSync(f, 'utf8')
  const history = {}
  // Read back the exact shape emitHistory writes — one line per episode. Parsed
  // by pattern rather than JSON because the emitted file is TypeScript source.
  const re = /'([^']+)':\s*\{\s*title:\s*\[([^\]]*)\],\s*body:\s*\[([^\]]*)\]\s*\}/g
  const hashes = list => list.split(',').map(h => h.trim().replace(/^'|'$/g, '')).filter(Boolean)
  let m
  while ((m = re.exec(src)) !== null) history[m[1]] = { title: hashes(m[2]), body: hashes(m[3]) }
  if (Object.keys(history).length === 0 && /POF_SEED_HISTORY/.test(src)) {
    throw new Error('history.ts exists but no entries could be read — refusing to run and lose it')
  }
  return history
}

function extendHistory(history, bundle) {
  for (const [id, { title, body }] of bundle) {
    const entry = (history[id] ??= { title: [], body: [] })
    for (const [key, value] of [['title', title], ['body', body]]) {
      const fp = fingerprint(value)
      if (!entry[key].includes(fp)) entry[key].push(fp)
    }
  }
  return history
}

/**
 * Strip the numbering back out of a body so it can be re-resolved against the
 * current release order. Without this the script is a one-way door: a later
 * change to launch-order.json could not fix a number already spelled into a body.
 */
function restorePlaceholders(body) {
  return body
    .replace(/^\[(?:EP\s*\d+|#\d+)\s*·\s*/, '[@@N@@ · ')
    .replace(/(The Point of Failure,\s*episode\s*)(?:\[N\]|[a-z]+(?:\s+[a-z]+){0,2})(?=\s*[.,])/g, '$1[N]')
}

function applyNumbering(body, release) {
  return body
    .replace(/^\[@@N@@\s*·\s*/, `[EP ${release} · `)
    .replace(/(The Point of Failure,\s*episode\s*)\[N\]/g, `$1${spokenNumber(release)}`)
}

// ----------------------------------------------------------------- comparison

const norm = s => s
  .replace(/\[[^\]]*\]/g, ' ').replace(/\*\*/g, '')
  .replace(/[‘’']/g, "'").replace(/[“”]/g, '"')
  .toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim()

/**
 * Words that differ between the bundled body and the book's spoken text. The
 * episode number is put back to its placeholder on both sides first, so this
 * reports editorial drift only — never the numbering this script just resolved.
 */
function drift(body, spoken) {
  const a = norm(restorePlaceholders(body)).split(' '), b = norm(restorePlaceholders(spoken)).split(' ')
  if (a.join(' ') === b.join(' ')) return null
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      return { mobile: a.slice(Math.max(0, i - 6), i + 6).join(' '), book: b.slice(Math.max(0, i - 6), i + 6).join(' ') }
    }
  }
  return { mobile: `(${a.length} words)`, book: `(${b.length} words)` }
}

// -------------------------------------------------------------------- emit

const q = s => (s.includes("'") ? JSON.stringify(s) : `'${s.replace(/\\/g, '\\\\')}'`)

function emitVolume(v, eps) {
  const lo = Math.min(...eps.map(e => e.release)), hi = Math.max(...eps.map(e => e.release))
  return `import type { PofEpisode } from './types'

// Volume ${v} of the production book — releases ${lo}–${hi}. Spoken text only.
// **bold** = punch it · [cue] = a beat/tone note you read but never speak.
// GENERATED by scripts/sync-episodes.mjs. Bodies are hand-authored and carried
// forward; ids, numbering and titles come from the book. Do not edit by hand.
export const vol${v}: PofEpisode[] = [
${eps.map(e => `  {
    id: '${e.id}',
    seq: ${e.release},
    title: ${q(`EP ${e.release} · ${e.title}`)},
    body: \`${e.body}\`,
  },`).join('\n')}
]
`
}

function emitIndex(seedVersion) {
  return `import type { PofEpisode } from './types'
${Array.from({ length: 9 }, (_, i) => `import { vol${i + 1} } from './vol${i + 1}'`).join('\n')}

export type { PofEpisode }
export { POF_COLLECTIONS, POF_COLLECTION_ORDER, collectionFor } from './collections'
export { POF_SEED_HISTORY } from './history'

/**
 * Fingerprint of the bundled episode set. Bumps whenever any id, number, title
 * or body changes, and is what tells an already-seeded library it is out of date.
 * GENERATED by scripts/sync-episodes.mjs.
 */
export const POF_SEED_VERSION = '${seedVersion}'

/** All bundled "The Point of Failure" episodes, in public release order. */
export const POF_EPISODES: PofEpisode[] = [
${Array.from({ length: 9 }, (_, i) => `  ...vol${i + 1},`).join('\n')}
].sort((a, b) => a.seq - b.seq)
`
}

function emitHistory(history) {
  const ids = Object.keys(history).sort()
  return `// GENERATED by scripts/sync-episodes.mjs. Append-only.
//
// Every title and body this project has shipped for each episode, fingerprinted.
// A library seeded before per-script fingerprints existed has no record of what
// it was given, so this is what lets a refresh tell an untouched bundled script
// from one the reader has made their own. Entries are never removed: dropping
// one would make a phone still on that build look edited, and it would then be
// stuck on an old episode number forever.

export const POF_SEED_HISTORY: Record<string, { title: string[]; body: string[] }> = {
${ids.map(id => `  '${id}': { title: [${history[id].title.map(h => `'${h}'`).join(', ')}], body: [${history[id].body.map(h => `'${h}'`).join(', ')}] },`).join('\n')}
}
`
}

function emitCollections(episodes, publishedThrough) {
  const publishedGroup = `Published — Episodes 1–${publishedThrough}`
  const groupOf = e => (e.release <= publishedThrough ? publishedGroup : e.arc)
  const ordered = [...episodes].sort((a, b) => a.release - b.release)

  const arcs = []
  for (const e of [...episodes].sort((a, b) => a.arcNumber - b.arcNumber || a.release - b.release)) {
    if (e.release <= publishedThrough) continue
    if (!arcs.includes(e.arc)) arcs.push(e.arc)
  }

  return `// GENERATED by scripts/sync-episodes.mjs from the production book's arc list.
// Episode id -> story-arc collection, used by the Library to group the bundled
// scripts into collapsible sections.
//
// The first ${publishedThrough} releases are published and frozen, so they are lifted out of
// their arcs into one "${publishedGroup}" section — which is why a section's
// count here can be lower than the book's arc-by-arc audit.

export const POF_COLLECTIONS: Record<string, string> = {
${ordered.map(e => `  '${e.id}': ${q(groupOf(e))},`).join('\n')}
}

/** Collections in release order: what is out, then the arcs still to come. */
export const POF_COLLECTION_ORDER: string[] = [
${[publishedGroup, ...arcs].map(g => `  ${q(g)},`).join('\n')}
]

/** The collection (story arc) a bundled script belongs to, if any. */
export function collectionFor(id: string): string | undefined {
  return POF_COLLECTIONS[id]
}
`
}

// -------------------------------------------------------------------- run

const { episodes, publishedThrough, releaseOf } = loadBook()

// Every bundle we can still see: the working tree about to be replaced, and the
// last committed one. Both are recorded before anything is written, so a phone
// on either build is recognised as unedited rather than frozen at an old number.
const onDisk = parseBundle(readFromDir(OUT))
const committed = parseBundle(readFromGitHead)
const history = extendHistory(extendHistory(loadHistory(), committed), onDisk)
const bodies = new Map([...onDisk].map(([id, e]) => [id, e.body]))
const problems = []
const drifts = []
const applied = []

for (const c of CORRECTIONS) {
  if (!c.verify) continue
  const actual = releaseOf.get(c.verify.master)
  if (actual !== c.verify.release) {
    problems.push(`correction for ${c.id} assumes master #${c.verify.master} is release ${c.verify.release}, but launch-order.json now says ${actual} — re-check the spoken cross-reference before trusting it`)
  }
}

for (const e of episodes) {
  const raw = bodies.get(e.id)
  if (raw === undefined) {
    problems.push(`no bundled body for ${e.id} (master #${e.master}, release ${e.release}) — a new episode needs its script written by hand`)
    continue
  }
  let body = applyNumbering(restorePlaceholders(raw), e.release)

  for (const c of CORRECTIONS.filter(c => c.id === e.id)) {
    if (body.includes(c.from)) {
      body = body.split(c.from).join(c.to)
      applied.push(`${e.id}: "${c.from}" -> "${c.to}"`)
    } else if (!body.includes(c.to)) {
      problems.push(`correction for ${e.id} matched nothing: expected "${c.from}" — ${c.why}`)
    }
  }

  if (body.includes('[N]')) problems.push(`${e.id}: an unresolved [N] placeholder remains`)
  const d = drift(body, e.spoken)
  if (d) drifts.push({ id: e.id, master: e.master, release: e.release, ...d })
  e.body = body
}

for (const id of bodies.keys()) {
  if (!episodes.some(e => e.id === id)) problems.push(`bundled ${id} is no longer in the book — remove it by hand once you are sure`)
}

if (problems.length) {
  console.error('\nBlocked:\n' + problems.map(p => `  - ${p}`).join('\n') + '\n')
  process.exit(1)
}

const byVolume = new Map()
for (const e of episodes) {
  if (!byVolume.has(e.volume)) byVolume.set(e.volume, [])
  byVolume.get(e.volume).push(e)
}
for (const eps of byVolume.values()) eps.sort((a, b) => a.release - b.release)

const seedVersion = crypto.createHash('sha256')
  .update(JSON.stringify([...episodes].sort((a, b) => a.release - b.release).map(e => [e.id, e.release, e.title, e.body])))
  .digest('hex').slice(0, 12)

const files = new Map()
for (const [v, eps] of [...byVolume].sort((a, b) => a[0] - b[0])) files.set(`vol${v}.ts`, emitVolume(v, eps))
files.set('index.ts', emitIndex(seedVersion))
files.set('collections.ts', emitCollections(episodes, publishedThrough))
files.set('history.ts', emitHistory(history))

let changed = 0
for (const [name, contents] of files) {
  const f = path.join(OUT, name)
  const before = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null
  if (before === contents) continue
  changed++
  if (!CHECK) fs.writeFileSync(f, contents)
  console.log(`${CHECK ? 'would update' : 'updated'} src/data/pof/${name}`)
}

console.log(`\n${episodes.length} episodes · releases 1–${episodes.length} · ${publishedThrough} published and frozen`)
console.log(`seed version ${seedVersion}${changed ? '' : ' (no change)'}`)
if (applied.length) console.log(`\ncorrections applied:\n${applied.map(a => `  - ${a}`).join('\n')}`)

if (drifts.length) {
  console.log(`\n${drifts.length} script(s) differ from the book's spoken text — bodies were NOT overwritten:`)
  for (const d of drifts) {
    console.log(`  ${d.id} (master #${d.master}, release ${d.release})`)
    console.log(`     bundled: ...${d.mobile}...`)
    console.log(`     book   : ...${d.book}...`)
  }
}
if (CHECK && changed) process.exit(1)
