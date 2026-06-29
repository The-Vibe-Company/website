/**
 * Validates the "Victor's Story" article series so a new article can never again
 * land in the wrong spot or without its D-day badge.
 *
 * Rules for every article with `series: victor-story`:
 *   1. it must declare a `seriesDay` (the D-number, e.g. `seriesDay: 3`);
 *   2. `seriesDay` must be a non-negative integer;
 *   3. `seriesDay` must be unique across the series (no two D3);
 *   4. it must NOT set `complexity` (Victor's Story articles don't show it).
 *
 * Runs in CI on every pull request. Exits non-zero with a readable report.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { parseFrontmatter } from '../src/lib/parse-frontmatter'

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const VICTOR_SERIES = 'victor-story'

/**
 * Frontmatter keys whose casing matters: a typo like `seriesday:` slips past
 * both this validator and the renderer, silently producing a mis-tagged article.
 */
const CANONICAL_KEYS = ['series', 'seriesDay', 'complexity']
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
  const seenDays = new Map<number, string>()

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const { data } = parseFrontmatter(raw)
    const rel = path.relative(ROOT, file)

    // Catch a mis-cased key (e.g. "seriesday") on any article — it would
    // otherwise slip past both this gate and the renderer unnoticed.
    for (const key of frontmatterKeys(raw)) {
      const canonical = CANONICAL_BY_LOWER.get(key.toLowerCase())
      if (canonical && key !== canonical) {
        failures.push({
          file: rel,
          reason: `frontmatter key "${key}" should be "${canonical}" (keys are case-sensitive).`,
        })
      }
    }

    if (data.series !== VICTOR_SERIES) continue

    if (data.complexity) {
      failures.push({
        file: rel,
        reason: `must not set "complexity" (found "${data.complexity}") — Victor's Story articles don't show it.`,
      })
    }

    const rawDay = data.seriesDay
    if (rawDay == null || rawDay === '') {
      failures.push({
        file: rel,
        reason: 'missing "seriesDay" — every Victor\'s Story article needs its D-number (e.g. seriesDay: 3).',
      })
      continue
    }

    const day = Number(rawDay)
    if (!Number.isInteger(day) || day < 0) {
      failures.push({ file: rel, reason: `"seriesDay" must be a non-negative integer (found "${rawDay}").` })
      continue
    }

    const duplicate = seenDays.get(day)
    if (duplicate) {
      failures.push({
        file: rel,
        reason: `duplicate seriesDay ${day} — also used by ${duplicate}. Each D-number must be unique.`,
      })
    } else {
      seenDays.set(day, rel)
    }
  }

  if (failures.length > 0) {
    console.error(`\n[victor-story] ${failures.length} problem(s) found:\n`)
    for (const failure of failures) {
      console.error(`  ✗ ${failure.file}\n    ${failure.reason}`)
    }
    console.error('\nFix the frontmatter above and push again.\n')
    process.exit(1)
  }

  console.log(`[victor-story] ok — ${seenDays.size} Victor's Story article(s) validated.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
