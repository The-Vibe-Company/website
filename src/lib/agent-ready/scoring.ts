import type { CategoryId, Check, Report, Score } from "./types";
export function score(checks: Check[]): Score {
  const applicable = checks.filter((c) => !c.informative && c.status !== "na");
  const total = applicable.reduce((n, c) => n + c.weight, 0);
  const percentage = total ? Math.round(100 * applicable.reduce((n, c) => n + (c.status === "pass" ? c.weight : 0), 0) / total) : 0;
  return { percentage, level: Math.round(percentage / 20) };
}
export function categories(checks: Check[]): Report["categories"] {
  return (["discoverability", "content", "ai_bots", "protocols", "commerce"] as CategoryId[])
    .map((id) => { const subset = checks.filter((c) => c.category === id); return { id, ...score(subset), checks: subset }; });
}
// Global score uses check weights across categories (equivalent to weighting
// category percentages by their applicable weight, before rounding).
