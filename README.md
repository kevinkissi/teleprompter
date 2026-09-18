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
npm run verify:slides     # segmentation never changes the script (180 episodes)
npm run verify:protocol   # remote protocol in lockstep with Studio OS
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

### Two playback modes

The same script, presented two ways. Switching between them changes nothing about
the script and nothing about recording.

**Continuous** — the scrolling reader the app has always had, at the set WPM.
**Pause teleprompter** freezes the script where it is; **Resume** carries on from
the same position. Speed, font and everything else work as before.

**Slides** — the script is divided into small sections and shown one at a time
inside the lens frame. Advance them yourself (**Previous** / **Next**), or let
them advance automatically: each slide is held for its own word count at the
slide **pace**, plus a **pause before advancing**, plus a short read-in allowance
(a slide gives you no peripheral preview of the next line, which continuous
scrolling does). Any single slide's time can be overridden by hand from Studio OS.
Pausing automatic advancement freezes the slide and nothing else.

#### How the script is divided

Segmentation only ever decides where the boundaries go. It never rewrites,
reorders or drops a word — slides are half-open spans of the original body that
abut and cover it exactly, so concatenating them reproduces the script byte for
byte. `npm run verify:slides` asserts that over all 180 bundled episodes at seven
lens sizes, along with: no boundary inside a word, a number or a clock time;
emphasis carried across any break; determinism; and that a reading position
always resolves to exactly one slide.

Boundaries are chosen strongest-first: a paragraph break, then a `[director cue]`
line (a written rest, which gets a card of its own), then a sentence end. Only
when a *single sentence cannot physically fit the window* is it continued onto the
next slide, and then at the most natural pause it contains — em dash, ellipsis,
colon, comma, word gap — never mid-word, never inside a number, and preferring not
to end on a function word. A continued slide is marked so you can see the thought
carries over.

#### Lens size is the real constraint

The amount of text per slide is measured against the actual reading box, with the
actual font. That box is small: at the default 40 mm lens on an iPhone 17 Pro Max
it is 241 × 241 CSS px. Measured over the bundled series:

| lens | type size | slides/episode | words/slide | whole sentences |
| --- | --- | --- | --- | --- |
| off | 53px | 24.7 | 11.6 | 62% |
| 82 / 67 mm | 37px | 25.0 | 11.5 | 61% |
| 49 mm | 29px | 27.9 | 10.3 | 50% |
| **40 mm** (default) | 28px | 37.9 | 7.6 | 36% |
| 30 mm | 28px | 67.3 | 4.3 | 15% |
| 20 mm | 28px | 143.8 | 2.0 | 3% |

`npm run verify:slides` prints this table, so it is measured rather than quoted.

So "never cut a sentence" and "legible through a beam-splitter" are geometrically
incompatible below about 49 mm — there is no algorithm that fixes a 241 px box.
The reader picks legibility, splits at the best pause available, and **tells you
the number before you roll**: the Slides card in Studio OS shows the chosen type
size and what percentage of slides are whole sentences at the current lens, and
says so in orange when it drops below half. Opening the lens window from 40 mm to
67 mm costs nothing physically — the window only has to cover where your eyes
travel — and takes whole sentences from 36% to 61%.

Type size is chosen automatically (largest size at which most sentences still fit,
floored at 28 px) and can be set by hand from the reader's **More** panel. A slide
that still overflows is shrunk a step at a time, measured against the real box,
down to a 24 px floor. Slide Mode does not apply the lens edge fade: the fade
softens text *entering and leaving* a scroll window, and on a static centred slide
it would only dim the first and last line.

### Lens window (eyeline over the camera)

A one‑tap **Lens** mode confines the script to a centered square roughly the size of the camera's
lens opening, so your eyes never drift off the lens and you always appear to look straight into the
camera. Everything outside the window is masked, with a soft edge fade. Sizes are set in real
millimetres (mapped via the iPhone 17 Pro Max display density, ~6.04 CSS px/mm, and a 1:1
beam‑splitter reflection) with presets for common lenses (e.g. Sony FE 24‑70 GM 82 mm, 24‑70 f/4
67 mm). Because the phone (~73 mm wide) is about as wide as the lens, the window mainly crops the
**vertical** reading band. Toggle it from the reader's **Lens** button or configure size, border,
and fade in **Setup**; the default is the full‑screen reader (feature off).

### Remote control (laptop ↔ phone)

Drive the teleprompter on your phone from a laptop (or any second device) over the same WiFi — no
accounts, no server. On the phone: **Library → Remote → Enable remote control** (or the **Remote**
button in the reader) shows a 5-character code. On the laptop: open the same app, **Remote → Open
remote control**, type the code. They connect directly over a **WebRTC data channel** (PeerJS is used
only for the ~2-second pairing handshake, then traffic is peer-to-peer). The laptop can Play/Pause,
Restart from top, jump Top/End, seek ±5 s, change speed & font, and pick which script to prompt; it
mirrors the phone's live status (script, play state, progress, remaining time, WPM). Commands invoke
the exact same store actions/scroll controller as the on-device controls, so behaviour is identical.
The protocol also carries the **lens window** (on/off and size in millimetres, via `lensEnabled` /
`lensSize` / `lensDelta`, with `lensEnabled` + `lensSizeMm` in the streamed state): Studio OS on the
Mac sizes the window live from its Teleprompter tab. The in-app laptop remote does not expose it yet.
Protocol 3 adds **Slide Mode** to the same channel: playback mode, slide index and
count, the current and next slide's text, manual/auto advancement, slide timing,
per-slide time overrides, teleprompter pause/resume, and the recording state
Studio OS pushes so the reader can show a take is rolling. `RemoteState` carries a
`protocolVersion`, and every new field uses a sentinel that cannot be a real value
(`playbackMode: ''`, `slideIndex: -1`, `slideCount: 0`), so an older phone is
detected rather than misread — Studio OS disables the controls that phone cannot
honour instead of sending commands it would silently drop.

The protocol is declared once in [src/remote/protocol.ts](src/remote/protocol.ts)
and mirrored by hand in two files in the Studio OS repo. Nothing mechanical
connects them, so `npm run verify:protocol` does: it fails if `RemoteState`,
`controller.js`'s `forwardState`, and Swift's `applyState` ever disagree, or if a
command exists that nothing handles.

PeerJS loads as its own lazy chunk, so the offline-first core is unaffected. Transport lives in
[src/remote/](src/remote/); UI in `RemoteControl` / `RemotePanel` / `RemoteTab`.

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
Library to add them all at once, in **public release order**. Data lives in
[src/data/pof/](src/data/pof/) (one file per production-book volume).

**Numbering.** Episodes are titled and ordered by their public release position (`EP 1` … `EP 180`),
which is also the number each script speaks in its opening line. That order is an editorial
decision and is *not* the production-book master number — release 1 is master #27 — so it is never
derived, only read from the book data.

**Refreshing the bundle.** `npm run episodes` regenerates ids, numbering, titles and arc grouping
from the distributor's production book (`../assetdistro/content/book`, or `$TPOF_BOOK_DIR`);
`npm run episodes:check` reports what would change without writing. Script *bodies* are hand-cleaned
for the reader, so they are carried forward rather than regenerated — the script reports any drift
against the book instead of overwriting it, and applies the book's editorial corrections from a
table it keeps.

**Getting a refresh onto a phone.** A library that already holds the series is re-synced on launch
whenever the bundled `POF_SEED_VERSION` changes, so corrected scripts and new episode numbers
actually arrive — the old import only ever added missing episodes, which meant a renumbering never
reached a phone that had already loaded the series. The sync is still **non-destructive**: an
episode you have edited is left alone (only its number is refreshed), and notes, scroll position and
archive state are preserved on every episode. The decision of what may be touched is
[src/storage/seedSync.ts](src/storage/seedSync.ts), checked by `npm run verify:seed`, which replays
the real upgrade from the committed bundle.

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
  hooks/         useScrollEngine, useSlideEngine, useKeyboardShortcuts,
                 useAutoHideControls, useWakeLock, useOrientation, useGestures
  state/         appStore (Zustand + persist), scrollController, defaults
  storage/       db (Dexie), scriptsRepository, presetsRepository
  utils/         transform, estimateReadTime, textNormalize, id,
                 sentences + slides + slideFit (Slide Mode segmentation)
  types.ts       Script / Preset / AppSettings / PrompterConfig
scripts/
  generate-icons.mjs   dependency-free PNG icon generator
  verify-slides.mjs    segmentation invariants over the whole bundled series
  verify-protocol.mjs  remote protocol lockstep across both repos
```

**Playback engine design.** Whichever mode is active installs its own engine into
the shared `scrollController` handle, so Play, Pause, Next, Top and End mean
something in both modes and no remote command is ever a silent no-op. When no
engine is mounted the handle holds an *idle* controller that still clears the
store's playback flags — a no-op pause was the one genuinely dangerous case,
because a `playing` or `countingDown` that nothing can resolve makes Studio OS
stop starting the prompter on later takes.

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
