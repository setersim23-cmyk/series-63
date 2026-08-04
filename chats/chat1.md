# Series 63 Learning App

_Started 2026-08-03 23:22 UTC_

---

## User

Design a mobile app to help me learn about build a dynamic tool that has all of the material of the series 63, but has a super clean and intuitive interface like 2 dollar's website but also uses a series 63 "readiness" score logic that can be easily accessed and updated in real time - focus on breaking concepts into chapters that can be both read or spoken to me (via an AI reading voice that i can choose the speed of their narration and various voices, and highlights text in real-time while moving the page). let me know what other information you need to see if feasible and how to make this an incredible app that's for my use

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- two_dollar: https://www.2dollartests.com/courses/series-63-course/regulated-persons/broker-dealer-registration-requirements/
- content_source: i have a project folder with all the content in my claude projects under "FINRA" but i can also upload pdfs of my notes of the textbook
- study_time: Listening while commuting/walking, Reading in focused sittings, Drilling practice questions, Quick 5-min reviews between meetings, Night-before cramming
- readiness_inputs: Practice question accuracy, Topic coverage (chapters completed), Recency / forgetting curve decay, Confidence self-ratings, Timed mock exam scores, Streak / consistency, Also it's key that it updates my Harada chart in real time
- readiness_display: Explore a few options
- audio_features: Multiple voice choices, Speed control (0.75x–2x), Word-level highlighting synced to audio, Auto-scroll as it reads, Background/lockscreen playback
- quiz_style: Single MCQ at a time with instant explanation, Timed mock exam mode (60 questions/75 min), Spaced-repetition queue of missed items, Scenario-based 'what must the agent do' items, what else would be best to learn fast (i got time to use my app while on the go)
- chapter_structure: Decide for me
- exam_date: yes in 6 days on August 10th @ 9am EST (right now it's 7:30pm EST on 8/3)
- platform: iphone and accessible easily via chrome
- variations: Just one strong direction, no options
- other_notes: 2 dollar's website is on a black background - make sure text is color coded according to the harada chart, but also doesn't lack the necessary details i need to know. also it does a poor job of knowing what specific chapter is tying back to (i.e. i may reading about broker-dealer requirements but not realize everything is all about broker-dealer's and not other types of persons. also it references usa law codes i.e. USA 201 - but doesn't tell me what this relates to (want a dynamic way i can easily figure out what they specific part of the law relates to).

## Assistant

_[tool: write_file]_

## Assistant

Good news: nothing to download. Everything I build runs in your browser — I create the app as an interactive web page you can open on your iPhone in Chrome (add it to your home screen and it behaves like an app).

What I need from you, in order of importance:

1. **Your Series 63 content.** Two easy ways:
   - Click the **+ / Import** button in this chat and attach your **"FINRA" Claude project** (there's an option to link another project), or
   - Upload your **textbook-notes PDFs** directly into the chat.
   I can't copy 2dollartests' actual material (it's their paid content), so your notes/project are what makes this real.

2. **Your Harada chart.** I know the general method, but yours has specific goals/tasks and a color code you want the text keyed to. A photo or screenshot of it is perfect — I'll wire the readiness score to update it.

3. Nothing else — no connectors, no accounts, no installs.

What happens next: I'll build the app with the full NASAA Series 63 outline structure (chapters → short lessons), the readiness score, the read/listen player with word highlighting + speed/voice controls, quiz modes, and the "what is USA 201?" tap-to-explain references. Then I pour your content in once you attach it.

One caveat to know upfront: the narration will use your phone's built-in text-to-speech voices (that's what lets you pick voices and speeds for free, works offline, and syncs word highlighting). They sound decent but not studio-quality.

Attach the FINRA project or PDFs and the Harada chart, and I'll start building — you've got 6 days, so let's move.

## User

harada is in the Series 63 coded textbook

## Assistant

_[tool: read_skill_prompt]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

The coded textbook is perfectly structured for this — 8 chapters × 8 cells with concept/memorize/trap tags. Let me check the supplement for practice questions before I build.

_[tool: run_script]_

_[tool: update_todos]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: write_file]_

Now the app itself.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The app is live — built entirely from your Coded Textbook, all 64 cells, plus a 128-question drill bank keyed to them.

What's in it:
- **Home** — readiness ring (white tick = 72 pass line), exam countdown, today's slot from your 8-day plan, and the live Harada chart: 8 chapter blocks + center summary, every cell fills with color as you read/mark/drill it. Tap any cell to open it.
- **Learn** — chapters in teaching order, each with its spine, actor banner ("everything here is about THE FIRM") so you never lose who a rule applies to, ◆/●/▲ tagged items, second-angle refs to your other three books, memorize sheets, and the all-traps view.
- **Listen** — play any cell or a whole chapter: word-by-word highlighting, auto-scroll, 0.75–2× speed, voice picker.
- **Blue dotted terms** (§202, NSMIA, Rule 506, Howey…) tap open a plain-English explainer.
- **Drill** — adaptive Quick 10, missed-item spaced queue, per-chapter/per-cell drills, and a 60Q/75-min timed mock scored against 43-to-pass. Every answer updates the chart and score instantly.
- Everything saves on your phone — open it in Chrome on your iPhone and add to home screen.

Caveats: iPhone voices only appear after your first tap on the play button, and word-highlight timing there is estimated (iOS doesn't report word boundaries — desktop Chrome is exact). It's Aug 3 — the plan says AGT + IAD today.

## User

voice doesn't work at 1.25x and switches back to a different voice

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed — two Chrome speech bugs: it falls back to the default voice if a new utterance starts immediately after canceling the old one (now a short beat between), and it silently stalls long passages at speeds other than 1× (now kept alive with a periodic nudge). Changing speed mid-read now restarts the sentence in your chosen voice. Try 1.25× again.

## User

i need practice questions (5 hard ones), and also more detailed material for each chapter, don't over summarize - make sure the entire content and concept is there (where it makes most sense) along with dropping in key concepts to memorize or highlighting key areas to memorize throughout the text. build in "Is this a security?" — the answer framework" like the one here (https://www.2dollartests.com/courses/series-63-course/securities-and-issuers/definition-of-a-security/)

"Every question in this territory yields to the same three filters, run in order:

Does the instrument match a USA §401(m) enumerated category? Stock, bond, note, debenture, warrant, transferable share, voting-trust certificate, etc. → yes, it's a security. Done.
If it's not enumerated, does it satisfy the Howey test? Investment of money + common enterprise + expectation of profits + derived from the efforts of others. All four prongs → investment contract → security.
Is it specifically excluded? Fixed annuities, fixed insurance, commodity futures, physical commodities and collectibles held directly, bank deposit products, and direct real estate ownership are NOT securities.
The two patterns that pay: fixed vs. variable annuity (variable = security; fixed = insurance) and the orange grove / racehorse / oil well novelty question — run Howey, and four for four means security." picture as example. 

Also, there are interactive drag and drop tools like the 4-Case Scenario Simulator
Step into the state administrator's role across 4 branching enforcement cases — choose the action, the statute, and the remedy, and see the consequences of getting it wrong.
8 Interactive Learning Tools
Drag-and-drop violation sorters, an administrative-action timeline, a five-filter agent walkthrough, and a rescission-offer calculator with a live worked example — embedded directly in lessons (do that too)

## Assistant

Big addition — let me wire it in: answer frameworks in every chapter, five embedded interactive tools, the 4-case Administrator simulator, and a Hard 5 set.

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Now the tool blocks in the cell view, drill cards, and the simulator screen:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

All in:

**Answer frameworks** (green ● cards, like your 2DT example) — 8 of them, one per chapter where the pattern lives: "Is this a security?" verbatim in SEC-1, plus firm-registration filters (BDR-2), the five-filter agent test (AGT-1), adviser ABC + AUM lines (IAD-1), where-the-human-registers (IAR-2), suitability (COM-6), fraud-vs-prohibited-vs-permitted (ETH-1), and Administrator powers (REM-3). They're read aloud with highlighting like everything else.

**Interactive tools embedded in lessons:**
- SEC-2: security/not-a-security sorter (tap item → tap bucket, instant why)
- ETH-1: violation sorter — fraud / prohibited / permitted
- AGT-1: five-filter walkthrough — 6 scenarios, you call agent-or-not
- REM-4: administrative-action timeline — tap events into statutory order
- REM-6: rescission calculator — live §410 formula, rescission/damages toggle, worked example

**Administrator simulator** — in Drill: 4 branching enforcement cases (unregistered seller, the firm filing BDW mid-investigation, the tailored newsletter, the rescission-offer cleanup). Choose action → statute → remedy, wrong picks show consequences, misses cost you the appeal.

**The Hard 5** — new Drill card with multi-concept, exam-day-difficulty questions (offeree counting, federal-covered IAR registration, custody-by-fee-deduction, the limitations clock trap).

One note on detail: the chapter text was never summarized — every cell contains the full Coded Textbook material word-for-word. The frameworks sit on top of it.

## User

don't just have me mark blank, shaky or solid at the end of each section - drill me with practice questions that would determine this on a great memory methodology (Method of Loci (memory palace)) and apply to every chapter and then section and ultimately final overview

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the template pieces:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the two new view screens (checkpoint + palace walk):

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

_[tool: snip]_

The whole app is now a **memory palace** — eight rooms, one per chapter (SEC = The Vault, BDR = The Front Office, AGT = The Sales Floor, IAD = The Corner Suite, IAR = The Fiduciary's Study, COM = The Mailroom, ETH = The Interrogation Room, REM = The Judge's Chambers), with a vivid locus image authored for all 64 cells.

How it works at each level:

- **While reading (encode):** every cell opens with its locus card — "🏛 The Vault · the vault door: *an orange tree grows through the door, dollar bills ripening — someone else picks them*" — so the image gets fixed while the material is fresh.
- **End of cell (prove, not self-mark):** the mark panel is now secondary. The primary button is **"Prove it — checkpoint"**: concept MCQs from that cell, then fact-recall cards (say the whole fact out loud → reveal → had it/missed it). It grades ◆ and ● for you, writes the marks to the chart, and prescribes the fix (re-derive vs. drill). Manual marking is still there underneath.
- **End of chapter:** **"Walk this room"** — the 8 loci in sequence: you see only the room, spot, and image, recall the rule aloud, reveal, self-grade. Grades write straight to the Harada chart.
- **Final overview:** **"Walk the whole palace"** in Drill — all 8 rooms, 64 loci, the full mental walkthrough you'll do in the parking lot on the 10th.

Noticed you set the pass tick to 90 — good target; the ring and cell-solid counts now grade against it.

## User

build in a new section that has an interactive and visual map (drill down with explanation when i click into a specific law) and recheck the accuracy of entire app with the updated textbook 2

## Assistant

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

Textbook 2 content is now live in the app (29 cells updated, v1 cross-refs preserved). Now the Map of Authorities:

_[tool: write_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done — two things:

**⚖ Map tab** (new, in the bottom nav): the six-layer map of authorities as an interactive stack — Federal statutes → SEC rules → **the NSMIA line** (drawn as the literal red cut it is) → the State statute → NASAA → SROs & courts. Tap a layer to open it (the state statute drills into Parts I–IV, all 25 sections §101–§415), tap any law for the full explanation — what it is, what it does on this exam — plus chips linking straight to the Harada cells it lives in. The "layer question that answers questions" rule sits at the top.

**Accuracy recheck against Textbook 2:**
- Replaced all chapter content with the v2 text — 29 of 64 cells had updated material (your v1 cross-references were kept, since v2 dropped them).
- Fixed the tap-to-explain law dictionary per the Map's citation audit: §302 is registration by **notification**, not notice filing (adviser notice filing = §202(b)); §102's five subsections added; §202's (b)–(f) added; §412 good-faith reliance, §413 files/opinions, §415 statutory policy, and §204 added; agency-cross now cites Rule 206(3)-2 (the phantom NASAA 102(f)-1 never appears); Rule 505 flagged as repealed/distractor; the manual exemption noted under §402.
- Audited the question bank against the corrections — no answers conflicted.

## User

awesome how do i publish this to an app on my iphone?

## Assistant

No App Store needed — it's a web app, so you "install" it straight from the browser:

**Easiest route (recommended):**
1. In this project, use the **Share / Publish** button (top of the app window) to get a link to the app.
2. Open that link on your iPhone — **in Safari** (Add to Home Screen works best there; Chrome on iOS can do it too via ⋮ → Add to Home Screen).
3. Tap the **Share icon → Add to Home Screen**.

You'll get an icon on your home screen that opens full-screen like a native app. Your progress (readiness score, Harada chart, missed queue) saves on the device automatically, so it persists between sessions.

Two iPhone notes:
- Tap the ▶ play button once before picking a voice — iOS only loads its voice list after a first interaction.
- Keep using the same browser you installed from; progress is stored per-browser.

If you also want an **offline copy** (single file that works with no internet, e.g. in the exam-center parking lot), say the word and I'll bundle everything — all 64 cells, questions, and the map — into one self-contained HTML file you can save to your phone.

## User

yes

## Assistant

_[tool: run_script]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

Bundled and loading clean — 1.3 MB, everything inside: all 64 cells, the question bank, the map, loci, tools.

On your iPhone: tap the card above → Share → **Save to Files**, then open it from Files anytime (it opens in Safari, no internet needed). One caveat: progress saved in the offline copy is separate from the published version — treat it as your backup/exam-day copy, and the home-screen install as your main one.

## User

will it save all my progress, and if i use in offline mode, will it be able to update my live progress?

## Assistant

Short answer: each copy keeps its own progress — the home-screen app and the offline file don't talk to each other automatically. And progress made offline stays in that file's storage.

So I'm adding a **progress sync code** — one tap copies your entire state (chart marks, quiz history, missed queue, mocks) as a code; paste it into the other copy to bring it up to date, in either direction:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: super_inline_html]_

_[tool: present_fs_item_for_download]_

_[tool: ready_for_verification]_

To answer directly:

- **Yes, it saves all progress** — automatically, on the device, in whichever copy you're using.
- **No automatic sync between copies** — the home-screen app and the offline file each keep their own progress.

So I added **⇅ Backup / transfer my progress** on the Home screen (both versions, re-download above): tap it, copy the code, open the other copy, paste, Apply. Works both directions — study offline, then push that progress back into your live version in ten seconds. It's also a backup: paste the code into Notes occasionally and you can never lose your chart.

