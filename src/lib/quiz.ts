import { QBANK } from '../content/questions'
import { META } from '../data/meta'
import { MOCK_MINUTES } from './config'
import { cellScore } from './scoring'
import type { Progress } from './store'
import { ORDER } from '../types'
import type { CellId, ChapterCode, Store } from '../types'

export type QuizMode = 'quick' | 'missed' | 'hard' | 'mock' | 'chapter' | 'cell'

export interface Session {
  mode: QuizMode
  /** Indices into QBANK. */
  qs: number[]
  i: number
  chosen: number | null
  answers: boolean[]
  start: number
  /** Deadline for the timed mock, else null. */
  end: number | null
}

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const indicesWhere = (fn: (q: (typeof QBANK)[number]) => boolean) =>
  QBANK.map((q, i) => ({ q, i }))
    .filter((x) => fn(x.q))
    .map((x) => x.i)

/**
 * Takes `n` from a pool, least-recently-seen first.
 *
 * A pure shuffle means the second mock repeats about a third of the first one,
 * which reads as a smaller bank than it is. Shuffling *before* the sort keeps
 * the order random among questions with the same timestamp — and everything you
 * have never been asked shares timestamp zero — so an untouched bank is still
 * fully random, while a second sitting works through the rest of it first.
 */
function rotate(store: Store, pool: number[], n: number): number[] {
  const shown = store.shown ?? {}
  return shuffle(pool)
    .sort((a, b) => (shown[a] ?? 0) - (shown[b] ?? 0))
    .slice(0, n)
}

/** Stamps the questions a session served, so the next one reaches past them. */
export function markShown(store: Store, qs: number[]) {
  const shown = (store.shown ??= {})
  const now = Date.now()
  for (const qi of qs) shown[qi] = now
}

/** Picks the questions for a session, or null when there is nothing to ask. */
export function buildSession(
  store: Store,
  mode: QuizMode,
  filter?: ChapterCode | CellId
): Session | null {
  let qs: number[] = []

  if (mode === 'missed') {
    const now = Date.now()
    qs = Object.keys(store.missed)
      .filter((k) => store.missed[k].due <= now)
      .map(Number)
      .slice(0, 15)
  } else if (mode === 'mock') {
    for (const code of ORDER) {
      qs.push(...rotate(store, indicesWhere((q) => q.c.startsWith(`${code}-`)), META[code].q))
    }
    shuffle(qs)
  } else if (mode === 'chapter' || mode === 'cell') {
    if (!filter) return null
    const pool = indicesWhere((q) => (filter.length <= 3 ? q.c.startsWith(`${filter}-`) : q.c === filter))
    qs = shuffle(rotate(store, pool, 16))
  } else if (mode === 'hard') {
    qs = shuffle(indicesWhere((q) => !!q.h))
  } else {
    // Adaptive Quick 10 — weakest cells first, with enough jitter to stay varied.
    const scored = QBANK.map((q, i) => ({ i, s: cellScore(store, q.c) + Math.random() * 25 }))
    scored.sort((a, b) => a.s - b.s)
    qs = shuffle(scored.slice(0, 10).map((x) => x.i))
  }

  if (!qs.length) return null
  return {
    mode,
    qs,
    i: 0,
    chosen: null,
    answers: [],
    start: Date.now(),
    end: mode === 'mock' ? Date.now() + MOCK_MINUTES * 60000 : null,
  }
}

/** Spaced repetition: a miss returns in 3h, then 12h, 24h, 48h before it retires. */
const INTERVALS_HOURS = [12, 24, 48]

/** Writes one answer to the cell's history and to the missed queue, then saves. */
export function recordAnswer(progress: Progress, qi: number, ok: boolean) {
  const q = QBANK[qi]
  progress.update((store) => {
    const cell = (store.cells[q.c] ??= { qa: [] })
    cell.qa = cell.qa ?? []
    cell.qa.push(ok)
    if (cell.qa.length > 30) cell.qa = cell.qa.slice(-30)
    cell.last = Date.now()

    const missed = store.missed
    if (!ok) {
      missed[qi] = { due: Date.now() + 3 * 3600000, streak: 0 }
    } else if (missed[qi]) {
      const streak = missed[qi].streak + 1
      if (streak >= 3) delete missed[qi]
      else missed[qi] = { due: Date.now() + INTERVALS_HOURS[streak - 1] * 3600000, streak }
    }
  })
}
