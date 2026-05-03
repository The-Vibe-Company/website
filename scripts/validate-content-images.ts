import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

import { parseFrontmatter } from '../src/lib/parse-frontmatter'
import { CONTENT_TYPES, getUrlSlugForDbType } from '../src/lib/content-types'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')
const DIMENSIONS_FILE = path.join(ROOT, 'src/generated/og-image-dimensions.json')

const MIN_ASPECT_RATIO = 1.5
const MAX_ASPECT_RATIO = 2.2
const MIN_WIDTH = 1200
const MAX_BYTES = 2500 * 1024

type Failure = { file: string; reason: string }

type Dimensions = { width: number; height: number }

async function listMarkdown(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(dir, entry.name))
    return files
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

function toPublicPath(url: string): string {
  return path.resolve(PUBLIC_DIR, url.replace(/^\//, ''))
}

function isInsidePublic(resolvedPath: string): boolean {
  const relative = path.relative(PUBLIC_DIR, resolvedPath)
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function readDimensions(file: string): Promise<Dimensions | null> {
  try {
    const metadata = await sharp(file).metadata()
    if (!metadata.width || !metadata.height) return null
    return { width: metadata.width, height: metadata.height }
  } catch {
    return null
  }
}

async function validateMarkdownFile(file: string): Promise<{
  failures: Failure[]
  entry: { sourceUrl: string; dimensions: Dimensions } | null
}> {
  const relFile = path.relative(ROOT, file)
  const failures: Failure[] = []
  const raw = await fs.readFile(file, 'utf8')
  const { data } = parseFrontmatter(raw)
  const ogImage = data.ogImage?.trim() ?? ''

  if (!ogImage) {
    failures.push({ file: relFile, reason: 'missing `ogImage:` frontmatter field' })
    return { failures, entry: null }
  }

  const sourcePath = toPublicPath(ogImage)
  if (!isInsidePublic(sourcePath)) {
    failures.push({ file: relFile, reason: `ogImage path escapes the public/ directory: ${ogImage}` })
    return { failures, entry: null }
  }

  let stat: Awaited<ReturnType<typeof fs.stat>>
  try {
    stat = await fs.stat(sourcePath)
  } catch {
    failures.push({ file: relFile, reason: `ogImage file not found at public${ogImage}` })
    return { failures, entry: null }
  }

  if (stat.size > MAX_BYTES) {
    failures.push({
      file: relFile,
      reason: `ogImage is ${formatBytes(stat.size)} (over ${formatBytes(MAX_BYTES)} budget)`,
    })
  }

  const dimensions = await readDimensions(sourcePath)
  if (!dimensions) {
    failures.push({ file: relFile, reason: `ogImage at public${ogImage} could not be read by sharp` })
    return { failures, entry: null }
  }

  if (dimensions.width < MIN_WIDTH) {
    failures.push({
      file: relFile,
      reason: `ogImage width is ${dimensions.width}px (need >= ${MIN_WIDTH}px)`,
    })
  }

  const aspect = dimensions.width / dimensions.height
  if (aspect < MIN_ASPECT_RATIO || aspect > MAX_ASPECT_RATIO) {
    failures.push({
      file: relFile,
      reason: `ogImage aspect ratio ${aspect.toFixed(2)} is outside [${MIN_ASPECT_RATIO}, ${MAX_ASPECT_RATIO}] (target ~1.91 for 1200x630)`,
    })
  }

  if (failures.length > 0) {
    return { failures, entry: null }
  }

  return { failures, entry: { sourceUrl: ogImage, dimensions } }
}

async function writeDimensionsFile(map: Record<string, Dimensions>): Promise<void> {
  const ordered = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)))
  const next = `${JSON.stringify(ordered, null, 2)}\n`
  let current = ''
  try {
    current = await fs.readFile(DIMENSIONS_FILE, 'utf8')
  } catch {
    // File doesn't exist yet.
  }
  if (current === next) return
  await fs.mkdir(path.dirname(DIMENSIONS_FILE), { recursive: true })
  await fs.writeFile(DIMENSIONS_FILE, next)
}

async function main() {
  const failures: Failure[] = []
  const dimensions: Record<string, Dimensions> = {}
  let validated = 0

  for (const type of CONTENT_TYPES) {
    if (!type.requiresOgImage) continue

    const dir = path.join(CONTENT_DIR, getUrlSlugForDbType(type.slug))
    const files = await listMarkdown(dir)

    for (const file of files) {
      const result = await validateMarkdownFile(file)
      failures.push(...result.failures)
      if (result.entry) {
        dimensions[result.entry.sourceUrl] = result.entry.dimensions
        validated += 1
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`[fail] ${failure.file}: ${failure.reason}`)
    }
    console.error(`[fail] ${failures.length} validation error(s).`)
    process.exit(1)
  }

  await writeDimensionsFile(dimensions)
  console.log(`[ok] ${validated} content file(s) validated. og-image-dimensions.json updated.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
