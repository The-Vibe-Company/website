/**
 * Structure of the "AI agency in Paris" landing page (/fr/agence-ia-paris,
 * /en/ai-agency-paris). The copy lives in the `agencyParis` message
 * namespace; this file only orders it and points at the pages it links to.
 *
 * Every figure on the page is already published in a case study or an
 * article, and the same figures come back in the lede, the facts strip and
 * the proof (2 months, 87%, €4M, 165 questions, 12 versions, 2 projects,
 * more than 100,000 users). No pricing, no generic timeline, no
 * certification: the team works according to RGPD and HDS requirements.
 */

import { OFFICE_ADDRESS } from "./site";

export { OFFICE_ADDRESS };

/**
 * The sections of the page, top to bottom, as AgencyParisPage lays them out
 * (each section's comment there carries its number in this list).
 */
export const AGENCY_PARIS_SECTIONS = [
  "hero",
  "facts",
  "audience",
  "proof",
  "cta",
  "offers",
  "method",
  "landscape",
  "versus",
  "security",
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

/** The published case studies, in the order of the "further reading" links. */
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

/** The comparison of AI firms (article #11), per language. */
export const AGENCY_PARIS_COMPARISON: Record<"fr" | "en", { path: string; locale: "fr" | "en" }> = {
  fr: { path: "/resources/articles/meilleure-agence-ia-comparatif", locale: "fr" },
  en: { path: "/resources/articles/best-ai-consulting-firms-france", locale: "en" },
};

/** Order of the FAQ entries, mirrored in the FAQPage JSON-LD. */
export const AGENCY_PARIS_FAQ_KEYS = [
  "paris",
  "clients",
  "cost",
  "timeline",
  "best",
  "generalist",
  "data",
  "code",
  "related",
  "start",
] as const;
