/**
 * One-shot importer: turns the Claude Design bundle's `window.*` content globals
 * (project/content/*.js) into typed TS modules under src/content/.
 *
 * Re-run after the design bundle's content is refreshed:
 *   node scripts/convert-content.mjs
 */
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const src = join(root, 'project', 'content')

globalThis.window = {}
require(join(src, 'textbook_data.js'))
require(join(src, 'questions.js'))
require(join(src, 'authorities.js'))
const { TEXTBOOK, QBANK, AUTH } = globalThis.window

const banner = (from) =>
  `// Generated from project/content/${from} by scripts/convert-content.mjs — do not hand-edit.\n`

const emit = (file, from, decl) =>
  writeFileSync(join(root, 'src', 'content', file), banner(from) + decl, 'utf8')

emit(
  'textbook.ts',
  'textbook_data.js',
  `import type { Textbook } from '../types'\n\nexport const TEXTBOOK: Textbook = ${JSON.stringify(TEXTBOOK, null, 1)}\n`
)
emit(
  'questions.ts',
  'questions.js',
  `import type { Question } from '../types'\n\nexport const QBANK: Question[] = ${JSON.stringify(QBANK, null, 1)}\n`
)
emit(
  'authorities.ts',
  'authorities.js',
  `import type { Authorities } from '../types'\n\nexport const AUTH: Authorities = ${JSON.stringify(AUTH, null, 1)}\n`
)

const cells = TEXTBOOK.chapters.flatMap((c) => c.cells)
const facts = TEXTBOOK.chapters.flatMap((c) => c.memorize)
console.log(
  `chapters ${TEXTBOOK.chapters.length} · cells ${cells.length} · memorize ${facts.length} · questions ${QBANK.length} · layers ${AUTH.layers.length}`
)

// Guard rails: the app assumes 8 chapters of 8 cells and a question for every cell.
const problems = []
if (TEXTBOOK.chapters.length !== 8) problems.push('expected 8 chapters')
for (const ch of TEXTBOOK.chapters) {
  if (ch.cells.length !== 8) problems.push(`${ch.code} has ${ch.cells.length} cells, expected 8`)
}
const covered = new Set(QBANK.map((q) => q.c))
for (const cell of cells) if (!covered.has(cell.id)) problems.push(`no question for ${cell.id}`)
for (const q of QBANK) if (!cells.some((c) => c.id === q.c)) problems.push(`question cites unknown cell ${q.c}`)
for (const f of facts) if (!cells.some((c) => c.id === f.cell)) problems.push(`fact cites unknown cell ${f.cell}`)
if (problems.length) {
  console.error('\nContent problems:\n' + problems.map((p) => ' · ' + p).join('\n'))
  process.exit(1)
}
