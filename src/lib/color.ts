import { META } from '../data/meta'
import type { ChapterCode } from '../types'

/**
 * Every colour in the app is the chapter's hue at a given lightness/chroma —
 * that is what keys the text to the Harada chart.
 */
export function hue(code: ChapterCode, l: number, c: number, a?: number): string {
  const h = META[code].hue
  return a != null ? `oklch(${l}% ${c} ${h} / ${a})` : `oklch(${l}% ${c} ${h})`
}

/** The chapter's signature colour, used for titles, bars and accents. */
export function chapterColor(code: ChapterCode): string {
  return hue(code, 75, 0.14)
}

export function codeOf(cellId: string): ChapterCode {
  return cellId.split('-')[0] as ChapterCode
}

export const GREEN = 'oklch(75% 0.17 150)'
export const AMBER = 'oklch(80% 0.14 85)'
export const RED = 'oklch(70% 0.19 25)'
