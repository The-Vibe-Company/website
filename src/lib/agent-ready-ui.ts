import type { CategoryId, CheckId, Report } from "@/lib/agent-ready/types";

/**
 * Display helpers for the agent-ready scanner page and its client island.
 * Free of server imports: the island bundles this file, so it stays small.
 * Only types come from the scanner library (src/lib/agent-ready).
 */

/** Display order of the categories, and of the checks inside each one. */
export const AGENT_READY_CATEGORIES: { id: CategoryId; checks: CheckId[] }[] = [
  { id: "discoverability", checks: ["robots_txt", "sitemap", "llms_txt", "link_headers"] },
  { id: "content", checks: ["raw_html_content", "markdown_negotiation"] },
  { id: "ai_bots", checks: ["ai_bot_access", "robots_ai_rules", "content_signal"] },
  {
    id: "protocols",
    checks: [
      "mcp_server_card",
      "a2a_agent_card",
      "agent_skills",
      "oauth_discovery",
      "oauth_protected_resource",
      "api_catalog",
    ],
  },
  { id: "commerce", checks: ["x402"] },
];

/** The reference each fix points to (same sources as the scanner README). */
export const AGENT_READY_SPECS: Record<CheckId, string> = {
  robots_txt: "https://www.rfc-editor.org/rfc/rfc9309",
  sitemap: "https://www.sitemaps.org/protocol.html",
  link_headers: "https://www.rfc-editor.org/rfc/rfc8288",
  llms_txt: "https://llmstxt.org/",
  markdown_negotiation: "https://www.rfc-editor.org/rfc/rfc7763",
  raw_html_content: "https://html.spec.whatwg.org/multipage/sections.html",
  robots_ai_rules: "https://www.rfc-editor.org/rfc/rfc9309",
  content_signal: "https://contentsignals.org/",
  ai_bot_access: "https://www.rfc-editor.org/rfc/rfc9110",
  mcp_server_card: "https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649",
  a2a_agent_card: "https://a2a-protocol.org/latest/specification/",
  agent_skills: "https://agentskills.io/",
  oauth_discovery: "https://www.rfc-editor.org/rfc/rfc8414",
  oauth_protected_resource: "https://www.rfc-editor.org/rfc/rfc9728",
  api_catalog: "https://www.rfc-editor.org/rfc/rfc9727",
  x402: "https://docs.x402.org/",
};

/** Error codes the API answers with, plus the island's own client-side ones. */
export const AGENT_READY_ERROR_CODES = [
  "empty",
  "invalid_json",
  "invalid_url",
  "blocked_address",
  "blocked_port",
  "dns_failed",
  "rate_limited",
  "scan_failed",
  "method_not_allowed",
  "network",
] as const;
export type AgentReadyErrorCode = (typeof AGENT_READY_ERROR_CODES)[number];

export function isAgentReadyErrorCode(value: unknown): value is AgentReadyErrorCode {
  return typeof value === "string" && (AGENT_READY_ERROR_CODES as readonly string[]).includes(value);
}

export type CheckCopy = { name: string; explain: string; fix: string };

/** Every string the island renders, read on the server for one locale. */
export type AgentReadyCopy = {
  form: Record<"label" | "placeholder" | "submit" | "scanning" | "hint" | "progress", string>;
  errors: Record<AgentReadyErrorCode, string>;
  report: Record<
    | "heading" | "ready" | "scoreLabel" | "level" | "categoryScore" | "informative" | "evidence"
    | "fix" | "spec" | "copy" | "copied" | "copyFailed" | "copyHint" | "allGood" | "ctaTitle"
    | "ctaBody" | "ctaButton" | "again",
    string
  >;
  status: Record<"pass" | "fail" | "na", string>;
  categories: Record<CategoryId, { name: string; question: string }>;
  checks: Record<CheckId, CheckCopy>;
  prompt: Record<"title" | "intro" | "category" | "evidence" | "fix" | "spec" | "outro", string>;
};

/** Fills `{name}` placeholders. Messages are read raw, so this is the only interpolation. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * The hostname of what the visitor typed, the way the API normalizes it
 * (https:// assumed when no scheme is given). Analytics only ever see this,
 * never the path or query. Null when it does not parse.
 */
export function hostnameOf(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname || null;
  } catch {
    return null;
  }
}

/**
 * The Markdown handed to a coding agent: every scored check that failed, in
 * display order, with the scanner's evidence, the fix and its reference.
 * Null when nothing failed.
 */
export function buildAgentPrompt(report: Report, copy: AgentReadyCopy): string | null {
  const host = hostnameOf(report.finalUrl) ?? hostnameOf(report.url) ?? report.url;
  const byId = new Map(report.categories.flatMap((category) => category.checks).map((check) => [check.id, check]));
  const failing = AGENT_READY_CATEGORIES.flatMap(({ id, checks }) =>
    checks
      .map((checkId) => byId.get(checkId))
      .filter((check) => check && check.status === "fail" && !check.informative)
      .map((check) => ({ category: id, check: check! })),
  );
  if (failing.length === 0) return null;

  const sections = failing.map(({ category, check }, index) => {
    const text = copy.checks[check.id];
    return [
      `## ${index + 1}. ${text.name} (\`${check.id}\`)`,
      "",
      `- ${copy.prompt.category}: ${copy.categories[category].name}`,
      `- ${copy.prompt.evidence}: ${check.details}`,
      `- ${copy.prompt.fix}: ${text.fix}`,
      `- ${copy.prompt.spec}: ${AGENT_READY_SPECS[check.id]}`,
    ].join("\n");
  });

  return [
    `# ${fill(copy.prompt.title, { host })}`,
    "",
    fill(copy.prompt.intro, { url: report.url, score: report.score.percentage, level: report.score.level }),
    "",
    sections.join("\n\n"),
    "",
    copy.prompt.outro,
    "",
  ].join("\n");
}
