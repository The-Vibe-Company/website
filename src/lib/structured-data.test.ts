import { describe, expect, test } from "bun:test";

import { getContentByType } from "./content-source";
import { normalizeMarkdownBody, renderMarkdown } from "./markdown";
import {
  articleFaqPageSchema,
  articleSchema,
  breadcrumbList,
  extractMarkdownFaq,
  faqPageSchema,
  isPublishable,
  isPublishableInArticleFaq,
  siteGraph,
  webPageNode,
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
    const graph = siteGraph("en") as { "@graph": Record<string, unknown>[] };
    const [organization, website] = graph["@graph"];

    expect(organization).toMatchObject({
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE}/#organization`,
      name: "The Vibe Company",
      url: SITE,
      image: `${SITE}/icon.png`,
      logo: { url: `${SITE}/icon.png`, width: 512, height: 512 },
      foundingDate: "2024",
      address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
      areaServed: [{ "@type": "Country", name: "France" }],
      knowsAbout: [
        "Artificial intelligence",
        "AI agents",
        "Large language models",
        "Generative AI",
        "AI automation",
        "Model Context Protocol",
      ],
      sameAs: [
        "https://www.linkedin.com/company/thevibeco",
        "https://www.ycombinator.com/companies/the-vibe-company",
        "https://github.com/The-Vibe-Company",
        "https://x.com/thevibecompany",
        "https://github.com/QuivrHQ",
        "https://www.linkedin.com/company/getquivr",
      ],
    });
    expect(organization.founder).toMatchObject([
      { "@id": `${SITE}/#stan-girard`, name: "Stan Girard" },
      {
        "@id": `${SITE}/#antoine-dewez`,
        name: "Antoine Dewez",
        sameAs: [
          "https://www.linkedin.com/in/antoine-dewez-367774157",
          "https://x.com/AntoineZewed",
        ],
      },
    ]);
    expect(website).toMatchObject({ "@type": "WebSite", name: "The Vibe Company", url: SITE });
  });

  test("describes the agency in the page's language", () => {
    const description = (locale: string) =>
      (siteGraph(locale) as { "@graph": Record<string, unknown>[] })["@graph"][0].description;

    expect(description("fr")).toBe(
      "Agence IA native à Paris : agents IA, intégration de LLM et automatisation, du cadrage à la mise en production.",
    );
    expect(description("en")).toBe(
      "AI-native agency in Paris: AI agents, LLM integration and automation, from scoping to production.",
    );
  });

  test("leaves out the optional business fields we cannot source", () => {
    for (const locale of ["fr", "en"]) {
      const json = JSON.stringify(siteGraph(locale));
      for (const key of [
        "priceRange",
        "aggregateRating",
        "review",
        "telephone",
        "email",
        "openingHours",
        "award",
        "hasCredential",
      ]) {
        expect(json).not.toContain(`"${key}"`);
      }
    }
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

  test("case study detail has a three-step trail ending on the client", () => {
    const url = `${SITE}/en/case-studies/theodo`;
    expect(
      breadcrumbList([
        { name: "Home", url: `${SITE}/en` },
        { name: "Case studies", url: `${SITE}/en/case-studies` },
        { name: "Theodo", url },
      ]),
    ).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: `${SITE}/en` },
        { position: 2, name: "Case studies", item: `${SITE}/en/case-studies` },
        { position: 3, name: "Theodo", item: url },
      ],
    });
  });
});

describe("webPageNode", () => {
  test("attaches the case study page to the site WebSite and Organization", () => {
    const url = `${SITE}/en/case-studies/theodo`;
    const node = webPageNode({
      url,
      name: "Theodo · Case studies",
      description: "A short publishable description.",
      language: "en",
    });

    expect(node).toMatchObject({
      "@type": "WebPage",
      "@id": url,
      url,
      name: "Theodo · Case studies",
      description: "A short publishable description.",
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    });
  });

  test("drops a description that mentions a client name", () => {
    const node = webPageNode({
      url: `${SITE}/en/case-studies/theodo`,
      name: "Theodo · Case studies",
      // The Theodo summary mentions the client by name — kept out of markup
      // by isPublishable, same policy as other pages.
      description: "The Vibe Company supports Theodo as a technical expert.",
      language: "en",
    });
    expect(node).not.toHaveProperty("description");
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
      ];
      for (const schema of schemas) {
        if (!schema) continue;
        const rest = { ...schema, headline: undefined, url: undefined, mainEntityOfPage: undefined };
        expect(isPublishable(JSON.stringify(rest))).toBe(true);
      }
      const faq = articleFaqPageSchema(article.body);
      if (faq) expect(isPublishableInArticleFaq(JSON.stringify(faq))).toBe(true);
    }
  });

  // Regression: entries naming a client (Monka, LocService) or a price word
  // ("forfait", "€") used to be dropped, so the markup had fewer questions than
  // the page (e.g. "Combien de temps faut-il…" on the HDS article).
  test("every article FAQ question visible on the page is in the FAQPage markup", () => {
    const withFaq = articles.filter((article) => /^## FAQ\s*$/m.test(article.body));
    for (const article of withFaq) {
      const items = extractMarkdownFaq(article.body);
      const visible = (article.body.split(/^## FAQ\s*$/m)[1] ?? "")
        .split(/^#{1,2}\s/m)[0]
        .split("\n")
        .filter((line) => /^###\s+\S/.test(line.trim()) || /^\*\*.+\*\*$/.test(line.trim()));
      expect({ slug: article.slug, count: items.length }).toEqual({ slug: article.slug, count: visible.length });

      const faq = articleFaqPageSchema(article.body) as { mainEntity: { name: string }[] } | null;
      const kept = items.filter(
        (item) => isPublishableInArticleFaq(item.question) && isPublishableInArticleFaq(item.answer),
      );
      expect({ slug: article.slug, questions: faq?.mainEntity.map((q) => q.name) ?? [] }).toEqual({
        slug: article.slug,
        questions: kept.map((item) => item.question),
      });
    }

    const hds = articles.find((article) => article.slug === "ia-donnees-de-sante-hds");
    const hdsFaq = articleFaqPageSchema(hds!.body) as { mainEntity: { name: string }[] };
    expect(hdsFaq.mainEntity.map((q) => q.name)).toContain(
      "Combien de temps faut-il pour mettre en production un projet IA en santé ?",
    );
  });

  test("article FAQ markup keeps certifications and the grant programme out", () => {
    const markdown = [
      "## FAQ",
      "",
      "### Combien de temps faut-il ?",
      "",
      "Chez Monka, deux mois, au forfait.",
      "",
      "### Êtes-vous certifiés ?",
      "",
      "Nous ne sommes pas certifiés SOC 2.",
      "",
      "### Quel financement ?",
      "",
      "Le projet MediaGen.",
    ].join("\n");
    const faq = articleFaqPageSchema(markdown) as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.map((q) => q.name)).toEqual(["Combien de temps faut-il ?"]);
    expect(isPublishableInArticleFaq("ISO 27001")).toBe(false);
    expect(articleFaqPageSchema("## FAQ\n\n### SOC 2 ?\n\nNon.")).toBeNull();
  });

  test("Victor's Story articles are Victor's, every other article is Stan's", () => {
    const victorStory = articles.filter((article) => article.series === "victor-story");
    expect(victorStory.length).toBeGreaterThan(0);

    for (const article of articles) {
      const schema = articleSchema({
        url: `${SITE}/${article.language}/resources/articles/${article.slug}`,
        title: article.title,
        publishedAt: article.publishedAt,
        language: article.language,
        series: article.series,
      });
      if (article.series === "victor-story") {
        expect(schema.author).toEqual({
          "@type": "Person",
          name: "Victor Nivault",
          jobTitle: "Builder",
          worksFor: { "@type": "Organization", name: "The Vibe Company" },
          sameAs: ["https://www.linkedin.com/in/victor-nivault-698a77217"],
        });
      } else {
        expect(schema.author).toMatchObject({ "@type": "Person", name: "Stan Girard" });
      }
    }
  });

  test("an article without a FAQ section gets no FAQPage", () => {
    expect(extractMarkdownFaq("## Intro\n\nText.\n\n## Next\n\n**Not a question**\nBody.")).toEqual([]);
    expect(faqPageSchema([])).toBeNull();
  });
});
