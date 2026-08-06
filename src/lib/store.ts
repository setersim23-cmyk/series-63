import { useCallback, useMemo, useRef, useState } from 'react'
import { STORAGE_KEY } from './config'
import type { CellId, CellProgress, Store } from '../types'

function empty(): Store {
  return { cells: {}, missed: {}, mocks: [], settings: { rate: 1, voice: null, text: 1, theme: 'dark' } }
}

/**
 * Whether this copy can actually keep progress between sessions.
 *
 * A page embedded in an iframe sandboxed without `allow-same-origin` runs on the
 * opaque origin `null`, where localStorage, sessionStorage and cookies all throw
 * SecurityError. Swallowing that quietly is worse than useless — the chart fills
 * in, the score climbs, and every bit of it is gone at the next launch. So the
 * probe runs once at load and the app says so when it fails.
 */
export const storageWorks: boolean = (() => {
  try {
    const probe = `${STORAGE_KEY}__probe`
    localStorage.setItem(probe, '1')
    const readBack = localStorage.getItem(probe)
    localStorage.removeItem(probe)
    return readBack === '1'
  } catch {
    return false
  }
})()

export function load(): Store {
  const base = empty()
  if (!storageWorks) return base
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Store>
      return {
        ...base,
        ...saved,
        settings: { ...base.settings, ...(saved.settings ?? {}) },
      }
    }
  } catch {
    /* corrupt payload — start clean rather than dying on load */
  }
  return base
}

function persist(store: Store) {
  if (!storageWorks) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* quota — this session's progress is still in memory */
  }
}

export interface Progress {
  store: Store
  /** Mutate the store in place and persist. Mirrors the prototype's mutable model. */
  update(fn: (store: Store) => void): void
  /** Touch a cell: create it if needed, apply the change, stamp `last`, persist. */
  touch(id: CellId, fn: (cell: CellProgress) => void): void
  replace(store: Store): void
}

export function useProgress(): Progress {
  const ref = useRef<Store | null>(null)
  if (ref.current === null) ref.current = load()
  const [, bump] = useState(0)

  const update = useCallback((fn: (store: Store) => void) => {
    fn(ref.current!)
    persist(ref.current!)
    bump((n) => n + 1)
  }, [])

  const touch = useCallback(
    (id: CellId, fn: (cell: CellProgress) => void) => {
      update((store) => {
        if (!store.cells[id]) store.cells[id] = { qa: [] }
        fn(store.cells[id])
        store.cells[id].last = Date.now()
      })
    },
    [update]
  )

  const replace = useCallback(
    (next: Store) => {
      update((store) => {
        Object.assign(store, empty(), next)
      })
    },
    [update]
  )

  return useMemo(
    () => ({ store: ref.current!, update, touch, replace }),
    // `store` is mutated in place; `bump` is what re-renders, so the identity is stable.
    [update, touch, replace]
  )
}

/** Base64 round-trip used by the progress transfer sheet. */
export function encodeProgress(store: Store): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(store))))
}

export function decodeProgress(code: string): Store {
  const parsed = JSON.parse(decodeURIComponent(escape(atob(code.trim())))) as Store
  if (!parsed || typeof parsed !== 'object' || !parsed.cells) throw new Error('not a progress code')
  return parsed
}
