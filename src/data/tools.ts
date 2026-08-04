// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.
import type { CellId } from '../types'

export interface SorterItem {
  t: string
  /** Index of the bucket this belongs in. */
  b: number
  why: string
}

export interface Sorter {
  title: string
  hint: string
  buckets: string[]
  items: SorterItem[]
}

export interface Timeline {
  title: string
  hint: string
  /** Events in the order the Act requires them. */
  events: string[]
}

export interface WalkScenario {
  s: string
  agent: boolean
  why: string
}

export interface FiveFilterWalk {
  title: string
  scenarios: WalkScenario[]
}

/** Which interactive tool is embedded in which cell. */
export const TOOLMAP: Record<CellId, string> = {
 "SEC-2": "sorter-sec",
 "ETH-1": "sorter-eth",
 "AGT-1": "walk",
 "REM-4": "timeline",
 "REM-6": "calc"
}

export const SORTERS: Record<string, Sorter> = {
 "sorter-sec": {
  "title": "Sort it: security or not?",
  "hint": "Tap an item, then tap the bucket it belongs in.",
  "buckets": [
   "SECURITY",
   "NOT A SECURITY"
  ],
  "items": [
   {
    "t": "Variable annuity",
    "b": 0,
    "why": "Holder bears the market risk — separate-account security."
   },
   {
    "t": "Fixed annuity",
    "b": 1,
    "why": "Insurer guarantees the rate and holds the risk — insurance."
   },
   {
    "t": "Whiskey warehouse receipt",
    "b": 0,
    "why": "Investment contract under Howey — profits from the promoter’s efforts."
   },
   {
    "t": "Commodity futures contract",
    "b": 1,
    "why": "Futures are excluded; an OPTION on a commodity future is a security."
   },
   {
    "t": "Bank CD at an insured bank",
    "b": 1,
    "why": "Deposit products are excluded."
   },
   {
    "t": "Limited partnership interest",
    "b": 0,
    "why": "Passive investors relying on the GP — enumerated and Howey-positive."
   },
   {
    "t": "Condo bought with a rental-management contract",
    "b": 0,
    "why": "The original Howey pattern: real estate + passive income arrangement."
   },
   {
    "t": "Gold coins held in a home safe",
    "b": 1,
    "why": "Physical commodities held directly are excluded."
   },
   {
    "t": "Preorganization certificate",
    "b": 0,
    "why": "Enumerated in §401 — a security even before the company exists."
   },
   {
    "t": "IRA account itself",
    "b": 1,
    "why": "The plan is not a security; the investments inside it may be."
   }
  ]
 },
 "sorter-eth": {
  "title": "Sort it: fraud, prohibited, or permitted?",
  "hint": "Tap an item, then tap a bucket. Deception = fraud; dishonest-but-not-deceptive = prohibited.",
  "buckets": [
   "FRAUD",
   "PROHIBITED",
   "PERMITTED"
  ],
  "items": [
   {
    "t": "\"This fund is government-guaranteed\" (it isn’t)",
    "b": 0,
    "why": "An untrue statement of material fact in a sale — §101 fraud."
   },
   {
    "t": "Omitting a pending lawsuit the issuer faces",
    "b": 0,
    "why": "A misleading omission of material fact is fraud, intent or not."
   },
   {
    "t": "Trading a client’s account daily to hit commission targets",
    "b": 1,
    "why": "Churning — dishonest practice, no deception required."
   },
   {
    "t": "Borrowing $5,000 from a retail client",
    "b": 1,
    "why": "Prohibited unless the client is in the lending business."
   },
   {
    "t": "Sharing profits proportionately with dual written consent (BD agent)",
    "b": 2,
    "why": "The one blessed sharing arrangement — never for IARs."
   },
   {
    "t": "Marking a solicited order \"unsolicited\"",
    "b": 0,
    "why": "Falsifying the books to disguise conduct — fraud on the records."
   },
   {
    "t": "Guaranteeing a client against loss",
    "b": 1,
    "why": "Always prohibited, even in writing, even if honored."
   },
   {
    "t": "Telling a client an aggressive fund could lose value",
    "b": 2,
    "why": "Honest risk disclosure is the job, not a violation."
   }
  ]
 }
}

export const TIMELINE: Timeline = {
 "title": "Put the administrative action in order",
 "hint": "Tap the events in the order the Act requires them.",
 "events": [
  "Administrator suspects a violation and opens an investigation (public or private)",
  "Subpoenas records and testimony — in or out of state",
  "Summarily suspends the registration pending determination, with prompt notice",
  "Registrant files a written request for a hearing",
  "Hearing is held within 15 days of the written request",
  "Final order entered with written findings of fact and conclusions of law",
  "Registrant petitions the court for review — within 60 days, no automatic stay"
 ]
}

export const WALK: FiveFilterWalk = {
 "title": "The five-filter walkthrough — call it: agent or not?",
 "scenarios": [
  {
   "s": "A receptionist at a BD quotes the current price of a stock to a caller, then transfers the call.",
   "agent": false,
   "why": "Filter 3: quoting a price without taking an order or urging a trade is ministerial. She crossed no line — yet."
  },
  {
   "s": "The same receptionist, rep out sick, accepts the caller’s order to sell 200 shares.",
   "agent": true,
   "why": "Filter 3: accepting an order IS effecting a transaction. Clerical status evaporated the moment she took it."
  },
  {
   "s": "An individual sells City of Tucson bonds to the public on behalf of a broker-dealer.",
   "agent": true,
   "why": "Filter 5: representing a BD has no exempt-security escape. Munis or not, she must register."
  },
  {
   "s": "An individual sells the same Tucson bonds for the CITY itself.",
   "agent": false,
   "why": "Filter 4: representing the ISSUER of an exempt security — excluded from the agent definition."
  },
  {
   "s": "A startup’s HR director explains the employee stock-purchase plan to staff; she is paid salary only.",
   "agent": false,
   "why": "Filter 4: issuer rep, selling to the issuer’s own employees, no commission — the third escape hatch."
  },
  {
   "s": "The same HR director gets a $50 bonus per employee she signs up.",
   "agent": true,
   "why": "Filter 4 fails: commission-like compensation kills the employee-sales escape. She registers."
  }
 ]
}
