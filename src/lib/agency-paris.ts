/**
 * Structure of the "AI agency in Paris" landing page (/fr/agence-ia-paris,
 * /en/ai-agency-paris). The copy lives in the `agencyParis` message
 * namespace; this file only orders it and points at the pages it links to.
 *
 * Every figure on the page is already published in a case study or an
 * article. No pricing, no generic timeline, no certification.
 */

/** Order of the three offers, same keys as the homepage `services` namespace. */
export const AGENCY_PARIS_OFFER_KEYS = ["build", "operate", "advise"] as const;

/** Order of the delivery steps. */
export const AGENCY_PARIS_STEPS = [
  { n: "01", key: "call" },
  { n: "02", key: "scope" },
  { n: "03", key: "cycles" },
  { n: "04", key: "production" },
  { n: "05", key: "handover" },
] as const;

/** The published case studies shown as proof, in reading order. */
export const AGENCY_PARIS_CASE_SLUGS = [
  "monka",
  "afp",
  "locservice",
  "coup-de-pates",
  "theodo",
] as const;

export const AGENCY_PARIS_SECURITY_KEYS = ["compliance", "privilege", "human"] as const;

/**
 * Articles linked from the security section, per language. Each entry is
 * listed only in the language it is published in (or translated to).
 */
export const AGENCY_PARIS_ARTICLES: Record<
  "fr" | "en",
  { key: string; path: string }[]
> = {
  fr: [
    { key: "hds", path: "/resources/articles/ia-donnees-de-sante-hds" },
    { key: "authority", path: "/resources/articles/agents-ia-formation-autorite" },
    { key: "blackOctober", path: "/resources/articles/black-october-securite-agents-ia" },
  ],
  en: [
    { key: "hds", path: "/resources/articles/ai-health-data-hds-france" },
    { key: "blackOctober", path: "/resources/articles/black-october-ai-agent-security" },
  ],
};

/** Order of the FAQ entries, mirrored in the FAQPage JSON-LD. */
export const AGENCY_PARIS_FAQ_KEYS = [
  "cost",
  "timeline",
  "start",
  "data",
  "code",
  "paris",
] as const;
