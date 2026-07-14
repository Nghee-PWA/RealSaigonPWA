// Tạo icon PNG cho app (hình nhân vật pixel đội nón lá) mà không cần công cụ vẽ.
// Chạy: npm run icons  →  xuất ra public/icons/icon-192.png và icon-512.png
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const GRID = [
  '................',
  '.......OO.......',
  '......OHHO......',
  '.....OHHHHO.....',
  '....OHHHHHHO....',
  '...OhhhhhhhhO...',
  '..OOOOOOOOOOOO..',
  '..OFFFFFFFFFFO..',
  '..OFEFFFFFFEFO..',
  '..OFCFFFFFFCFO..',
  '..OFFFFOOFFFFO..',
  '..OFFFFFFFFFFO..',
  '...OBBBBBBBBO...',
  '...OBBBBBBBBO...',
  '....OOOOOOOO....',
  '................',
]

const COLORS = {
  '.': '#8ed8c6', // nền
  O: '#4a3728', // viền
  H: '#f2c14e', // nón lá
  h: '#d99e2b', // nón lá (bóng)
  F: '#ffe0b8', // mặt
  E: '#2b1d14', // mắt
  C: '#f79892', // má hồng
  B: '#f2617a', // áo
}

function hexToRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

let crcTable
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      crcTable[n] = c
    }
  }
  let c = -1
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

function makePng(size) {
  const scale = size / GRID.length
  const raw = Buffer.alloc(size * (size * 4 + 1))
  let p = 0
  for (let y = 0; y < size; y++) {
    raw[p++] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const cell = GRID[Math.floor(y / scale)][Math.floor(x / scale)]
      const [r, g, b] = hexToRgb(COLORS[cell])
      raw[p++] = r
      raw[p++] = g
      raw[p++] = b
      raw[p++] = 255
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // độ sâu màu
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), makePng(size))
  console.log(`Đã tạo icon-${size}.png`)
}
