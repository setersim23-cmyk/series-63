/** Chapter codes, in teaching order. */
export const ORDER = ['SEC', 'BDR', 'AGT', 'IAD', 'IAR', 'COM', 'ETH', 'REM'] as const
export type ChapterCode = (typeof ORDER)[number]

/** A cell id, e.g. "ETH-3". Cells are numbered 1–8 within each chapter. */
export type CellId = string

// ---------- textbook ----------

/** Card kinds inside a cell. `frame` is synthesised from FRAMES, never authored. */
export type ItemKind = 'concept' | 'memorize' | 'trap' | 'link' | 'warn'

export interface Item {
  t: ItemKind
  /** The prose. `x` is the design bundle's field name; kept so content stays portable. */
  x: string
}

export interface Cell {
  id: CellId
  title: string
  /** Cross-references into the other three books. */
  refs: string[]
  items: Item[]
}

export interface Fact {
  cell: CellId
  x: string
}

export interface Chapter {
  code: ChapterCode
  name: string
  /** e.g. "25% · 15 questions" */
  weight: string
  spine: string
  cells: Cell[]
  memorize: Fact[]
}

export interface Textbook {
  chapters: Chapter[]
}

// ---------- questions ----------

export interface Question {
  /** Cell this question is keyed to. */
  c: CellId
  q: string
  o: string[]
  /** Index into `o` of the correct option. */
  a: number
  /** Why — shown after answering. */
  w: string
  /** 1 when the question is flagged for The Hard 5. */
  h?: number
}

// ---------- map of authorities ----------

export interface Authority {
  n: string
  s: string
  /** What it does on this exam. */
  w: string
  /** Harada cells this authority lives in. */
  cells?: CellId[]
}

export interface AuthorityPart {
  p: string
  items: Authority[]
}

export interface Layer {
  id?: string
  name: string
  sub?: string
  hue?: number
  desc: string
  items?: Authority[]
  parts?: AuthorityPart[]
  /** The NSMIA line — drawn as a divider rather than an expandable layer. */
  line?: boolean
}

export interface Authorities {
  intro: string
  layerRule: string
  layers: Layer[]
}

// ---------- saved progress ----------

/** 0 = blank, 1 = shaky, 2 = solid. */
export type Mark = 0 | 1 | 2

export interface CellProgress {
  read?: boolean
  /** ◆ concepts */
  c?: Mark
  /** ● facts */
  f?: Mark
  /** Rolling answer history, most recent last. */
  qa?: boolean[]
  /** Timestamp of the last interaction, for forgetting-curve decay. */
  last?: number
}

export interface MissedEntry {
  due: number
  streak: number
}

export interface MockResult {
  ts: number
  score: number
  total: number
}

export interface Settings {
  rate: number
  voice: string | null
}

export interface Store {
  cells: Record<CellId, CellProgress>
  missed: Record<string, MissedEntry>
  mocks: MockResult[]
  settings: Settings
}
