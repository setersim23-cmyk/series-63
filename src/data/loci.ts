// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.
import type { ChapterCode } from '../types'

/** Method-of-loci rooms: one per chapter, eight spots each, in cell order. */
export interface Room {
  room: string
  /** [spot, the vivid image fixed there] */
  spots: [string, string][]
}

export const LOCI: Record<ChapterCode, Room> = {
 "SEC": {
  "room": "The Vault",
  "spots": [
   [
    "the vault door",
    "An orange tree grows straight through the door, dollar bills ripening on its branches — and someone ELSE picks them."
   ],
   [
    "the granite statue",
    "A granite statue of a fixed annuity holds an umbrella over the insurer. Anything where the ISSUER holds the risk stays outside the vault."
   ],
   [
    "the gift counter",
    "A box marked FREE snaps shut like a mousetrap — value moved with it, so the \"gift\" was a sale."
   ],
   [
    "the deposit boxes",
    "A shelf of passports pre-stamped EXEMPT — born exempt, they travel exempt through every trade, forever."
   ],
   [
    "the velvet rope",
    "A bouncer counts exactly TEN retail faces in twelve months. Institutions stroll past the rope uncounted."
   ],
   [
    "the security camera",
    "A federal eagle perches on the camera — Washington covers the security, but the state can still arrest anyone who lies about it."
   ],
   [
    "the three inner doors",
    "An express door wired to open the instant Washington’s does; a mail slot for notices; a heavy wheel only the keeper himself turns."
   ],
   [
    "the wall calendar",
    "The calendar burns itself after exactly ONE year — and the red STOP stamp beside it works only with notice, hearing, and written findings."
   ]
  ]
 },
 "BDR": {
  "room": "The Front Office",
  "spots": [
   [
    "the name plaque",
    "The entire BUILDING wears the name badge — in this room the firm is the person, never the human inside it."
   ],
   [
    "the guest list",
    "A guest list of banks and insurers only. ONE walk-in retail name and the whole list is shredded — there is no small number."
   ],
   [
    "the doormat",
    "A beach chair sits on the doormat — the vacationing existing client may still phone in. But hang an address in an ad, and you live here."
   ],
   [
    "the application tray",
    "Form BD in the tray, stapled to a notary’s consent that never expires and is never filed twice."
   ],
   [
    "the wall clock",
    "The clock strikes NOON on day 30; confetti drops every December 31; and a one-year shadow follows anyone out the door."
   ],
   [
    "the brass scale",
    "Gold bars outweigh a paper bond certificate — enough net capital and the bond vanishes. A federal line is etched where the scale must stop."
   ],
   [
    "the supply closet",
    "An auditor steps out of the closet unannounced — from any state, at any reasonable hour."
   ],
   [
    "the corner desk",
    "A maple-leaf desk in the corner, serving only the clients it brought from home and their retirement accounts."
   ]
  ]
 },
 "AGT": {
  "room": "The Sales Floor",
  "spots": [
   [
    "the headset rack",
    "ONE live human wearing a headset stands among mannequins — only individuals can be agents."
   ],
   [
    "the mannequin row",
    "The mannequins file papers and read stock quotes aloud — clerks who never take an order stay mannequins."
   ],
   [
    "the issuer’s booth",
    "THREE trapdoors under the issuer’s booth: exempt security, exempt transaction, employees-with-no-commission. The BD’s booth has no floor to fall through."
   ],
   [
    "the state map",
    "A pin drops on the map wherever the rep dials a RESIDENT — and every pin demands its own registration."
   ],
   [
    "the badge printer",
    "The U4 badge printer only runs while plugged into a registered firm’s socket."
   ],
   [
    "the leash",
    "A leash runs from the rep’s badge to the firm’s front door — suspend the firm and every leash goes slack at once."
   ],
   [
    "the exit turnstile",
    "THREE bells ring when a rep pushes through — the old firm, the new firm, and the rep must all tell the Administrator."
   ],
   [
    "the coat check",
    "A second paycheck hides inside a checked coat — outside business and outside accounts need the firm’s written nod first."
   ]
  ]
 },
 "IAD": {
  "room": "The Corner Suite",
  "spots": [
   [
    "the brass plate",
    "Three letters etched on the door: A·B·C — Advice, Business, Compensation. Lose any one letter and the plate comes down."
   ],
   [
    "the LATE lounge",
    "A Lawyer, an Accountant, a Teacher, and an Engineer doze on the couch — one SPECIAL FEE and they wake up as advisers."
   ],
   [
    "the side door",
    "A side door where a visitor with no office and five or fewer retail clients slips in unregistered."
   ],
   [
    "the dollar ruler",
    "A ruler on the desk marked 90 — 100 — 110 million. Cross 110 and Washington takes the file; the state keeps only a notice slot."
   ],
   [
    "the ADV binder",
    "A brochure thrust into a client’s hands 48 hours early — or at signing, with a 5-day escape hatch sewn in."
   ],
   [
    "the contract table",
    "Contracts signed in ink: fees, term, no assignment without consent — and the performance-fee drawer opens only for qualified clients."
   ],
   [
    "the safe",
    "Holding the CLIENT’s key to the safe is custody — higher net worth required, and a next-business-day confession if it dips."
   ],
   [
    "the file wall",
    "Files held five years; privacy notices drop into every client’s mailbox annually."
   ]
  ]
 },
 "IAR": {
  "room": "The Fiduciary’s Study",
  "spots": [
   [
    "the five portraits",
    "Five portraits over the fireplace: ADVISE, MANAGE, DECIDE, SOLICIT, SUPERVISE. Hang in any one frame and you are an IAR."
   ],
   [
    "the typist’s desk",
    "The typist retypes other people’s advice all day and never hangs on the wall — clerical hands stay clerical."
   ],
   [
    "the office globe",
    "A globe with a desk pinned to it: federal-covered firm? You register where YOUR desk sits. State firm? Wherever the firm is and you act."
   ],
   [
    "the visitor counter",
    "A counter by the door: no desk in the state and five or fewer retail visitors — the counter waves you through."
   ],
   [
    "the badge drawer",
    "A U4 badge issued through the firm, alive only while the firm is — noon on day 30, dead every December 31 unless renewed."
   ],
   [
    "the double mirror",
    "One face in the mirror wears TWO badges — agent and IAR at once, if the firms and the Administrator permit it."
   ],
   [
    "the balcony",
    "A supervisor watches every desk from the balcony — the firm answers for every human it registers."
   ],
   [
    "the exit ledger",
    "Names crossed out of the ledger still owe the room a full year of jurisdiction."
   ]
  ]
 },
 "COM": {
  "room": "The Mailroom",
  "spots": [
   [
    "the mail slot",
    "No envelope leaves without its disclosure sheet stapled on — costs, capacity, and conflicts ride with every confirmation."
   ],
   [
    "the rubber stamp",
    "A stamp that only ever says RECEIVED — never APPROVED. Claiming approval is itself the crime."
   ],
   [
    "the guarantee bin",
    "A shredder bolted over the bin eats every \"you can’t lose\" letter on arrival."
   ],
   [
    "the new-account desk",
    "A new-account form the CUSTOMER never signs — but a principal must, before the mail moves."
   ],
   [
    "the margin ledger",
    "A ruler snapped at 50% lies across the ledger, chained to a signed credit agreement and the hypothecation pledge."
   ],
   [
    "the options board",
    "A 15-day clock ticks over the options board — agreement signed or the account freezes; intrinsic and time value chalked beneath."
   ],
   [
    "the ad wall",
    "Every poster on the wall bears a principal’s initials — and the 26th retail reader tips a letter into \"retail communication.\""
   ],
   [
    "the records shelf",
    "Boxes of correspondence dated years back; January’s mailbag stuffed with privacy notices."
   ]
  ]
 },
 "ETH": {
  "room": "The Interrogation Room",
  "spots": [
   [
    "the three chairs",
    "Three chairs under the lamp — suitability, best interest, fiduciary — and the antifraud light shines on ALL of them, registered or not."
   ],
   [
    "the ticker tape",
    "Ticker tape loops through a washing machine while a vent whispers merger news — manipulation and inside tips both end in this room."
   ],
   [
    "the teller window",
    "A bank teller’s window painted on the wall — say WHICH side of the glass you’re on, and never blur the line."
   ],
   [
    "the butter churn",
    "A butter churn bolted to a client’s ledger, cranked for the commissions, not the client."
   ],
   [
    "the fund shelf",
    "Fund shares stacked exactly one dollar under the breakpoint — the shelf’s edge is where clients get cut."
   ],
   [
    "the firm’s bench",
    "Violations wearing the firm’s whole uniform sit on this bench — failure to supervise never fits a single badge."
   ],
   [
    "the badge board",
    "Individual sins pinned to individual badges — borrowing, guaranteeing, sharing, selling away."
   ],
   [
    "the wool blanket",
    "A blanket wrapped around a vulnerable adult, and a HOLD button wired beside the outgoing wire desk."
   ]
  ]
 },
 "REM": {
  "room": "The Judge’s Chambers",
  "spots": [
   [
    "the gavel",
    "The Administrator holds every tool in the room EXCEPT the gavel — jail, injunctions, and receivers belong to the court alone."
   ],
   [
    "the chamber door",
    "The door swings BOTH ways — jurisdiction lives where the offer left from AND where it landed."
   ],
   [
    "the subpoena drawer",
    "Subpoenas fly out of the drawer across state lines; pleading the Fifth here buys immunity, never silence."
   ],
   [
    "the order stack",
    "Three orders on the desk — cease-and-desist fires first and hears later; stop and summary orders owe prompt notice and a 15-day hearing."
   ],
   [
    "the hourglass",
    "An hourglass beside a two-item checklist: PUBLIC INTEREST plus an ENUMERATED CAUSE — flip one without the other and nothing moves."
   ],
   [
    "the calculator",
    "Price + interest + costs − income, against tender of the security; a 30-day acceptance window; the clock runs at the EARLIER of 3 years or 2-from-discovery."
   ],
   [
    "the cell door",
    "$5,000 / 3 years / 5-year clock stenciled on the bars — and appeals leave through the side door within 60 days, with no automatic stay."
   ],
   [
    "the umbrella stand",
    "An umbrella that covers exactly $500,000 per customer — but only half of it keeps cash dry."
   ]
  ]
 }
}
