// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.
import type { CellId } from '../types'

/** "Is this a security?"-style answer frameworks, one per chapter where the pattern lives. */
export interface Frame {
  head: string
  intro: string
  /** [the filter, what it resolves to] */
  bullets: [string, string][]
  tail: string
}

export const FRAMES: Record<CellId, Frame> = {
 "SEC-1": {
  "head": "\"Is this a security?\" — the answer framework",
  "intro": "Every question in this territory yields to the same three filters, run in order:",
  "bullets": [
   [
    "Does the instrument match a USA §401(m) enumerated category?",
    "Stock, bond, note, debenture, warrant, transferable share, voting-trust certificate, etc. → yes, it’s a security. Done."
   ],
   [
    "If it’s not enumerated, does it satisfy the Howey test?",
    "Investment of money + common enterprise + expectation of profits + derived from the efforts of others. All four prongs → investment contract → security."
   ],
   [
    "Is it specifically excluded?",
    "Fixed annuities, fixed insurance, commodity futures, physical commodities and collectibles held directly, bank deposit products, and direct real estate ownership are NOT securities."
   ]
  ],
  "tail": "The two patterns that pay: fixed vs. variable annuity (variable = security; fixed = insurance) and the orange grove / racehorse / oil well novelty question — run Howey, and four for four means security."
 },
 "BDR-2": {
  "head": "\"Must the FIRM register here?\" — the answer framework",
  "intro": "Run three filters, in order, for the state in the question:",
  "bullets": [
   [
    "Is it even a broker-dealer?",
    "Agents, issuers, and banks/savings institutions/trust companies are excluded from the definition entirely. Excluded means no registration analysis ever begins."
   ],
   [
    "Does it have a place of business in the state?",
    "Any office, or any location held out to the public. If yes → register. Full stop. Clients don’t matter."
   ],
   [
    "No office — who are the in-state clients?",
    "Exclusively institutions and other BDs → not a BD in that state. Existing clients temporarily present → snowbird rule. ONE resident retail customer → register."
   ]
  ],
  "tail": "The trap that pays: there is NO de minimis number for broker-dealers. The IA \"fewer than 6\" rule never applies to a firm effecting trades."
 },
 "AGT-1": {
  "head": "\"Is this individual an agent?\" — the five-filter walkthrough",
  "intro": "Run the filters in order; the first one that answers, answers:",
  "bullets": [
   [
    "Is it an individual?",
    "Firms are never agents. A \"person\" who is an entity is a BD, IA, or issuer — not an agent."
   ],
   [
    "Whom do they represent?",
    "A BD or an issuer. Representing no one in a securities transaction = not an agent."
   ],
   [
    "Are they effecting or attempting to effect trades?",
    "Taking orders, soliciting, discussing merits — yes. Purely clerical or ministerial work — no."
   ],
   [
    "Representing an ISSUER: does an escape hatch apply?",
    "Exempt securities · exempt transactions · sales to the issuer’s own employees/partners/directors with NO commission → not an agent."
   ],
   [
    "Representing a BD: no escape hatches exist.",
    "Selling even US Treasuries for a BD makes the individual an agent. The exempt-security escape belongs to issuer reps only."
   ]
  ],
  "tail": "The swap the exam loves: same person, same municipal bond — agent if the employer is a BD, not an agent if the employer is the issuer."
 },
 "IAD-1": {
  "head": "\"Is this an investment adviser?\" — the answer framework",
  "intro": "Three prongs, then two escape lists, then the dollar lines:",
  "bullets": [
   [
    "The ABC test — all three prongs required.",
    "Advice about securities + as a Business + for Compensation. Any economic benefit counts, direct or indirect."
   ],
   [
    "Excluded?",
    "LATE professionals (Lawyer, Accountant, Teacher, Engineer) with solely incidental advice and no special compensation · banks · BDs without special compensation · bona fide publishers · US-government-securities-only advisers."
   ],
   [
    "Special compensation kills every exclusion.",
    "A separate fee for the advice — a wrap fee, a planning fee — and the excluded person becomes an adviser."
   ],
   [
    "Then, where does the FIRM register?",
    "Under $100M AUM → state. $100–110M → choice. $110M+ → SEC (federal covered; states get a notice filing only). Below $90M → back to the states."
   ]
  ],
  "tail": "Advisers to registered investment companies are federal covered at ANY size — the exam plants small fund advisers to catch the AUM-only reflex."
 },
 "IAR-2": {
  "head": "\"Where does the HUMAN register?\" — the answer framework",
  "intro": "The IAR rule is the mirror image of the firm rule. Two questions:",
  "bullets": [
   [
    "Is the firm federal covered or state-registered?",
    "Federal covered firm → the FIRM only notice files, but its IAR registers with any state where the IAR has a place of business."
   ],
   [
    "Does the IAR have a place of business in the state?",
    "Office there → register there, always. No office → de minimis relief (fewer than 6 retail clients) usually applies."
   ]
  ],
  "tail": "Big firm, small filing; small human, real registration. If the stem says the IAR \"works from an office in State X,\" the answer almost always includes registering in X."
 },
 "COM-6": {
  "head": "\"Is the recommendation suitable?\" — the answer framework",
  "intro": "Two duties stack, in order:",
  "bullets": [
   [
    "Reasonable-basis suitability — know the SECURITY.",
    "The rep must understand the product’s risks and costs well enough to believe it could be suitable for someone."
   ],
   [
    "Customer-specific suitability — know the CUSTOMER.",
    "Objectives, time horizon, finances, tax status, risk tolerance from the profile. A suitable product for the wrong customer is still a violation."
   ],
   [
    "No profile?",
    "If the customer refuses financial information, the firm may accept unsolicited orders but recommendations become nearly impossible to justify."
   ]
  ],
  "tail": "Profit does not cure unsuitability and loss does not prove it — the violation is the mismatch at the time of the recommendation."
 },
 "ETH-1": {
  "head": "\"Fraud, prohibited practice, or permitted?\" — the answer framework",
  "intro": "Sort every conduct question into one of three buckets:",
  "bullets": [
   [
    "FRAUD (§101) — deception in connection with an offer, sale, or purchase.",
    "Untrue statements, misleading omissions of material fact, schemes to defraud. Applies to ANY person, ANY security, ANY transaction — no exemption ever reaches it."
   ],
   [
    "PROHIBITED PRACTICE — dishonest or unethical conduct without deception.",
    "Churning, unsuitable recommendations, borrowing from clients, selling away, guarantees against loss, commingling. Grounds for discipline even when no one was deceived."
   ],
   [
    "PERMITTED — the narrow carve-outs.",
    "Profit-sharing proportionate to contribution with dual written consent (BD agents only) · borrowing from a client that is a bank · discussing risk honestly."
   ]
  ],
  "tail": "When two answers both look \"wrong,\" pick the one involving deception — the exam grades fraud as the more serious and more specific answer."
 },
 "REM-3": {
  "head": "\"Can the Administrator do this?\" — the answer framework",
  "intro": "Three checks decide every powers question:",
  "bullets": [
   [
    "Discipline needs BOTH prongs.",
    "Public interest AND an enumerated cause (willful violation, 10-year felony/securities-misdemeanor lookback, insolvency, unethical practice). Either alone fails. Lack of experience alone NEVER qualifies."
   ],
   [
    "Only a COURT can…",
    "issue an injunction, appoint a receiver, or imprison anyone. The Administrator applies to the court for those."
   ],
   [
    "Everything else needs due process.",
    "Notice, opportunity for a hearing (within 15 days of written request), written findings — except a cease & desist, which may issue first and be heard later."
   ]
  ],
  "tail": "If an answer choice has the Administrator jailing, enjoining, or acting on \"public interest\" alone, it is wrong before you finish reading it."
 }
}
