import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

type ImageJob = {
  sourceUrl: string
  targetUrl: string
  sourcePath: string
  targetPath: string
  kind: 'content' | 'og'
  references: Set<string>
}

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')
const VARIANTS_FILE = path.join(ROOT, 'src/generated/image-variants.json')
const OPTIMIZED_PREFIX = '/images/_optimized/'

const args = new Set(process.argv.slice(2))
const checkOnly = args.has('--check')
const dryRun = args.has('--dry-run')

const IMAGE_REF_PATTERN = /\/images\/(?!_optimized\/)[^\s)"']+\.(?:png|jpe?g|webp)/gi
const CONTENT_BUDGET_BYTES = 2500 * 1024
const OG_BUDGET_BYTES = 2500 * 1024

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walkFiles(fullPath)
      if (entry.isFile()) return [fullPath]
      return []
    }),
  )

  return files.flat()
}

function toPublicPath(url: string): string {
  return path.join(PUBLIC_DIR, url.replace(/^\//, ''))
}

function getTargetUrl(sourceUrl: string, kind: ImageJob['kind']): string {
  const extension = path.extname(sourceUrl)
  const withoutPrefix = sourceUrl.replace(/^\/images\//, '')
  const base = withoutPrefix.slice(0, -extension.length)
  const targetExtension = kind === 'og' ? '.png' : '.webp'

  return `${OPTIMIZED_PREFIX}${base}${targetExtension}`
}

function getLineAt(text: string, index: number): string {
  const lineStart = text.lastIndexOf('\n', index) + 1
  const lineEnd = text.indexOf('\n', index)
  return text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
}

function getKind(sourceUrl: string, line: string): ImageJob['kind'] {
  return /^ogImage:\s*/.test(line.trim()) || /(?:^|[-/])og(?:[-.]|$)|-og\./i.test(sourceUrl)
    ? 'og'
    : 'content'
}

async function collectImageJobs(markdownFiles: string[]): Promise<Map<string, ImageJob>> {
  const jobs = new Map<string, ImageJob>()

  for (const file of markdownFiles) {
    const text = await fs.readFile(file, 'utf8')

    for (const match of text.matchAll(IMAGE_REF_PATTERN)) {
      const sourceUrl = match[0]
      const sourcePath = toPublicPath(sourceUrl)
      const kind = getKind(sourceUrl, getLineAt(text, match.index ?? 0))

      try {
        await fs.access(sourcePath)
      } catch {
        console.warn(`[warn] Missing image referenced by ${path.relative(ROOT, file)}: ${sourceUrl}`)
        continue
      }

      const key = `${kind}:${sourceUrl}`
      const existing = jobs.get(key)
      if (existing) {
        existing.references.add(file)
        continue
      }

      const targetUrl = getTargetUrl(sourceUrl, kind)
      jobs.set(key, {
        sourceUrl,
        targetUrl,
        sourcePath,
        targetPath: toPublicPath(targetUrl),
        kind,
        references: new Set([file]),
      })
    }
  }

  return jobs
}

async function hashFile(file: string): Promise<string> {
  const buffer = await fs.readFile(file)
  return createHash('sha256').update(buffer).digest('hex')
}

async function writeIfChanged(tempPath: string, targetPath: string, sourceSize: number): Promise<boolean> {
  const tempSize = (await fs.stat(tempPath)).size

  if (tempSize >= sourceSize) {
    await fs.rm(tempPath, { force: true })
    if (await exists(targetPath)) {
      await fs.rm(targetPath, { force: true })
      return true
    }
    return false
  }

  try {
    const [tempHash, targetHash] = await Promise.all([hashFile(tempPath), hashFile(targetPath)])
    if (tempHash === targetHash) {
      await fs.rm(tempPath, { force: true })
      return false
    }
  } catch {
    // Target does not exist yet.
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.rename(tempPath, targetPath)
  return true
}

async function writeTextIfChanged(file: string, text: string): Promise<boolean> {
  try {
    const current = await fs.readFile(file, 'utf8')
    if (current === text) return false
  } catch {
    // File does not exist yet.
  }

  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, text)
  return true
}

async function optimizeImage(job: ImageJob): Promise<{ before: number; after: number; changed: boolean }> {
  const before = (await fs.stat(job.sourcePath)).size
  await fs.mkdir(path.dirname(job.targetPath), { recursive: true })

  const tempPath = `${job.targetPath}.tmp-${process.pid}`
  const pipeline = sharp(job.sourcePath, { limitInputPixels: false }).rotate()

  if (job.kind === 'og') {
    await pipeline.png({ compressionLevel: 9, effort: 10, palette: false }).toFile(tempPath)
  } else {
    await pipeline.webp({ lossless: true, effort: 6 }).toFile(tempPath)
  }

  const changed = await writeIfChanged(tempPath, job.targetPath, before)
  const targetExists = await exists(job.targetPath)
  const after = targetExists ? (await fs.stat(job.targetPath)).size : before

  return { before, after, changed }
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function checkBudgets(jobs: Iterable<ImageJob>): Promise<number> {
  let failures = 0

  for (const job of jobs) {
    try {
      const checkPath = (await exists(job.targetPath)) ? job.targetPath : job.sourcePath
      const size = (await fs.stat(checkPath)).size
      const budget = job.kind === 'og' ? OG_BUDGET_BYTES : CONTENT_BUDGET_BYTES

      if (size > budget) {
        failures += 1
        console.error(
          `[fail] ${path.relative(ROOT, job.targetPath)} is ${formatBytes(size)}; budget is ${formatBytes(
            budget,
          )}.`,
        )
      }
    } catch {
      failures += 1
      console.error(`[fail] Missing image for ${job.sourceUrl}.`)
    }
  }

  if (failures === 0) {
    console.log('[ok] Optimized image budgets passed.')
  }

  return failures
}

async function readManifest(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await fs.readFile(VARIANTS_FILE, 'utf8')) as Record<string, string>
  } catch {
    return {}
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function main() {
  const markdownFiles = (await walkFiles(CONTENT_DIR)).filter((file) => file.endsWith('.md'))
  const jobs = await collectImageJobs(markdownFiles)

  if (checkOnly) {
    const failures = await checkBudgets(jobs.values())
    process.exit(failures === 0 ? 0 : 1)
  }

  if (jobs.size === 0) {
    console.log('[ok] No content images found to optimize.')
    return
  }

  const manifest = await readManifest()

  for (const job of jobs.values()) {
    const before = (await fs.stat(job.sourcePath)).size
    if (dryRun) {
      console.log(`[dry-run] ${job.sourceUrl} -> ${job.targetUrl} (${formatBytes(before)})`)
      continue
    }

    const result = await optimizeImage(job)
    if (await exists(job.targetPath)) {
      manifest[job.sourceUrl] = job.targetUrl
    } else {
      delete manifest[job.sourceUrl]
    }
    const delta = result.before - result.after
    const sign = delta >= 0 ? '-' : '+'
    console.log(
      `${result.changed ? '[optimized]' : '[unchanged]'} ${job.sourceUrl} -> ${job.targetUrl} ${formatBytes(
        result.before,
      )} -> ${formatBytes(result.after)} (${sign}${formatBytes(Math.abs(delta))})`,
    )
  }

  const orderedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
  const manifestChanged = await writeTextIfChanged(VARIANTS_FILE, `${JSON.stringify(orderedManifest, null, 2)}\n`)
  console.log(`${manifestChanged ? '[updated]' : '[unchanged]'} ${path.relative(ROOT, VARIANTS_FILE)}`)

  const failures = await checkBudgets(jobs.values())
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
