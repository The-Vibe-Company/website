import {
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  HARDENING_PATHS,
  HEALTHCARE_AI_PATHS,
  MEDIA_AI_PATHS,
  type SplitPaths,
} from "@/lib/site";

/**
 * Commercial landings linked from the footer "Offerings" column, in display
 * order. Each label lives under `footer.offerings.<key>` in both message files.
 * Adding a landing is one entry here plus its two labels.
 */
export const FOOTER_OFFERINGS: ReadonlyArray<{ key: string; paths: SplitPaths }> = [
  { key: "agencyParis", paths: AGENCY_PARIS_PATHS },
  { key: "hardening", paths: HARDENING_PATHS },
  { key: "healthcareAi", paths: HEALTHCARE_AI_PATHS },
  { key: "agentsProduction", paths: AGENTS_PRODUCTION_PATHS },
  { key: "mediaAi", paths: MEDIA_AI_PATHS },
];
