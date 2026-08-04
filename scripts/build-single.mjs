/**
 * Bundles the built app into one self-contained HTML file — no separate assets,
 * no network at all. For saving to the phone's Files app, or for hosting
 * somewhere that only takes a single page.
 *
 * Run after a build:
 *   VITE_SINGLE_FILE=true npm run build && node scripts/build-single.mjs
 *
 * Emits two files into dist-single/:
 *   series-63.html   a complete document you can open straight from Files
 *   embed.html       the same page as body content only, for hosts that supply
 *                    their own document shell
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const out = join(root, 'dist-single')

const html = readFileSync(join(dist, 'index.html'), 'utf8')
const assets = readdirSync(join(dist, 'assets'))
const jsFile = assets.find((f) => f.endsWith('.js'))
const cssFile = assets.find((f) => f.endsWith('.css'))

let css = readFileSync(join(dist, 'assets', cssFile), 'utf8')
const js = readFileSync(join(dist, 'assets', jsFile), 'utf8')

// Inline the fonts the page actually uses. The latin-ext faces only cover
// accented characters this material never contains, so they are dropped rather
// than carried as another 175 KB of base64.
let inlined = 0
let dropped = 0
css = css.replace(/@font-face\{[^}]*\}/g, (face) => {
  const url = /url\(([^)]+)\)/.exec(face)?.[1]
  if (!url) return face
  if (url.includes('latin-ext')) {
    dropped++
    return ''
  }
  const data = readFileSync(join(dist, url.replace(/^\//, ''))).toString('base64')
  inlined++
  return face.replace(url, `data:font/woff2;base64,${data}`)
})

const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? 'Series 63 Coach'
const icon = readFileSync(join(dist, 'apple-touch-icon.png')).toString('base64')

const body = `<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>`

const document = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="theme-color" content="#08080b">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Series 63">
<link rel="apple-touch-icon" href="data:image/png;base64,${icon}">
</head>
<body>
${body}
</body>
</html>
`

mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'series-63.html'), document, 'utf8')
writeFileSync(join(out, 'embed.html'), `<title>${title}</title>\n${body}`, 'utf8')

const mb = (s) => (Buffer.byteLength(s) / 1048576).toFixed(2) + ' MB'
console.log(`fonts inlined ${inlined}, latin-ext dropped ${dropped}`)
console.log(`dist-single/series-63.html  ${mb(document)}`)
console.log(`dist-single/embed.html      ${mb(body)}`)
