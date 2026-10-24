import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { AGENCY_PARIS_FAQ_KEYS } from "./agency-paris";
import { BOOKING_URL } from "./booking";
import { faqPageSchema, isPublishable, serviceNode, webPageNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const LOCALES = { fr: fr.agencyParis, en: en.agencyParis };

describe("AI agency in Paris landing", () => {
  test("keeps the title, description and H1 of the SEO brief", () => {
    expect(fr.agencyParis.metaTitle).toBe("Agence IA à Paris — produits & agents | The Vibe Company");
    expect(fr.agencyParis.metaDescription).toBe(
      "Agence IA à Paris (YC W24) : produits IA, agents et formation jusqu'en production. Cas Monka, AFP, LocService. RDV sous 24 h.",
    );
    expect(fr.agencyParis.title).toBe(
      "Agence IA à Paris : on construit vos produits et agents IA jusqu'en production",
    );
    expect(en.agencyParis.metaTitle).toBe("AI Agency in Paris: ship products & agents | The Vibe Company");
    expect(en.agencyParis.metaDescription).toBe(
      "Paris AI agency (YC W24): AI products, agents and training shipped to production. Monka, AFP, LocService cases. Reply within 24h.",
    );
    expect(en.agencyParis.title).toBe(
      "AI agency in Paris: we build your AI products and agents, all the way to production",
    );
  });

  test("does not reuse the homepage title or H1", () => {
    expect(fr.agencyParis.metaTitle).not.toBe(fr.meta.homeTitle);
    expect(en.agencyParis.metaTitle).not.toBe(en.meta.homeTitle);
  });

  test("never claims a certification, a price or the old booking link", () => {
    for (const copy of Object.values(LOCALES)) {
      const text = JSON.stringify(copy);
      expect(text).not.toMatch(/SOC\s?2|\bISO\b|certifi|30min|À CONFIRMER/i);
      expect(text).not.toMatch(/€\s?\/|TJM|à partir de|starting at/i);
    }
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("puts all six FAQ entries in the FAQPage markup", () => {
    for (const copy of Object.values(LOCALES)) {
      const items = AGENCY_PARIS_FAQ_KEYS.map((key) => ({
        question: copy.faq.items[key].q,
        answer: copy.faq.items[key].a,
      }));
      for (const item of items) {
        expect(isPublishable(item.question)).toBe(true);
        expect(isPublishable(item.answer)).toBe(true);
      }
      const faq = faqPageSchema(items) as { mainEntity: unknown[] };
      expect(faq.mainEntity).toHaveLength(6);
    }
  });

  test("attaches the WebPage and the Service to the site graph", () => {
    const url = `${SITE}/fr/agence-ia-paris`;
    expect(webPageNode({ url, name: "N", description: "D", language: "fr" })).toEqual({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: "N",
      description: "D",
      inLanguage: "fr",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    });
    expect(
      serviceNode({
        url,
        name: "Agence IA à Paris",
        serviceType: "AI product development, AI agents, AI training",
        city: "Paris",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Agence IA à Paris",
      serviceType: "AI product development, AI agents, AI training",
      provider: { "@id": `${SITE}/#organization` },
      areaServed: { "@type": "City", name: "Paris" },
      url,
    });
  });
});
