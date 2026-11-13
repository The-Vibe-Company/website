import { describe, expect, test } from "bun:test";

import {
  AUTHORS,
  authorAbsoluteUrl,
  authorHref,
  authorRole,
  authorSitePath,
  isAuthorId,
  resolveArticleAuthor,
} from "./authors";
import { getContentByType } from "./content-source";

const SITE = "https://www.thevibecompany.co";

describe("article author resolution", () => {
  test("defaults to Stan Girard", () => {
    expect(resolveArticleAuthor({}).id).toBe("stan-girard");
    expect(resolveArticleAuthor({ series: "something-else" }).id).toBe("stan-girard");
  });

  test("Victor's Story articles are Victor's", () => {
    expect(resolveArticleAuthor({ series: "victor-story" }).id).toBe("victor-nivault");
  });

  test("an explicit author wins over the series", () => {
    expect(resolveArticleAuthor({ author: "stan-girard", series: "victor-story" }).id).toBe(
      "stan-girard",
    );
    expect(resolveArticleAuthor({ author: "victor-nivault" }).id).toBe("victor-nivault");
  });

  test("an unknown id falls back to the series rule", () => {
    expect(resolveArticleAuthor({ author: "nobody" }).id).toBe("stan-girard");
    expect(resolveArticleAuthor({ author: "nobody", series: "victor-story" }).id).toBe(
      "victor-nivault",
    );
    expect(isAuthorId("toString")).toBe(false);
  });

  test("every article resolves as expected, and any explicit author is a known id", () => {
    const articles = getContentByType("article");
    const victorStory = articles.filter((article) => article.series === "victor-story");
    expect(victorStory.length).toBeGreaterThan(0);
    for (const article of articles) {
      if (article.author !== undefined) expect(isAuthorId(article.author)).toBe(true);
      const expected = article.author ?? (article.series === "victor-story" ? "victor-nivault" : "stan-girard");
      expect(resolveArticleAuthor(article).id as string).toBe(expected);
    }
  });
});

describe("author links and roles", () => {
  const stan = AUTHORS["stan-girard"];
  const victor = AUTHORS["victor-nivault"];

  test("Stan links to the About page in the article's language", () => {
    expect(authorRole(stan, "fr")).toBe("Cofondateur");
    expect(authorRole(stan, "en")).toBe("Co-founder");
    expect(authorSitePath(stan, "fr")).toBe("/a-propos");
    expect(authorHref(stan, "fr")).toBe("/fr/a-propos");
    expect(authorHref(stan, "en")).toBe("/en/about");
    expect(authorAbsoluteUrl(stan, "fr")).toBe(`${SITE}/fr/a-propos`);
    expect(authorAbsoluteUrl(stan, "en")).toBe(`${SITE}/en/about`);
  });

  test("Victor links to his LinkedIn", () => {
    expect(authorRole(victor, "fr")).toBe("Builder");
    expect(authorRole(victor, "en")).toBe("Builder");
    expect(authorSitePath(victor, "fr")).toBeNull();
    expect(authorHref(victor, "fr")).toBe("https://www.linkedin.com/in/victor-nivault-698a77217");
  });

  test("no dashes in visible author text", () => {
    for (const author of Object.values(AUTHORS)) {
      for (const text of [author.name, author.role.fr, author.role.en]) {
        expect(text).not.toMatch(/[\u2013\u2014]/);
      }
    }
  });
});
