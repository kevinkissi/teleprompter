// Dependency-free PWA icon generator.
// Draws a simple "teleprompter" motif (stacked script lines with a highlighted
// current line) and encodes it to PNG using only Node's built-in zlib.
//
// Run with: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'icons')

// ---- Colours ----
const BG = [0x0b, 0x0f, 0x14, 255] // near-black with a hint of blue
const LINE = [0xe6, 0xed, 0xf3, 255] // light grey script lines
const ACCENT = [0x38, 0xbd, 0xf8, 255] // sky blue "current line"

const SS = 3 // supersampling factor for anti-aliasing

// Signed-distance function for a rounded rectangle centred at (cx, cy).
function sdfRoundRect(px, py, cx, cy, halfW, halfH, r) {
  const qx = Math.abs(px - cx) - (halfW - r)
  const qy = Math.abs(py - cy) - (halfH - r)
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const inside = Math.min(Math.max(qx, qy), 0)
  return outside + inside - r
}

function blend(dst, i, color) {
  const a = color[3] / 255
  if (a <= 0) return
  const ia = 1 - a
  dst[i] = Math.round(color[0] * a + dst[i] * ia)
  dst[i + 1] = Math.round(color[1] * a + dst[i + 1] * ia)
  dst[i + 2] = Math.round(color[2] * a + dst[i + 2] * ia)
  dst[i + 3] = Math.round(color[3] + dst[i + 3] * ia)
}

// Render one icon at `size`. `fullBleed` fills the whole square (maskable / iOS);
// otherwise the background is a rounded square with transparent corners.
function renderIcon(size, fullBleed) {
  const S = size * SS
  const hi = new Uint8Array(S * S * 4) // transparent

  const bgRadius = fullBleed ? 0 : S * 0.2
  const bgHalf = S / 2
  const bgCx = S / 2
  const bgCy = S / 2

  // Content safe zone: smaller for maskable/full-bleed so nothing is clipped.
  const inset = fullBleed ? S * 0.2 : S * 0.16
  const contentX = inset
  const contentW = S - inset * 2
  const contentCx = S / 2

  // Line geometry
  const lineWidths = [0.92, 0.66, 1.0, 0.78, 0.5]
  const accentIndex = 2
  const lineCount = lineWidths.length
  const lineH = contentW * 0.11
  const gap = lineH * 0.85
  const totalH = lineCount * lineH + (lineCount - 1) * gap
  const startY = (S - totalH) / 2
  const lineRadius = lineH / 2

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const i = (y * S + x) * 4

      // Background
      const bgD = sdfRoundRect(px, py, bgCx, bgCy, bgHalf, bgHalf, bgRadius)
      if (bgD <= 0) blend(hi, i, BG)

      // Script lines (left-aligned within the content box)
      for (let l = 0; l < lineCount; l++) {
        const w = contentW * lineWidths[l]
        const lineCx = contentX + w / 2
        const lineCy = startY + l * (lineH + gap) + lineH / 2
        const d = sdfRoundRect(px, py, lineCx, lineCy, w / 2, lineH / 2, lineRadius)
        if (d <= 0) {
          blend(hi, i, l === accentIndex ? ACCENT : LINE)
        }
      }

      // keep contentCx referenced (center guide) — subtle tick on accent line only
      void contentCx
    }
  }

  // Box-downsample SS x SS -> anti-aliased final image.
  const out = new Uint8Array(size * size * 4)
  const n = SS * SS
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const hx = x * SS + sx
          const hy = y * SS + sy
          const hi_i = (hy * S + hx) * 4
          r += hi[hi_i]
          g += hi[hi_i + 1]
          b += hi[hi_i + 2]
          a += hi[hi_i + 3]
        }
      }
      const o = (y * size + x) * 4
      out[o] = Math.round(r / n)
      out[o + 1] = Math.round(g / n)
      out[o + 2] = Math.round(b / n)
      out[o + 3] = Math.round(a / n)
    }
  }
  return out
}

// ---- Minimal PNG encoder (RGBA, 8-bit) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0)
  return Buffer.concat([len, typeBytes, Buffer.from(data), crcBuf])
}

function encodePng(rgba, size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Raw image data: filter byte 0 per scanline.
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0
    Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const idat = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function writeIcon(name, size, fullBleed) {
  const rgba = renderIcon(size, fullBleed)
  const png = encodePng(rgba, size)
  writeFileSync(join(OUT_DIR, name), png)
  console.log(`  ${name} (${size}x${size}, ${png.length} bytes)`)
}

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#0b0f14"/>
  <g>
    <rect x="12" y="18" width="34" height="5" rx="2.5" fill="#e6edf3"/>
    <rect x="12" y="27" width="24" height="5" rx="2.5" fill="#e6edf3"/>
    <rect x="12" y="36" width="40" height="5" rx="2.5" fill="#38bdf8"/>
    <rect x="12" y="45" width="28" height="5" rx="2.5" fill="#e6edf3"/>
  </g>
</svg>
`

function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  console.log('Generating icons ->', OUT_DIR)
  writeIcon('icon-192.png', 192, false)
  writeIcon('icon-512.png', 512, false)
  writeIcon('icon-512-maskable.png', 512, true)
  writeIcon('apple-touch-icon.png', 180, true)
  writeFileSync(join(OUT_DIR, 'favicon.svg'), FAVICON_SVG)
  console.log('  favicon.svg')
  console.log('Done.')
}

main()
