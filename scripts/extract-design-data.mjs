/**
 * One-shot importer: lifts the static data tables that live inside the Claude
 * Design prototype's component class (project/Series 63 Coach.dc.html) into
 * typed TS modules under src/data/.
 *
 * The tables are pure literals, so we evaluate the class against a DCLogic stub
 * and serialise what its methods return — no transcription, no drift.
 *
 *   node scripts/extract-design-data.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(join(root, 'project', 'Series 63 Coach.dc.html'), 'utf8')

const open = html.indexOf('<script type="text/x-dc"')
const bodyStart = html.indexOf('>', open) + 1
const bodyEnd = html.indexOf('</script>', bodyStart)
if (open < 0 || bodyEnd < 0) throw new Error('could not find the dc script block')
const source = html.slice(bodyStart, bodyEnd)

const ctx = vm.createContext({ DCLogic: class {}, console })
vm.runInContext(`${source}\nglobalThis.__C = Component`, ctx)
const c = new ctx.__C()

const json = (v) => JSON.stringify(v, null, 1)
const write = (file, body) =>
  writeFileSync(
    join(root, 'src', 'data', file),
    `// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.\n` +
      body,
    'utf8'
  )

write(
  'meta.ts',
  `import type { ChapterCode } from '../types'

/** Exam weight (w), question count (q), the actor every rule in the chapter is about, and the chart hue. */
export interface ChapterMeta {
  name: string
  actor: string
  hue: number
  w: number
  q: number
}

export const META: Record<ChapterCode, ChapterMeta> = ${json(c.META())}
`
)

write(
  'laws.ts',
  `/** Tap-to-explain dictionary: term → [title, plain-English explainer]. */
export const LAWS: Record<string, [string, string]> = ${json(c.LAWS())}
`
)

write(
  'frames.ts',
  `import type { CellId } from '../types'

/** "Is this a security?"-style answer frameworks, one per chapter where the pattern lives. */
export interface Frame {
  head: string
  intro: string
  /** [the filter, what it resolves to] */
  bullets: [string, string][]
  tail: string
}

export const FRAMES: Record<CellId, Frame> = ${json(c.FRAMES())}
`
)

write(
  'loci.ts',
  `import type { ChapterCode } from '../types'

/** Method-of-loci rooms: one per chapter, eight spots each, in cell order. */
export interface Room {
  room: string
  /** [spot, the vivid image fixed there] */
  spots: [string, string][]
}

export const LOCI: Record<ChapterCode, Room> = ${json(c.LOCI())}
`
)

write(
  'tools.ts',
  `import type { CellId } from '../types'

export interface SorterItem {
  t: string
  /** Index of the bucket this belongs in. */
  b: number
  why: string
}

export interface Sorter {
  title: string
  hint: string
  buckets: string[]
  items: SorterItem[]
}

export interface Timeline {
  title: string
  hint: string
  /** Events in the order the Act requires them. */
  events: string[]
}

export interface WalkScenario {
  s: string
  agent: boolean
  why: string
}

export interface FiveFilterWalk {
  title: string
  scenarios: WalkScenario[]
}

/** Which interactive tool is embedded in which cell. */
export const TOOLMAP: Record<CellId, string> = ${json(c.TOOLMAP())}

export const SORTERS: Record<string, Sorter> = ${json(c.SORTERS())}

export const TIMELINE: Timeline = ${json(c.TIMELINE())}

export const WALK: FiveFilterWalk = ${json(c.WALK())}
`
)

write(
  'sim.ts',
  `export interface SimOption {
  t: string
  ok: boolean
  /** Shown after the pick — the consequence of getting it wrong. */
  fb: string
}

export interface SimStep {
  p: string
  o: SimOption[]
}

export interface SimCase {
  name: string
  facts: string
  steps: SimStep[]
  close: string
}

export interface Simulator {
  title: string
  cases: SimCase[]
}

/** The Administrator's desk — four branching enforcement cases. */
export const SIM: Simulator = ${json(c.SIM())}
`
)

console.log(
  `laws ${Object.keys(c.LAWS()).length} · frames ${Object.keys(c.FRAMES()).length} · ` +
    `loci ${Object.keys(c.LOCI()).length} rooms · sorters ${Object.keys(c.SORTERS()).length} · ` +
    `sim cases ${c.SIM().cases.length} · timeline ${c.TIMELINE().events.length} · walk ${c.WALK().scenarios.length}`
)
