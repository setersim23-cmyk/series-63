/**
 * Generates the app icons from the design's thumbnail: the Harada 3×3 with "63"
 * in the middle. Dependency-free PNG encoding — zlib is all it takes for flat
 * colour art, and it keeps the install path free of native image toolchains.
 *
 *   node scripts/make-icons.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const BG = [0x08, 0x08, 0x0b]
// The eight chapter hues, in chart order, sampled from the design's thumbnail.
const CHIPS = [
  [0x74, 0xd8, 0xa4], // SEC 150
  [0x9d, 0xb6, 0xff], // BDR 265
  [0x5c, 0xd8, 0xdc], // AGT 195
  [0xff, 0x9d, 0xd0], // IAD 330
  null, //             centre
  [0xff, 0xb0, 0x76], // IAR 35
  [0x8a, 0xbc, 0xff], // COM 220
  [0xff, 0x9d, 0xa4], // ETH 0
  [0xcb, 0xcb, 0x62], // REM 85
]
const CENTRE = [0x1a, 0x1a, 0x24]
const INK = [0xe9, 0xe9, 0xef]

// 5×7 bitmaps for the only two glyphs the icon needs.
const DIGITS = {
  6: ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
}

function render(size) {
  const px = new Uint8Array(size * size * 3)
  const set = (x, y, [r, g, b]) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 3
    px[i] = r
    px[i + 1] = g
    px[i + 2] = b
  }
  const rect = (x0, y0, w, h, colour) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, colour)
  }

  rect(0, 0, size, size, BG)

  // 3×3 grid. The design thumbnail sits small inside its card; a home-screen
  // icon wants the mark filling roughly three quarters of the tile.
  const cell = Math.round(size * 0.22)
  const gap = Math.round(size * 0.05)
  const span = cell * 3 + gap * 2
  const originX = Math.round((size - span) / 2)
  const originY = originX

  CHIPS.forEach((colour, i) => {
    const x = originX + (i % 3) * (cell + gap)
    const y = originY + Math.floor(i / 3) * (cell + gap)
    rect(x, y, cell, cell, colour ?? CENTRE)
  })

  // "63" across the centre cell, sized to the grid.
  const scale = Math.max(1, Math.round((cell * 0.5) / 7))
  const glyphW = 5 * scale
  const glyphH = 7 * scale
  const textW = glyphW * 2 + scale
  const textX = Math.round((size - textW) / 2)
  const textY = Math.round((size - glyphH) / 2)
  ;['6', '3'].forEach((digit, gi) => {
    DIGITS[digit].forEach((row, ry) => {
      ;[...row].forEach((bit, rx) => {
        if (bit !== '1') return
        rect(textX + gi * (glyphW + scale) + rx * scale, textY + ry * scale, scale, scale, INK)
      })
    })
  })

  return png(px, size)
}

function crc32(buf) {
  let c = ~0
  for (const byte of buf) {
    c ^= byte
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(rgb, size) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolour
  // rows are filter-byte prefixed
  const raw = Buffer.alloc(size * (size * 3 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0
    Buffer.from(rgb.buffer, y * size * 3, size * 3).copy(raw, y * (size * 3 + 1) + 1)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  writeFileSync(join(root, 'public', name), render(size))
  console.log(`${name} ${size}×${size}`)
}
