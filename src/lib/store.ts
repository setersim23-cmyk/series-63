import { useCallback, useMemo, useRef, useState } from 'react'
import { STORAGE_KEY } from './config'
import type { CellId, CellProgress, Store } from '../types'

function empty(): Store {
  return { cells: {}, missed: {}, mocks: [], settings: { rate: 1, voice: null } }
}

export function load(): Store {
  const base = empty()
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
    /* corrupt or unavailable storage — start clean rather than dying on load */
  }
  return base
}

function persist(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* private mode / quota — progress still works for this session */
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
