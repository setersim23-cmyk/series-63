import { META } from '../data/meta'
import type { ChapterCode } from '../types'

/**
 * Every colour in the app is the chapter's hue at a given lightness/chroma —
 * that is what keys the text to the Harada chart.
 *
 * The lightness is written as the design drew it, on a near-black page, and
 * reflected by the stylesheet: --hue-dir is 1 on dark and -1 on light, where
 * --hue-base pivots it. These are the same colours in both themes, at the
 * lightness each page needs — a chapter's green stays that chapter's green.
 */
export const L = (l: number) => `calc(var(--hue-base) + var(--hue-dir) * ${l}%)`

export function hue(code: ChapterCode, l: number, c: number, a?: number): string {
  const h = META[code].hue
  return a != null ? `oklch(${L(l)} ${c} ${h} / ${a})` : `oklch(${L(l)} ${c} ${h})`
}

/** The chapter's signature colour, used for titles, bars and accents. */
export function chapterColor(code: ChapterCode): string {
  return hue(code, 75, 0.14)
}

export function codeOf(cellId: string): ChapterCode {
  return cellId.split('-')[0] as ChapterCode
}

export const GREEN = `oklch(${L(75)} 0.17 150)`
export const AMBER = `oklch(${L(80)} 0.14 85)`
export const RED = `oklch(${L(70)} 0.19 25)`
