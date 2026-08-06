/**
 * Builds src/theme.css from the colours the app actually uses.
 *
 *   node scripts/make-theme.mjs
 *
 * The design is drawn in one palette, on a near-black page, as a few named
 * tokens plus a long tail of one-off hexes tuned card by card. Hand-writing a
 * second palette for the light theme would mean re-tuning all of it and getting
 * a different answer every time.
 *
 * So the light value of every colour is derived instead, and derived from the
 * property that matters: its WCAG contrast against the page it sits on. Same
 * hue, same chroma where sRGB has room for it, same contrast. A hairline border
 * stays a hairline, body text stays exactly as readable as it was, and the
 * relationships between the two hundred-odd colours survive intact.
 *
 * Every colour in src/ is emitted as a variable named after its dark value, so
 * the source keeps saying `#7ee0a8` — the colour the design specified — and the
 * stylesheet decides what that means on the day.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ---------- sRGB ↔ OKLCH, per CSS Color 4 ----------

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

const channels = (hex) => {
  let h = hex.slice(1)
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  return [0, 2, 4].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255))
}

function hexToOklch(hex) {
  const [r, g, b] = channels(hex)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI }
}

function oklchToHex({ L, C, h }) {
  const hr = (h * Math.PI) / 180
  const A = C * Math.cos(hr)
  const B = C * Math.sin(hr)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return (
    '#' +
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
      .map((v) =>
        Math.round(Math.max(0, Math.min(1, gam(v))) * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

const luminance = (hex) => {
  const [r, g, b] = channels(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// ---------- the transform ----------

/** The page, in each theme. Everything else is positioned relative to these. */
const INK = '#08080b'
const PAPER = '#fbfbfd'

/**
 * Saturated colour needs lightness to exist in: a dark green at chroma .12 is
 * outside sRGB and clips to something muddy. This is roughly where the gamut
 * boundary runs, as a function of how far the lightness sits from either end.
 */
const gamutChroma = (C, L) => Math.min(C, 0.34 * Math.min(L, 1 - L) + 0.02)

function toLight(hex) {
  if (hex.toLowerCase() === INK) return PAPER
  const { C, h } = hexToOklch(hex)
  const want = contrast(hex, INK)
  let lo = 0
  let hi = 1
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (contrast(oklchToHex({ L: mid, C: gamutChroma(C, mid), h }), PAPER) > want) lo = mid
    else hi = mid
  }
  const L = (lo + hi) / 2
  return oklchToHex({ L, C: gamutChroma(C, L), h })
}

// ---------- collecting what the app uses ----------

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g

const expand = (hex) =>
  hex.length === 4
    ? '#' +
      hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
    : hex.toLowerCase()

// Both spellings count: a raw hex someone has just written, and the variables
// an earlier run already rewrote them into. Without the second the script would
// erase its own output the moment it ran twice.
const REF = /var\(--k([0-9a-f]{6})\)/g

const used = new Set()
for (const file of walk(join(root, 'src'))) {
  if (!/\.(tsx?|css)$/.test(file)) continue
  if (file.endsWith('theme.css')) continue
  const text = readFileSync(file, 'utf8')
  for (const hex of text.match(HEX) ?? []) used.add(expand(hex))
  for (const [, hex] of text.matchAll(REF)) used.add(`#${hex}`)
}

const names = [...used].sort()

/**
 * The chapter hues are not hexes — they are oklch() built at render time from
 * the chapter's angle and an explicit lightness. Reversing them takes the same
 * shape: the light theme's lightness is 116% minus the dark theme's, which
 * matches the contrast-preserving answer to within about a point and a half
 * across every lightness the app asks for.
 */
const HUE_LIGHT_PIVOT = '116%'

/**
 * The few colours that are not a hex anywhere: translucent chrome that has to
 * sit on top of the page it is blurring, and the drop shadow, which needs less
 * weight on paper than it does in the dark. Written out rather than derived,
 * because there is no dark value to derive them from.
 */
const EXTRA = [
  ['--chrome', 'rgba(10, 10, 14, 0.94)', 'rgba(251, 251, 253, 0.94)'],
  ['--chrome-soft', 'rgba(8, 8, 11, 0.92)', 'rgba(251, 251, 253, 0.92)'],
  ['--shadow', 'rgba(0, 0, 0, 0.5)', 'rgba(40, 40, 60, 0.16)'],
  ['--scrim', 'rgba(0, 0, 0, 0.55)', 'rgba(20, 20, 30, 0.4)'],
]

const block = (selector, comment, entries) =>
  `${comment}\n${selector} {\n${entries.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`

const dark = [
  ['--hue-base', '0%'],
  ['--hue-dir', '1'],
  ...EXTRA.map(([k, v]) => [k, v]),
  ...names.map((hex) => [`--k${hex.slice(1)}`, hex]),
]
const light = [
  ['--hue-base', HUE_LIGHT_PIVOT],
  ['--hue-dir', '-1'],
  ...EXTRA.map(([k, , v]) => [k, v]),
  ...names.map((hex) => [`--k${hex.slice(1)}`, toLight(hex)]),
]

const out =
  `/* Generated by scripts/make-theme.mjs — do not hand-edit.\n` +
  `   ${names.length} colours, derived from the dark palette by matching each one's\n` +
  `   contrast against the page. Re-run the script after adding a colour. */\n\n` +
  block(':root', '/* dark — the palette as designed */', dark) +
  '\n' +
  block(
    ":root[data-theme='light']",
    '/* light — same hues, same contrasts, on paper */',
    light
  )

writeFileSync(join(root, 'src', 'theme.css'), out, 'utf8')

const worst = names
  .map((hex) => ({ hex, d: contrast(hex, INK), l: contrast(toLight(hex), PAPER) }))
  .sort((a, b) => Math.abs(a.l - a.d) - Math.abs(b.l - b.d))
  .at(-1)
console.log(
  `${names.length} colours → src/theme.css · largest contrast drift ${worst.hex} ` +
    `${worst.d.toFixed(2)} → ${worst.l.toFixed(2)}`
)
