import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { getContentItem } from "./content-source";
import { PRIORITY_ARTICLES } from "./priority-articles";

describe("priority articles", () => {
  test("every entry has a label in its language, and no label is orphaned", () => {
    expect(Object.keys(fr.footer.priorityArticles).sort()).toEqual(
      PRIORITY_ARTICLES.fr.map(({ key }) => key).sort(),
    );
    expect(Object.keys(en.footer.priorityArticles).sort()).toEqual(
      PRIORITY_ARTICLES.en.map(({ key }) => key).sort(),
    );
  });

  test("links only to articles that exist in the linked language", () => {
    for (const locale of ["fr", "en"] as const) {
      for (const { slug } of PRIORITY_ARTICLES[locale]) {
        expect(getContentItem("article", slug)?.language).toBe(locale);
      }
    }
  });
});
