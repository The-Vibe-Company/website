import { describe, expect, test } from "bun:test";

import { getContentByType } from "./content-source";
import { normalizeMarkdownBody, renderMarkdown } from "./markdown";
import {
  articleSchema,
  breadcrumbList,
  extractMarkdownFaq,
  faqPageSchema,
  isPublishable,
  siteGraph,
} from "./structured-data";

const SITE = "https://www.thevibecompany.co";

/** The text a reader sees once the Markdown is rendered. */
function visibleText(markdown: string): string {
  return renderMarkdown(normalizeMarkdownBody(markdown))
    .replace(/<\/?(a|strong|em|code)\b[^>]*>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

const collapse = (text: string) => text.replace(/\s+/g, " ");

describe("site graph", () => {
  test("declares the Organization and the WebSite", () => {
    const graph = siteGraph() as { "@graph": Record<string, unknown>[] };
    const [organization, website] = graph["@graph"];

    expect(organization).toMatchObject({
      "@type": "Organization",
      name: "The Vibe Company",
      url: SITE,
      logo: { url: `${SITE}/icon.png`, width: 1024, height: 1024 },
      foundingDate: "2024",
      address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
      sameAs: [
        "https://www.linkedin.com/company/thevibeco",
        "https://www.ycombinator.com/companies/the-vibe-company",
        "https://github.com/The-Vibe-Company",
        "https://x.com/thevibecompany",
      ],
    });
    expect((organization.founder as { name: string }[]).map((person) => person.name)).toEqual([
      "Stan Girard",
      "Antoine Dewez",
    ]);
    expect(website).toMatchObject({ "@type": "WebSite", name: "The Vibe Company", url: SITE });
  });
});

describe("breadcrumbList", () => {
  test("numbers the trail from 1", () => {
    expect(
      breadcrumbList([
        { name: "Home", url: `${SITE}/en` },
        { name: "Portfolio", url: `${SITE}/en/portfolio` },
      ]),
    ).toMatchObject({
      itemListElement: [
        { position: 1, name: "Home", item: `${SITE}/en` },
        { position: 2, name: "Portfolio", item: `${SITE}/en/portfolio` },
      ],
    });
  });
});

describe("isPublishable", () => {
  test("keeps client names, pricing, certifications and MediaGen out", () => {
    for (const text of [
      "At Monka, it took two months.",
      "Chez LocService, l'assistant lit tout.",
      "Avec l'AFP.",
      "SOC 2 ready",
      "ISO 27001",
      "Within a €400,000 cap",
      "Fixed price or time and materials?",
      "Forfait : prix fixe",
      "Forfait ou régie pour un projet IA ?",
      "Récupérer 150 000 euros",
      "Le projet MediaGen",
    ]) {
      expect(isPublishable(text)).toBe(false);
    }
    expect(isPublishable("A 30-minute call to understand your need.")).toBe(true);
  });
});

describe("articles", () => {
  const articles = getContentByType("article");

  test("every article FAQ is extracted word for word from the rendered page", () => {
    const withFaq = articles.filter((article) => /^## FAQ\s*$/m.test(article.body));
    expect(withFaq.length).toBeGreaterThan(0);

    for (const article of withFaq) {
      const items = extractMarkdownFaq(article.body);
      expect(items.length).toBeGreaterThan(0);
      const text = visibleText(article.body);
      for (const item of items) {
        expect(text).toContain(collapse(item.question));
        expect(text).toContain(collapse(item.answer));
      }
    }
  });

  // The headline is the article's own title, required and kept verbatim; the
  // free text the markup adds (description, FAQ) is what gets filtered.
  test("structured data never carries restricted terms beyond the title", () => {
    for (const article of articles) {
      const schemas = [
        articleSchema({
          url: `${SITE}/${article.language}/resources/articles/${article.slug}`,
          title: article.title,
          summary: article.summary,
          publishedAt: article.publishedAt,
          language: article.language,
        }),
        faqPageSchema(extractMarkdownFaq(article.body)),
      ];
      for (const schema of schemas) {
        if (!schema) continue;
        const rest = { ...schema, headline: undefined, url: undefined, mainEntityOfPage: undefined };
        expect(isPublishable(JSON.stringify(rest))).toBe(true);
      }
    }
  });

  test("an article without a FAQ section gets no FAQPage", () => {
    expect(extractMarkdownFaq("## Intro\n\nText.\n\n## Next\n\n**Not a question**\nBody.")).toEqual([]);
    expect(faqPageSchema([])).toBeNull();
  });
});
