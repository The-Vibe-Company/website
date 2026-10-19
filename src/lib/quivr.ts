/**
 * Facts and links for the Quivr project page (/fr/portfolio/quivr,
 * /en/portfolio/quivr). Quivr uses the shared project template, with its web
 * app drawn in code and a few sections of its own underneath.
 *
 * Every claim on that page comes from the Quivr README
 * (github.com/The-Vibe-Company/quivr) or its documentation
 * (docs.quivr.thevibecompany.co). A fact neither source states is left off.
 */

/** Quivr's slug in src/lib/projects.ts. */
export const QUIVR_SLUG = "quivr";

/** Anchor of the "We deploy it for you" section, the target of service links. */
export const QUIVR_SERVICES_ID = "services";

/** The call booked from this page, distinct from the site-wide 30-minute call. */
export const QUIVR_BOOKING_URL = "https://cal.com/stangirard/thevibecompany";

export const QUIVR_REPO = "The-Vibe-Company/quivr";
export const QUIVR_REPO_URL = `https://github.com/${QUIVR_REPO}`;

/**
 * The 1200x630 social cards, one per language: captures of the web app drawn
 * in QuivrFeedMock, made by scripts/capture-quivr-og.sh.
 */
export const QUIVR_OG_IMAGE = {
  url: { fr: "/projects/quivr-og-fr.jpg", en: "/projects/quivr-og-en.jpg" },
  width: 1200,
  height: 630,
} as const;

export const QUIVR_SERVICE_KEYS = ["plugins", "production", "security"] as const;

/** The FAQ holds the longer answers, plain-words first. */
export const QUIVR_FAQ_KEYS = [
  "whatFor",
  "underTheHood",
  "v1",
  "license",
  "production",
  "selfHost",
  "support",
] as const;
