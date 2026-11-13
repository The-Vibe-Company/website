import { ABOUT_PATHS, localizedPath, localizedUrl, splitPath } from "@/lib/site";

/**
 * The people who sign articles. An article names its author with an optional
 * `author` frontmatter key holding one of these ids; without it, Victor's
 * Story articles (`series: victor-story`) are Victor's and every other
 * article is Stan's. There is no author page: the byline links to the
 * author's own page (the About page for Stan, LinkedIn for Victor).
 */

export type AuthorId = "stan-girard" | "victor-nivault";

type Localized = { fr: string; en: string };

export interface Author {
  id: AuthorId;
  name: string;
  role: Localized;
  /**
   * Where the byline links to: a site path (resolved per locale) or an
   * external URL. Empty when there is none.
   */
  url: Localized | string;
  /** Profiles restated as `sameAs` in structured data. */
  sameAs: string[];
  /** Restate The Vibe Company as `worksFor` in structured data. */
  worksForCompany?: boolean;
  /** A portrait, for later. Unused for now. */
  image?: string;
}

export const DEFAULT_AUTHOR_ID: AuthorId = "stan-girard";
export const VICTOR_STORY_SERIES = "victor-story";

export const AUTHORS: Record<AuthorId, Author> = {
  "stan-girard": {
    id: "stan-girard",
    name: "Stan Girard",
    role: { fr: "Cofondateur", en: "Co-founder" },
    url: ABOUT_PATHS,
    sameAs: [
      "https://www.linkedin.com/in/stan-girard/",
      "https://x.com/_stangirard",
      "https://github.com/StanGirard",
    ],
  },
  "victor-nivault": {
    id: "victor-nivault",
    name: "Victor Nivault",
    role: { fr: "Builder", en: "Builder" },
    url: "https://www.linkedin.com/in/victor-nivault-698a77217",
    sameAs: ["https://www.linkedin.com/in/victor-nivault-698a77217"],
    worksForCompany: true,
  },
};

export function isAuthorId(value: unknown): value is AuthorId {
  return typeof value === "string" && Object.hasOwn(AUTHORS, value);
}

/**
 * The author of an article: its explicit `author` id, else Victor for the
 * Victor's Story series, else Stan. An unknown id falls back to the same rule
 * (the content tests reject one before it ships).
 */
export function resolveArticleAuthor({
  author,
  series,
}: {
  author?: string;
  series?: string;
}): Author {
  if (isAuthorId(author)) return AUTHORS[author];
  if (series === VICTOR_STORY_SERIES) return AUTHORS["victor-nivault"];
  return AUTHORS[DEFAULT_AUTHOR_ID];
}

function lang(locale: string): "fr" | "en" {
  return locale === "en" ? "en" : "fr";
}

export function authorRole(author: Author, locale: string): string {
  return author.role[lang(locale)];
}

/** The author's site page, without the locale prefix, or null when it lives elsewhere. */
export function authorSitePath(author: Author, locale: string): string | null {
  return typeof author.url === "string" ? null : splitPath(author.url, lang(locale));
}

/** The byline link: a locale-prefixed site path, an external URL, or "" when none. */
export function authorHref(author: Author, locale: string): string {
  const sitePath = authorSitePath(author, locale);
  return sitePath === null ? (author.url as string) : localizedPath(lang(locale), sitePath);
}

/** The author's URL as an absolute URL (structured data, Open Graph), or "" when none. */
export function authorAbsoluteUrl(author: Author, locale: string): string {
  if (typeof author.url === "string") return author.url;
  return localizedUrl(lang(locale), splitPath(author.url, lang(locale)));
}

export function isExternalAuthorUrl(href: string): boolean {
  return /^https?:\/\//.test(href);
}
