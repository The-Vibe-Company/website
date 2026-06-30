/**
 * Validates the "Focus" article tag so a Focus article can never land mis-tagged
 * or without what the format needs.
 *
 * Rules for every article that declares `focus`:
 *   1. `focus` must be exactly `true`;
 *   2. it must set an `ogImage` (Focus articles are shared, they need a social image);
 *   3. it must NOT set `complexity` (Focus articles don't show it, like Victor's Story).
 *
 * Also catches a mis-cased `focus` key (e.g. `Focus:`) on any article, which would
 * otherwise slip past both this gate and the renderer.
 *
 * Runs in CI on every pull request. Exits non-zero with a readable report.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { parseFrontmatter } from '../src/lib/parse-frontmatter'

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')

/** Frontmatter keys whose casing matters: a typo silently mis-tags the article. */
const CANONICAL_KEYS = ['focus']
const CANONICAL_BY_LOWER = new Map(CANONICAL_KEYS.map((key) => [key.toLowerCase(), key]))

type Failure = { file: string; reason: string }

function frontmatterKeys(raw: string): string[] {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return []
  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf(':')
      return index === -1 ? '' : line.slice(0, index).trim()
    })
    .filter(Boolean)
}

async function listMarkdown(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(dir, entry.name))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function main(): Promise<void> {
  const files = await listMarkdown(ARTICLES_DIR)
  const failures: Failure[] = []
  let focusCount = 0

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const { data } = parseFrontmatter(raw)
    const rel = path.relative(ROOT, file)

    // Catch a mis-cased key (e.g. "Focus") on any article.
    for (const key of frontmatterKeys(raw)) {
      const canonical = CANONICAL_BY_LOWER.get(key.toLowerCase())
      if (canonical && key !== canonical) {
        failures.push({
          file: rel,
          reason: `frontmatter key "${key}" should be "${canonical}" (keys are case-sensitive).`,
        })
      }
    }

    if (data.focus == null || data.focus === '') continue
    focusCount += 1

    if (data.focus.trim() !== 'true') {
      failures.push({
        file: rel,
        reason: `"focus" must be exactly "true" (found "${data.focus}").`,
      })
    }

    if (data.complexity) {
      failures.push({
        file: rel,
        reason: `must not set "complexity" (found "${data.complexity}") — Focus articles don't show it.`,
      })
    }

    if (!data.ogImage || data.ogImage.trim() === '') {
      failures.push({
        file: rel,
        reason: 'missing "ogImage" — every Focus article needs a social image.',
      })
    }
  }

  if (failures.length > 0) {
    console.error(`\n[focus] ${failures.length} problem(s) found:\n`)
    for (const failure of failures) {
      console.error(`  ✗ ${failure.file}\n    ${failure.reason}`)
    }
    console.error('\nFix the frontmatter above and push again.\n')
    process.exit(1)
  }

  console.log(`[focus] ok — ${focusCount} Focus article(s) validated.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
