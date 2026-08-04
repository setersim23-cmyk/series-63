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
```

`dist/` is a static site — any static host will do. It must be served over HTTPS (or
localhost) for the service worker, and therefore offline mode, to work.

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
```

`convert-content.mjs` fails the run if the content drifts out of shape — 8 chapters of
8 cells, every cell covered by at least one question, and no question or memorize fact
citing a cell that does not exist.

Current content: **8 chapters · 64 cells · 234 memorize facts · 134 questions · 61 traps
· 6 layers of authority · 64 loci**.

## Tuning

`src/lib/config.ts` holds the exam date and time, the pass target the readiness ring is
graded against (the white tick), the mock exam length and pass mark, and the storage key.
The eight-day run-up plan is in `src/data/plan.ts`, keyed by `month-date`.
