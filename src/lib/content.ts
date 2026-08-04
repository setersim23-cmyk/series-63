import { FRAMES, type Frame } from '../data/frames'
import { LAWS } from '../data/laws'
import { LOCI } from '../data/loci'
import { TEXTBOOK } from '../content/textbook'
import { codeOf } from './color'
import type { Cell, CellId, Chapter, ChapterCode, Item } from '../types'

export function findChapter(code: ChapterCode): Chapter | undefined {
  return TEXTBOOK.chapters.find((c) => c.code === code)
}

export function findCell(id: CellId | null): Cell | undefined {
  if (!id) return undefined
  return findChapter(codeOf(id))?.cells.find((c) => c.id === id)
}

/** A cell's cards, plus its answer framework appended as a synthetic card. */
export type DisplayItem = Item | { t: 'frame'; x: string; fr: Frame }

export function cellItems(cell: Cell | undefined): DisplayItem[] {
  if (!cell) return []
  const fr = FRAMES[cell.id]
  if (!fr) return cell.items
  const x = `${fr.head}. ${fr.intro} ${fr.bullets.map(([b, r]) => `${b} ${r}`).join(' ')} ${fr.tail}`
  return [...cell.items, { t: 'frame', x, fr }]
}

const SPOKEN_PREFIX: Record<string, string> = {
  concept: 'Concept.',
  memorize: 'Memorize this.',
  trap: 'Exam trap.',
  link: 'Connection.',
  warn: 'Source note.',
  frame: 'The answer framework.',
}

/** What the narrator actually says — section signs and middots don't read well aloud. */
export function speakables(cell: Cell | undefined): { label: string; text: string }[] {
  return cellItems(cell).map((it) => ({
    label: SPOKEN_PREFIX[it.t] ?? '',
    text: it.x.replace(/·/g, '; ').replace(/§/g, 'section '),
  }))
}

export function locusOf(id: CellId): { room: string; spot: string; img: string } | null {
  const [code, n] = id.split('-')
  const room = LOCI[code as ChapterCode]
  if (!room) return null
  const [spot, img] = room.spots[parseInt(n, 10) - 1]
  return { room: room.room, spot, img }
}

const TERM_RE =
  /(§\s?\d{3}|USA\s?\d{3}|Rule 506|Regulation D|Regulation T|Reg T|NSMIA|SIPC|FINRA 2210|Howey|Form ADV|Form BDW|Form BD|Form U4|12b-1|Securities Act of 1933|1933 Act)/g

export interface Segment {
  t: string
  /** Set when the segment is a tappable citation. */
  term?: string
}

/** Splits prose into plain runs and tappable law citations. */
export function segments(text: string): Segment[] {
  const out: Segment[] = []
  let last = 0
  let m: RegExpExecArray | null
  TERM_RE.lastIndex = 0
  while ((m = TERM_RE.exec(text))) {
    if (m.index > last) out.push({ t: text.slice(last, m.index) })
    let key = m[0].replace(/USA\s?/, '§').replace(/§\s/, '§')
    if (!LAWS[key]) key = m[0]
    out.push(LAWS[key] ? { t: m[0], term: key } : { t: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ t: text.slice(last) })
  return out
}

export function trapCount(): number {
  return TEXTBOOK.chapters.reduce(
    (s, ch) => s + ch.cells.reduce((s2, cl) => s2 + cl.items.filter((i) => i.t === 'trap').length, 0),
    0
  )
}
