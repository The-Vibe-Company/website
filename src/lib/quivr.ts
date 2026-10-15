/**
 * Facts and links for the Quivr project page (/fr/portfolio/quivr,
 * /en/portfolio/quivr), which adds a few sections to the shared project
 * template.
 *
 * Every claim on that page comes from the Quivr README
 * (github.com/The-Vibe-Company/quivr) or its documentation
 * (docs.quivr.thevibecompany.co). A fact neither source states is left off.
 */

/** Quivr's slug in src/lib/projects.ts. */
export const QUIVR_SLUG = "quivr";

/** Anchor of the "How we help" section, the target of service links. */
export const QUIVR_SERVICES_ID = "services";

/** The call booked from this page, distinct from the site-wide 30-minute call. */
export const QUIVR_BOOKING_URL = "https://cal.com/stangirard/thevibecompany";

export const QUIVR_REPO = "The-Vibe-Company/quivr";
export const QUIVR_REPO_URL = `https://github.com/${QUIVR_REPO}`;
export const QUIVR_DOCS_URL = "https://docs.quivr.thevibecompany.co";
export const QUIVR_QUICKSTART_URL = `${QUIVR_DOCS_URL}/quickstart`;

/** The tag on the last commit of Quivr V1, before V2 replaced it on main. */
export const QUIVR_V1_TAG = "v1-final";
export const QUIVR_V1_URL = `${QUIVR_REPO_URL}/tree/${QUIVR_V1_TAG}`;

/** The announcement of Quivr becoming The Vibe Company, on this site. */
export const QUIVR_STORY_ARTICLE_PATH =
  "/resources/articles/quivr-to-the-vibe-company";

/** The three benefits, then the steps of the usage example, in order. */
export const QUIVR_BENEFIT_KEYS = ["nothingLost", "meaning", "alerts"] as const;
export const QUIVR_EXAMPLE_STEPS = ["alert", "article", "match", "correction"] as const;

/** What The Vibe Company does around the engine. */
export const QUIVR_HELP_KEYS = ["sources", "production", "hosting"] as const;

/** Rows of the technical block at the bottom of the page. */
export const QUIVR_TECH_KEYS = [
  "engine",
  "storage",
  "search",
  "plugins",
  "integrations",
  "license",
] as const;

/**
 * A floor for the star count, shown when the GitHub API cannot be reached.
 * The repository passed 39,500 stars (39,587 on 2026-10-15), so "39k+" stays
 * true without pretending to be a live figure.
 */
export const QUIVR_STARS_FLOOR = 39_000;

/** How often the page refetches the star count (ISR), in seconds. */
export const QUIVR_STARS_REVALIDATE = 3600;

/** The repository's star count, or null when GitHub does not answer. */
export async function getQuivrStars(): Promise<number | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`https://api.github.com/repos/${QUIVR_REPO}`, {
      headers,
      next: { revalidate: QUIVR_STARS_REVALIDATE },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return parseStargazers(await response.json());
  } catch {
    return null;
  }
}

export function parseStargazers(body: unknown): number | null {
  if (typeof body !== "object" || body === null) return null;
  const count = (body as { stargazers_count?: unknown }).stargazers_count;
  return typeof count === "number" && Number.isInteger(count) && count >= 0
    ? count
    : null;
}

/**
 * The full count in the reader's locale ("39,587" / "39 587"), or the floor
 * as "39k+" when the live count is unknown.
 */
export function formatStars(stars: number | null, locale: string): string {
  if (stars === null) return `${QUIVR_STARS_FLOOR / 1000}k+`;
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(stars);
}

/** The compact count for running text ("39.6k" / "39,6 k"). */
export function formatStarsCompact(stars: number | null, locale: string): string {
  if (stars === null) return `${QUIVR_STARS_FLOOR / 1000}k+`;
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}
