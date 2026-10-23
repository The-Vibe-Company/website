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
    languages: localizedLanguages(path),
  };
}

/**
 * The self-inclusive hreflang set of a page served at the same path in both
 * languages. The French URL (the site's default language, keep in sync with
 * `routing.defaultLocale`) doubles as `x-default`.
 */
export function localizedLanguages(path = "/"): Record<string, string> {
  return splitPathLanguages({ fr: path, en: path });
}

/** The hreflang set of a page whose path differs per language. */
export function splitPathLanguages(paths: SplitPaths): Record<string, string> {
  return {
    fr: localizedUrl("fr", paths.fr),
    en: localizedUrl("en", paths.en),
    "x-default": localizedUrl("fr", paths.fr),
  };
}

/**
 * Alternates for a page whose path differs per language: the canonical is the
 * current language's own URL, and both languages stay in the hreflang set.
 */
export function splitPathAlternates(locale: string, paths: SplitPaths) {
  return {
    canonical: localizedUrl(locale, splitPath(paths, locale)),
    languages: splitPathLanguages(paths),
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

/**
 * Content published in a single language: it declares itself, and doubles as
 * `x-default` since there is no other version to send anyone to.
 */
export function monolingualAlternates(language: string, path: string) {
  const canonical = localizedUrl(language, path);

  return {
    canonical,
    languages: {
      [language]: canonical,
      "x-default": canonical,
    },
  };
}

export function openGraphLocale(locale: string): string {
  return locale === "fr" ? "fr_FR" : "en_US";
}

/**
 * A social card image, as a site path, with its alt text and, when known, its
 * size and MIME type.
 */
export type SocialImage = { path: string; width?: number; height?: number; type?: string; alt: string };

/**
 * The site's square logo (served from `src/app/icon.png`), declared as the
 * logo in the Organization structured data. Not a social card: networks crop
 * a square into their 1.91:1 frame.
 */
export const SITE_LOGO = { path: "/icon.png", width: 1024, height: 1024 } as const;

/**
 * The social card of any page that has no image of its own. A 1.91:1 JPEG
 * (not WebP, which LinkedIn does not render in link previews).
 */
export const DEFAULT_OG_IMAGE = {
  path: "/og/default.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: SITE_NAME,
} as const satisfies SocialImage;

/** A social image as the `openGraph.images` entry Next.js expects. */
export function openGraphImage(image: SocialImage) {
  return {
    url: absoluteUrl(image.path),
    ...(image.width && image.height ? { width: image.width, height: image.height } : {}),
    ...(image.type ? { type: image.type } : {}),
    alt: image.alt,
  };
}

/**
 * Site-wide defaults for the layout, so a page that declares no social
 * metadata of its own still shares the default card.
 */
export function defaultSocialMetadata(locale: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: openGraphLocale(locale),
      siteName: SITE_NAME,
      images: [openGraphImage(DEFAULT_OG_IMAGE)],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(DEFAULT_OG_IMAGE.path)],
    },
  };
}

export function localizedSocialMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  /** The page's own card. Without one, the page shares the default card. */
  image?: SocialImage;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const card = image ?? DEFAULT_OG_IMAGE;
  const imageUrl = absoluteUrl(card.path);
  return {
    openGraph: {
      type: "website",
      locale: openGraphLocale(locale),
      url: localizedUrl(locale, path),
      siteName: SITE_NAME,
      title,
      description,
      images: [openGraphImage(card)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
