import { describe, expect, test } from "bun:test";

import { contentPath, getContentByType, getContentByTypeForLanguage } from "./content-source";
import { getCustomers } from "./customers";
import { normalizeMarkdownBody, renderMarkdown } from "./markdown";
import { localizedUrl } from "./site";
import { PORTFOLIO_CATEGORY_MAP, PROJECT_SLUGS } from "./projects";
import {
  articleFaqPageSchema,
  articleSchema,
  breadcrumbList,
  collectionPageSchema,
  extractMarkdownFaq,
  faqPageSchema,
  isPublishable,
  isPublishableInArticleFaq,
  isPublishableInCaseStudyFaq,
  siteGraph,
  softwareApplicationSchema,
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
        "https://www.ycombinator.com/companies/the-vibe-company",
        "https://github.com/The-Vibe-Company",
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

describe("softwareApplicationSchema", () => {
  const base = {
    name: "VibeDrift",
    description: "VibeDrift tracks real developer activity and turns it into useful metrics.",
    url: `${SITE}/en/portfolio/vibedrift`,
    applicationCategory: "DeveloperApplication",
  };

  test("returns a SoftwareApplication with required fields", () => {
    const schema = softwareApplicationSchema(base);
    expect(schema).toMatchObject({
      "@type": "SoftwareApplication",
      name: "VibeDrift",
      url: base.url,
      applicationCategory: "DeveloperApplication",
      author: { "@id": `${SITE}/#organization` },
      provider: { "@id": `${SITE}/#organization` },
    });
  });

  test("includes description when publishable", () => {
    const schema = softwareApplicationSchema(base);
    expect(schema).toHaveProperty("description", base.description);
  });

  test("omits description when isPublishable fails (e.g. contains 'SOC 2')", () => {
    const schema = softwareApplicationSchema({ ...base, description: "SOC 2 compliant tool." });
    expect(schema).not.toHaveProperty("description");
  });

  test("omits aggregateRating and offers", () => {
    const json = JSON.stringify(softwareApplicationSchema(base));
    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain("offers");
  });

  test("includes optional fields when provided", () => {
    const schema = softwareApplicationSchema({
      ...base,
      applicationSubCategory: "Dev analytics",
      imageUrl: `${SITE}/projects/vibedrift-home.png`,
      sameAs: ["https://www.vibedrift.dev"],
      operatingSystem: "Web",
    });
    expect(schema).toMatchObject({
      applicationSubCategory: "Dev analytics",
      image: `${SITE}/projects/vibedrift-home.png`,
      sameAs: ["https://www.vibedrift.dev"],
      operatingSystem: "Web",
    });
  });

  test("omits optional fields when not provided", () => {
    const schema = softwareApplicationSchema(base);
    expect(schema).not.toHaveProperty("applicationSubCategory");
    expect(schema).not.toHaveProperty("image");
    expect(schema).not.toHaveProperty("sameAs");
    expect(schema).not.toHaveProperty("operatingSystem");
  });

  test("PORTFOLIO_CATEGORY_MAP covers every PROJECT_SLUGS entry", () => {
    for (const slug of PROJECT_SLUGS) {
      expect(PORTFOLIO_CATEGORY_MAP).toHaveProperty(slug);
      expect(typeof PORTFOLIO_CATEGORY_MAP[slug].applicationCategory).toBe("string");
    }
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

describe("collectionPageSchema", () => {
  const hubUrl = `${SITE}/en/resources`;
  const sampleItems = [
    { name: "First article", url: `${SITE}/en/resources/articles/first` },
    { name: "Second article", url: `${SITE}/en/resources/articles/second` },
    { name: "Third article", url: `${SITE}/en/resources/articles/third` },
  ];

  test("renders a CollectionPage with an ItemList numbered from 1", () => {
    const node = collectionPageSchema({
      url: hubUrl,
      name: "AI Resources: articles & hands-on guides",
      description: "A short publishable description.",
      language: "en",
      items: sampleItems,
    });

    expect(node).toMatchObject({
      "@type": "CollectionPage",
      "@id": hubUrl,
      url: hubUrl,
      name: "AI Resources: articles & hands-on guides",
      description: "A short publishable description.",
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 3,
        itemListElement: [
          { "@type": "ListItem", position: 1, url: sampleItems[0].url, name: "First article" },
          { "@type": "ListItem", position: 2, url: sampleItems[1].url, name: "Second article" },
          { "@type": "ListItem", position: 3, url: sampleItems[2].url, name: "Third article" },
        ],
      },
    });
  });

  test("drops a description that mentions a certification", () => {
    const node = collectionPageSchema({
      url: hubUrl,
      name: "AI Resources: articles & hands-on guides",
      description: "The Vibe Company is SOC 2 ready.",
      language: "en",
      items: sampleItems,
    });
    expect(node).not.toHaveProperty("description");
  });

  test("keeps a publishable description", () => {
    const node = collectionPageSchema({
      url: hubUrl,
      name: "AI Resources: articles & hands-on guides",
      description:
        "AI articles and hands-on guides from The Vibe Company: agents, automation, shipping to prod, plus Victor's Story.",
      language: "en",
      items: sampleItems,
    });
    expect(node).toHaveProperty(
      "description",
      "AI articles and hands-on guides from The Vibe Company: agents, automation, shipping to prod, plus Victor's Story.",
    );
  });

  test("smoke: fr resources hub ItemList caps at 15 newest articles", () => {
    const articles = getContentByTypeForLanguage("article", "fr").slice(0, 15);
    const items = articles.map((article) => ({
      name: article.title,
      url: localizedUrl("fr", contentPath(article)),
    }));
    const node = collectionPageSchema({
      url: localizedUrl("fr", "/resources"),
      name: "Ressources IA : nos articles et guides",
      description:
        "Articles et guides IA de The Vibe Company : agents, automatisation, mise en production, et la Victor’s Story.",
      language: "fr",
      items,
    }) as { mainEntity: { itemListElement: { position: number; url: string }[]; numberOfItems: number } };

    expect(node.mainEntity.numberOfItems).toBe(items.length);
    expect(node.mainEntity.itemListElement.length).toBeLessThanOrEqual(15);
    expect(node.mainEntity.itemListElement[0].position).toBe(1);
    for (const entry of node.mainEntity.itemListElement) {
      expect(entry.url.startsWith(`${SITE}/fr/resources/`)).toBe(true);
    }
  });

  test("markup never adds restricted terms beyond the item names", () => {
    const node = collectionPageSchema({
      url: hubUrl,
      name: "AI Resources: articles & hands-on guides",
      description:
        "AI articles and hands-on guides from The Vibe Company: agents, automation, shipping to prod, plus Victor's Story.",
      language: "en",
      items: sampleItems,
    }) as Record<string, unknown> & { mainEntity: { itemListElement: Record<string, unknown>[] } };

    const rest = {
      ...node,
      name: undefined,
      url: undefined,
      "@id": undefined,
      mainEntity: {
        ...node.mainEntity,
        itemListElement: node.mainEntity.itemListElement.map((entry) => ({
          ...entry,
          name: undefined,
          url: undefined,
        })),
      },
    };
    expect(isPublishable(JSON.stringify(rest))).toBe(true);
    const json = JSON.stringify(node);
    for (const key of ["priceRange", "aggregateRating", "SOC 2", "ISO 27001"]) {
      expect(json).not.toContain(key);
    }
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

describe("article modification dates", () => {
  const input = {
    url: SITE + "/fr/resources/articles/example",
    title: "Example",
    publishedAt: "2026-11-04",
    language: "fr",
  };

  test("uses the explicit modification date without changing publication", () => {
    const schema = articleSchema({ ...input, dateModified: "2026-11-10" });
    expect(schema.datePublished).toBe("2026-11-04");
    expect(schema.dateModified).toBe("2026-11-10");
  });

  test("falls back to publication when no modification date is provided", () => {
    const schema = articleSchema(input);
    expect(schema.datePublished).toBe("2026-11-04");
    expect(schema.dateModified).toBe(schema.datePublished);
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

describe("case-study FAQs", () => {
  test("isPublishableInCaseStudyFaq allows client names and MediaGen but blocks certifications", () => {
    expect(isPublishableInCaseStudyFaq("MediaGen")).toBe(true);
    expect(isPublishableInCaseStudyFaq("Monka’s coordinating nurses")).toBe(true);
    expect(isPublishableInCaseStudyFaq("At LocService.")).toBe(true);
    expect(isPublishableInCaseStudyFaq("SOC 2")).toBe(false);
    expect(isPublishableInCaseStudyFaq("SOC2 compliant")).toBe(false);
    expect(isPublishableInCaseStudyFaq("ISO 27001")).toBe(false);
  });

  for (const locale of ["fr", "en"] as const) {
    const customers = getCustomers(locale);
    for (const customer of customers) {
      if (!customer.faq) continue;
      test(`${customer.slug} (${locale}): FAQPage mainEntity matches faq length`, () => {
        const schema = faqPageSchema(customer.faq!, isPublishableInCaseStudyFaq) as
          | { mainEntity: unknown[] }
          | null;
        expect(schema).not.toBeNull();
        expect(schema!.mainEntity.length).toBe(customer.faq!.length);
      });
    }
  }

  test("Monka FR FAQ mentions the two-month go-live", () => {
    const monka = getCustomers("fr").find((c) => c.slug === "monka")!;
    const schema = faqPageSchema(monka.faq!, isPublishableInCaseStudyFaq) as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    const combined = schema.mainEntity.map((q) => `${q.name} ${q.acceptedAnswer.text}`).join("\n");
    expect(combined).toContain("deux mois");
  });

  test("LocService FAQ includes 87%", () => {
    for (const locale of ["fr", "en"] as const) {
      const locservice = getCustomers(locale).find((c) => c.slug === "locservice")!;
      const schema = faqPageSchema(locservice.faq!, isPublishableInCaseStudyFaq) as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      const combined = schema.mainEntity.map((q) => `${q.name} ${q.acceptedAnswer.text}`).join("\n");
      expect(combined).toContain("87");
    }
  });

  test("no case-study FAQ string names SOC 2 or ISO", () => {
    for (const locale of ["fr", "en"] as const) {
      for (const customer of getCustomers(locale)) {
        if (!customer.faq) continue;
        for (const item of customer.faq) {
          expect(item.question).not.toMatch(/\bSOC\s?2\b/i);
          expect(item.question).not.toMatch(/\bISO\b/i);
          expect(item.answer).not.toMatch(/\bSOC\s?2\b/i);
          expect(item.answer).not.toMatch(/\bISO\b/i);
          expect(item.answer).not.toMatch(/certifi[ée]e? HDS/i);
        }
      }
    }
  });
});
