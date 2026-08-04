// Generated from project/content/authorities.js by scripts/convert-content.mjs — do not hand-edit.
import type { Authorities } from '../types'

export const AUTH: Authorities = {
 "intro": "Every authority on this exam sits in one of six layers. The layers have different reach, different enforcers, and different relationships to each other — and identifying the layer first answers half the Remedies questions on its own.",
 "layerRule": "When a stem asks WHO can do something — fine, bar, enjoin, require registration — find the layer. The Administrator can do everything Part IV of the state statute grants and nothing else. FINRA binds only its members, by contract. Only a court can enjoin, imprison, or grant immunity.",
 "layers": [
  {
   "id": "fed",
   "name": "Federal statute",
   "sub": "Acts of Congress",
   "hue": 220,
   "desc": "They create the SEC, define the federal perimeter, and set the outer limit of what a state may do.",
   "items": [
    {
     "n": "Securities Act of 1933",
     "s": "Registration and disclosure for new offerings",
     "w": "§5 — the three offering periods. §17(a) — fraud in the offer or sale. §18(b) — the definition of a covered security, which is where federal covered status actually comes from. §134 — tombstone advertisements.",
     "cells": [
      "SEC-6",
      "COM-7"
     ]
    },
    {
     "n": "Securities Exchange Act of 1934",
     "s": "Secondary markets; creates the SEC",
     "w": "§10(b) — the antifraud authority Rule 10b-5 was written under. §15 — broker-dealer registration. §28(e) — the soft dollar safe harbor. §3(a)(4) and (5) — the split broker and dealer definitions the state act fuses into one. §3(a)(39) — statutory disqualification.",
     "cells": [
      "BDR-1",
      "ETH-8"
     ]
    },
    {
     "n": "Investment Advisers Act of 1940",
     "s": "Federal regulation of advisers",
     "w": "§202(a)(11) — the adviser definition and its exclusions. §203 — registration. §203A — the federal-state division NSMIA drew. §205 — advisory contracts and the performance fee prohibition. §206 — antifraud, including §206(3) principal and agency-cross trades.",
     "cells": [
      "IAD-1",
      "IAD-4",
      "IAD-6"
     ]
    },
    {
     "n": "Investment Company Act of 1940",
     "s": "Regulation of pooled vehicles",
     "w": "Supplies the term \"registered investment company\" — which is what makes fund shares federal covered, and what makes an adviser to a fund federal covered at ANY size.",
     "cells": [
      "SEC-6",
      "IAD-4"
     ]
    },
    {
     "n": "NSMIA (1996)",
     "s": "National Securities Markets Improvement Act",
     "w": "Not a statute you cite — an AMENDING act. It rewrote Securities Act §18 and added Advisers Act §203A. Everything you know about preemption traces to those two amendments.",
     "cells": [
      "SEC-6",
      "IAD-4"
     ]
    },
    {
     "n": "SIPA (1970)",
     "s": "Securities Investor Protection Act",
     "w": "Creates SIPC. Insolvency protection for customers of a failed broker-dealer — $500,000 per customer, max $250,000 cash.",
     "cells": [
      "REM-8"
     ]
    },
    {
     "n": "Dodd-Frank (2010)",
     "s": "Wall Street Reform Act",
     "w": "Raised the adviser registration threshold and created the mid-sized adviser category — the reason the $90M / $100M / $110M structure exists at all.",
     "cells": [
      "IAD-4"
     ]
    },
    {
     "n": "SLUSA (1998)",
     "s": "Securities Litigation Uniform Standards Act",
     "w": "Constrains state-law class actions in covered securities. Named in §410 as a limit on the civil remedy.",
     "cells": [
      "REM-6"
     ]
    }
   ]
  },
  {
   "id": "secr",
   "name": "SEC rules",
   "sub": "Adopted under the federal statutes",
   "hue": 190,
   "desc": "Cited by number, not section: 10b-5, 15c3-1, 206(4)-2. A rule can never exceed the statute it was written under — every SEC rule traces back to a parent act.",
   "items": [
    {
     "n": "Rule 10b-5",
     "s": "Under Exchange Act §10(b)",
     "w": "The federal antifraud rule. Insider trading and manipulation liability run through it.",
     "cells": [
      "ETH-2"
     ]
    },
    {
     "n": "Rule 15l-1 — Regulation Best Interest",
     "s": "The BD recommendation standard",
     "w": "The four obligations a broker-dealer owes at a recommendation to a retail customer: care, disclosure, conflict of interest, compliance.",
     "cells": [
      "ETH-1"
     ]
    },
    {
     "n": "Rules 15c3-1 & 15c3-3",
     "s": "Net capital · customer protection",
     "w": "Federal financial requirements. Relevant to the 63 chiefly as the CEILING a state may not exceed — not for their dollar amounts.",
     "cells": [
      "BDR-6"
     ]
    },
    {
     "n": "Rules 17a-3 & 17a-4",
     "s": "Books and records",
     "w": "What a broker-dealer must make, and how long it must keep it.",
     "cells": [
      "COM-8"
     ]
    },
    {
     "n": "Regulation S-P",
     "s": "Privacy of consumer financial information",
     "w": "Initial and annual privacy notices, the opt-out right, and the safeguards requirement.",
     "cells": [
      "COM-8",
      "IAD-8"
     ]
    },
    {
     "n": "Rule 204A-1",
     "s": "Code of ethics",
     "w": "Personal trading reports and pre-clearance for advisers.",
     "cells": [
      "ETH-1"
     ]
    },
    {
     "n": "Rule 205-3",
     "s": "Qualified client",
     "w": "The exception permitting performance fees — $1.4M under management or $2.7M net worth (thresholds from June 29, 2026).",
     "cells": [
      "IAD-6"
     ]
    },
    {
     "n": "Rule 206(3)-2",
     "s": "Agency cross transactions",
     "w": "The reliable authority behind the agency-cross conditions (written disclosure and consent). The state hook is NASAA’s unethical-practices rule.",
     "cells": [
      "ETH-8"
     ]
    },
    {
     "n": "Rule 206(4)-2",
     "s": "Custody",
     "w": "Qualified custodian, quarterly statements, surprise examination.",
     "cells": [
      "IAD-7"
     ]
    },
    {
     "n": "Rule 206(4)-5",
     "s": "Pay-to-play",
     "w": "The two-year time-out and the $350 / $150 de minimis contribution limits.",
     "cells": [
      "ETH-8"
     ]
    },
    {
     "n": "Rule 203A-1",
     "s": "Eligibility for SEC registration",
     "w": "The $90M / $100M / $110M buffer mechanics.",
     "cells": [
      "IAD-4"
     ]
    },
    {
     "n": "Regulation D — Rules 504 & 506",
     "s": "Private offering safe harbors",
     "w": "Rule 506 offerings are federal covered; Rule 504 offerings are NOT. Rule 505 was repealed in 2016 — treat it as a distractor.",
     "cells": [
      "SEC-6"
     ]
    }
   ]
  },
  {
   "id": "nsmia",
   "line": true,
   "name": "THE NSMIA LINE",
   "desc": "Not a layer — a horizontal cut through the whole structure. Above the line, federal law occupies the field: federal covered advisers and securities owe states only notice filings and fees. Below it, state law governs fully. Antifraud authority passes through the line untouched, in both directions. The single most consequential thing on this map."
  },
  {
   "id": "state",
   "name": "State statute — the Uniform Securities Act",
   "sub": "NASAA-amended 1956 text — the version the exam is written from",
   "hue": 150,
   "desc": "Four parts: conduct, persons, securities, general provisions. This is the body of law the exam is actually about. (Your state’s real blue-sky numbering, and the 2002 revision, will NOT match — stay inside the NASAA-amended numbering.)",
   "parts": [
    {
     "p": "PART I — FRAUDULENT AND OTHER PROHIBITED PRACTICES",
     "items": [
      {
       "n": "§101 — Sales and purchases",
       "s": "THE antifraud provision",
       "w": "Unlawful, in connection with the offer, sale, or purchase of ANY security, to defraud, to misstate or omit a material fact, or to engage in any practice operating as a fraud. Applies to everyone and everything, always — no exemption reaches it.",
       "cells": [
        "ETH-1"
       ]
      },
      {
       "n": "§102 — Advisory activities",
       "s": "The adviser-conduct spine",
       "w": "Five subsections: (a) dishonest or unethical conduct · (b) solicitation of clients · (c) investment advisory contracts · (d) compensation · (e) custody of client funds and securities.",
       "cells": [
        "ETH-1",
        "IAD-6",
        "IAD-7"
       ]
      }
     ]
    },
    {
     "p": "PART II — REGISTRATION OF PERSONS",
     "items": [
      {
       "n": "§201 — Registration requirement",
       "s": "Who must register",
       "w": "(a) broker-dealers and agents · (c) investment advisers · (d) IARs. The de minimis exemption lives across §§201(c), 201(d), 401(f) and 401(g) — which is why it reads as both a registration rule and a definitional one.",
       "cells": [
        "BDR-1",
        "AGT-1",
        "IAD-3"
       ]
      },
      {
       "n": "§202 — Registration procedure",
       "s": "How a person registers",
       "w": "(a) application and effective date — NOON ON THE 30TH DAY · (b) federal covered adviser notice filing · (c) registration fee · (d) successor firm · (e) minimum capital · (f) surety bonds and minimum financial requirements.",
       "cells": [
        "BDR-4",
        "BDR-5",
        "BDR-6"
       ]
      },
      {
       "n": "§203 — Post-registration provisions",
       "s": "What registrants must keep doing",
       "w": "(a) books and accounts · (b) information to be furnished · (c) financial reports · (d) corrections and amendments · (e) inspection power — any reasonable time, in or out of state, no notice.",
       "cells": [
        "BDR-7"
       ]
      },
      {
       "n": "§204 — Denial, suspension, revocation, cancellation, withdrawal",
       "s": "The discipline section for persons",
       "w": "Grounds, the public-interest-PLUS-cause requirement, due process, and the non-punitive endings (cancellation, withdrawal). Sub-letters vary between printings — cite §204 and stop.",
       "cells": [
        "AGT-7",
        "REM-5"
       ]
      }
     ]
    },
    {
     "p": "PART III — REGISTRATION OF SECURITIES",
     "items": [
      {
       "n": "§301 — Registration requirement",
       "s": "The hinge Part III swings on",
       "w": "Unlawful to offer or sell any security in the state unless it is registered, federal covered, or exempt.",
       "cells": [
        "SEC-4",
        "SEC-5"
       ]
      },
      {
       "n": "§302 — Registration by notification (filing)",
       "s": "The streamlined path",
       "w": "For seasoned issuers with an earnings history. Rarely used today — but a live distractor. (The federal covered SECURITY notice filing is a different thing and sits elsewhere in Part III; the ADVISER notice filing is §202(b).)",
       "cells": [
        "SEC-7"
       ]
      },
      {
       "n": "§303 — Registration by coordination",
       "s": "Rides on the SEC filing",
       "w": "For securities registering concurrently with the SEC. State effectiveness happens automatically at the same moment as federal effectiveness.",
       "cells": [
        "SEC-7"
       ]
      },
      {
       "n": "§304 — Registration by qualification",
       "s": "Everything else",
       "w": "Full state review, including intrastate offerings that never go to the SEC. The Administrator affirmatively declares effectiveness — no automatic mechanism.",
       "cells": [
        "SEC-7"
       ]
      },
      {
       "n": "§305 — General registration provisions",
       "s": "Housekeeping for all methods",
       "w": "Who may file, the ONE-YEAR effective period, escrow and impound conditions, required prospectus delivery, and quarterly progress reports.",
       "cells": [
        "SEC-8"
       ]
      },
      {
       "n": "§306 — Stop orders",
       "s": "Denial, suspension, revocation of a securities registration",
       "w": "Grounds, notice, hearing, written findings — and the thirty-day limit on acting off facts known at effectiveness.",
       "cells": [
        "SEC-8"
       ]
      }
     ]
    },
    {
     "p": "PART IV — GENERAL PROVISIONS",
     "items": [
      {
       "n": "§401 — Definitions",
       "s": "Half the exam wearing a costume",
       "w": "(b) agent · (c) broker-dealer · (c1) federal covered adviser · (c2) federal covered security · (d) fraud · (e) guaranteed · (f) investment adviser · (g) IAR · (k) sale and offer · (m) security. The (c1)/(c2) bolt-ons exist because NASAA inserted the new definitions after (c) rather than renumbering.",
       "cells": [
        "SEC-1",
        "BDR-1",
        "AGT-1",
        "IAD-1"
       ]
      },
      {
       "n": "§402 — Exemptions",
       "s": "The two escape lists",
       "w": "(a) exempt securities · (b) exempt transactions. Exemption is a Part IV concept, deliberately separated from the Part III registration machinery it excuses. Includes the MANUAL exemption — a non-issuer trade in a security whose issuer appears in a recognized securities manual.",
       "cells": [
        "SEC-4",
        "SEC-5"
       ]
      },
      {
       "n": "§403 — Sales and advertising literature",
       "s": "The state advertising-filing rule",
       "w": "Prospectuses, pamphlets, circulars, form letters and advertising for registered securities must be filed with the Administrator — not for exempt or federal covered securities.",
       "cells": [
        "BDR-7",
        "COM-7"
       ]
      },
      {
       "n": "§404 — Misleading filings",
       "s": "Lying to the Administrator",
       "w": "Unlawful to make an untrue statement of material fact in any document filed with the Administrator, or in any proceeding.",
       "cells": [
        "REM-3"
       ]
      },
      {
       "n": "§405 — Unlawful representations",
       "s": "\"Registration is not approval\"",
       "w": "Neither registration nor an exemption means the Administrator has passed on the merits — and representing otherwise is unlawful. The statutory home of a whole exam cell.",
       "cells": [
        "COM-2"
       ]
      },
      {
       "n": "§406 — Administration of the Act",
       "s": "The Administrator’s office",
       "w": "Creates and empowers the office; bars using confidential information for personal gain.",
       "cells": [
        "REM-1"
       ]
      },
      {
       "n": "§407 — Investigations and subpoenas",
       "s": "Investigative authority",
       "w": "Investigations in or out of state, public or private; subpoenas for witnesses and documents, enforced through a court; compelled testimony carries use immunity.",
       "cells": [
        "REM-3"
       ]
      },
      {
       "n": "§408 — Prohibitory orders and injunctions",
       "s": "Both remedies, one section",
       "w": "Exactly why the distinction is tested: the Administrator issues the prohibitory (cease-and-desist) order ITSELF, but must go to COURT for the injunction or a receiver.",
       "cells": [
        "REM-4"
       ]
      },
      {
       "n": "§409 — Criminal penalties",
       "s": "The prosecutor’s section",
       "w": "$5,000, three years, or both, per willful violation; 5-year limitations period. The prosecuting authority is a prosecutor — the Administrator refers.",
       "cells": [
        "REM-7"
       ]
      },
      {
       "n": "§410 — Civil liabilities",
       "s": "The rescission section",
       "w": "Ten subsections in order: registration/fraud violation liability · adviser and IAR liabilities · (c) persons liable · tender · survivability · statute of limitations (earlier of 3 years or 2-from-discovery) · (g) offers to rescind (30 days) · illegal contracts unenforceable · waivers void · existing remedies saved.",
       "cells": [
        "REM-6"
       ]
      },
      {
       "n": "§411 — Judicial review of orders",
       "s": "The appeal route",
       "w": "Petition within SIXTY days; filing does not stay the order — a stay must be separately requested.",
       "cells": [
        "REM-7"
       ]
      },
      {
       "n": "§412 — Rules, forms, orders and hearings",
       "s": "Rulemaking power and its limits",
       "w": "Includes the GOOD-FAITH RELIANCE defense — protecting a person who acted on a rule or order later amended or held invalid.",
       "cells": [
        "REM-1"
       ]
      },
      {
       "n": "§413 — Administrative files and opinions",
       "s": "The public register",
       "w": "Public register of filings and orders; interpretive opinions. NOT the Administrator’s office — that is §406.",
       "cells": [
        "REM-1"
       ]
      },
      {
       "n": "§414 — Scope of the Act and service of process",
       "s": "Jurisdiction",
       "w": "Where an offer is made, where it is accepted, where acceptance is communicated — plus the publication/broadcast exclusions and the consent to service of process (filed once, irrevocable).",
       "cells": [
        "REM-2",
        "BDR-4"
       ]
      },
      {
       "n": "§415 — Statutory policy",
       "s": "The interpretive thumb on the scale",
       "w": "Directs that the Act be construed to coordinate with federal securities law and make state regulation uniform — the reasoning behind every preemption answer.",
       "cells": [
        "REM-1"
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "nasaa",
   "name": "NASAA",
   "sub": "Model rules, statements of policy, model acts",
   "hue": 35,
   "desc": "NASAA is a voluntary association of state regulators, not a government body. Its products bind only where a state adopts them — but the exam treats them as law everywhere.",
   "items": [
    {
     "n": "Model Rule 102(a)(4)-1",
     "s": "Unethical practices of IAs and IARs",
     "w": "The enumerated list of adviser misconduct. Named by NASAA as testable.",
     "cells": [
      "ETH-1",
      "ETH-7"
     ]
    },
    {
     "n": "Model Rule 102(e)(1)-1",
     "s": "Custody requirements for advisers",
     "w": "Including the three-business-day trigger for inadvertent receipt of third-party checks, and the Administrator’s power to prohibit custody outright.",
     "cells": [
      "IAD-7"
     ]
    },
    {
     "n": "Model Rule 202(d)-1",
     "s": "Minimum financial requirements",
     "w": "$35,000 net worth with custody · $10,000 with discretion · the notification and reporting sequence · the bond-in-lieu rounding.",
     "cells": [
      "IAD-7"
     ]
    },
    {
     "n": "Model Rule 203(a)-2",
     "s": "Adviser recordkeeping",
     "w": "Five years, the first two in the principal office.",
     "cells": [
      "IAD-8"
     ]
    },
    {
     "n": "Model Rule 502(c)",
     "s": "Contents of an advisory contract",
     "w": "In writing; services, term, fee and formula, prepaid-fee refund, discretion, no assignment without consent, partnership membership notice.",
     "cells": [
      "IAD-6"
     ]
    },
    {
     "n": "Model Rule 202(a)-2",
     "s": "IAR registration requirements",
     "w": "Place of business as the trigger; the de minimis exemption.",
     "cells": [
      "IAR-3",
      "IAR-4"
     ]
    },
    {
     "n": "SoP — Dishonest or Unethical Business Practices",
     "s": "BDs and agents",
     "w": "The enumerated catalogue of firm-level and agent-level misconduct. The backbone of the largest chapter on the exam.",
     "cells": [
      "ETH-4",
      "ETH-5",
      "ETH-6",
      "ETH-7"
     ]
    },
    {
     "n": "SoP — Investment company shares",
     "s": "Mutual fund sales practices",
     "w": "Breakpoint sales, letters of intent, share-class abuse, switching, selling dividends.",
     "cells": [
      "ETH-5"
     ]
    },
    {
     "n": "Rules for Sales at Financial Institutions (1998)",
     "s": "Bank-premises sales",
     "w": "The four disclosures (not FDIC insured · not a deposit · not guaranteed by the bank · may lose value), physical separation, signage, complaint procedures.",
     "cells": [
      "ETH-3"
     ]
    },
    {
     "n": "Model Act to Protect Vulnerable Adults (2016)",
     "s": "Financial exploitation",
     "w": "Disbursement holds of fifteen business days extendable by ten, notice to the Administrator and adult protective services, trusted contacts, civil immunity.",
     "cells": [
      "ETH-8"
     ]
    },
    {
     "n": "IA Information Security and Privacy Rule (2019)",
     "s": "Cybersecurity and privacy",
     "w": "Written policies, delivery of the privacy policy, records of delivery.",
     "cells": [
      "IAD-8"
     ]
    }
   ]
  },
  {
   "id": "sro",
   "name": "SROs and the courts",
   "sub": "Membership contracts and case law",
   "hue": 0,
   "desc": "FINRA and MSRB rules bind their members by contract rather than by statute — they can expel or suspend a member but cannot reach a non-member. Courts supply the tests the statutes assume.",
   "items": [
    {
     "n": "FINRA rules",
     "s": "Bind members by contract",
     "w": "2040 payments to unregistered persons · 2111 suitability · 2121 fair prices and commissions · 2165 senior holds · 2210 communications · 2360 options · 3110 supervision · 3210 outside accounts · 4210 margin · 4512 customer account information.",
     "cells": [
      "COM-4",
      "COM-5",
      "ETH-8"
     ]
    },
    {
     "n": "FINRA Regulatory Notice 10-22",
     "s": "Guidance, not a rule",
     "w": "The independent due-diligence obligation of a BD selling a Regulation D private placement. Named by NASAA as testable — and absent from most prep sources.",
     "cells": [
      "ETH-1"
     ]
    },
    {
     "n": "MSRB Rule G-37",
     "s": "Municipal pay-to-play",
     "w": "The parallel two-year ban with a $250 de minimis.",
     "cells": [
      "ETH-8"
     ]
    },
    {
     "n": "SEC v. W. J. Howey Co. (1946)",
     "s": "US Supreme Court",
     "w": "The four-prong investment contract test. The only case NASAA names.",
     "cells": [
      "SEC-1"
     ]
    },
    {
     "n": "Uniform Prudent Investor Act",
     "s": "Uniform Law Commission",
     "w": "Portfolio-level prudence, diversification as a duty, permitted delegation, loyalty and impartiality. Not a NASAA product — but NASAA names it as testable.",
     "cells": [
      "ETH-8"
     ]
    }
   ]
  }
 ]
}
