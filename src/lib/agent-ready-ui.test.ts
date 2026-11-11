import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import type { CheckId, Report } from "@/lib/agent-ready/types";
import {
  AGENT_READY_CATEGORIES,
  AGENT_READY_ERROR_CODES,
  AGENT_READY_SPECS,
  buildAgentPrompt,
  fill,
  hostnameOf,
  type AgentReadyCopy,
} from "./agent-ready-ui";

const ALL_CHECKS: CheckId[] = [
  "robots_txt", "sitemap", "link_headers", "llms_txt", "markdown_negotiation", "raw_html_content",
  "robots_ai_rules", "content_signal", "ai_bot_access", "mcp_server_card", "a2a_agent_card",
  "agent_skills", "oauth_discovery", "oauth_protected_resource", "api_catalog", "x402",
];

const copyOf = (messages: typeof fr) => messages.agentReady as unknown as AgentReadyCopy;

function report(failing: CheckId[]): Report {
  return {
    url: "https://example.com",
    finalUrl: "https://www.example.com/",
    scannedAt: "2026-11-11T00:00:00.000Z",
    durationMs: 1000,
    score: { percentage: 42, level: 2 },
    categories: AGENT_READY_CATEGORIES.map(({ id, checks }) => ({
      id,
      percentage: 50,
      level: 3,
      checks: checks.map((check) => ({
        id: check,
        category: id,
        weight: id === "commerce" ? 0 : 1,
        status: failing.includes(check) ? "fail" : id === "commerce" ? "na" : "pass",
        details: `evidence for ${check}`,
        ...(id === "commerce" ? { informative: true } : {}),
      })),
    })),
  };
}

describe("agent-ready copy", () => {
  test("every check is displayed once, with a spec link", () => {
    const shown = AGENT_READY_CATEGORIES.flatMap(({ checks }) => checks);
    expect([...shown].sort()).toEqual([...ALL_CHECKS].sort());
    for (const id of ALL_CHECKS) expect(AGENT_READY_SPECS[id]).toStartWith("https://");
  });

  test.each([["fr", fr], ["en", en]] as const)("%s has copy for every check, category, status and error", (_, messages) => {
    const copy = copyOf(messages);
    for (const id of ALL_CHECKS) {
      expect(copy.checks[id].name.length).toBeGreaterThan(0);
      expect(copy.checks[id].explain.length).toBeGreaterThan(0);
      expect(copy.checks[id].fix.length).toBeGreaterThan(0);
    }
    for (const { id } of AGENT_READY_CATEGORIES) expect(copy.categories[id].name.length).toBeGreaterThan(0);
    for (const code of AGENT_READY_ERROR_CODES) expect(copy.errors[code].length).toBeGreaterThan(0);
    expect(Object.keys(copy.status).sort()).toEqual(["fail", "na", "pass"]);
  });

  test("status labels match the brief", () => {
    expect(fr.agentReady.status).toEqual({ pass: "OK", fail: "À corriger", na: "Non applicable" });
    expect(en.agentReady.status).toEqual({ pass: "OK", fail: "To fix", na: "Not applicable" });
  });

  test.each([["fr", fr], ["en", en]] as const)("%s tool copy has no em or en dash", (_, messages) => {
    const text = JSON.stringify([messages.tools, messages.agentReady, messages.footer.tools]);
    expect(text).not.toMatch(/[–—]/);
  });

  test.each([["fr", fr], ["en", en]] as const)("%s titles fit 60 characters, descriptions 120 to 160", (_, messages) => {
    for (const page of [messages.tools, messages.agentReady]) {
      expect([...page.metaTitle].length).toBeLessThanOrEqual(60);
      expect([...page.metaDescription].length).toBeGreaterThanOrEqual(120);
      expect([...page.metaDescription].length).toBeLessThanOrEqual(160);
    }
  });
});

describe("hostnameOf", () => {
  test("assumes https and keeps only the hostname", () => {
    expect(hostnameOf("example.com/private/path?q=secret")).toBe("example.com");
    expect(hostnameOf("  HTTP://Www.Example.com:443/x ")).toBe("www.example.com");
    expect(hostnameOf("")).toBeNull();
    expect(hostnameOf("http://")).toBeNull();
  });
});

describe("fill", () => {
  test("replaces known placeholders and leaves the others", () => {
    expect(fill("{a} and {b}", { a: 1 })).toBe("1 and {b}");
  });
});

describe("buildAgentPrompt", () => {
  test("lists only failing scored checks, in display order, with fix and spec", () => {
    const prompt = buildAgentPrompt(report(["sitemap", "robots_txt", "ai_bot_access"]), copyOf(en))!;
    expect(prompt).toStartWith("# Make www.example.com ready for AI agents");
    expect(prompt).toContain("score 42/100, level 2/5");
    const order = ["`robots_txt`", "`sitemap`", "`ai_bot_access`"].map((id) => prompt.indexOf(id));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order.every((index) => index > 0)).toBe(true);
    expect(prompt).toContain(en.agentReady.checks.sitemap.fix);
    expect(prompt).toContain(AGENT_READY_SPECS.sitemap);
    expect(prompt).toContain("evidence for sitemap");
    expect(prompt).not.toContain("`llms_txt`");
    expect(prompt).not.toContain("`x402`");
  });

  test("is null when nothing scored failed", () => {
    expect(buildAgentPrompt(report([]), copyOf(fr))).toBeNull();
  });
});
