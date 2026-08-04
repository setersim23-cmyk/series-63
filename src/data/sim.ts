// Generated from project/Series 63 Coach.dc.html by scripts/extract-design-data.mjs — do not hand-edit.
export interface SimOption {
  t: string
  ok: boolean
  /** Shown after the pick — the consequence of getting it wrong. */
  fb: string
}

export interface SimStep {
  p: string
  o: SimOption[]
}

export interface SimCase {
  name: string
  facts: string
  steps: SimStep[]
  close: string
}

export interface Simulator {
  title: string
  cases: SimCase[]
}

/** The Administrator's desk — four branching enforcement cases. */
export const SIM: Simulator = {
 "title": "The Administrator’s desk — 4 enforcement cases",
 "cases": [
  {
   "name": "Case 1 · The unregistered \"consultant\"",
   "facts": "A tip alleges that an individual in your state is cold-calling retirees, selling interests in a private oil-drilling program for a Texas promoter, earning 8% per sale. He is not registered in any capacity; the interests are not registered or federal covered; nothing suggests the offers stop at 10 people.",
   "steps": [
    {
     "p": "Your first move?",
     "o": [
      {
       "t": "Issue a cease & desist order immediately",
       "ok": true,
       "fb": "Right. A C&D may issue with or without a prior hearing — it is the tool built for stopping ongoing sales today."
      },
      {
       "t": "Apply to the court for an injunction",
       "ok": false,
       "fb": "Available, but slower and unnecessary as step one — you have your own order power. Courts are for when your orders are ignored."
      },
      {
       "t": "Revoke his registration",
       "ok": false,
       "fb": "He has no registration to revoke. You cannot revoke what was never granted — that is exactly why the C&D exists."
      }
     ]
    },
    {
     "p": "Which provisions has he violated?",
     "o": [
      {
       "t": "§201 (unregistered agent) and §301 (unregistered security)",
       "ok": true,
       "fb": "Both. He is effecting trades for compensation while unregistered, in a security that is neither registered, exempt, nor federal covered."
      },
      {
       "t": "§101 antifraud only",
       "ok": false,
       "fb": "Nothing in the facts shows deception yet. Registration violations stand on their own — you don’t need fraud to act."
      },
      {
       "t": "§302 notice filing failure",
       "ok": false,
       "fb": "Notice filing is for federal covered securities. An oil-program private deal gone public is not that."
      }
     ]
    },
    {
     "p": "The retirees who already bought — what remedy does the Act give them?",
     "o": [
      {
       "t": "Rescission: price + interest + costs/fees − income received",
       "ok": true,
       "fb": "§410. Sales by an unregistered agent are voidable by the buyer — scienter not required."
      },
      {
       "t": "Nothing unless fraud is proven",
       "ok": false,
       "fb": "Wrong — civil liability attaches to REGISTRATION violations too. Innocent violation, same rescission."
      },
      {
       "t": "SIPC coverage",
       "ok": false,
       "fb": "SIPC is for failed broker-dealers’ custody, never for bad sales."
      }
     ]
    }
   ],
   "close": "Textbook sequence: C&D to stop the bleeding, dual registration violations charged, §410 rescission for the victims. If he keeps selling, THEN you go to court for an injunction — and possibly refer for criminal prosecution ($5,000 / 3 years / 5-year clock)."
  },
  {
   "name": "Case 2 · The firm that wants out",
   "facts": "A mid-size BD under investigation for supervisory failures files a Form BDW withdrawal, hoping to moot your case. The filing is complete; the investigation became a formal proceeding last week.",
   "steps": [
    {
     "p": "Does the withdrawal become effective in 30 days?",
     "o": [
      {
       "t": "No — withdrawal is held while a proceeding is pending",
       "ok": true,
       "fb": "Correct. §204: no withdrawal becomes effective while a revocation or suspension proceeding is pending against the registrant."
      },
      {
       "t": "Yes — withdrawal is a right",
       "ok": false,
       "fb": "It would be, absent the proceeding. Filing BDW during a pending action does not stop the action."
      },
      {
       "t": "Yes, but only partially",
       "ok": false,
       "fb": "There is no partial withdrawal concept in the Act."
      }
     ]
    },
    {
     "p": "Suppose no proceeding existed and withdrawal took effect June 1. Until when can you still institute one?",
     "o": [
      {
       "t": "One year after the withdrawal became effective",
       "ok": true,
       "fb": "The one-year tail. Registration ends; jurisdiction lingers."
      },
      {
       "t": "Never — jurisdiction ends with registration",
       "ok": false,
       "fb": "The one-year tail exists precisely to stop this escape."
      },
      {
       "t": "Five years",
       "ok": false,
       "fb": "Five years is the CRIMINAL statute of limitations — different clock entirely."
      }
     ]
    },
    {
     "p": "To suspend the firm today, before the full hearing, you must:",
     "o": [
      {
       "t": "Summarily suspend, promptly notify, and offer a hearing within 15 days of written request",
       "ok": true,
       "fb": "The summary-power recipe: act first, but notice and a prompt hearing path are mandatory."
      },
      {
       "t": "Wait for the hearing — no summary power exists",
       "ok": false,
       "fb": "Summary postponement/suspension pending determination is expressly allowed."
      },
      {
       "t": "Get a court order first",
       "ok": false,
       "fb": "Courts are for injunctions and receivers — suspension of a registration is your own power."
      }
     ]
    }
   ],
   "close": "Withdrawal is not an exit from discipline: pending proceedings freeze it, and even a clean exit leaves a one-year tail. Summary suspension is yours to use — with notice and the 15-day hearing right attached."
  },
  {
   "name": "Case 3 · The too-good newsletter",
   "facts": "A subscription newsletter in your state sells \"personal portfolio blueprints\" — each issue tailored to the subscriber’s holdings, $2,400/year. The publisher, never registered, claims the publisher’s exclusion. Separately, ads claim \"SEC-approved methodology.\"",
   "steps": [
    {
     "p": "Does the publisher’s exclusion hold?",
     "o": [
      {
       "t": "No — tailored, paid advice is not a bona fide general-circulation publication",
       "ok": true,
       "fb": "The exclusion requires impersonal, regular, general circulation. Person-specific blueprints are advisory services."
      },
      {
       "t": "Yes — anything printed is a publication",
       "ok": false,
       "fb": "Form does not control. Individualized advice for compensation is the adviser definition on all three prongs."
      },
      {
       "t": "Yes, if under $100M AUM",
       "ok": false,
       "fb": "AUM decides WHERE an adviser registers, not WHETHER someone is an adviser."
      }
     ]
    },
    {
     "p": "The \"SEC-approved methodology\" claim is:",
     "o": [
      {
       "t": "A §404/§405-type violation — approval claims are always unlawful",
       "ok": true,
       "fb": "No regulator ever approves. Claiming approval is an independent violation regardless of registration status."
      },
      {
       "t": "Puffery",
       "ok": false,
       "fb": "Approval claims are enumerated misconduct, not opinion."
      },
      {
       "t": "Acceptable if the SEC reviewed any filing",
       "ok": false,
       "fb": "Review is never approval, and saying so is the violation."
      }
     ]
    },
    {
     "p": "He argues you lack authority because he never registered. You:",
     "o": [
      {
       "t": "Proceed — antifraud and enforcement powers reach ANY person, registered or not",
       "ok": true,
       "fb": "The actor shortcut: exclusions and non-registration never shield fraud or false statements from the Administrator."
      },
      {
       "t": "Refer to the SEC — only federal authority applies",
       "ok": false,
       "fb": "State antifraud jurisdiction is never preempted, even for federal covered actors."
      },
      {
       "t": "Concede — no registration, no jurisdiction",
       "ok": false,
       "fb": "Jurisdiction follows the CONDUCT in your state, not the registration."
      }
     ]
    }
   ],
   "close": "Two independent hooks: he IS an adviser (tailored + business + compensation) who failed to register, and the approval claim is unlawful on its face. Unregistered status is a violation, never a defense."
  },
  {
   "name": "Case 4 · Unwinding the damage",
   "facts": "A registered agent sold a client $40,000 of an unregistered, non-exempt security 14 months ago. The client received $1,600 in distributions. The firm discovers the violation in a branch audit and wants to fix it before you order anything. Your state’s legal rate of interest is 6%.",
   "steps": [
    {
     "p": "The firm’s correct move is:",
     "o": [
      {
       "t": "A written rescission offer: repurchase at cost + 6% interest − income received, plus costs",
       "ok": true,
       "fb": "The §410 rescission offer — the self-help mechanism that can extinguish civil liability before suit."
      },
      {
       "t": "Quietly swap the client into a registered fund",
       "ok": false,
       "fb": "That compounds the violation and touches nothing about the voidable sale."
      },
      {
       "t": "Wait — the client seems happy",
       "ok": false,
       "fb": "The liability clock runs 3 years from the sale. Hoping is not a remediation program."
      }
     ]
    },
    {
     "p": "Run the numbers. The offer should total about:",
     "o": [
      {
       "t": "$40,000 + $2,800 interest (14 mo @ 6%) − $1,600 = ~$41,200, against tender of the security",
       "ok": true,
       "fb": "Price + interest from purchase − income received; the client hands the security back. (Use the calculator in REM-6.)"
      },
      {
       "t": "$40,000 flat",
       "ok": false,
       "fb": "Interest from the purchase date and the income offset are both part of the statutory formula."
      },
      {
       "t": "$41,600 with no tender required",
       "ok": false,
       "fb": "Tender is required when the client still holds the security — and income received is subtracted, not ignored."
      }
     ]
    },
    {
     "p": "The client ignores the written offer. After 30 days, the client:",
     "o": [
      {
       "t": "Has waived the right of action for that violation",
       "ok": true,
       "fb": "Thirty days to accept a proper rescission offer, or the claim on that violation is extinguished."
      },
      {
       "t": "May still sue within 3 years",
       "ok": false,
       "fb": "A proper unaccepted rescission offer cuts off the claim — that is its entire purpose."
      },
      {
       "t": "Gets an automatic extension",
       "ok": false,
       "fb": "No extensions. Thirty days, then waiver."
      }
     ]
    }
   ],
   "close": "The rescission offer is the exam’s favorite civil-liability machine: exact formula, tender rule, and the 30-day acceptance window that quietly kills the claim."
  }
 ]
}
