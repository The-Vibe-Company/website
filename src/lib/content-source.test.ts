import { describe, expect, test } from "bun:test";

import {
  getCanonicalContentForLanguage,
  getContentByType,
  getContentByTypeForLanguage,
  getContentTranslations,
} from "./content-source";

describe("article listings", () => {
  for (const language of ["fr", "en"] as const) {
    test(`lists ${language} articles newest first by publish date`, () => {
      const dates = getContentByTypeForLanguage("article", language).map(
        (item) => item.publishedAt,
      );

      expect(dates.length).toBeGreaterThan(1);
      expect(dates).toEqual([...dates].sort().reverse());
    });
  }
});

describe("canonical version per language prefix", () => {
  const articles = getContentByType("article");
  const monolingual = articles.filter(
    (item) => getContentTranslations(item.type, item.slug).length === 1,
  );
  const translated = articles.filter(
    (item) => getContentTranslations(item.type, item.slug).length > 1,
  );

  test("both kinds of article exist, so the checks below are not vacuous", () => {
    expect(monolingual.length).toBeGreaterThan(0);
    expect(translated.length).toBeGreaterThan(0);
  });

  test("an article is served as-is under its own language's prefix", () => {
    for (const item of articles) {
      expect(getCanonicalContentForLanguage(item.type, item.slug, item.language)?.id).toBe(item.id);
    }
  });

  test("a single-language article resolves to itself under the other prefix", () => {
    // The page then redirects to the article's own language instead of serving
    // a noindexed duplicate (e.g. /en/... -> /fr/... for a French-only article).
    for (const item of monolingual) {
      const other = item.language === "fr" ? "en" : "fr";
      expect(getCanonicalContentForLanguage(item.type, item.slug, other)?.id).toBe(item.id);
    }
  });

  test("a translated article resolves to its translation under the other prefix", () => {
    for (const item of translated) {
      const other = item.language === "fr" ? "en" : "fr";
      const target = getCanonicalContentForLanguage(item.type, item.slug, other);
      expect(target?.language).toBe(other);
      expect(target?.translationKey).toBe(item.translationKey);
    }
  });

  test("an unknown slug resolves to nothing", () => {
    expect(getCanonicalContentForLanguage("article", "does-not-exist", "en")).toBeNull();
  });
});
