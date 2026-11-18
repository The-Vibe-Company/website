import { describe, expect, test } from "bun:test";
import {
  parseArticleTranslations,
  translatedArticlePath,
  type ArticleTranslationMap,
} from "./article-translations";
import { articleTranslationMap, readArticleLanguages } from "./bare-article-redirects";

const map: ArticleTranslationMap = {
  "rag-entreprise": { fr: "rag-entreprise", en: "enterprise-rag" },
  "enterprise-rag": { fr: "rag-entreprise", en: "enterprise-rag" },
};

describe("translatedArticlePath (THE-2364)", () => {
  test.each([
    ["/resources/articles/rag-entreprise", "en", "/resources/articles/enterprise-rag"],
    ["/resources/articles/rag-entreprise", "fr", "/resources/articles/rag-entreprise"],
    ["/resources/articles/enterprise-rag", "fr", "/resources/articles/rag-entreprise"],
    ["/resources/articles/enterprise-rag/", "fr", "/resources/articles/rag-entreprise"],
  ])("%s in %s -> %s", (pathname, locale, target) => {
    expect(translatedArticlePath(pathname, locale, map)).toBe(target);
  });

  test.each([
    "/resources/articles/unknown-slug",
    "/resources/articles/les-skills",
    "/resources/skills/enterprise-rag",
    "/resources/articles/enterprise-rag/extra",
    "/privacy",
  ])("leaves %s unchanged", (pathname) => {
    expect(translatedArticlePath(pathname, "en", map)).toBe(pathname);
  });

  test("tolerates a missing or broken inlined map", () => {
    expect(parseArticleTranslations(undefined)).toEqual({});
    expect(parseArticleTranslations("not json")).toEqual({});
    expect(parseArticleTranslations(JSON.stringify(map))).toEqual(map);
  });
});

describe("articleTranslationMap from content/articles", () => {
  const entries = readArticleLanguages();
  const real = articleTranslationMap(entries);

  test("maps every slug of a translated article to both versions, and nothing else", () => {
    const translated = entries.filter((entry) => entry.translationKey);
    expect(Object.keys(real).sort()).toEqual(translated.map((entry) => entry.slug).sort());
    for (const entry of translated) {
      const versions = real[entry.slug];
      expect(versions[entry.language]).toBe(entry.slug);
      expect(versions.fr).toBeTruthy();
      expect(versions.en).toBeTruthy();
    }
  });

  test("sends each version's bare URL to the other language's slug", () => {
    for (const [slug, versions] of Object.entries(real)) {
      for (const locale of ["fr", "en"] as const) {
        expect(translatedArticlePath(`/resources/articles/${slug}`, locale, real)).toBe(
          `/resources/articles/${versions[locale]}`,
        );
      }
    }
  });

  test("rejects a slug that would turn into a redirect pattern", () => {
    expect(() =>
      articleTranslationMap([{ slug: "bad:slug", language: "fr", translationKey: "k" }]),
    ).toThrow();
  });
});
