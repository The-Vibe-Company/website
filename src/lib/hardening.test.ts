import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL } from "./booking";
import { getContentItem } from "./content-source";
import { getCustomer } from "./customers";
import {
  AGENT_AUTHORITY_PATH,
  BLACK_OCTOBER_PATHS,
  HARDENING_CASE_SLUGS,
  HARDENING_FAQ_KEYS,
  HDS_GUIDE_PATHS,
  MCP_GUIDE_PATHS,
} from "./hardening";
import { HARDENING_PATHS, splitPathAlternates } from "./site";
import { faqPageSchema, isPublishable, serviceSchema, webPageSchema } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const MESSAGES = { fr: fr.hardening, en: en.hardening } as const;

describe("hardening landing", () => {
  test("each language is canonical on its own path and declares the other", () => {
    expect(splitPathAlternates("fr", HARDENING_PATHS)).toEqual({
      canonical: `${SITE}/fr/agents-ia-securite-produit`,
      languages: {
        fr: `${SITE}/fr/agents-ia-securite-produit`,
        en: `${SITE}/en/ai-agents-product-hardening`,
        "x-default": `${SITE}/fr/agents-ia-securite-produit`,
      },
    });
    expect(splitPathAlternates("en", HARDENING_PATHS).canonical).toBe(
      `${SITE}/en/ai-agents-product-hardening`,
    );
  });

  test("keeps the briefed title, meta description and H1", () => {
    expect(MESSAGES.fr.metaTitle).toBe("Agents IA pour durcir produit et SI | The Vibe Company");
    expect(MESSAGES.fr.title).toBe("Utiliser des agents IA pour durcir votre produit et votre SI");
    expect(MESSAGES.en.metaTitle).toBe("AI Agents to Harden Your Product & Stack | The Vibe Company");
    expect(MESSAGES.en.title).toBe("Use AI agents to harden your product and your infrastructure");
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.metaTitle.length).toBeLessThanOrEqual(60);
      expect(messages.metaDescription.length).toBeLessThanOrEqual(160);
    }
  });

  test("never claims a certification, a price or a guarantee", () => {
    const forbidden = [
      /\bSOC\s?2\b/i,
      /\bISO\b/,
      /certifi(é|e)e?s?\s+HDS/i,
      /HDS[- ]certified/i,
      /zero[- ]breach/i,
      /z(é|e)ro (faille|incident)/i,
      /[€$£]/,
      /\/30min/,
    ];
    for (const messages of Object.values(MESSAGES)) {
      const copy = JSON.stringify(messages);
      for (const pattern of forbidden) expect(copy).not.toMatch(pattern);
    }
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("links only to articles and case studies that exist in the linked language", () => {
    for (const locale of ["fr", "en"] as const) {
      for (const paths of [BLACK_OCTOBER_PATHS, MCP_GUIDE_PATHS, HDS_GUIDE_PATHS]) {
        const slug = paths[locale].split("/").pop()!;
        expect(getContentItem("article", slug)?.language).toBe(locale);
      }
      for (const slug of HARDENING_CASE_SLUGS) {
        expect(getCustomer(slug, locale)).toBeDefined();
      }
    }
    const authority = AGENT_AUTHORITY_PATH.split("/").pop()!;
    expect(getContentItem("article", authority)?.language).toBe("fr");
  });

  test("the whole FAQ goes into the FAQPage markup", () => {
    for (const messages of Object.values(MESSAGES)) {
      const items = HARDENING_FAQ_KEYS.map((key) => ({
        question: messages.faq.items[key].q,
        answer: messages.faq.items[key].a,
      }));
      const schema = faqPageSchema(items) as { mainEntity: unknown[] };
      expect(schema.mainEntity).toHaveLength(HARDENING_FAQ_KEYS.length);
    }
  });

  test("the Service is provided by the Organization and carries no offer", () => {
    const url = `${SITE}/fr/agents-ia-securite-produit`;
    const service = serviceSchema({
      url,
      name: MESSAGES.fr.service.name,
      serviceType: "AI agents for product and infrastructure hardening",
      description: MESSAGES.fr.service.description,
      language: "fr",
    });

    expect(service).toMatchObject({
      "@type": "Service",
      "@id": `${url}#service`,
      name: "Agents IA pour durcir produit et SI",
      serviceType: "AI agents for product and infrastructure hardening",
      provider: { "@id": `${SITE}/#organization` },
    });
    expect(service.description).toBe(MESSAGES.fr.service.description);
    expect(service).not.toHaveProperty("offers");
    expect(isPublishable(MESSAGES.en.service.description)).toBe(true);
  });

  test("the WebPage belongs to the site", () => {
    const url = `${SITE}/en/ai-agents-product-hardening`;
    expect(
      webPageSchema({ url, name: MESSAGES.en.title, description: MESSAGES.en.metaDescription, language: "en" }),
    ).toMatchObject({
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/#website` },
    });
  });
});
