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

/**
 * AFP's press release announcing MediaGen, the source of the one line on the
 * page that names MediaGen and AFP (Quivr's place in its consortium). Named
 * on Stan's go-ahead (THE-2187); every other Quivr message stays free of
 * client names (src/lib/quivr-messages.test.ts).
 */
export const QUIVR_MEDIAGEN_SOURCE = {
  fr: "https://www.afp.com/fr/lagence/notre-actualite/communiques-de-presse/lafp-lance-mediagen-un-projet-dia-generative-au",
  en: "https://www.afp.com/en/agency/inside-afp/press-release/afp-launches-mediagen-generative-ai-project-media",
} as const;
export const QUIVR_REPO_URL = `https://github.com/${QUIVR_REPO}`;

/**
 * The 1200x630 social cards, one per language: captures of the earlier
 * full-feed drawing of the web app, made by scripts/capture-quivr-og.sh.
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
