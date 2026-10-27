/**
 * Validates `translationKey`, the shared identifier that links the FR and EN
 * versions of the same article so the resources list shows one card instead of
 * two, and so each version declares the other through hreflang.
 *
 * An article WITHOUT a `translationKey` is perfectly valid: it simply has no
 * translation yet and keeps behaving as a standalone article.
 *
 * Every article, translated or not, must declare an explicit `language` (`fr`
 * or `en`): it decides which prefix the article is canonical on, and the other
 * prefix redirects there. A missing value would silently default to `en` and
 * send a French article's readers to the wrong URL. Skills follow the same
 * rule, so they are checked for `language` too.
 *
 * Rules for every article that declares `translationKey`:
 *   1. the value must be a lowercase kebab-case slug (e.g. `hds-health-data`);
 *   2. no two articles may share both the same key and the same language;
 *   3. the key must be shared by at least one other article, otherwise it is a
 *      typo or a leftover, and the pairing silently does nothing;
 *   4. every article in a group must declare the same `series`, so a pair never
 *      splits across the two columns of the resources list.
 *
 * Also catches a mis-cased `translationKey` key (e.g. `translationkey:`), which
 * would otherwise slip past both this gate and the renderer.
 *
 * Runs in CI on every pull request. Exits non-zero with a readable report.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { parseFrontmatter } from '../src/lib/parse-frontmatter'

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const SKILLS_DIR = path.join(ROOT, 'content', 'skills')

/** Frontmatter keys whose casing matters: a typo silently unlinks the pair. */
const CANONICAL_KEYS = ['translationKey', 'language']
const CANONICAL_BY_LOWER = new Map(CANONICAL_KEYS.map((key) => [key.toLowerCase(), key]))

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const LANGUAGES = ['fr', 'en']

type Failure = { file: string; reason: string }

type Article = { file: string; key: string; language: string; series: string }

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
  const translated: Article[] = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const { data } = parseFrontmatter(raw)
    const rel = path.relative(ROOT, file)

    // Catch a mis-cased key (e.g. "translationkey") on any article.
    for (const key of frontmatterKeys(raw)) {
      const canonical = CANONICAL_BY_LOWER.get(key.toLowerCase())
      if (canonical && key !== canonical) {
        failures.push({
          file: rel,
          reason: `frontmatter key "${key}" should be "${canonical}" (keys are case-sensitive).`,
        })
      }
    }

    const language = data.language?.trim() ?? ''
    if (!LANGUAGES.includes(language)) {
      failures.push({
        file: rel,
        reason: `must declare \`language: fr\` or \`language: en\` (found ${language ? `"${language}"` : 'nothing'}); it decides which URL the article is canonical on.`,
      })
      continue
    }

    const key = data.translationKey?.trim()
    if (!key) continue

    if (!KEY_PATTERN.test(key)) {
      failures.push({
        file: rel,
        reason: `translationKey "${key}" must be lowercase kebab-case (e.g. "hds-health-data").`,
      })
      continue
    }

    translated.push({ file: rel, key, language, series: data.series?.trim() ?? '' })
  }

  const groups = new Map<string, Article[]>()
  for (const article of translated) {
    const group = groups.get(article.key)
    if (group) group.push(article)
    else groups.set(article.key, [article])
  }

  for (const [key, group] of groups) {
    if (group.length < 2) {
      failures.push({
        file: group[0].file,
        reason: `translationKey "${key}" is not shared by any other article. Pair it with the translation, or drop the key if this article has none.`,
      })
      continue
    }

    for (const language of LANGUAGES) {
      const sameLanguage = group.filter((article) => article.language === language)
      if (sameLanguage.length > 1) {
        failures.push({
          file: sameLanguage[1].file,
          reason: `translationKey "${key}" is already used by ${sameLanguage[0].file} for language "${language}". One version per language.`,
        })
      }
    }

    const series = new Set(group.map((article) => article.series))
    if (series.size > 1) {
      failures.push({
        file: group[0].file,
        reason: `translationKey "${key}" groups articles with different \`series\` values (${[...series].map((value) => value || '(none)').join(', ')}). Translations must stay in the same series.`,
      })
    }
  }

  // Skills have no translations, but redirect on `language` the same way.
  const skillFiles = await listMarkdown(SKILLS_DIR)
  for (const file of skillFiles) {
    const { data } = parseFrontmatter(await fs.readFile(file, 'utf8'))
    const language = data.language?.trim() ?? ''
    if (!LANGUAGES.includes(language)) {
      failures.push({
        file: path.relative(ROOT, file),
        reason: `must declare \`language: fr\` or \`language: en\` (found ${language ? `"${language}"` : 'nothing'}); it decides which URL the skill is canonical on.`,
      })
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`[fail] ${failure.file}: ${failure.reason}`)
    }
    console.error(`[fail] ${failures.length} validation error(s).`)
    process.exit(1)
  }

  console.log(
    `[ok] ${files.length} article(s) and ${skillFiles.length} skill(s) checked, ${groups.size} translation pair(s) validated.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
