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

export function localizedAlternates(locale: string, path = "/") {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      fr: localizedUrl("fr", path),
      en: localizedUrl("en", path),
    },
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
