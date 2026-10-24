import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL } from "./booking";
import { getContentItem } from "./content-source";
import { getCustomer } from "./customers";
import {
  HEALTHCARE_CASE_SLUG,
  HEALTHCARE_FAQ_KEYS,
  HEALTHCARE_HDS_ARTICLE_PATHS,
  HEALTHCARE_SECONDARY_CASE_SLUG,
  healthcarePageId,
} from "./healthcare-ai";
import { HEALTHCARE_AI_PATHS, splitPathAlternates } from "./site";
import { faqPageSchema, isPublishable, serviceNode, webPageNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const MESSAGES = { fr: fr.healthcareAi, en: en.healthcareAi } as const;

describe("healthcare AI landing", () => {
  test("each language is canonical on its own path and declares the other", () => {
    expect(splitPathAlternates("fr", HEALTHCARE_AI_PATHS)).toEqual({
      canonical: `${SITE}/fr/ia-sante-hds`,
      languages: {
        fr: `${SITE}/fr/ia-sante-hds`,
        en: `${SITE}/en/healthcare-ai-hds`,
        "x-default": `${SITE}/fr/ia-sante-hds`,
      },
    });
    expect(splitPathAlternates("en", HEALTHCARE_AI_PATHS).canonical).toBe(
      `${SITE}/en/healthcare-ai-hds`,
    );
    expect(healthcarePageId("fr")).toBe("ia-sante-hds");
    expect(healthcarePageId("en")).toBe("healthcare-ai-hds");
  });

  test("keeps the briefed title, meta description and H1", () => {
    expect(MESSAGES.fr.metaTitle).toBe("IA santé & HDS : projets en production | The Vibe Company");
    expect(MESSAGES.fr.metaDescription).toBe(
      "Projets IA sur données de santé, livrés selon les exigences RGPD et HDS. Cas Monka (prod en 2 mois). Agence IA Paris, YC W24. RDV sous 24 h.",
    );
    expect(MESSAGES.fr.title).toBe("IA santé et HDS : on construit vos produits jusqu'en production");
    expect(MESSAGES.en.metaTitle).toBe("Healthcare AI & HDS: ship to production | The Vibe Company");
    expect(MESSAGES.en.metaDescription).toBe(
      "AI projects on French health data, built to GDPR and HDS requirements. Monka case (2 months to prod). Paris AI agency, YC W24. Reply within 24h.",
    );
    expect(MESSAGES.en.title).toBe(
      "Healthcare AI and HDS: we build your products all the way to production",
    );
    expect(MESSAGES.fr.bookCall).toBe("Prendre 30 minutes");
    expect(MESSAGES.en.bookCall).toBe("Book 30 minutes");
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.metaTitle.length).toBeLessThanOrEqual(60);
      expect(messages.metaDescription.length).toBeLessThanOrEqual(160);
      expect(messages.metaTitle).not.toBe(messages.title);
    }
  });

  test("does not reuse the HDS article's title", () => {
    for (const [locale, slug] of Object.entries(HEALTHCARE_HDS_ARTICLE_PATHS)) {
      const article = getContentItem("article", slug.split("/").pop()!);
      const messages = MESSAGES[locale as keyof typeof MESSAGES];
      expect(article?.title).not.toBe(messages.title);
      expect(article?.title).not.toBe(messages.metaTitle);
    }
  });

  test("never claims to be certified, a host, or anything priced", () => {
    const forbidden = [
      /\bSOC\s?2\b/i,
      /\bISO\b/,
      /hasCredential/,
      // A positive claim; the page only ever says it is not certified.
      /(The Vibe Company|TVC|\bon|\bnous)\s+(est|sommes)\s+(certifi|un hébergeur|hébergeur)/i,
      /(The Vibe Company|TVC|\bwe)\s+(is|are)\s+(HDS[- ]certified|certified|an? (HDS )?host)/i,
      /certifiée HDS(?! \?)/i,
      /[€$£]/,
      /\b(TJM|à partir de|starting at)\b/i,
      /\/30min/,
      /À CONFIRMER/i,
    ];
    for (const messages of Object.values(MESSAGES)) {
      const copy = JSON.stringify(messages);
      for (const pattern of forbidden) expect(copy).not.toMatch(pattern);
    }
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("links only to articles and case studies that exist in the linked language", () => {
    for (const locale of ["fr", "en"] as const) {
      const slug = HEALTHCARE_HDS_ARTICLE_PATHS[locale].split("/").pop()!;
      expect(getContentItem("article", slug)?.language).toBe(locale);
      expect(getCustomer(HEALTHCARE_CASE_SLUG, locale)).toBeDefined();
      expect(getCustomer(HEALTHCARE_SECONDARY_CASE_SLUG, locale)).toBeDefined();
    }
  });

  test("the Monka figures match the published case study", () => {
    const monka = getCustomer(HEALTHCARE_CASE_SLUG, "fr")!;
    const results = monka.results.map((stat) => stat.value);
    expect(results).toEqual(["2 mois", "165", "90", "12"]);
    const points = fr.healthcareAi.proof.points.join(" ");
    for (const figure of ["165 questions", "12 versions", "deux mois", "90 versions"]) {
      expect(points).toContain(figure);
    }
  });

  test("the whole FAQ goes into the FAQPage markup", () => {
    for (const messages of Object.values(MESSAGES)) {
      const items = HEALTHCARE_FAQ_KEYS.map((key) => ({
        question: messages.faq.items[key].q,
        answer: messages.faq.items[key].a,
      }));
      for (const item of items) {
        expect(isPublishable(item.question)).toBe(true);
        expect(isPublishable(item.answer)).toBe(true);
      }
      const schema = faqPageSchema(items) as { mainEntity: unknown[] };
      expect(schema.mainEntity).toHaveLength(HEALTHCARE_FAQ_KEYS.length);
    }
  });

  test("the Service is provided by the Organization and carries no offer", () => {
    const url = `${SITE}/fr/ia-sante-hds`;
    const service = serviceNode({
      url,
      name: MESSAGES.fr.service.name,
      serviceType: "Healthcare AI product development under GDPR and HDS requirements",
      description: MESSAGES.fr.service.description,
    });

    expect(service).toMatchObject({
      "@type": "Service",
      name: "Projets IA santé selon exigences HDS",
      serviceType: "Healthcare AI product development under GDPR and HDS requirements",
      provider: { "@id": `${SITE}/#organization` },
      areaServed: { "@type": "Country", name: "France" },
      url,
    });
    expect(service.description).toBe(MESSAGES.fr.service.description);
    expect(service).not.toHaveProperty("offers");
    expect(service).not.toHaveProperty("hasCredential");
    expect(isPublishable(MESSAGES.en.service.description)).toBe(true);
  });

  test("the WebPage belongs to the site and is about the Organization", () => {
    const url = `${SITE}/en/healthcare-ai-hds`;
    expect(
      webPageNode({ url, name: MESSAGES.en.title, description: MESSAGES.en.metaDescription, language: "en" }),
    ).toMatchObject({
      "@type": "WebPage",
      "@id": url,
      url,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    });
  });
});
