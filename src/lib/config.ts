/**
 * Settings that were editor props in the design prototype. They are read at
 * render time, so overriding them in the console (or a future settings screen)
 * takes effect immediately.
 */

/** Exam date & time. */
export const EXAM_DATE = '2026-08-10T09:00:00-04:00'

/** The white tick on the readiness ring — the score you are aiming to hold. */
export const PASS_TARGET = 90

/** Timed mock: 60 scored questions, 75 minutes, 43 to pass. */
export const MOCK_MINUTES = 75
export const MOCK_PASS = 43

/** localStorage key. Kept identical to the prototype so existing progress survives. */
export const STORAGE_KEY = 's63_coach'
