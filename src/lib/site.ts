import type { Metadata } from "next";

export const SITE_NAME = "The Vibe Company";
export const SITE_URL = "https://www.thevibecompany.co";
export const SITE_DESCRIPTION =
  "An AI-native agency. Everything 10 to 20× faster with AI — products, ops, training. Our agency runs on AI too.";

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  /** Also declare the French URL as `x-default` in the hreflang set. */
  xDefault?: boolean;
};

export const INDEXABLE_STATIC_ROUTES: SiteRoute[] = [
  {
    path: "/",
    title: SITE_NAME,
    description:
      "The Vibe Company is an AI-native agency. We make every part of your business 10 to 20× faster with AI — products, agent ops, training.",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/portfolio",
    title: "Projects",
    description:
      "A selection of projects built by The Vibe Company.",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/resources",
    title: "Resources",
    description:
      "Shareable AI skills and articles from The Vibe Company.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/quivr",
    title: "Quivr V2",
    description:
      "Quivr V2, the open-source engine by The Vibe Company that turns continuous content streams into search and monitoring: durable ingestion, hybrid search, alerts, webhooks, plugins and MCP.",
    changeFrequency: "weekly",
    priority: 0.8,
    xDefault: true,
  },
];

/**
 * A page whose URL segment is translated, so each language owns its own path.
 * "/about" in English, "/a-propos" in French: one page, two canonicals, each
 * declaring the other through hreflang.
 */
export type SplitPaths = { fr: string; en: string };

export const ABOUT_PATHS: SplitPaths = { fr: "/a-propos", en: "/about" };

export type SplitPathRoute = Omit<SiteRoute, "path"> & { paths: SplitPaths };

export const INDEXABLE_SPLIT_PATH_ROUTES: SplitPathRoute[] = [
  {
    paths: ABOUT_PATHS,
    title: "About",
    description:
      "Who The Vibe Company is: an AI-first agency in Paris, YC W24, with the key facts about the company, its team, and how it works.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export function splitPath(paths: SplitPaths, locale: string): string {
  return locale === "en" ? paths.en : paths.fr;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function localizedPath(locale: string, path = "/"): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${suffix}`;
}

export function localizedUrl(locale: string, path = "/"): string {
  return absoluteUrl(localizedPath(locale, path));
}

export function localizedAlternates(
  locale: string,
  path = "/",
  { xDefault = false }: { xDefault?: boolean } = {},
) {
  return {
    canonical: localizedUrl(locale, path),
    languages: localizedLanguages(path, { xDefault }),
  };
}

/**
 * The self-inclusive hreflang set of a page served at the same path in both
 * languages. With `xDefault`, the French URL (the site's default language,
 * keep in sync with `routing.defaultLocale`) doubles as `x-default`.
 */
export function localizedLanguages(
  path = "/",
  { xDefault = false }: { xDefault?: boolean } = {},
): Record<string, string> {
  return {
    fr: localizedUrl("fr", path),
    en: localizedUrl("en", path),
    ...(xDefault ? { "x-default": localizedUrl("fr", path) } : {}),
  };
}

/**
 * Alternates for a page whose path differs per language: the canonical is the
 * current language's own URL, and both languages stay in the hreflang set.
 */
export function splitPathAlternates(locale: string, paths: SplitPaths) {
  return {
    canonical: localizedUrl(locale, splitPath(paths, locale)),
    languages: {
      fr: localizedUrl("fr", paths.fr),
      en: localizedUrl("en", paths.en),
    },
  };
}

/** A language version of a piece of content, as an unprefixed site path. */
export type ContentVersion = { language: string; path: string };

/**
 * Alternates for content published in one or more languages. Each version is
 * canonical on its own URL and declares every translation, so a pair points at
 * itself and at the other; `x-default` goes to the French version, the site's
 * default language. Content published in a single language keeps the
 * monolingual declaration.
 */
export function contentAlternates(
  language: string,
  path: string,
  versions: ContentVersion[],
) {
  if (versions.length < 2) return monolingualAlternates(language, path);

  const languages: Record<string, string> = {};
  for (const version of versions) {
    languages[version.language] = localizedUrl(version.language, version.path);
  }

  // Keep this in sync with `routing.defaultLocale`.
  const fallback = versions.find((version) => version.language === "fr") ?? versions[0];
  languages["x-default"] = localizedUrl(fallback.language, fallback.path);

  return {
    canonical: localizedUrl(language, path),
    languages,
  };
}

export function monolingualAlternates(language: string, path: string) {
  const canonical = localizedUrl(language, path);

  return {
    canonical,
    languages: {
      [language]: canonical,
    },
  };
}

export function localizedSocialMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: localizedUrl(locale, path),
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
