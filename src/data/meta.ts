// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.
import type { ChapterCode } from '../types'

/** Exam weight (w), question count (q), the actor every rule in the chapter is about, and the chart hue. */
export interface ChapterMeta {
  name: string
  actor: string
  hue: number
  w: number
  q: number
}

export const META: Record<ChapterCode, ChapterMeta> = {
 "SEC": {
  "name": "Securities & Issuers",
  "actor": "THE INSTRUMENT",
  "hue": 150,
  "w": 9,
  "q": 5
 },
 "BDR": {
  "name": "Broker-Dealers",
  "actor": "THE FIRM",
  "hue": 265,
  "w": 12,
  "q": 7
 },
 "AGT": {
  "name": "Agents of Broker-Dealers",
  "actor": "THE INDIVIDUAL REP",
  "hue": 195,
  "w": 13,
  "q": 8
 },
 "IAD": {
  "name": "Investment Advisers",
  "actor": "THE ADVISORY FIRM",
  "hue": 330,
  "w": 5,
  "q": 3
 },
 "IAR": {
  "name": "Adviser Representatives",
  "actor": "THE ADVISORY INDIVIDUAL",
  "hue": 35,
  "w": 5,
  "q": 3
 },
 "COM": {
  "name": "Customer Communications",
  "actor": "THE PAPERWORK & THE PITCH",
  "hue": 220,
  "w": 20,
  "q": 12
 },
 "ETH": {
  "name": "Ethical Practices & Fraud",
  "actor": "THE CONDUCT ITSELF",
  "hue": 0,
  "w": 25,
  "q": 15
 },
 "REM": {
  "name": "Remedies & Administration",
  "actor": "THE ADMINISTRATOR",
  "hue": 85,
  "w": 11,
  "q": 7
 }
}
