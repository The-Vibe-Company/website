/**
 * Last-known content modification date for every URL emitted by the sitemap.
 *
 * Emitted as `<lastmod>` in `/sitemap.xml`. We use a stable per-page date
 * instead of the build timestamp so Google can trust the signal: Google only
 * reads `<lastmod>` when it is consistently accurate, and a timestamp that
 * flips on every deploy for a page whose visible content did not change is
 * worse than no `<lastmod>` at all.
 *
 * Update when the page's visible content changes. Dates come from
 * `git log -1 --format=%cs <page component + its content/data source>` on
 * the commit that last changed what visitors see.
 *
 * Dates are ISO (`YYYY-MM-DD`), interpreted as UTC. Keys for split-path
 * landings use the FR path, matching `INDEXABLE_SPLIT_PATH_ROUTES.paths.fr`.
 */

// Home: `services.items.build.bullets` was reworked on 2026-10-24 (#270
// "soft-home security bullets + cross-links"), which is page-visible.
export const HOME_LASTMOD = "2026-10-24";
export const PORTFOLIO_INDEX_LASTMOD = "2026-10-22";
export const CASE_STUDIES_INDEX_LASTMOD = "2026-10-15";

/**
 * Keyed by `INDEXABLE_SPLIT_PATH_ROUTES.paths.fr`.
 *
 * About (`/a-propos` + `/about`) renders the `services` and `agencyParis`
 * message namespaces, both reworked on 2026-10-24 — the About lastmod is
 * floored to that date even though the dedicated `about` namespace is older.
 */
export const SPLIT_PATH_LASTMOD: Record<string, string> = {
  "/a-propos": "2026-10-24",
  "/agence-ia-paris": "2026-10-24",
  "/agents-ia-securite-produit": "2026-10-24",
  "/agents-ia-production": "2026-10-24",
  "/ia-sante-hds": "2026-10-24",
  "/ia-medias": "2026-10-24",
};

/** Keyed by `PROJECT_SLUGS` entry. */
export const PROJECT_LASTMOD: Record<string, string> = {
  vanish: "2026-08-08",
  skillpack: "2026-09-21",
  vibedrift: "2026-08-08",
  granite: "2026-08-08",
  vibedeck: "2026-08-08",
  bruno: "2026-09-23",
  armada: "2026-10-14",
  aeom: "2026-10-14",
  quivr: "2026-10-19",
};

/**
 * Keyed by `CUSTOMER_SLUGS` entry.
 *
 * Every case study detail page renders `agencyParis.caseLink` (plus
 * `healthcareAi.caseLink` for Monka and `mediaAi.caseLink` for AFP), all
 * three message keys added on 2026-10-24 by the matching SEO landings
 * (#264–#269). Even customers whose own copy in `src/lib/customers.ts` is
 * older therefore pick 2026-10-24 as their lastmod floor.
 */
export const CUSTOMER_LASTMOD: Record<string, string> = {
  monka: "2026-10-24",
  afp: "2026-10-24",
  locservice: "2026-10-24",
  "coup-de-pates": "2026-10-24",
  theodo: "2026-10-24",
};

/**
 * Resolve an ISO date to a Date at UTC midnight. A plain `new Date("YYYY-MM-DD")`
 * is already parsed as UTC, but we go through this helper so a bad entry throws
 * loudly at build time instead of emitting an "Invalid Date" lastmod.
 */
export function lastmodDate(iso: string): Date {
  const date = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`sitemap-lastmod: invalid date "${iso}"`);
  }
  return date;
}

/**
 * Look up a split-path landing's `lastmod` by its FR path, or throw. The
 * sitemap entry count is checked in the test suite, so missing a key here
 * fails CI rather than silently falling back to the build timestamp.
 */
export function splitPathLastmod(frPath: string): Date {
  const iso = SPLIT_PATH_LASTMOD[frPath];
  if (!iso) {
    throw new Error(`sitemap-lastmod: no lastmod for split path "${frPath}"`);
  }
  return lastmodDate(iso);
}

/** Look up a project page's `lastmod` by slug, or throw. */
export function projectLastmod(slug: string): Date {
  const iso = PROJECT_LASTMOD[slug];
  if (!iso) {
    throw new Error(`sitemap-lastmod: no lastmod for project "${slug}"`);
  }
  return lastmodDate(iso);
}

/** Look up a customer case study's `lastmod` by slug, or throw. */
export function customerLastmod(slug: string): Date {
  const iso = CUSTOMER_LASTMOD[slug];
  if (!iso) {
    throw new Error(`sitemap-lastmod: no lastmod for customer "${slug}"`);
  }
  return lastmodDate(iso);
}
