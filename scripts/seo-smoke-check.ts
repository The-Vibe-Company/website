/**
 * SEO smoke check: verifies, without a build or a deploy, the invariants the
 * recent SEO fixes rely on. Run it before opening any SEO PR:
 *
 *   bun run seo:check
 *
 * One URL per article and per language. An article or skill is canonical
 * under its own `language` prefix only; under the other prefix it answers a
 * permanent redirect (308) to its translation, or to itself in its own
 * language when it has none. Never a `noindex` page served with a 200.
 *
 * In-process checks, driven by the same helpers the pages and the sitemap use:
 *   1. sitemap: every entry is listed once, under its own language only, and
 *      every hreflang alternate points to a listed, same-language URL;
 *   2. redirects: each entry, requested under each prefix, is served (200)
 *      under its own language and redirects (308) everywhere else, straight
 *      to a canonical URL (no chain, no loop);
 *   3. listings: listing cards and "keep reading" links resolve to a
 *      canonical URL, and a translated article shows up as one card;
 *   4. internal links: the hard-coded article paths in `src/lib` exist, and
 *      a path declared for `fr` or `en` points to an article in that language;
 *   5. source guards: the article and skill pages still redirect with
 *      `permanentRedirect` and declare no `noindex`; entry cards still link
 *      with the entry's own `locale`;
 *   6. titles and social cards: <title> fits in 60 characters and is unique,
 *      every entry has a description, and every type that requires an OG
 *      image has one.
 *
 * Then reuses the existing gates instead of duplicating them: the explicit
 * `language` rule (`content:translations-check`), unique covers
 * (`content:covers-check`), and the SEO unit tests.
 *
 * Exits non-zero with a readable report when anything fails.
 */
import { spawnSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import sitemap from '../src/app/sitemap'
import { ABOUT_ORIGIN_ARTICLE_LOCALE, ABOUT_ORIGIN_ARTICLE_PATH } from '../src/lib/about'
import {
  contentPath,
  getAllContent,
  getCanonicalContentForLanguage,
  getContentByTypeForLanguage,
  getContentForLanguage,
  getContentItem,
  getRelatedContent,
  type ContentEntry,
  type ContentLanguage,
} from '../src/lib/content-source'
import { CONTENT_TYPES, getContentTypeByUrlSlug } from '../src/lib/content-types'
import { PRIORITY_ARTICLES } from '../src/lib/priority-articles'
import { localizedUrl, SITE_NAME } from '../src/lib/site'

const ROOT = process.cwd()
const LANGUAGES: ContentLanguage[] = ['fr', 'en']
const MAX_TITLE_LENGTH = 60

const ARTICLE_PAGE = 'src/app/[locale]/resources/[type]/[slug]/page.tsx'
const SKILL_PAGE = 'src/app/[locale]/resources/skills/[slug]/page.tsx'
/** Components that render a link to a content entry. */
const ENTRY_LINK_COMPONENTS = [
  'src/components/resources/ContentCard.tsx',
  'src/components/resources/SkillCard.tsx',
  'src/components/resources/ArticleBrowser.tsx',
  'src/components/resources/KeepReading.tsx',
  'src/components/resources/TranslationSwitch.tsx',
]

/** Existing gates, run as-is. */
const GATES: { name: string; args: string[] }[] = [
  { name: 'content:translations-check', args: ['scripts/validate-article-translations.ts'] },
  { name: 'content:covers-check', args: ['scripts/validate-unique-covers.ts'] },
  {
    name: 'seo unit tests',
    args: [
      'test',
      'src/lib/content-source.test.ts',
      'src/lib/article-links.test.ts',
      'src/lib/site.test.ts',
      'src/lib/seo-titles.test.ts',
      'src/lib/structured-data.test.ts',
      'src/lib/favicons.test.ts',
    ],
  },
]

type Check = { name: string; run: () => string[] | Promise<string[]> }

type Resolution = { status: 200 } | { status: 308; location: string }

const otherLanguage = (language: ContentLanguage): ContentLanguage =>
  language === 'fr' ? 'en' : 'fr'

const canonicalUrl = (item: ContentEntry): string => localizedUrl(item.language, contentPath(item))

/**
 * What `/{locale}/resources/{type}/{slug}` answers, mirroring the redirect at
 * the top of the article and skill pages (kept in sync by the source guards).
 */
function resolve(item: ContentEntry, locale: ContentLanguage): Resolution {
  if (item.type === 'skill') {
    return item.language === locale
      ? { status: 200 }
      : { status: 308, location: canonicalUrl(item) }
  }
  const target = getCanonicalContentForLanguage(item.type, item.slug, locale) ?? item
  return target.slug !== item.slug || target.language !== locale
    ? { status: 308, location: canonicalUrl(target) }
    : { status: 200 }
}

/** Entry served at an absolute URL, or null when the URL is not a content page. */
function entryAtUrl(url: string): { item: ContentEntry | null; locale: ContentLanguage } | null {
  const match = new URL(url).pathname.match(/^\/(fr|en)\/resources\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  const type = getContentTypeByUrlSlug(match[2])
  return {
    item: type ? getContentItem(type.slug, match[3]) : null,
    locale: match[1] as ContentLanguage,
  }
}

/** HTML <title> the detail page renders, layout template included. */
function renderedTitle(item: ContentEntry): string {
  // Only the article page reads `seoTitle`; the skill page appends "| Skills".
  if (item.type === 'skill') return `${item.title} | Skills | ${SITE_NAME}`
  return item.seoTitle ?? `${item.title} | ${SITE_NAME}`
}

/** Every JSX opening tag `<Name ...>` in `source`, attributes included. */
function jsxTags(source: string, name: string): { tag: string; line: number }[] {
  const tags: { tag: string; line: number }[] = []
  const pattern = new RegExp(`<${name}\\b`, 'g')
  for (const match of source.matchAll(pattern)) {
    let depth = 0
    let end = match.index + match[0].length
    for (; end < source.length; end++) {
      const char = source[end]
      if (char === '{') depth++
      else if (char === '}') depth--
      else if (char === '>' && depth === 0) break
    }
    tags.push({
      tag: source.slice(match.index, end + 1),
      line: source.slice(0, match.index).split('\n').length,
    })
  }
  return tags
}

async function read(rel: string): Promise<string> {
  return fs.readFile(path.join(ROOT, rel), 'utf8')
}

async function listSource(dir: string): Promise<string[]> {
  const entries = await fs.readdir(path.join(ROOT, dir), { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name))
    .map((entry) => path.relative(ROOT, path.join(entry.parentPath, entry.name)))
}

const content = getAllContent()
const sitemapEntries = sitemap()
const sitemapUrls = new Set(sitemapEntries.map((entry) => entry.url))

const checks: Check[] = [
  {
    name: 'sitemap lists each entry once, under its own language only',
    run: () => {
      const failures: string[] = []
      const seen = new Set<string>()
      for (const { url } of sitemapEntries) {
        if (seen.has(url)) failures.push(`${url} is listed twice.`)
        seen.add(url)
      }

      for (const item of content) {
        if (!sitemapUrls.has(canonicalUrl(item))) {
          failures.push(`${item.id}: canonical ${canonicalUrl(item)} is missing.`)
        }
        const wrong = localizedUrl(otherLanguage(item.language), contentPath(item))
        if (sitemapUrls.has(wrong)) failures.push(`${item.id}: wrong-locale ${wrong} is listed.`)
      }

      for (const entry of sitemapEntries) {
        const served = entryAtUrl(entry.url)
        if (!served) continue
        if (!served.item) {
          failures.push(`${entry.url} does not match any article or skill.`)
          continue
        }
        if (served.item.language !== served.locale) {
          failures.push(`${entry.url} is a ${served.item.language} entry under /${served.locale}.`)
        }
        const languages = (entry.alternates?.languages ?? {}) as Record<string, string>
        if (!Object.values(languages).includes(entry.url)) {
          failures.push(`${entry.url}: hreflang alternates do not include the URL itself.`)
        }
        for (const [hreflang, href] of Object.entries(languages)) {
          if (!sitemapUrls.has(href)) {
            failures.push(`${entry.url}: hreflang "${hreflang}" points to ${href}, which is not in the sitemap.`)
          }
          if (hreflang !== 'x-default' && entryAtUrl(href)?.locale !== hreflang) {
            failures.push(`${entry.url}: hreflang "${hreflang}" points to ${href}, under another prefix.`)
          }
        }
      }
      return failures
    },
  },
  {
    name: 'wrong-locale URLs redirect (308) straight to the canonical, never a 200',
    run: () => {
      const failures: string[] = []
      for (const item of content) {
        for (const locale of LANGUAGES) {
          const requested = localizedUrl(locale, contentPath(item))
          const result = resolve(item, locale)
          if (result.status === 200) {
            if (locale !== item.language) {
              failures.push(`${requested} is served (200) for a ${item.language} ${item.type}.`)
            }
            continue
          }
          if (locale === item.language) {
            failures.push(`${requested} redirects away from its own canonical URL.`)
            continue
          }
          const target = entryAtUrl(result.location)
          if (!sitemapUrls.has(result.location)) {
            failures.push(`${requested} redirects to ${result.location}, which is not in the sitemap.`)
          } else if (!target?.item || resolve(target.item, target.locale).status !== 200) {
            failures.push(`${requested} redirects to ${result.location}, which redirects again.`)
          }
        }
      }
      return failures
    },
  },
  {
    name: 'listings and "keep reading" link each entry under its own language',
    run: () => {
      const failures: string[] = []
      for (const type of CONTENT_TYPES) {
        for (const locale of LANGUAGES) {
          const cards = getContentByTypeForLanguage(type.slug, locale)
          const keys = new Set<string>()
          for (const item of cards) {
            // Cards link to `contentPath(item)` with `locale={item.language}`.
            if (resolve(item, item.language).status !== 200) {
              failures.push(`/${locale}/resources card for ${item.id} links to a redirect.`)
            }
            if (item.translationKey) {
              if (keys.has(item.translationKey)) {
                failures.push(`/${locale}/resources shows "${item.translationKey}" twice.`)
              }
              keys.add(item.translationKey)
              const local = getContentForLanguage(item.type, item.slug, locale)
              if (item.language !== locale && local) {
                failures.push(`/${locale}/resources shows ${item.id} instead of its ${locale} version ${local.id}.`)
              }
            }
          }
        }
      }

      // KeepReading links a related entry to its version in the page's language.
      for (const item of content) {
        for (const related of getRelatedContent(item.type, item.slug, 3)) {
          const target = getContentForLanguage(related.type, related.slug, item.language) ?? related
          if (resolve(target, target.language).status !== 200) {
            failures.push(`${item.id}: "keep reading" link to ${related.id} hits a redirect.`)
          }
        }
      }
      return failures
    },
  },
  {
    name: 'hard-coded article links in src/lib exist and match their language',
    run: async () => {
      const failures: string[] = []
      const check = (where: string, articlePath: string, language?: string) => {
        const slug = articlePath.match(/^\/resources\/articles\/([^/?#]+)$/)?.[1]
        const item = slug ? getContentItem('article', slug) : null
        if (!item) failures.push(`${where}: ${articlePath} is not an article.`)
        else if (language && item.language !== language) {
          failures.push(`${where}: ${articlePath} is linked under /${language} but is a ${item.language} article.`)
        }
      }

      // `{ fr: ..., en: ... }` maps of article paths, at any depth.
      const walk = (where: string, value: unknown, language?: string) => {
        if (typeof value === 'string') {
          if (value.startsWith('/resources/articles/')) check(where, value, language)
        } else if (Array.isArray(value)) {
          value.forEach((child) => walk(where, child, language))
        } else if (value && typeof value === 'object') {
          for (const [key, child] of Object.entries(value)) {
            walk(where, child, LANGUAGES.includes(key as ContentLanguage) ? key : language)
          }
        }
      }

      const modules = (await listSource('src/lib')).filter((file) => file.endsWith('.ts'))
      for (const file of modules) {
        if (!(await read(file)).includes("/resources/articles/")) continue
        const exports = (await import(path.join(ROOT, file))) as Record<string, unknown>
        for (const [name, value] of Object.entries(exports)) walk(`${file} ${name}`, value)
      }

      for (const language of LANGUAGES) {
        for (const { slug } of PRIORITY_ARTICLES[language]) {
          check(`PRIORITY_ARTICLES.${language}`, `/resources/articles/${slug}`, language)
        }
      }
      check('ABOUT_ORIGIN_ARTICLE_PATH', ABOUT_ORIGIN_ARTICLE_PATH, ABOUT_ORIGIN_ARTICLE_LOCALE)
      return failures
    },
  },
  {
    name: 'pages redirect permanently, declare no noindex, cards keep the entry locale',
    run: async () => {
      const failures: string[] = []
      const pages: [string, string][] = [
        [ARTICLE_PAGE, 'getCanonicalContentForLanguage('],
        [SKILL_PAGE, 'item.language !== locale'],
      ]
      for (const [file, rule] of pages) {
        const source = await read(file)
        if (!source.includes('permanentRedirect(')) {
          failures.push(`${file}: no longer calls permanentRedirect (308) for wrong-locale requests.`)
        }
        if (!source.includes(rule)) {
          failures.push(`${file}: wrong-locale rule changed (expected \`${rule}\`); update resolve() in this script.`)
        }
        if (/noindex|index:\s*false/.test(source)) {
          failures.push(`${file}: declares noindex; a wrong-locale URL must redirect instead.`)
        }
      }

      for (const file of ENTRY_LINK_COMPONENTS) {
        const source = await read(file)
        for (const { tag, line } of jsxTags(source, 'Link')) {
          if (!/\blocale=|\{\.\.\./.test(tag)) {
            failures.push(`${file}:${line}: <Link> has no locale, so it links under the browsed prefix.`)
          }
        }
      }

      for (const file of await listSource('src')) {
        if (!file.endsWith('.tsx')) continue
        const source = await read(file)
        for (const name of ['ContentCard', 'SkillCard']) {
          for (const { tag, line } of jsxTags(source, name)) {
            if (!/\blanguage=/.test(tag)) {
              failures.push(`${file}:${line}: <${name}> is missing language=, so it links under the browsed prefix.`)
            }
          }
        }
      }
      return failures
    },
  },
  {
    name: `titles fit in ${MAX_TITLE_LENGTH} characters, are unique, with description and OG image`,
    run: () => {
      const failures: string[] = []
      const titles = new Map<string, string>()
      for (const item of content) {
        const title = renderedTitle(item)
        const length = [...title].length
        if (!item.title.trim()) failures.push(`${item.id}: empty title.`)
        if (length > MAX_TITLE_LENGTH) {
          failures.push(`${item.id}: <title> is ${length} characters (max ${MAX_TITLE_LENGTH}): "${title}". Add or shorten \`seoTitle\`.`)
        }
        const duplicate = titles.get(title)
        if (duplicate) failures.push(`${item.id}: <title> "${title}" is also used by ${duplicate}.`)
        titles.set(title, item.id)
        if (!item.summary.trim()) failures.push(`${item.id}: empty summary (meta description).`)
        const type = CONTENT_TYPES.find((candidate) => candidate.slug === item.type)
        if (type?.requiresOgImage && !(item.ogImage ?? item.featuredImage)) {
          failures.push(`${item.id}: no ogImage or coverImage for the social card.`)
        }
      }
      return failures
    },
  },
]

function runGate(gate: (typeof GATES)[number]): string[] {
  const result = spawnSync(process.execPath, gate.args, { cwd: ROOT, encoding: 'utf8' })
  if (result.status === 0) return []
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
  return [`\`bun ${gate.args.join(' ')}\` failed:\n${output}`]
}

async function main(): Promise<void> {
  const started = performance.now()
  let failed = 0

  const report = (name: string, failures: string[]) => {
    if (failures.length === 0) {
      console.log(`[ok] ${name}`)
      return
    }
    failed++
    for (const failure of failures) console.error(`[fail] ${name}: ${failure}`)
  }

  for (const check of checks) report(check.name, await check.run())
  for (const gate of GATES) report(gate.name, runGate(gate))

  const seconds = ((performance.now() - started) / 1000).toFixed(1)
  const scope = `${content.length} entries, ${sitemapEntries.length} sitemap URLs`
  if (failed > 0) {
    console.error(`[fail] seo:check: ${failed} of ${checks.length + GATES.length} checks failed (${scope}, ${seconds}s).`)
    process.exit(1)
  }
  console.log(`[ok] seo:check: ${checks.length + GATES.length} checks passed (${scope}, ${seconds}s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
