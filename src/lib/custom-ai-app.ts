/**
 * Structure and links of the custom AI application landing
 * (/fr/developpement-application-ia-sur-mesure, /en/custom-ai-app-development):
 * AI applications and SaaS built to order, from the idea to production.
 *
 * The copy lives in the `customAiApp` messages namespace; this file only
 * orders it and points at the pages it links to. Every case figure comes from
 * the brief or from the published case studies: Monka's two dates, LocService's
 * 87 %, and AFP / MediaGen facts already on the AFP case page. Anything the
 * page would need and nobody has confirmed is written « À CONFIRMER », and
 * `CUSTOM_AI_APP_PLACEHOLDER_KEYS` lists it so it cannot ship unnoticed.
 */

/** Hero bullets, in reading order. */
export const CUSTOM_AI_APP_HERO_KEYS = ["product", "data", "handover", "cases"] as const;

/** Section 1: the kinds of AI applications and SaaS we build. */
export const CUSTOM_AI_APP_APPS_KEYS = ["internal", "saas", "customer", "backoffice"] as const;

/** Section 2: RAG architecture and agents. */
export const CUSTOM_AI_APP_RAG_KEYS = ["rag", "agents", "measure", "models"] as const;

/** Section 3: security, GDPR and business integrations. */
export const CUSTOM_AI_APP_SECURITY_KEYS = ["gdpr", "privilege", "human", "integrations"] as const;

/** Sections 4 to 6: the three published cases, in reading order. */
export const CUSTOM_AI_APP_CASES = [
  { key: "monka", slug: "monka", stats: ["start", "production"] },
  { key: "locservice", slug: "locservice", stats: ["drafts"] },
  { key: "afp", slug: "afp", stats: ["frame", "tools", "horizon"] },
] as const;

/** The steps of a project, from the first call to the handover. */
export const CUSTOM_AI_APP_METHOD_STEPS = [
  { n: "01", key: "call" },
  { n: "02", key: "scope" },
  { n: "03", key: "cycles" },
  { n: "04", key: "production" },
  { n: "05", key: "handover" },
] as const;

/** Order of the FAQ entries, mirrored in the FAQPage JSON-LD. */
export const CUSTOM_AI_APP_FAQ_KEYS = [
  "cost",
  "timeline",
  "rag",
  "data",
  "code",
  "otherPages",
] as const;

/**
 * Message keys (dot paths in `customAiApp`) that still read « À CONFIRMER »:
 * facts the page needs that nobody has confirmed yet. Empty it, key by key,
 * as Stan confirms each one. Empty today: the page only states facts that are
 * already published or given in the brief.
 */
export const CUSTOM_AI_APP_PLACEHOLDER_KEYS: readonly string[] = [];

/** The RAG article, one per language, as canonical unprefixed paths. */
export const CUSTOM_AI_APP_RAG_ARTICLE_PATHS = {
  fr: "/resources/articles/rag-entreprise",
  en: "/resources/articles/enterprise-rag",
} as const;

export function customAiAppRagArticle(locale: string): string {
  return locale === "en" ? CUSTOM_AI_APP_RAG_ARTICLE_PATHS.en : CUSTOM_AI_APP_RAG_ARTICLE_PATHS.fr;
}

/** PostHog `page` property of the landing's booking CTA, one per language. */
export function customAiAppPageId(locale: string): string {
  return locale === "en" ? "custom-ai-app-development" : "developpement-application-ia-sur-mesure";
}
