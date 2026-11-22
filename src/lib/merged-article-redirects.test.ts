import { describe, expect, test } from "bun:test";
import { readArticleLanguages } from "./bare-article-redirects";
import { MERGED_ARTICLES, mergedArticleRedirects } from "./merged-article-redirects";

const articles = readArticleLanguages();

describe("mergedArticleRedirects", () => {
  test("the old CIR story lands on the CIR playbook from every form of its URL", () => {
    const from = "comment-on-a-ecrit-notre-cir-pour-recuperer-150-000-euros-grace-a-lia";
    const destination = "/fr/resources/articles/laisser-lia-faire-votre-cir-sans-la-laisser-inventer";
    expect(mergedArticleRedirects()).toEqual(
      expect.arrayContaining([
        { source: `/:locale(fr|en)/resources/articles/${from}`, destination, permanent: true },
        { source: `/resources/articles/${from}`, destination, permanent: true },
      ])
    );
  });

  test.each(MERGED_ARTICLES.map((entry) => [entry.from, entry] as const))(
    "%s is gone and its target exists in the declared language (no chain, no 404)",
    (_, { from, to, language }) => {
      expect(articles.some((article) => article.slug === from)).toBe(false);
      const target = articles.find((article) => article.slug === to);
      expect(target?.language).toBe(language);
      expect(MERGED_ARTICLES.some((entry) => entry.from === to)).toBe(false);
    }
  );
});
