# Teleprompter

An offline-first teleprompter **PWA** built for the iPhone 17 Pro Max (works on any modern
browser). Large, high-contrast, smoothly scrolling script text with full mirror/rotation support
for physical beam-splitter teleprompter rigs. No App Store, no login, no network needed while
prompting.

Built with **Vite + React + TypeScript**, **Zustand** (state), **Dexie/IndexedDB** (script
storage), and **vite-plugin-pwa** (offline service worker + installable manifest).

---

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build (add --host to reach it from your phone)
npm run icons      # regenerate the PWA icons (dependency-free PNG generator)
```

### Put it on your iPhone (no App Store)

1. Deploy `dist/` to any HTTPS host, **or** run `npm run preview -- --host` and open the shown
   LAN URL on the phone (PWA install/offline needs HTTPS or `localhost`; for a phone on your
   network use a real HTTPS host or a tunnel).
2. Open the URL in **Safari**.
3. Tap **Share → Add to Home Screen**.
4. Launch from the Home Screen — it runs full-screen and works offline.

---

## What it does

### Reading

- Full-screen black-on-white (configurable) reader with smooth `requestAnimationFrame` scrolling.
- **WPM-based speed (10–300)** that is *font-size independent* — bumping the font mid-take does not
  change your reading pace, because scroll velocity scales with the rendered text height.
- Play / pause / seek ±5s / jump to top / jump to bottom, all without losing position.
- Live font-size (24–160px), line-height, margin, letter/word spacing, weight, alignment, all-caps.
- Optional 3 / 5 / 10 s countdown, pre-roll padding, loop, and an end-of-script indicator.
- Progress bar + estimated remaining time.
- Auto-hiding controls while scrolling (tap to reveal); the control overlay is **never mirrored**,
  only the reading text and countdown are.

### Lens window (eyeline over the camera)

A one‑tap **Lens** mode confines the script to a centered square roughly the size of the camera's
lens opening, so your eyes never drift off the lens and you always appear to look straight into the
camera. Everything outside the window is masked, with a soft edge fade. Sizes are set in real
millimetres (mapped via the iPhone 17 Pro Max display density, ~6.04 CSS px/mm, and a 1:1
beam‑splitter reflection) with presets for common lenses (e.g. Sony FE 24‑70 GM 82 mm, 24‑70 f/4
67 mm). Because the phone (~73 mm wide) is about as wide as the lens, the window mainly crops the
**vertical** reading band. Toggle it from the reader's **Lens** button or configure size, border,
and fade in **Setup**; the default is the full‑screen reader (feature off).

### Mirroring & rotation (first-class)

All 11 orientations from the spec are reachable from **Setup** and the in-reader quick panel:
Normal, Mirror L/R, Mirror T/B, Flip Both, Rotate 90° R/L, Rotate 180°, and the four
rotate-plus-mirror combinations. A live preview stage with center-line / safe-area / alignment-grid
guides lets you match the reflection through your glass before recording.

### Scripts

- Create / edit / paste / duplicate / delete, with **auto-save** to IndexedDB.
- Import `.txt` / `.md`, export `.txt` / `.md`, copy to clipboard, whitespace clean-up.
- Word / character counts and read-time estimate. Per-script last-scroll-position memory.
- Presenter notes (kept out of the prompter).
- **Library management for large libraries:** scripts group into **collapsible sections** (bundled
  series scripts by story arc via [src/data/pof/collections.ts](src/data/pof/collections.ts), your
  own under "My scripts"), a **To film / Done** filter with live counts, and per-card **Archive /
  Restore** (non-destructive — keeps edits and scroll position; `setArchived` in
  [scriptsRepository.ts](src/storage/scriptsRepository.ts)). Primary card actions are Prompt / Edit /
  Archive; Duplicate + Delete live in a "…" overflow menu.

#### Reading markup (emphasis & pauses)

Script bodies support two lightweight, no-graphics reading cues that render in the prompter
(and are ignored everywhere it matters):

- `**word**` → **emphasis**: rendered bold and slightly larger so a number or punchline pops as
  you read it.
- A whole line wrapped in `[brackets]` → a **director cue** you read but never speak (`[beat]`, a
  tone note like `[SERIOUS — measured, low energy]`). Rendered dim + small, and **excluded from the
  word count** so cues never distort your WPM scroll pace.

Parsing lives in [src/utils/prompterFormat.ts](src/utils/prompterFormat.ts); rendering in
[src/components/PromptDisplay.tsx](src/components/PromptDisplay.tsx).

#### Bundled series: "The Point of Failure" (180 episodes)

All 180 episode scripts ship with the app, cleaned to spoken text only (no fact boxes, edit cues,
or timecodes) and formatted with the markup above — sparse emphasis on the key numbers/punchlines
and `[beat]` rests derived from the production book's own EDIT cues. Tap **Load series** in the
Library to add them all at once, in filming order. The import is **idempotent and non-destructive**:
re-tapping only adds what's missing (matched by stable id) and never overwrites your edits, notes,
or scroll position. Data lives in [src/data/pof/](src/data/pof/) (one file per volume); the importer
is `importSeedEpisodes` in [src/storage/scriptsRepository.ts](src/storage/scriptsRepository.ts).

### Presets

Save named setups (transform + typography + scroll + colours) — e.g. *tabletop rig*, *landscape
mirror*, *close camera*. Load, rename, duplicate, delete, mark default.

### Reliability

- Offline after first load (app shell + assets precached; only system fonts, no remote fonts).
- Screen Wake Lock while prompting (best-effort, re-acquired after app switch).
- Recording checklist + battery warning in **Setup**.

---

## Keyboard / Bluetooth remote shortcuts

Most Bluetooth remotes emit key events, so these work with a paired remote too (the page must have
focus). Toggle in **Settings**.

| Key | Action |
| --- | --- |
| `Space` / `Enter` | Play / pause |
| `↑` | Slower · `Shift+↑` big step |
| `↓` | Faster · `Shift+↓` big step |
| `←` / `→` | Rewind / forward 5s |
| `+` / `=` , `-` | Font larger / smaller |
| `m` / `M` | Mirror horizontal / vertical |
| `[` / `]` | Rotate 90° left / right |
| `r` , `Home` / `End` | Reset to top / jump top / bottom |
| `f` | Full-screen |
| `Esc` | Pause, or exit to library |

> Arrow-key speed mapping follows the spec (**↑ = slower, ↓ = faster**). Touch swipes use the
> opposite convention (swipe up = faster) as the spec also requests.

### Touch gestures (off by default — enable in Settings)

Single tap always toggles controls. When gestures are on: double-tap play/pause, horizontal swipe
seek, vertical swipe speed, pinch to resize the font.

---

## Architecture

```
src/
  components/    PromptDisplay, ControlOverlay, ReaderView, Countdown,
                 ScriptList, ScriptEditor, SettingsPanel, PresetManager,
                 CalibrationView, LibraryView, Icon, ui (primitives)
  hooks/         useScrollEngine, useKeyboardShortcuts, useAutoHideControls,
                 useWakeLock, useOrientation, useGestures
  state/         appStore (Zustand + persist), scrollController, defaults
  storage/       db (Dexie), scriptsRepository, presetsRepository
  utils/         transform, estimateReadTime, textNormalize, id
  types.ts       Script / Preset / AppSettings / PrompterConfig
scripts/
  generate-icons.mjs   dependency-free PNG icon generator
```

**Scroll engine design.** The authoritative pixel position lives in a `ref` and is written straight
to the DOM via `translate3d` on the scroller element — scrolling never triggers a React render.
Progress/remaining-time is pushed to the store at ~5 Hz, and components use narrow Zustand selectors
so the heavy prompt text never re-renders during a scroll. Speed is
`pxPerSec = textHeight × wpm / (words × 60)`.

**Transform pipeline.** A centered `.reader__layer` carries
`translate(-50%,-50%) rotate() scale()`; the inner `.reader__scroller` is translated along the
layer's local Y so reading direction is preserved through rotation. For 90°/-90° the layer's
width/height are swapped so the text column and scroll bounds match the on-screen reading axis.

---

## Deployment options (from the spec)

- **A — PWA + Add to Home Screen** (recommended, implemented here): no App Store, instant updates,
  offline.
- **B — Xcode free provisioning**, **C — Ad Hoc**, **D — TestFlight**, **E — Enterprise**: native
  paths for later. The state model and feature set here port cleanly to a SwiftUI app if the PWA
  ever hits orientation-lock or remote-reliability limits.

### Hosting note

`vite.config.ts` uses `base: './'` so the build works from a sub-path (e.g. GitHub Pages project
site) as well as a domain root. The service worker scope follows the same base.

---

## MVP coverage

All 15 MVP items from the spec are implemented (script editing/paste, full-screen reader, play/pause,
smooth rAF scroll, speed & font controls, horizontal/vertical mirror, 90/180 rotation, local script +
settings persistence, offline PWA, Add-to-Home-Screen, portrait & landscape, keyboard shortcuts),
plus several V2 items (presets, countdown, import/export, advanced typography, gestures, read-time
estimate, progress indicator, calibration/test pattern).
