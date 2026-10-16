/**
 * Guarantees that every article ships its own cover, by content rather than
 * by file name: two covers at different paths with the same bytes are the
 * same picture to a reader, so the check hashes the files (sha256) instead of
 * comparing frontmatter strings.
 *
 * Rules, for `coverImage` and `ogImage` of every article in content/articles:
 *   1. both fields are required, must stay inside public/ and must point at an
 *      existing file. A missing cover is an error, never something to paper
 *      over by copying another article's image;
 *   2. the same bytes may only be used by ONE article. The FR and EN versions
 *      of an article (same `translationKey`, the pairing validated by
 *      validate-article-translations.ts) count as one article, so they may,
 *      and should, reference the same path;
 *   3. identical bytes must also live at a single path: a byte-for-byte copy
 *      under another name is a duplicated cover, even within one article.
 *
 * Runs in CI on every pull request. Exits non-zero with a readable report.
 */
import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { parseFrontmatter } from '../src/lib/parse-frontmatter'

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const PUBLIC_DIR = path.join(ROOT, 'public')

const COVER_FIELDS = ['coverImage', 'ogImage'] as const

type CoverField = (typeof COVER_FIELDS)[number]

export type CoverReference = {
  /** Article file, relative to the repo root. */
  file: string
  /** One id per article: the translation key when there is one, else the slug. */
  group: string
  field: CoverField
  url: string
  hash: string
}

type Failure = { file: string; reason: string }

/** The FR and EN versions of an article share a group; any other article is its own. */
export function articleGroup(data: Record<string, string>, file: string): string {
  const key = data.translationKey?.trim()
  if (key) return `translationKey:${key}`
  const slug = data.slug?.trim() || path.basename(file, '.md')
  return `slug:${slug}`
}

/**
 * Returns one failure per set of byte-identical covers that is shared by more
 * than one article, or stored under more than one path.
 */
export function findDuplicateCovers(references: CoverReference[]): Failure[] {
  const byHash = new Map<string, CoverReference[]>()
  for (const reference of references) {
    const list = byHash.get(reference.hash)
    if (list) list.push(reference)
    else byHash.set(reference.hash, [reference])
  }

  const failures: Failure[] = []
  for (const [hash, list] of byHash) {
    const groups = new Set(list.map((reference) => reference.group))
    const urls = new Set(list.map((reference) => reference.url))
    if (groups.size < 2 && urls.size < 2) continue

    const files = [...new Set(list.map((reference) => reference.file))].sort()
    const usages = list
      .map((reference) => `    - ${reference.file} (${reference.field}: ${reference.url})`)
      .sort()
      .join('\n')
    const reason =
      groups.size > 1
        ? `${groups.size} different articles share the same cover bytes (sha256 ${hash.slice(0, 12)}…). Each article needs its own cover; only the FR/EN versions of one article may share it.`
        : `the same cover bytes (sha256 ${hash.slice(0, 12)}…) are stored under ${urls.size} paths. Reference a single file instead of a copy.`

    failures.push({ file: files.join(', '), reason: `${reason}\n${usages}` })
  }

  return failures
}

function toPublicPath(url: string): string {
  return path.resolve(PUBLIC_DIR, url.replace(/^\//, ''))
}

function isInsidePublic(resolvedPath: string): boolean {
  const relative = path.relative(PUBLIC_DIR, resolvedPath)
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
}

async function listMarkdown(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(dir, entry.name))
      .sort()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function main(): Promise<void> {
  const files = await listMarkdown(ARTICLES_DIR)
  const failures: Failure[] = []
  const references: CoverReference[] = []
  const hashes = new Map<string, string>()

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const { data } = parseFrontmatter(await fs.readFile(file, 'utf8'))
    const group = articleGroup(data, file)

    for (const field of COVER_FIELDS) {
      const url = data[field]?.trim() ?? ''
      if (!url) {
        failures.push({
          file: rel,
          reason: `missing \`${field}:\` frontmatter field. Generate a cover with \`bun run cover:generate\`, never reuse another article's.`,
        })
        continue
      }

      const sourcePath = toPublicPath(url)
      if (!isInsidePublic(sourcePath)) {
        failures.push({ file: rel, reason: `${field} path escapes the public/ directory: ${url}` })
        continue
      }

      let hash = hashes.get(sourcePath)
      if (!hash) {
        try {
          hash = createHash('sha256').update(await fs.readFile(sourcePath)).digest('hex')
        } catch {
          failures.push({ file: rel, reason: `${field} file not found at public${url}` })
          continue
        }
        hashes.set(sourcePath, hash)
      }

      references.push({ file: rel, group, field, url, hash })
    }
  }

  failures.push(...findDuplicateCovers(references))

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`[fail] ${failure.file}: ${failure.reason}`)
    }
    console.error(`[fail] ${failures.length} validation error(s).`)
    process.exit(1)
  }

  const groups = new Set(references.map((reference) => reference.group))
  console.log(
    `[ok] ${files.length} article(s) checked, ${hashes.size} distinct cover file(s) across ${groups.size} article(s).`,
  )
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
