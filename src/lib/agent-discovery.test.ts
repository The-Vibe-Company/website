import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { parseFrontmatter } from "@/lib/parse-frontmatter";
import { getAllContent } from "@/lib/content-source";
import { hasMarkdownRepresentation, prefersMarkdown } from "./agent-discovery";

describe("Markdown negotiation", () => {
  test.each([
    ["text/markdown", true],
    ["text/markdown; charset=utf-8", true],
    ["TEXT/MARKDOWN", true],
    ["text/html, text/markdown;q=0.5", false],
    ["text/html;q=0.5, text/markdown", true],
    ["text/markdown;q=0, */*", false],
    ["text/markdown;q=invalid", false],
    ["text/html, */*;q=0.8", false],
    ["*/*", false],
    [null, false],
  ])("%s -> %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  test("only supported source-backed paths are negotiated", () => {
    for (const path of ["/", "/fr", "/en/", "/fr/resources/articles/example"]) {
      expect(hasMarkdownRepresentation(path)).toBe(true);
    }
    for (const path of ["/portfolio", "/en/resources", "/md/fr", "/api", "/.well-known/agent-skills/index.json"]) {
      expect(hasMarkdownRepresentation(path)).toBe(false);
    }
  });

  test("rewrites Markdown but preserves HTML, RSC and POST routing", () => {
    const request = (headers: Record<string, string>, method = "GET") =>
      new NextRequest("https://www.thevibecompany.co/fr", { headers, method });
    const markdown = middleware(request({ accept: "text/markdown" }));
    expect(markdown.headers.get("x-middleware-rewrite")).toBe("https://www.thevibecompany.co/md/fr");
    expect(markdown.headers.get("vary")).toContain("Accept");
    for (const response of [
      middleware(request({ accept: "text/html" })),
      middleware(request({ accept: "text/markdown", rsc: "1" })),
      middleware(request({ accept: "text/markdown" }, "POST")),
    ]) {
      expect(response.headers.get("x-middleware-rewrite") ?? "").not.toContain("/md");
    }
  });
});

describe("published agent skills", () => {
  const root = join(process.cwd(), "public/.well-known/agent-skills");
  const index = JSON.parse(readFileSync(join(root, "index.json"), "utf8"));

  test("discovery 0.2.0 entries describe every static artifact and match its bytes", () => {
    expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json");
    expect(index.skills).toHaveLength(2);
    expect(new Set(index.skills.map((skill: { name: string }) => skill.name)).size).toBe(2);
    expect(readdirSync(root).filter((name) => name !== "index.json").sort()).toEqual(
      index.skills.map((skill: { name: string }) => skill.name).sort(),
    );
    for (const skill of index.skills) {
      expect(skill.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(skill.name.length).toBeLessThanOrEqual(64);
      expect(skill.type).toBe("skill-md");
      expect(skill.url).toBe(`/.well-known/agent-skills/${skill.name}/SKILL.md`);
      const bytes = readFileSync(join(process.cwd(), "public", skill.url));
      expect(skill.digest).toBe(`sha256:${createHash("sha256").update(bytes).digest("hex")}`);
      const { data, body } = parseFrontmatter(bytes.toString("utf8"));
      expect(data.name).toBe(skill.name);
      expect(data.description).toBe(skill.description);
      expect(body.length).toBeGreaterThan(0);
    }
  });

  test("public article sources exist for negotiation", () => {
    expect(getAllContent().filter((item) => item.type === "article").length).toBeGreaterThan(0);
  });
});
