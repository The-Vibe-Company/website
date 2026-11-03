import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL } from "./booking";
import { getContentItem } from "./content-source";
import { getCustomer } from "./customers";
import {
  MEDIA_CASE_SLUG,
  MEDIA_FAQ_KEYS,
  MEDIA_FUNDING_ARTICLE_PATHS,
  mediaPageId,
} from "./media-ai";
import { MEDIA_AI_PATHS, splitPathAlternates } from "./site";
import { faqPageSchema, isPublishable, serviceNode, webPageNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const MESSAGES = { fr: fr.mediaAi, en: en.mediaAi } as const;

/** What `t.markup` returns with pass-through tags. */
function plainAnswer(answer: string): string {
  return answer.replace(/<\/?(case|funding|agency|agents)>/g, "");
}

describe("media AI landing", () => {
  test("each language is canonical on its own path and declares the other", () => {
    expect(splitPathAlternates("fr", MEDIA_AI_PATHS)).toEqual({
      canonical: `${SITE}/fr/ia-medias`,
      languages: {
        fr: `${SITE}/fr/ia-medias`,
        en: `${SITE}/en/ai-for-media`,
        "x-default": `${SITE}/fr/ia-medias`,
      },
    });
    expect(splitPathAlternates("en", MEDIA_AI_PATHS).canonical).toBe(`${SITE}/en/ai-for-media`);
    expect(mediaPageId("fr")).toBe("ia-medias");
    expect(mediaPageId("en")).toBe("ai-for-media");
  });

  test("keeps the briefed title, meta description, H1 and calls", () => {
    expect(MESSAGES.fr.metaTitle).toBe("IA médias : outils pour les rédactions | The Vibe Company");
    expect(MESSAGES.fr.metaDescription).toBe(
      "Outils IA pour rédactions et médias, jusqu'en production. Preuve AFP / MediaGen (France 2030). Agence IA Paris, YC W24. RDV sous 24 h.",
    );
    expect(MESSAGES.fr.title).toBe(
      "IA pour les médias : on construit les outils des rédactions jusqu'en production",
    );
    expect(MESSAGES.en.metaTitle).toBe("AI for Media: tools for newsrooms | The Vibe Company");
    expect(MESSAGES.en.metaDescription).toBe(
      "AI tools for newsrooms and media orgs, shipped to production. AFP / MediaGen proof (France 2030). Paris AI agency, YC W24. Reply within 24h.",
    );
    expect(MESSAGES.en.title).toBe("AI for media: we build newsroom tools all the way to production");
    expect(MESSAGES.fr.kicker).toBe("// IA MÉDIAS · RÉDACTIONS");
    expect(MESSAGES.en.kicker).toBe("// AI FOR MEDIA · NEWSROOMS");
    expect(MESSAGES.fr.bookCall).toBe("Prendre 30 minutes");
    expect(MESSAGES.fr.response).toBe("Réponse sous 24 h");
    expect(MESSAGES.en.bookCall).toBe("Book 30 minutes");
    expect(MESSAGES.en.response).toBe("Reply within 24h");
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.metaTitle.length).toBeLessThanOrEqual(60);
      expect(messages.metaDescription.length).toBeLessThanOrEqual(160);
      expect(messages.metaTitle).not.toBe(messages.title);
    }
  });

  test("does not reuse the funding article's title", () => {
    for (const [locale, path] of Object.entries(MEDIA_FUNDING_ARTICLE_PATHS)) {
      const article = getContentItem("article", path.split("/").pop()!);
      const messages = MESSAGES[locale as keyof typeof MESSAGES];
      expect(article?.title).not.toBe(messages.title);
      expect(article?.title).not.toBe(messages.metaTitle);
    }
  });

  test("never claims a certification, a price, a funding service or AI replacing journalists", () => {
    const forbidden = [
      /\bSOC\s?2\b/i,
      /\bISO\b/,
      /\bHDS\b/,
      /hasCredential/,
      /certifi/i,
      // The only amount on the page is MediaGen's published budget, removed below.
      /[€$£]/,
      /\b(TJM|tarif|à partir de|starting at|per day|par jour)\b/i,
      /\/30min/,
      /À CONFIRMER/i,
      // We build the tools; we do not put together a France 2030 / Bpifrance application.
      /\bon monte (votre|vos) dossier/i,
      /\bwe (put together|file|prepare|handle) your\b/i,
      /\b(l'IA|IA|AI) (remplace|replaces)\b/i,
    ];
    for (const messages of Object.values(MESSAGES)) {
      const copy = JSON.stringify(messages).replace(/4 M€|€4M/g, "");
      for (const pattern of forbidden) expect(copy).not.toMatch(pattern);
    }
    expect(MESSAGES.fr.proof.items.notDossier).toContain("on ne monte pas votre dossier");
    expect(MESSAGES.en.proof.items.notDossier).toContain("we do not put together");
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("the MediaGen facts match the published AFP case, with three tools and no fourth", () => {
    for (const locale of ["fr", "en"] as const) {
      const afp = getCustomer(MEDIA_CASE_SLUG, locale)!;
      const messages = MESSAGES[locale];
      expect(afp.points).toHaveLength(3);
      expect(messages.afp.stats.tools.value).toBe("3");
      expect(afp.results.map((stat) => stat.value)).toEqual(
        expect.arrayContaining([messages.afp.stats.budget.value, messages.afp.stats.horizon.value]),
      );
      for (const partner of ["Kairntech", "Dawex"]) expect(afp.summary).toContain(partner);
    }
    expect(fr.mediaAi.afp.points.slice(0, 3).map((point) => point.split(" :")[0])).toEqual([
      "Veille augmentée",
      "Recherche multimodale",
      "Aide à la production",
    ]);
  });

  test("links only to articles and case studies that exist in the linked language", () => {
    for (const locale of ["fr", "en"] as const) {
      const slug = MEDIA_FUNDING_ARTICLE_PATHS[locale].split("/").pop()!;
      expect(getContentItem("article", slug)?.language).toBe(locale);
      expect(getCustomer(MEDIA_CASE_SLUG, locale)).toBeDefined();
    }
  });

  test("the FAQPage carries the publishable answers word for word, without link tags", () => {
    for (const messages of Object.values(MESSAGES)) {
      const items = MEDIA_FAQ_KEYS.map((key) => ({
        key,
        question: messages.faq.items[key].q,
        answer: plainAnswer(messages.faq.items[key].a),
      }));
      for (const item of items) expect(item.answer).not.toMatch(/[<>]/);
      // Answers naming AFP or MediaGen stay out of the markup, as site-wide.
      expect(
        items
          .filter((item) => isPublishable(item.question) && isPublishable(item.answer))
          .map((item) => item.key),
      ).toEqual(["replace", "hallucinations", "cost"]);
      const schema = faqPageSchema(items) as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      expect(schema.mainEntity.map((entry) => entry.name)).toEqual([
        messages.faq.items.replace.q,
        messages.faq.items.hallucinations.q,
        messages.faq.items.cost.q,
      ]);
    }
  });

  test("the Service is provided by the Organization and carries no offer", () => {
    const url = `${SITE}/fr/ia-medias`;
    const service = serviceNode({
      url,
      name: MESSAGES.fr.service.name,
      serviceType: "AI product development for media and newsrooms",
      description: MESSAGES.fr.service.description,
    });

    expect(service).toMatchObject({
      "@type": "Service",
      name: "Projets IA pour médias et rédactions",
      serviceType: "AI product development for media and newsrooms",
      description: MESSAGES.fr.service.description,
      provider: { "@id": `${SITE}/#organization` },
      areaServed: { "@type": "Country", name: "France" },
      url,
    });
    expect(service).not.toHaveProperty("offers");
    expect(service).not.toHaveProperty("hasCredential");
    expect(isPublishable(MESSAGES.en.service.description)).toBe(true);
  });

  test("the WebPage belongs to the site and is about the Organization", () => {
    const url = `${SITE}/en/ai-for-media`;
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
