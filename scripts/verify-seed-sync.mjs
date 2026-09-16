#!/usr/bin/env node
// Check that a library seeded by an older build survives a bundle refresh:
// the reader's own work is never overwritten, and everything else picks up the
// new episode numbering.
//
//   node scripts/verify-seed-sync.mjs [path/to/old/pof]
//
// The default "old" bundle is whatever git has in HEAD for src/data/pof, so this
// checks the real upgrade the next deploy will perform. Both bundles and the
// sync planner are compiled on the fly with the repo's own esbuild — no test
// framework, and it exercises the shipped code rather than a copy of it.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-sync-'))
const esbuild = path.join(REPO, 'node_modules/.bin/esbuild')

let failures = 0
const check = (ok, label, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`)
}

function bundle(entry, outName) {
  const out = path.join(tmp, outName)
  execFileSync(esbuild, [entry, '--bundle', '--format=esm', '--platform=node', `--outfile=${out}`], {
    cwd: REPO, stdio: ['ignore', 'ignore', 'inherit'],
  })
  return import(pathToFileURL(out).href)
}

/** Materialise the committed src/data/pof into a temp dir so it can be bundled. */
function checkoutOldBundle() {
  const dir = path.join(tmp, 'old-pof')
  fs.mkdirSync(dir, { recursive: true })
  const listed = execFileSync('git', ['ls-tree', '--name-only', 'HEAD', 'src/data/pof/'], {
    cwd: REPO, encoding: 'utf8',
  }).trim().split('\n').filter(Boolean)
  if (listed.length === 0) return null
  for (const f of listed) {
    const contents = execFileSync('git', ['show', `HEAD:${f}`], { cwd: REPO, encoding: 'utf8', maxBuffer: 64 << 20 })
    fs.writeFileSync(path.join(dir, path.basename(f)), contents)
  }
  return dir
}

const oldDir = process.argv[2] ? path.resolve(process.argv[2]) : checkoutOldBundle()
if (!oldDir) {
  console.error('No previous bundle to compare against (nothing at HEAD:src/data/pof).')
  process.exit(1)
}

const { POF_EPISODES: oldEpisodes } = await bundle(path.join(oldDir, 'index.ts'), 'old.mjs')
const { POF_EPISODES: newEpisodes, POF_SEED_VERSION, POF_SEED_HISTORY } = await bundle(path.join(REPO, 'src/data/pof/index.ts'), 'new.mjs')
const { planSeedSync, seededAt, fingerprint, withoutNumbering } = await bundle(path.join(REPO, 'src/storage/seedSync.ts'), 'sync.mjs')

console.log(`old bundle: ${oldEpisodes.length} episodes · new bundle: ${newEpisodes.length} · seed ${POF_SEED_VERSION}\n`)

/** A library as the OLD build would have left it: no seed hashes recorded. */
function legacyLibrary() {
  const m = new Map()
  for (const ep of oldEpisodes) {
    m.set(ep.id, {
      id: ep.id,
      title: ep.title,
      body: ep.body,
      createdAt: seededAt(ep.seq),
      updatedAt: seededAt(ep.seq),
      lastPositionPx: 0,
    })
  }
  return m
}

// ------------------------------------------------ 0. the numbering normalizer
// withoutNumbering has to recognise the numbering the generator writes, or a
// renumbering is a one-way door and every legacy script looks edited. It broke
// once already when "one hundred seventy six" grew past a word-count pattern.
console.log('the app can strip the numbering the generator writes:')
const unstripped = newEpisodes.filter((ep) => {
  const bare = withoutNumbering(ep.body)
  // A letter after "episode" means a number word survived; punctuation is the
  // expected remainder once the number is stripped.
  return /The Point of Failure\s*[,:\u2014-]?\s*episode\s*[a-z]/i.test(bare)
})
check(unstripped.length === 0, 'every spoken episode number normalises away', unstripped.slice(0, 3).map((e) => e.id).join(', '))
const prosePreserved = newEpisodes.filter((ep) => ep.body.includes('episode one of this show'))
check(
  prosePreserved.every((ep) => withoutNumbering(ep.body).includes('episode one of this show')),
  `prose "episode one of this show" is not eaten (${prosePreserved.length} script(s))`,
)

// ------------------------------------------------- 0. the two fingerprinters
// scripts/sync-episodes.mjs writes history.ts with its own copy of FNV-1a. If it
// ever drifts from the app's, every legacy script silently looks edited.
console.log("the generator's fingerprints match the app's:")
check(
  oldEpisodes.every((ep) => (POF_SEED_HISTORY[ep.id]?.title ?? []).includes(fingerprint(ep.title))),
  'every shipped title is recorded in history.ts',
)
check(
  oldEpisodes.every((ep) => (POF_SEED_HISTORY[ep.id]?.body ?? []).includes(fingerprint(ep.body))),
  'every shipped body is recorded in history.ts',
)

// ---------------------------------------------------------------- 1. upgrade
console.log('a phone that loaded the series in July, upgrading:')
const lib = legacyLibrary()
const { puts, result } = planSeedSync(newEpisodes, lib, POF_SEED_VERSION, POF_SEED_HISTORY)
check(result.added === 0, 'adds nothing', `added ${result.added}`)
check(result.keptEdited === 0, 'finds no edited scripts in an untouched library', `keptEdited ${result.keptEdited}`)
// Everything that actually changed between the two bundles must be refreshed —
// and nothing else written. A couple of episodes are byte-identical across the
// two builds (same release position, same title), so they are correctly untouched.
const oldById = new Map(oldEpisodes.map((e) => [e.id, e]))
const reallyChanged = newEpisodes.filter((ep) => {
  const o = oldById.get(ep.id)
  return !o || o.title !== ep.title || o.body !== ep.body || o.seq !== ep.seq
})
check(
  result.updated === reallyChanged.length,
  `refreshes every episode that changed (${reallyChanged.length} of ${newEpisodes.length})`,
  `updated ${result.updated}`,
)

const byId = new Map(puts.map((p) => [p.id, p]))
check(
  newEpisodes.every((ep) => byId.get(ep.id)?.title === ep.title),
  'every title now carries the new release number',
)
check(
  newEpisodes.every((ep) => byId.get(ep.id)?.updatedAt === seededAt(ep.seq)),
  'library re-files into release order',
)
const ids = new Set(newEpisodes.map((e) => e.id))
check([...lib.keys()].every((id) => ids.has(id)), 'no library script is orphaned by an id change')
const twelve = byId.get('pof-012')
check(!!twelve && twelve.body.includes('eleven countries'), 'the ep 12 correction reaches the phone')
const finale = byId.get('pof-m180')
check(!!finale && finale.body.includes('episode ninety three'), 'the finale cross-reference is corrected')
check(!!finale && !finale.body.includes('[N]'), 'no [N] placeholder survives')

// ------------------------------------------------------- 2. the reader's work
console.log('\nwith the reader\'s own work in the library:')
const lib2 = legacyLibrary()
const edited = lib2.get('pof-m002')
edited.body = edited.body + '\n\n[my own note to camera]'
edited.lastPositionPx = 4210
edited.notes = 'retake the cold open'
const renamed = lib2.get('pof-m003')
renamed.title = 'Tuesday shoot — bank one'
const positioned = lib2.get('pof-m005')
positioned.lastPositionPx = 980
lib2.set('mine-1', {
  id: 'mine-1', title: 'My own script', body: 'Hello.',
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', lastPositionPx: 77,
})

const plan2 = planSeedSync(newEpisodes, lib2, POF_SEED_VERSION, POF_SEED_HISTORY)
const out2 = new Map(plan2.puts.map((p) => [p.id, p]))
check(plan2.result.keptEdited === 2, 'counts exactly the two edited scripts', `keptEdited ${plan2.result.keptEdited}`)
check(out2.get('pof-m002')?.body === edited.body, 'an edited body is left alone')
check(out2.get('pof-m002')?.notes === 'retake the cold open', 'notes survive')
check(out2.get('pof-m002')?.lastPositionPx === 4210, 'scroll position survives')
check(out2.get('pof-m002')?.updatedAt === edited.updatedAt, 'an edited script keeps its place in the list')
check(
  out2.get('pof-m002')?.title === newEpisodes.find((e) => e.id === 'pof-m002').title,
  'but its title still gets the new number',
)
check(out2.get('pof-m003')?.title === 'Tuesday shoot — bank one', 'a renamed script keeps its name')
check(
  out2.get('pof-m003')?.body === newEpisodes.find((e) => e.id === 'pof-m003').body,
  'a renamed script still gets the fresh script text',
)
check(out2.get('pof-m005')?.lastPositionPx === 980, 'an unedited script keeps its scroll position too')
check(!out2.has('mine-1'), "the reader's own script is never touched")

// --------------------------------------------------------------- 3. idempotence
console.log('\nrunning again on the synced library:')
const lib3 = new Map(lib)
for (const p of puts) lib3.set(p.id, p)
const plan3 = planSeedSync(newEpisodes, lib3, POF_SEED_VERSION, POF_SEED_HISTORY)
check(plan3.puts.length === 0, 'writes nothing the second time', `${plan3.puts.length} writes`)
check(plan3.result.updated === 0, 'reports no updates', `updated ${plan3.result.updated}`)

// ------------------------------------------------- 4. a never-seeded library
console.log('\na library that never loaded the series:')
const plan4 = planSeedSync(newEpisodes, new Map(), POF_SEED_VERSION, POF_SEED_HISTORY)
check(plan4.result.added === newEpisodes.length, `adds all ${newEpisodes.length}`, `added ${plan4.result.added}`)
check(plan4.result.updated === 0 && plan4.result.keptEdited === 0, 'updates nothing')

fs.rmSync(tmp, { recursive: true, force: true })
console.log(failures === 0 ? '\nall checks passed' : `\n${failures} check(s) FAILED`)
process.exit(failures === 0 ? 0 : 1)
