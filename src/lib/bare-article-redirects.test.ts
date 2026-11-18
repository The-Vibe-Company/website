import { describe, expect, test } from "bun:test";
import { bareArticleRedirects, readArticleLanguages } from "./bare-article-redirects";
import { legacyBareTarget } from "./legacy-redirects";

const entries = readArticleLanguages();
const redirects = bareArticleRedirects(entries);

function targetOf(pathname: string): string | undefined {
  return redirects.find((rule) => rule.source === pathname)?.destination;
}

describe("bareArticleRedirects (THE-2364)", () => {
  test("reads every article from content/articles", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  test.each([
    "how-to-use-skillopt-to-train-agent-skills",
    "how-i-finally-started-my-game-using-scenario",
    "why-codex-felt-better-than-claude-deepswe",
    "why-i-replaced-prompts-with-skills",
    "agents-dont-lack-tools-they-lack-company-memory",
    "mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done",
  ])("sends the EN-only article %s straight to /en in one permanent redirect", (slug) => {
    const rule = redirects.find((r) => r.source === `/resources/articles/${slug}`);
    expect(rule).toEqual({
      source: `/resources/articles/${slug}`,
      destination: `/en/resources/articles/${slug}`,
      permanent: true,
    });
  });

  test("sends the FR-only article les-skills straight to /fr", () => {
    expect(targetOf("/resources/articles/les-skills")).toBe("/fr/resources/articles/les-skills");
  });

  test("leaves unknown slugs to the middleware", () => {
    expect(targetOf("/resources/articles/this-slug-does-not-exist")).toBeUndefined();
    expect(redirects.some((rule) => rule.source.includes("this-slug-does-not-exist"))).toBe(false);
  });

  test("leaves translated articles to the middleware (articleTranslationMap), which picks the visitor's language", () => {
    const translated = entries.filter((entry) => entry.translationKey);
    expect(translated.length).toBeGreaterThan(0);
    for (const entry of translated) {
      expect(targetOf(`/resources/articles/${entry.slug}`)).toBeUndefined();
    }
  });

  test("covers every single-language article with its own language, once", () => {
    const single = entries.filter((entry) => !entry.translationKey);
    expect(redirects).toHaveLength(single.length);
    expect(new Set(redirects.map((rule) => rule.source)).size).toBe(redirects.length);
    for (const entry of single) {
      expect(targetOf(`/resources/articles/${entry.slug}`)).toBe(
        `/${entry.language}/resources/articles/${entry.slug}`,
      );
    }
  });

  test("never shadows the legacy bare redirects", () => {
    for (const rule of redirects) {
      expect(legacyBareTarget(rule.source)).toBeNull();
    }
  });

  test("builds rules from frontmatter: explicit slug, explicit language, translation key", () => {
    expect(
      bareArticleRedirects([
        { slug: "b-en-only", language: "en" },
        { slug: "a-fr-only", language: "fr" },
        { slug: "paired-fr", language: "fr", translationKey: "pair" },
        { slug: "paired-en", language: "en", translationKey: "pair" },
      ]),
    ).toEqual([
      { source: "/resources/articles/a-fr-only", destination: "/fr/resources/articles/a-fr-only", permanent: true },
      { source: "/resources/articles/b-en-only", destination: "/en/resources/articles/b-en-only", permanent: true },
    ]);
  });
});
