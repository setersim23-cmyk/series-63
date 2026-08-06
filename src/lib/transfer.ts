import type { CellProgress, Store } from '../types'

/**
 * Moving progress between the laptop and the phone.
 *
 * The payload has to fit in a QR code the phone's camera can read in one go.
 * A heavy week of study — every cell marked, thirty answers each, sixty queued
 * misses — is about 17 KB of JSON, which base64 alone would push past what any
 * QR can hold. Gzipped it comes to roughly 1.1 KB, so it fits with room to
 * spare.
 */

export interface Snapshot {
  /** When this snapshot was taken. */
  t: number
  s: Store
}

const enc = new TextEncoder()
const dec = new TextDecoder()

const canCompress = typeof CompressionStream !== 'undefined'

async function through(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  const reader = stream.getReader()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  const total = chunks.reduce((n, c) => n + c.length, 0)
  const out = new Uint8Array(total)
  let at = 0
  for (const c of chunks) {
    out.set(c, at)
    at += c.length
  }
  return out
}

const toBase64Url = (bytes: Uint8Array) => {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (s: string) => {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

/** Encodes progress as a compact, URL-safe string. `g` = gzipped, `r` = raw. */
export async function encodeSnapshot(store: Store): Promise<string> {
  // `shown` is question-rotation bookkeeping for this device, and it is bulky
  // relative to everything else worth carrying. Leave it behind.
  const { shown: _rotation, ...carried } = store
  const json = JSON.stringify({ t: Date.now(), s: carried } satisfies Snapshot)
  const bytes = enc.encode(json)
  if (!canCompress) return `r.${toBase64Url(bytes)}`
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))
  return `g.${toBase64Url(await through(stream))}`
}

export async function decodeSnapshot(payload: string): Promise<Snapshot> {
  const [kind, data] = [payload.slice(0, 1), payload.slice(2)]
  if (!data) throw new Error('empty payload')
  const bytes = fromBase64Url(data)
  let json: string
  if (kind === 'g') {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
    json = dec.decode(await through(stream))
  } else {
    json = dec.decode(bytes)
  }
  const parsed = JSON.parse(json) as Snapshot
  if (!parsed?.s?.cells) throw new Error('not a progress snapshot')
  return parsed
}

/** The link the QR encodes — opening it on the other device offers the transfer. */
export async function transferUrl(store: Store): Promise<string> {
  return `${location.origin}${import.meta.env.BASE_URL}#s=${await encodeSnapshot(store)}`
}

/**
 * Combines two devices' progress, per cell, keeping whichever was touched most
 * recently. A straight replace would quietly throw away whatever you did on the
 * other device since the last transfer; taking the newer of each cell cannot.
 *
 * Settings stay local — narration speed and voice belong to the device you are
 * holding, not to the snapshot.
 */
export function mergeProgress(local: Store, incoming: Store): Store {
  const cells: Record<string, CellProgress> = { ...local.cells }
  for (const id of Object.keys(incoming.cells)) {
    const mine = local.cells[id]
    const theirs = incoming.cells[id]
    if (!mine || (theirs.last ?? 0) > (mine.last ?? 0)) cells[id] = theirs
  }

  const missed = { ...local.missed }
  for (const key of Object.keys(incoming.missed)) {
    const mine = local.missed[key]
    const theirs = incoming.missed[key]
    // The later review date is the one that reflects the more recent answer.
    if (!mine || theirs.due > mine.due) missed[key] = theirs
  }

  const byTs = new Map(local.mocks.map((m) => [m.ts, m]))
  for (const m of incoming.mocks) byTs.set(m.ts, m)

  return {
    cells,
    missed,
    mocks: [...byTs.values()].sort((a, b) => a.ts - b.ts),
    settings: local.settings,
    shown: local.shown,
  }
}

/** A plain-English summary of what a snapshot would bring in. */
export function describeSnapshot(local: Store, snap: Snapshot) {
  const merged = mergeProgress(local, snap.s)
  const newCells = Object.keys(snap.s.cells).filter((id) => {
    const mine = local.cells[id]
    return !mine || (snap.s.cells[id].last ?? 0) > (mine.last ?? 0)
  }).length
  const newMocks = merged.mocks.length - local.mocks.length
  const minutes = Math.max(0, Math.round((Date.now() - snap.t) / 60000))
  const age =
    minutes < 1 ? 'just now' : minutes < 60 ? `${minutes} min ago` : `${Math.round(minutes / 60)} h ago`
  return { newCells, newMocks, age, merged }
}
