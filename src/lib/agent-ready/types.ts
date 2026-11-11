export type CategoryId = "discoverability" | "content" | "ai_bots" | "protocols" | "commerce";
export type CheckId = "robots_txt" | "sitemap" | "link_headers" | "llms_txt" |
  "markdown_negotiation" | "raw_html_content" | "robots_ai_rules" | "content_signal" |
  "ai_bot_access" | "mcp_server_card" | "a2a_agent_card" | "agent_skills" |
  "oauth_discovery" | "oauth_protected_resource" | "api_catalog" | "x402";
export interface Check {
  id: CheckId; category: CategoryId; status: "pass" | "fail" | "na";
  weight: number; details: string; informative?: boolean;
}
export interface Score { percentage: number; level: number }
export interface Category extends Score { id: CategoryId; checks: Check[] }
export interface Report {
  url: string; finalUrl: string; scannedAt: string; durationMs: number;
  score: Score; categories: Category[];
}
