import type { ChapterCode } from '../types'

export type PlanTarget =
  | { kind: 'chapter'; code: ChapterCode }
  | { kind: 'mock' }
  | { kind: 'view'; view: 'traps' | 'learn' | 'drill' }

export interface PlanDay {
  title: string
  detail: string
  target: PlanTarget
}

/** The eight-day run-up, keyed by `${month}-${date}`. */
export const PLAN: Record<string, PlanDay> = {
  '8-2': {
    title: 'SEC + BDR',
    detail: 'Read the vocabulary chapters. Mark every cell.',
    target: { kind: 'chapter', code: 'SEC' },
  },
  '8-3': {
    title: 'AGT + IAD',
    detail: 'Read Agents and Advisers. Teach back the exclusions out loud.',
    target: { kind: 'chapter', code: 'AGT' },
  },
  '8-4': {
    title: 'IAR + COM',
    detail: 'Read both. Don’t rush the account-paperwork matching.',
    target: { kind: 'chapter', code: 'IAR' },
  },
  '8-5': {
    title: 'ETH',
    detail: '15 questions come from here — give it the whole session.',
    target: { kind: 'chapter', code: 'ETH' },
  },
  '8-6': {
    title: 'REM + Mock #1',
    detail: 'Read Remedies, then first full timed mock. Log every miss.',
    target: { kind: 'mock' },
  },
  '8-7': {
    title: 'Trap day',
    detail: 'Re-read every ▲ trap and clear the missed queue.',
    target: { kind: 'view', view: 'traps' },
  },
  '8-8': {
    title: 'Mock #2 + weak cells',
    detail: 'Second timed mock, then only what the chart shows shaky.',
    target: { kind: 'mock' },
  },
  '8-9': {
    title: 'Memorize sheets',
    detail: 'Facts only. All studying ends at 9 PM. Standing rule.',
    target: { kind: 'view', view: 'learn' },
  },
}

export const FALLBACK_PLAN: PlanDay = {
  title: 'Review',
  detail: 'Work your weakest cells and the missed queue.',
  target: { kind: 'view', view: 'drill' },
}
