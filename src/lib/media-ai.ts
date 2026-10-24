/**
 * Structure and links of the media AI landing (/fr/ia-medias,
 * /en/ai-for-media): generative AI tools for newsrooms and media
 * organisations, built all the way to production, under editorial control.
 *
 * The copy lives in the `mediaAi` messages namespace. The proof is MediaGen,
 * AFP's France 2030 project, where The Vibe Company is a technical consortium
 * member: every figure on the page comes from the published AFP case study.
 * The page never offers to put together a France 2030 or Bpifrance dossier.
 */

/** Hero bullets, in reading order. */
export const MEDIA_HERO_KEYS = ["mediagen", "france2030", "openSource", "agency"] as const;

/** Who the page is for: the kinds of organisations, then the signals. */
export const MEDIA_AUDIENCE_KEYS = ["press", "agencies", "broadcast", "pureplayers"] as const;

/** The five things a media AI project delivers. */
export const MEDIA_OFFER_KEYS = [
  "monitoring",
  "archives",
  "production",
  "agents",
  "framework",
] as const;

/** What MediaGen proves, and what it does not: in reading order. */
export const MEDIA_PROOF_KEYS = ["member", "ships", "notDossier"] as const;

/** The MediaGen facts table, every value from the published AFP case. */
export const MEDIA_STAT_KEYS = ["budget", "frame", "horizon", "tools"] as const;

/** The four steps of a project start. */
export const MEDIA_METHOD_STEPS = [
  { n: "01", key: "call" },
  { n: "02", key: "scope" },
  { n: "03", key: "cycles" },
  { n: "04", key: "production" },
] as const;

/** Order of the FAQ entries, mirrored in the FAQPage JSON-LD. */
export const MEDIA_FAQ_KEYS = [
  "replace",
  "mediagen",
  "funding",
  "timeline",
  "hallucinations",
  "otherPages",
  "cost",
] as const;

/** The media case study the whole page rests on. */
export const MEDIA_CASE_SLUG = "afp";

/** The AI funding article, one per language, as canonical unprefixed paths. */
export const MEDIA_FUNDING_ARTICLE_PATHS = {
  fr: "/resources/articles/financer-projet-ia-cir-cii-france-2030",
  en: "/resources/articles/fund-ai-project-france-cir-cii",
} as const;

export function mediaFundingArticle(locale: string): string {
  return locale === "en" ? MEDIA_FUNDING_ARTICLE_PATHS.en : MEDIA_FUNDING_ARTICLE_PATHS.fr;
}

/** PostHog `page` property of the landing's booking CTA, one per language. */
export function mediaPageId(locale: string): string {
  return locale === "en" ? "ai-for-media" : "ia-medias";
}
