import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Every file under public/, as a root-relative URL. */
function publicUrls(dir = 'public', base = 'public'): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory()
      ? publicUrls(full, base)
      : ['/' + relative(base, full).split(/[\\/]/).join('/')]
  })
}

/**
 * Emits a service worker that precaches the whole app so it runs with no
 * network at all — the exam-centre-parking-lot requirement. Asset filenames are
 * content-hashed, so cache-first is always correct; a new build produces a new
 * cache name and the old one is dropped on activate.
 */
function serviceWorker(): Plugin {
  return {
    name: 's63-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const assets = Object.keys(bundle).map((f) => '/' + f)
      // '/' is the entry the navigate handler falls back to; index.html is emitted
      // after this hook runs, so name it explicitly.
      const precache = ['/', '/index.html', ...assets, ...publicUrls().filter((u) => u !== '/sw.js')]
      const version = `s63-${Date.now().toString(36)}`
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `// generated at build time — do not edit
const CACHE = '${version}'
const PRECACHE = ${JSON.stringify(precache, null, 2)}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Module scripts are requested with crossorigin, so their headers differ from the
// ones used to precache them. Without ignoreVary the match misses and the app
// dies offline with the shell already served.
const MATCH = { ignoreVary: true }

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return

  // Navigations always resolve to the cached shell, so a deep link works offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches
        .match('/', MATCH)
        .then((hit) => hit || fetch(req).catch(() => caches.match('/index.html', MATCH)))
    )
    return
  }

  e.respondWith(
    caches.match(req, MATCH).then((hit) => {
      if (hit) return hit
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
    })
  )
})
`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serviceWorker()],
  build: {
    target: 'es2020',
    // The textbook is one big data module; it is the app, so don't warn about it.
    chunkSizeWarningLimit: 1500,
  },
})
