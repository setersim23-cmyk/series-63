# Series 63 Coach

A study app for the NASAA Series 63, built as an installable web app: readiness scoring
over a 64-cell Harada chart, the full coded textbook to read or listen to, a memory
palace over all 64 cells, drills and a timed mock, five interactive tools embedded in
lessons, and the map of authorities.

Works fully offline once installed.

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally

npm run build:single   # everything inlined into one portable .html
```

`build:single` writes `dist-single/series-63.html` — the whole app in a single
file with the fonts embedded, for saving to a phone's Files app or hosting
somewhere that only accepts one page. It has no service worker (there is no
second file to register), but it needs no network either.

`dist/` is a static site — any static host will do. It must be served over HTTPS (or
localhost) for the service worker, and therefore offline mode, to work.

### Deploying

Pushing to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`
— enable Pages in the repo settings with **Source: GitHub Actions** once, and every push
deploys from then on.

Pages serves a project site from `/<repo>/` rather than the root, so the workflow builds
with `BASE_PATH` set to the repo name. To host somewhere else, set it to wherever the app
will live (`BASE_PATH=/ npm run build` for a domain root, which is the default).

### Narration audio

Chapters are narrated by pre-rendered MP3s rather than the browser's speech
synthesis. That is not a quality decision — iOS suspends the Web Speech API the
moment the screen locks, so recorded audio is the only way to listen with the
phone in a pocket, and it brings lockscreen controls with it.

```sh
python3 scripts/build_audio.py   # ~40 min, writes public/audio/ + src/content/audio.ts
```

Piper and the voice model download on first run into `.audio-build/` (gitignored,
~150 MB). The spoken text is derived the same way `src/lib/tts.ts` derives it, so
recordings and the fallback never disagree.

Clips are addressed by position — `SEC-1-3.mp3` is the fourth card — so a cell
whose recording has a different number of clips than the app has cards falls back
to speech synthesis rather than reading the wrong text under the right heading.
Adding content without re-rendering degrades rather than breaks. The audio is
deliberately excluded from the service worker's precache — it is tens of
megabytes — and is cached per clip as you listen.

## Reading it

Two settings sit on the home screen, under the day's plan.

**Text size** multiplies a scale that already responds to the width of the
screen: about 16px on a phone, where the design was drawn, up to 18 on a laptop.
Every size in the app is written as the pixel value the design specified —
`fs(14)` — and resolves through `--fs-unit`, so the two effects compose instead
of one replacing the other.

**Theme** is dark, light, or whatever the phone is set to. The light palette is
not hand-written: `scripts/make-theme.mjs` derives each of the 94 colours from
its dark counterpart by keeping the hue, keeping the chroma where sRGB has room
for it, and — the part that matters — keeping its WCAG contrast against the page.
A hairline border stays a hairline; body text stays exactly as readable as it
was. The chapter hues are `oklch()` built at render time, so they reflect through
a pair of variables instead. Re-run the script after adding a colour:

```sh
node scripts/make-theme.mjs
```

## Two devices

The app is one build; a laptop gets a wider layout at 900px and up — a side rail
instead of the phone's bottom bar, and the chart and chapter list side by side.
Below that breakpoint nothing about the phone layout changes.

Progress moves between devices by QR. GitHub Pages serves static files and has
nowhere to store anything, so there is no server to sync through — instead the
sheet renders a link as a QR the other device's camera can read. A heavy week of
study is ~17 KB of JSON but gzips to about 1.1 KB, which fits inside a single
code with room to spare.

Arriving on a transfer link **merges** rather than replaces: for each cell the
more recently touched version wins, mock history is unioned, and narration speed
and voice stay with the device you are holding. Nothing is applied until it is
accepted, and the prompt says how many cells would change.

## Installing on the iPhone

Open the deployed URL in Safari → Share → **Add to Home Screen**. It opens full screen,
and after the first load it runs with no network at all — the service worker precaches
the app, the content, the fonts and the icons.

Two things worth knowing:

- Progress is stored per browser, in `localStorage` under `s63_coach`. Home screen →
  ⇅ **Backup / transfer my progress** copies your whole state as a code you can paste
  into another copy, or into Notes as a backup.
- iOS only exposes its speech voices after speech has run inside a user gesture. The app
  primes this on your first tap, so the voice picker is populated by the time you open it.

## Layout

```
src/
  App.tsx            routing, session state, and the wiring between progress, quizzes and speech
  context.ts         the API every view consumes
  types.ts           content and saved-progress types
  ui.tsx             palette and shared primitives
  views/             one file per screen
  components/        bottom nav, sheets, the speech player
  components/tools/  the tools embedded in lessons
  lib/
    config.ts        exam date, pass target, mock rules, storage key
    store.ts         localStorage-backed progress + the transfer codec
    scoring.ts       cell/chapter/overall readiness, including forgetting-curve decay
    content.ts       textbook lookups, citation linking, loci
    quiz.ts          session building for each drill mode, spaced repetition
    tts.ts           speech synthesis and its platform workarounds
    narrator.ts      the pre-rendered clips, and the fallback to speech
    color.ts         chapter hues, reflected between the two themes
  theme.css          generated: both palettes, one variable per colour
  content/           generated: textbook, question bank, map of authorities
  data/              generated: chapter meta, laws, frameworks, loci, tools, simulator
scripts/             the generators, and the icon builder
project/             the original Claude Design bundle this was built from
chats/               the design conversation
```

## Content

All content comes from the Claude Design bundle in `project/` and is regenerated rather
than hand-edited. If that bundle is refreshed:

```sh
node scripts/convert-content.mjs      # project/content/*.js  → src/content/*.ts
node scripts/extract-design-data.mjs  # the prototype's data tables → src/data/*.ts
node scripts/make-icons.mjs           # app icons → public/
node scripts/make-theme.mjs           # the light palette → src/theme.css
```

`convert-content.mjs` fails the run if the content drifts out of shape — 8 chapters of
8 cells, every cell covered by at least one question, and no question or memorize fact
citing a cell that does not exist.

Current content: **8 chapters · 64 cells · 234 memorize facts · 212 questions · 61 traps
· 6 layers of authority · 64 loci**.

The bank is sized so three full 60-question mocks can be drawn without a repeat —
the weighting follows the real exam, so ethics alone needs fifteen fresh
questions a sitting. Quizzes serve the least-recently-seen questions first
(`store.shown`), so a second mock works through the rest of the bank rather than
reshuffling the first one.

## Tuning

`src/lib/config.ts` holds the exam date and time, the pass target the readiness ring is
graded against (the white tick), the mock exam length and pass mark, and the storage key.
The eight-day run-up plan is in `src/data/plan.ts`, keyed by `month-date`.
