import fs from "fs";
import path from "path";
import type { ArticleTranslationMap } from "./article-translations";
import { parseFrontmatter } from "./parse-frontmatter";

// Kept free of `@/` imports: next.config.ts loads this module at build time.

export interface ArticleLanguageEntry {
  slug: string;
  language: "fr" | "en";
  translationKey?: string;
}

export interface BareArticleRedirect {
  source: string;
  destination: string;
  permanent: true;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/**
 * Slug, language and translation key of every article, read straight from the
 * Markdown frontmatter with the same rules as `content-source.ts` (explicit
 * `slug` wins over the file name, a missing `language` means `en`).
 */
export function readArticleLanguages(directory: string = ARTICLES_DIR): ArticleLanguageEntry[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data } = parseFrontmatter(fs.readFileSync(path.join(directory, file), "utf8"));
      return {
        slug: data.slug || file.replace(/\.md$/, ""),
        language: data.language === "fr" ? "fr" : "en",
        translationKey: data.translationKey?.trim() || undefined,
      } satisfies ArticleLanguageEntry;
    });
}

/**
 * One permanent redirect per article published in a single language, from its
 * prefix-less URL straight to its own language's URL.
 *
 * Without these, the middleware sends a prefix-less URL to the visitor's
 * locale first and the article page then corrects the language: two 308s for
 * an EN-only article reached from France (THE-2364). Config redirects run
 * before the middleware, so the article's language decides in one hop.
 *
 * Translated articles are left to the middleware: both languages exist, so
 * the visitor's locale still picks the version, and `articleTranslationMap`
 * lets it pick the right slug in the same hop. Unknown slugs are untouched.
 */
export function bareArticleRedirects(entries: ArticleLanguageEntry[]): BareArticleRedirect[] {
  return entries
    .filter((entry) => !entry.translationKey)
    .map(assertPlainSlug)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((entry) => ({
      source: `/resources/articles/${entry.slug}`,
      destination: `/${entry.language}/resources/articles/${entry.slug}`,
      permanent: true,
    }));
}

/**
 * For every translated article, each of its slugs mapped to the slug of every
 * language version, for the middleware (see `translatedArticlePath`).
 */
export function articleTranslationMap(entries: ArticleLanguageEntry[]): ArticleTranslationMap {
  const groups = new Map<string, { fr?: string; en?: string }>();
  for (const entry of entries) {
    if (!entry.translationKey) continue;
    const group = groups.get(entry.translationKey) ?? {};
    group[entry.language] = entry.slug;
    groups.set(entry.translationKey, group);
  }
  const map: ArticleTranslationMap = {};
  for (const entry of entries) {
    if (entry.translationKey) map[assertPlainSlug(entry).slug] = groups.get(entry.translationKey)!;
  }
  return map;
}

// Slugs become redirect `source` patterns: anything beyond plain kebab-case
// (`:`, `(`, `*`...) would turn into path-to-regexp syntax.
function assertPlainSlug(entry: ArticleLanguageEntry): ArticleLanguageEntry {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
    throw new Error(`Article slug "${entry.slug}" must be lowercase kebab-case`);
  }
  return entry;
}
