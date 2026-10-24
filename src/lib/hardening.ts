/**
 * Structure and links of the hardening landing (/fr/agents-ia-securite-produit,
 * /en/ai-agents-product-hardening): AI agents used to harden a product and its
 * stack, as opposed to securing the agents themselves (the Black October
 * article covers that side).
 *
 * The copy lives in the `hardening` messages namespace. Every fact on the page
 * comes from a case study already published on the site; no certification,
 * price or guarantee is claimed.
 */

/** Hero bullets, in reading order. */
export const HARDENING_HERO_KEYS = ["fleet", "stack", "compliance", "team"] as const;

/** The six areas the agent fleet covers. */
export const HARDENING_OFFER_KEYS = [
  "secrets",
  "dependencies",
  "iam",
  "configs",
  "review",
  "agents",
] as const;

/** The six delivery steps. */
export const HARDENING_METHOD_STEPS = [
  { n: "01", key: "map" },
  { n: "02", key: "prioritize" },
  { n: "03", key: "deploy" },
  { n: "04", key: "integrate" },
  { n: "05", key: "measure" },
  { n: "06", key: "handover" },
] as const;

/** Case studies cited as proof, all live under /case-studies/<slug>. */
export const HARDENING_CASE_SLUGS = ["theodo", "monka", "locservice"] as const;

/** What the offer is not, to set expectations. */
export const HARDENING_NOT_KEYS = ["ciso", "compliance", "prompt"] as const;

/** Order of the FAQ entries, mirrored word for word in the FAQPage JSON-LD. */
export const HARDENING_FAQ_KEYS = [
  "scanners",
  "production",
  "data",
  "agentSecurity",
  "start",
] as const;

/** One article per language, as canonical unprefixed paths. */
type LocalizedPath = { fr: string; en: string };

/** The incident write-up on securing the agents themselves. */
export const BLACK_OCTOBER_PATHS: LocalizedPath = {
  fr: "/resources/articles/black-october-securite-agents-ia",
  en: "/resources/articles/black-october-ai-agent-security",
};

/**
 * The French-only article on agent authority. Always linked with the French
 * locale, so the English page points at the French canonical.
 */
export const AGENT_AUTHORITY_PATH = "/resources/articles/agents-ia-formation-autorite";

export const MCP_GUIDE_PATHS: LocalizedPath = {
  fr: "/resources/articles/serveur-mcp-entreprise",
  en: "/resources/articles/what-is-an-mcp-server",
};

export const HDS_GUIDE_PATHS: LocalizedPath = {
  fr: "/resources/articles/ia-donnees-de-sante-hds",
  en: "/resources/articles/ai-health-data-hds-france",
};

export function localizedArticle(paths: LocalizedPath, locale: string): string {
  return locale === "en" ? paths.en : paths.fr;
}

/** PostHog `page` property of the landing's booking CTA, one per language. */
export function hardeningPageId(locale: string): string {
  return locale === "en" ? "ai-agents-product-hardening" : "agents-ia-securite-produit";
}
