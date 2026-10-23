import { describe, expect, test } from "bun:test";

import { getContentByTypeForLanguage } from "./content-source";

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
