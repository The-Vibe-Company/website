// Generates every raster favicon from the brand mark in public/favicon.svg, so
// the SVG stays the single source of truth. Re-run after changing the SVG:
//
//   bun run favicons:generate
//
// Writes, all at the site root (served as-is, outside the locale middleware):
//   favicon.ico             16, 32 and 48 px PNG entries
//   favicon-{48,96,192}.png search engines (Google wants a multiple of 48)
//   icon.png                512 px, web manifest + Organization logo
//   apple-touch-icon.png    180 px on solid black, iOS masks its own corners
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const SOURCE = path.join(PUBLIC_DIR, 'favicon.svg')
const MASTER_SIZE = 1024
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 }

// The mark is 2418x2354, not square: centre it on a transparent square canvas
// so no browser or crawler has to stretch it.
async function squareMaster(): Promise<Buffer> {
  const svg = await fs.readFile(SOURCE)
  return sharp(svg)
    .resize({ width: MASTER_SIZE, height: MASTER_SIZE, fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer()
}

function png(master: Buffer, size: number, background?: typeof BLACK): Promise<Buffer> {
  let pipeline = sharp(master).resize(size, size, { kernel: 'lanczos3' })
  if (background) pipeline = pipeline.flatten({ background })
  return pipeline.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer()
}

// ICO container holding PNG-encoded entries (supported by every current
// browser and by Google's favicon crawler).
function ico(entries: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)
  const directory = Buffer.alloc(16 * entries.length)
  let offset = header.length + directory.length
  entries.forEach(({ size, data }, i) => {
    const at = i * 16
    directory.writeUInt8(size >= 256 ? 0 : size, at)
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1)
    directory.writeUInt8(0, at + 2)
    directory.writeUInt8(0, at + 3)
    directory.writeUInt16LE(1, at + 4)
    directory.writeUInt16LE(32, at + 6)
    directory.writeUInt32LE(data.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += data.length
  })
  return Buffer.concat([header, directory, ...entries.map((e) => e.data)])
}

async function main() {
  const master = await squareMaster()
  const outputs: Record<string, Buffer> = {}

  const icoEntries = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, data: await png(master, size) })),
  )
  outputs['favicon.ico'] = ico(icoEntries)
  for (const size of [48, 96, 192]) outputs[`favicon-${size}.png`] = await png(master, size)
  outputs['icon.png'] = await png(master, 512)
  outputs['apple-touch-icon.png'] = await png(master, 180, BLACK)

  for (const [name, data] of Object.entries(outputs)) {
    await fs.writeFile(path.join(PUBLIC_DIR, name), data)
    console.log(`public/${name}  ${(data.length / 1024).toFixed(1)} KB`)
  }
}

await main()
