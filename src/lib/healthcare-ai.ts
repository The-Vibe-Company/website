/**
 * Structure and links of the healthcare AI landing (/fr/ia-sante-hds,
 * /en/healthcare-ai-hds): AI products and agents built on health data, to
 * GDPR and HDS requirements, inside the client's environment.
 *
 * The copy lives in the `healthcareAi` messages namespace. The HDS
 * certification belongs to the host (cloud or managed-service provider); The
 * Vibe Company is the development partner and never claims it. Every figure on
 * the page comes from the published Monka case study.
 */

/** Hero bullets, in reading order. */
export const HEALTHCARE_HERO_KEYS = ["monka", "cadence", "agency", "framework"] as const;

/** Who the page is for: the kinds of organisations, then the signals. */
export const HEALTHCARE_AUDIENCE_KEYS = [
  "startups",
  "publishers",
  "insurers",
  "coordination",
  "scaleups",
] as const;

/** The five things a healthcare AI project delivers. */
export const HEALTHCARE_OFFER_KEYS = [
  "products",
  "engines",
  "integrations",
  "agents",
  "production",
] as const;

/** Who is certified, and where we work: the HDS split, in reading order. */
export const HEALTHCARE_HDS_KEYS = ["host", "environment", "ai", "gdpr"] as const;

/** The four steps of a project start. */
export const HEALTHCARE_METHOD_STEPS = [
  { n: "01", key: "call" },
  { n: "02", key: "scope" },
  { n: "03", key: "cycles" },
  { n: "04", key: "production" },
] as const;

/** Order of the FAQ entries, mirrored word for word in the FAQPage JSON-LD. */
export const HEALTHCARE_FAQ_KEYS = [
  "certified",
  "needCertification",
  "timeline",
  "llm",
  "cost",
  "otherPages",
] as const;

/** The healthcare case study the whole page rests on. */
export const HEALTHCARE_CASE_SLUG = "monka";

/** A second, non-healthcare case, cited only for shipping credibility. */
export const HEALTHCARE_SECONDARY_CASE_SLUG = "locservice";

/** The HDS article, one per language, as canonical unprefixed paths. */
export const HEALTHCARE_HDS_ARTICLE_PATHS = {
  fr: "/resources/articles/ia-donnees-de-sante-hds",
  en: "/resources/articles/ai-health-data-hds-france",
} as const;

export function healthcareHdsArticle(locale: string): string {
  return locale === "en" ? HEALTHCARE_HDS_ARTICLE_PATHS.en : HEALTHCARE_HDS_ARTICLE_PATHS.fr;
}

/** PostHog `page` property of the landing's booking CTA, one per language. */
export function healthcarePageId(locale: string): string {
  return locale === "en" ? "healthcare-ai-hds" : "ia-sante-hds";
}
