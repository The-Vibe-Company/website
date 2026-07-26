export const SITE_NAME = "The Vibe Company";
export const SITE_URL = "https://www.thevibecompany.co";
export const SITE_DESCRIPTION =
  "An AI-native agency. Everything 10 to 20× faster with AI — products, ops, training. Our agency runs on AI too.";

/** Official brand identity, used for structured data (SEO/GEO disambiguation). */
export const SITE_EMAIL = "founders@thevibecompany.co";
export const SITE_FOUNDING_YEAR = "2023";
export const SITE_LOCALITY = "Paris";
export const SITE_COUNTRY = "FR";

/**
 * Stable, language-neutral one-liner for structured data. Kept separate from
 * the marketing tagline (which may change) so the schema stays stable.
 */
export const SITE_ORG_DESCRIPTION =
  "The Vibe Company is an AI-native agency. We build AI products, automate operations with AI agents, and train teams.";

/** Official accounts. `sameAs` is what ties the identity together for search engines and AI. */
export const SITE_SAME_AS = [
  "https://x.com/thevibecompany",
  "https://github.com/The-Vibe-Company",
  "https://www.linkedin.com/company/thevibecompany",
];

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

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
