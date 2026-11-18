// Edge-safe: imported by the middleware, so no `fs` and no `@/` imports here.

/** Translated article slug -> the slug of each of its language versions. */
export type ArticleTranslationMap = Record<string, { fr?: string; en?: string }>;

/**
 * The map is computed from `content/articles` at build time (next.config.ts)
 * and inlined into the middleware bundle through this env variable.
 */
export const ARTICLE_TRANSLATIONS_ENV = "ARTICLE_TRANSLATIONS";

export function parseArticleTranslations(raw: string | undefined): ArticleTranslationMap {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ArticleTranslationMap) : {};
  } catch {
    return {};
  }
}

/**
 * Locale-less path of a prefix-less translated article URL, rewritten to the
 * slug of the version in `locale`: `/resources/articles/rag-entreprise` for
 * `en` gives `/resources/articles/enterprise-rag`, so the middleware lands on
 * the final URL in one redirect instead of letting the page correct the slug
 * in a second one (THE-2364). Any other path comes back unchanged.
 */
export function translatedArticlePath(
  pathname: string,
  locale: string,
  translations: ArticleTranslationMap,
): string {
  const match = /^\/resources\/articles\/([^/]+)\/?$/.exec(pathname);
  if (!match) return pathname;
  const versions = translations[match[1]];
  const target = locale === "fr" || locale === "en" ? versions?.[locale] : undefined;
  return target ? `/resources/articles/${target}` : pathname;
}
