/**
 * Structure and links of the "AI agents in production" landing
 * (/fr/agents-ia-production, /en/ai-agents-in-production): the service of
 * taking a company's agents from the POC that impresses to the daily run.
 *
 * It sells the deployment. The hub article explains what an agent is, the
 * checklist article lists what production requires, the hardening landing
 * covers agents used to harden a product and its stack; this page links to
 * all three without restating them.
 *
 * The copy lives in the `agentsProduction` messages namespace. Every fact
 * comes from a case study already published on the site; no certification,
 * price or generic timeline is claimed.
 */

/** Hero bullets, in reading order. */
export const AGENTS_PRODUCTION_HERO_KEYS = ["tools", "guardrails", "measure", "team"] as const;

/** What a deployment includes, in delivery order. */
export const AGENTS_PRODUCTION_OFFER_KEYS = [
  "scope",
  "skills",
  "authority",
  "memory",
  "observability",
  "run",
] as const;

/** From the demo to the daily run. */
export const AGENTS_PRODUCTION_METHOD_STEPS = [
  { n: "01", key: "call" },
  { n: "02", key: "scope" },
  { n: "03", key: "pilot" },
  { n: "04", key: "scale" },
  { n: "05", key: "production" },
  { n: "06", key: "handover" },
] as const;

/** Case studies cited as proof, all live under /case-studies/<slug>. */
export const AGENTS_PRODUCTION_CASE_SLUGS = [
  "locservice",
  "coup-de-pates",
  "monka",
  "theodo",
] as const;

/** What the offer is not, to set expectations. */
export const AGENTS_PRODUCTION_NOT_KEYS = ["chatbot", "replace", "hardening", "promise"] as const;

/** Order of the FAQ entries, mirrored word for word in the FAQPage JSON-LD. */
export const AGENTS_PRODUCTION_FAQ_KEYS = [
  "start",
  "timeline",
  "existing",
  "data",
  "article",
  "hardening",
] as const;

/** One article per language, as canonical unprefixed paths. */
type LocalizedPath = { fr: string; en: string };

/** The educational hub: what an AI agent is and how to start. */
export const AGENTS_GUIDE_PATHS: LocalizedPath = {
  fr: "/resources/articles/agent-ia-entreprise",
  en: "/resources/articles/ai-agents-for-business",
};

/** The checklist of what production requires, which this page does not restate. */
export const POC_CHECKLIST_PATHS: LocalizedPath = {
  fr: "/resources/articles/poc-agent-ia-production",
  en: "/resources/articles/ai-agent-poc-to-production",
};

/** Which processes to automate first, and when an agent is overkill. */
export const AUTOMATION_GUIDE_PATHS: LocalizedPath = {
  fr: "/resources/articles/automatisation-ia-entreprise",
  en: "/resources/articles/ai-automation-which-processes-first",
};
