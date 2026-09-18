#!/usr/bin/env node
// Keep the remote protocol in lockstep across the two repos.
//
//   node scripts/verify-protocol.mjs
//   ZOF_STUDIO_DIR=../zofstudio node scripts/verify-protocol.mjs
//
// The protocol is declared here, in src/remote/protocol.ts, and then MIRRORED BY
// HAND in two files in the Studio OS repo. Nothing mechanical connects them: add
// a field to RemoteState and forget controller.js, and everything compiles, runs,
// and silently reads the sentinel forever. That is the failure this catches.
//
// Checked:
//   RemoteState keys      == controller.js forwardState keys
//                         == TeleprompterController.Snapshot fields
//                         == every field applyState() actually ASSIGNS
//   RemoteCommand actions >= every action remoteStore.applyCommand handles
//                         >= every action Studio OS actually sends
//   command parameters    == the parameter names Studio OS puts on the wire
//
// Studio OS is optional: without it, the phone-side halves are still checked.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STUDIO = path.resolve(REPO, process.env.ZOF_STUDIO_DIR ?? '../zofstudio')

let failures = 0
const check = (pass, label, detail = '') => {
  if (!pass) failures++
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${label}${detail && !pass ? ` — ${detail}` : ''}`)
}
const read = (p) => fs.readFileSync(p, 'utf8')
const missing = (a, b) => [...a].filter((x) => !b.has(x))

// --- phone: the declaration ------------------------------------------------
const protocolSrc = read(path.join(REPO, 'src/remote/protocol.ts'))

const stateBlock = protocolSrc.match(/export interface RemoteState \{([\s\S]*?)\n\}/)
if (!stateBlock) {
  console.error('Could not find `export interface RemoteState` in src/remote/protocol.ts')
  process.exit(1)
}
const stateKeys = new Set(
  stateBlock[1]
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .map((l) => l.match(/^([A-Za-z_][A-Za-z0-9_]*)\??:/)?.[1])
    .filter(Boolean),
)

const commandBlock = protocolSrc.match(/export type RemoteCommand =([\s\S]*?)\n\nexport interface/)
if (!commandBlock) {
  console.error('Could not find `export type RemoteCommand` in src/remote/protocol.ts')
  process.exit(1)
}
const actions = new Set([...commandBlock[1].matchAll(/action:\s*'([^']+)'/g)].map((m) => m[1]))
// Every non-`action` field a command carries, so a sender cannot invent a name.
const commandParams = new Set(
  [...commandBlock[1].matchAll(/;\s*([A-Za-z_][A-Za-z0-9_]*)\??:/g)].map((m) => m[1]),
)
const version = Number(protocolSrc.match(/PROTOCOL_VERSION\s*=\s*(\d+)/)?.[1] ?? 0)

console.log(`\nRemote protocol v${version} — ${stateKeys.size} state fields, ${actions.size} commands\n`)

// --- phone: buildState and applyCommand ------------------------------------
const remoteStoreSrc = read(path.join(REPO, 'src/remote/remoteStore.ts'))
const buildBlock = remoteStoreSrc.match(/function buildState\(\): RemoteState \{([\s\S]*?)\n\}/)
const buildKeys = new Set(
  [...(buildBlock?.[1] ?? '').matchAll(/^\s{4}([A-Za-z_][A-Za-z0-9_]*):/gm)].map((m) => m[1]),
)
check(
  missing(stateKeys, buildKeys).length === 0,
  'buildState() fills every RemoteState field',
  `missing: ${missing(stateKeys, buildKeys).join(', ')}`,
)

const handled = new Set([...remoteStoreSrc.matchAll(/case '([^']+)':/g)].map((m) => m[1]))
check(
  missing(actions, handled).length === 0,
  'applyCommand() handles every RemoteCommand',
  `unhandled: ${missing(actions, handled).join(', ')}`,
)

// --- Studio OS mirrors ------------------------------------------------------
if (!fs.existsSync(STUDIO)) {
  console.log(`\n  ..   Studio OS not found at ${STUDIO} — skipping its two mirrors.`)
  console.log('       Set ZOF_STUDIO_DIR to check them.\n')
  process.exit(failures === 0 ? 0 : 1)
}

const controllerJs = read(path.join(STUDIO, 'Sources/ZofStudio/Resources/remote/controller.js'))
const forwardBlock = controllerJs.match(/function forwardState\(st\) \{([\s\S]*?)\n  \}/)
const forwardKeys = new Set(
  [...(forwardBlock?.[1] ?? '').matchAll(/^\s{6}([A-Za-z_][A-Za-z0-9_]*):/gm)].map((m) => m[1]),
)
// `t` is the message tag, not a state field; `title` is the wire name the bridge
// uses for `currentTitle`.
forwardKeys.delete('t')
const forwardEquivalent = new Set([...forwardKeys].map((k) => (k === 'title' ? 'currentTitle' : k)))
check(
  missing(stateKeys, forwardEquivalent).length === 0,
  'controller.js forwardState() forwards every RemoteState field',
  `missing: ${missing(stateKeys, forwardEquivalent).join(', ')}`,
)

const swiftSrc = read(path.join(STUDIO, 'Sources/ZofStudio/TeleprompterBridge.swift'))
const applyCall = swiftSrc.match(/controller\.applyState\(([\s\S]*?)\n\s*\)\)/)
const swiftLabels = new Set(
  [...(applyCall?.[1] ?? '').matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*):/gm)].map((m) => m[1]),
)
const swiftEquivalent = new Set([...swiftLabels].map((k) => (k === 'title' ? 'currentTitle' : k)))
check(
  missing(stateKeys, swiftEquivalent).length === 0,
  'TeleprompterBridge passes every RemoteState field to applyState',
  `missing: ${missing(stateKeys, swiftEquivalent).join(', ')}`,
)

const teleControllerSrc = read(path.join(STUDIO, 'Sources/ZofStudio/TeleprompterController.swift'))

// A field can be declared, carried across the bridge, put in the Snapshot — and
// then never assigned to anything. It compiles, it runs, and it reads as its
// default forever. So check applyState actually consumes each one.
const applyBody = teleControllerSrc.match(/func applyState\(_ s: Snapshot\) \{([\s\S]*?)\n    \}/)
const consumed = new Set(
  [...(applyBody?.[1] ?? '').matchAll(/\bs\.([A-Za-z_][A-Za-z0-9_]*)/g)].map((m) => m[1]),
)
const consumedEquivalent = new Set(
  [...consumed].map((k) => (k === 'title' ? 'currentTitle' : k)),
)
check(
  missing(stateKeys, consumedEquivalent).length === 0,
  'applyState() reads every field of the snapshot',
  `never read: ${missing(stateKeys, consumedEquivalent).join(', ')}`,
)

const teleController = teleControllerSrc
const sent = new Set([
  ...[...teleController.matchAll(/"action":\s*"([^"]+)"/g)].map((m) => m[1]),
  ...[...teleController.matchAll(/send\(action:\s*"([^"]+)"\)/g)].map((m) => m[1]),
])
check(
  missing(sent, actions).length === 0,
  'every action Studio OS sends exists in RemoteCommand',
  `unknown: ${missing(sent, actions).join(', ')}`,
)

// A misspelled parameter is the other silent failure: the action arrives, the
// switch runs, and the value is undefined.
const sentParams = new Set(
  [...teleController.matchAll(/"([A-Za-z_][A-Za-z0-9_]*)":\s*(?!")/g)].map((m) => m[1]),
)
sentParams.delete('action')
check(
  missing(sentParams, commandParams).length === 0,
  'every command parameter Studio OS sends exists in RemoteCommand',
  `unknown: ${missing(sentParams, commandParams).join(', ')}`,
)

const swiftVersion = Number(
  teleController.match(/static let protocolVersion\s*=\s*(\d+)/)?.[1] ?? -1,
)
check(
  swiftVersion === version,
  `Studio OS targets protocol v${version}`,
  `Swift says v${swiftVersion}`,
)

console.log(failures === 0 ? '\nProtocol is in lockstep.\n' : `\n${failures} mismatch(es).\n`)
process.exit(failures === 0 ? 0 : 1)
