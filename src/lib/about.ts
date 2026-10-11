/**
 * Confirmed facts and links for the About page (/fr/a-propos, /en/about).
 *
 * Everything here is either already published elsewhere on the site or
 * validated by the founders. Fields that are still waiting for validation are
 * empty strings carrying a [TO CONFIRM] comment: the page skips an empty field
 * rather than filling it with a guess, so nothing invented ever ships.
 */

/** Order of the three services, same keys as the homepage `services` namespace. */
export const ABOUT_SERVICE_KEYS = ["build", "operate", "advise"] as const;

/** Order of the differentiators, each one carrying a figure we can source. */
export const ABOUT_EDGE_KEYS = [
  "production",
  "agents",
  "sectors",
  "security",
  "openSource",
] as const;

/** Order of the four delivery steps, reusing the homepage `process` namespace. */
export const ABOUT_PROCESS_STEPS = [
  { n: "01", key: "brief" },
  { n: "02", key: "design" },
  { n: "03", key: "build" },
  { n: "04", key: "operate" },
] as const;

export interface AboutTeamMember {
  key: "stan" | "antoine";
  name: string;
  linkedin: string;
  /** Personal X profile. Empty renders no link. */
  x: string;
}

export const ABOUT_TEAM: AboutTeamMember[] = [
  {
    key: "stan",
    name: "Stan Girard",
    linkedin: "https://linkedin.com/in/stan-girard",
    // [TO CONFIRM] Stan's X profile. Left empty on purpose: the handle is not
    // validated yet, and the page renders no link while the field is empty.
    x: "",
  },
  {
    key: "antoine",
    name: "Antoine Dewez",
    linkedin: "https://linkedin.com/in/antoine-dewez-gelpe-367774157",
    // [TO CONFIRM] Antoine's X profile — same rule as above.
    x: "",
  },
];

/** Company accounts, the same three the footer already links to. */
export const ABOUT_SOCIALS = [
  { label: "LinkedIn", url: "https://linkedin.com/company/thevibeco" },
  { label: "X", url: "https://x.com/thevibecompany" },
  { label: "GitHub", url: "https://github.com/The-Vibe-Company" },
];

/** The open-source engine the company grew out of. */
export const QUIVR_REPO_URL = "https://github.com/The-Vibe-Company/quivr";

/** The announcement that turned Quivr into The Vibe Company. */
export const ABOUT_ORIGIN_ARTICLE_PATH =
  "/resources/articles/quivr-to-the-vibe-company";

/** Rows of the "key facts" table, in reading order. */
export const ABOUT_FACT_KEYS = [
  "name",
  "type",
  "founded",
  "founders",
  "hq",
  "site",
  "offer",
  // [TO CONFIRM] `about.facts.values.pricing` and `.terms` are empty in both
  // messages files. The rows stay in the table with an empty value so the gap
  // is visible instead of guessed.
  "pricing",
  "terms",
  "clients",
  "projects",
  "networks",
  "notToConfuse",
] as const;

/** Order of the FAQ entries. */
export const ABOUT_FAQ_KEYS = [
  // [TO CONFIRM] `about.faq.items.cost.a` is empty: no price or range is
  // published anywhere, so the question ships without an answer.
  "cost",
  "timeline",
  "data",
  "funding",
  "start",
  "freelance",
] as const;
