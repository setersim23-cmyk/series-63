import { META } from '../data/meta'
import { ORDER } from '../types'
import type { CellId, ChapterCode, Store } from '../types'

/**
 * A cell is scored out of 100: reading it is worth 20, the two manual/checkpoint
 * marks 15 each, and recent drill accuracy the remaining 50 — then the whole
 * thing decays 6% a day since you last touched it, floored at 55%. That decay is
 * the forgetting curve the readiness score is supposed to reflect.
 */
export function cellScore(store: Store, id: CellId): number {
  const c = store.cells[id]
  if (!c) return 0

  let s = (c.read ? 20 : 0) + (c.c ?? 0) * 7.5 + (c.f ?? 0) * 7.5

  const qa = (c.qa ?? []).slice(-6)
  if (qa.length) s += 50 * (qa.filter(Boolean).length / qa.length)

  if (c.last) {
    const days = (Date.now() - c.last) / 86400000
    s *= Math.max(0.55, 1 - 0.06 * days)
  }

  return Math.round(Math.min(100, s))
}

export function chapterScore(store: Store, code: ChapterCode): number {
  let total = 0
  for (let i = 1; i <= 8; i++) total += cellScore(store, `${code}-${i}`)
  return Math.round(total / 8)
}

/** Readiness: chapter scores weighted by their share of the exam. */
export function overallScore(store: Store): number {
  let total = 0
  for (const code of ORDER) total += chapterScore(store, code) * META[code].w
  return Math.round(total / 100)
}

export function solidCount(store: Store, passTarget: number): number {
  let solid = 0
  for (const code of ORDER) {
    for (let i = 1; i <= 8; i++) if (cellScore(store, `${code}-${i}`) >= passTarget) solid++
  }
  return solid
}

export function drillAccuracy(store: Store): string {
  let seen = 0
  let right = 0
  for (const id in store.cells) {
    for (const ok of store.cells[id].qa ?? []) {
      seen++
      if (ok) right++
    }
  }
  return seen ? `${Math.round((100 * right) / seen)}%` : '—'
}

export function dueCount(store: Store): number {
  const now = Date.now()
  return Object.values(store.missed).filter((m) => m.due <= now).length
}

export function weakestChapter(store: Store): ChapterCode {
  return [...ORDER].sort((a, b) => chapterScore(store, a) - chapterScore(store, b))[0]
}

export function nextCellId(id: CellId): CellId | null {
  const [code, n] = id.split('-')
  const i = parseInt(n, 10)
  if (i < 8) return `${code}-${i + 1}`
  const at = ORDER.indexOf(code as ChapterCode)
  return at < ORDER.length - 1 ? `${ORDER[at + 1]}-1` : null
}
