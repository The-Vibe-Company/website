/**
 * Structure of the "AI agency in Paris" landing page (/fr/agence-ia-paris,
 * /en/ai-agency-paris). The copy lives in the `agencyParis` message
 * namespace; this file only orders it and points at the pages it links to.
 *
 * Every figure on the page is already published in a case study or an
 * article, and the same figures come back in the answer block, the facts strip
 * and the proof (2 months, 87%, €4M, 165 questions, 12 versions, 2 projects,
 * more than 100,000 users). No pricing, no generic timeline, no certification:
 * the team works according to GDPR (RGPD) and HDS requirements.
 */

import { OFFICE_ADDRESS } from "./site";

export { OFFICE_ADDRESS };

/**
 * The sections of the page, top to bottom, as AgencyParisPage lays them out.
 */
export const AGENCY_PARIS_SECTIONS = [
  "hero",
  "facts",
  "proof",
  "quote",
  "audience",
  "offers",
  "method",
  "landscape",
  "versus",
  "team",
  "faq",
  "links",
  "finalCta",
] as const;

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

/** The published case studies, in reading order. */
export const AGENCY_PARIS_CASE_SLUGS = [
  "monka",
  "afp",
  "locservice",
  "coup-de-pates",
  "theodo",
] as const;

/** The same case studies, in the order the proof section tells them. */
export const AGENCY_PARIS_PROOF_SLUGS = [
  "monka",
  "locservice",
  "afp",
  "coup-de-pates",
  "theodo",
] as const;

/**
 * The AI firms a reader meets when looking for an agency in Paris, in the
 * order of the comparison article: the SME and mid-cap group first, The Vibe
 * Company at its head, then the larger firms. The only place the list lives;
 * FAQ "best" names them in the same order, which the tests check.
 */
export const AGENCY_PARIS_PLAYERS = [
  { name: "The Vibe Company", group: "sme" },
  { name: "Juwa", group: "sme" },
  { name: "Galadrim", group: "sme" },
  { name: "Koïno", group: "sme" },
  { name: "Theodo", group: "large" },
  { name: "Artefact", group: "large" },
  { name: "Mistral AI", group: "large" },
  { name: "Ekimetrics", group: "large" },
] as const satisfies readonly { name: string; group: "sme" | "large" }[];

/** The comparison of AI firms, per language. */
export const AGENCY_PARIS_COMPARISON: Record<"fr" | "en", { path: string; locale: "fr" | "en" }> = {
  fr: { path: "/resources/articles/meilleure-agence-ia-comparatif", locale: "fr" },
  en: { path: "/resources/articles/best-ai-consulting-firms-france", locale: "en" },
};

/** Relevant articles linked from the Paris agency landing, one per language. */
export const AGENCY_PARIS_ARTICLES = {
  choose: {
    fr: "/resources/articles/choisir-agence-ia-esn-freelance",
    en: "/resources/articles/how-to-choose-an-ai-agency",
  },
  steps: {
    fr: "/resources/articles/agence-intelligence-artificielle",
    en: "/resources/articles/what-an-ai-agency-does",
  },
  versus: {
    fr: "/resources/articles/agence-ia-vs-freelance-esn",
    en: "/resources/articles/ai-agency-vs-freelancer-vs-it-services",
  },
} as const;

/** Order of the 6 FAQ entries, mirrored in the FAQPage JSON-LD. */
export const AGENCY_PARIS_FAQ_KEYS = [
  "paris",
  "best",
  "cost",
  "timeline",
  "data",
  "related",
] as const;
