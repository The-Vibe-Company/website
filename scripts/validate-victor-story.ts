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

type Failure = { file: string; reason: string }

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
    if (data.series !== VICTOR_SERIES) continue

    const rel = path.relative(ROOT, file)

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
