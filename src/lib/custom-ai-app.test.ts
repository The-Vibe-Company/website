import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL } from "./booking";
import { getContentItem } from "./content-source";
import {
  CUSTOM_AI_APP_CASES,
  CUSTOM_AI_APP_FAQ_KEYS,
  CUSTOM_AI_APP_PLACEHOLDER_KEYS,
  CUSTOM_AI_APP_RAG_ARTICLE_PATHS,
  customAiAppPageId,
} from "./custom-ai-app";
import { getCustomer } from "./customers";
import { FOOTER_OFFERINGS } from "./footer-offerings";
import { AGENCY_PARIS_PATHS, CUSTOM_AI_APP_PATHS, splitPathAlternates } from "./site";
import { faqPageSchema, isPublishable, serviceNode, webPageNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const MESSAGES = { fr: fr.customAiApp, en: en.customAiApp } as const;
const PAGE_SOURCE = readFileSync(
  new URL("../components/custom-ai-app/CustomAiAppPage.tsx", import.meta.url),
  "utf8",
);
const PARIS_SOURCE = readFileSync(
  new URL("../components/agency-paris/AgencyParisPage.tsx", import.meta.url),
  "utf8",
);

/** What `t.markup` returns with pass-through tags. */
function plainAnswer(answer: string): string {
  return answer.replace(/<\/?(case|rag|agency|agents)>/g, "");
}

/** Every string in a messages subtree, with its dot path. */
function strings(node: unknown, path = ""): [string, string][] {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((item, i) => strings(item, `${path}.${i}`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      strings(value, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("custom AI app landing", () => {
  test("each language is canonical on its own path and declares the other", () => {
    expect(splitPathAlternates("fr", CUSTOM_AI_APP_PATHS)).toEqual({
      canonical: `${SITE}/fr/developpement-application-ia-sur-mesure`,
      languages: {
        fr: `${SITE}/fr/developpement-application-ia-sur-mesure`,
        en: `${SITE}/en/custom-ai-app-development`,
        "x-default": `${SITE}/fr/developpement-application-ia-sur-mesure`,
      },
    });
    expect(splitPathAlternates("en", CUSTOM_AI_APP_PATHS).canonical).toBe(
      `${SITE}/en/custom-ai-app-development`,
    );
    expect(customAiAppPageId("fr")).toBe("developpement-application-ia-sur-mesure");
    expect(customAiAppPageId("en")).toBe("custom-ai-app-development");
  });

  test("keeps the briefed title and H1, without « agence IA » / « AI agency »", () => {
    expect(MESSAGES.fr.metaTitle).toBe(
      "Développement d'application IA sur mesure | The Vibe Company",
    );
    expect(MESSAGES.fr.title).toBe(
      "Développez une application IA sur mesure, de l'idée à la production",
    );
    expect(MESSAGES.en.metaTitle).toBe("Custom AI App Development | The Vibe Company");
    expect(MESSAGES.en.title).toBe("Build a custom AI application, from idea to production");
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.metaTitle.length).toBeLessThanOrEqual(60);
      expect(messages.metaDescription.length).toBeLessThanOrEqual(160);
      expect(messages.metaTitle).not.toBe(messages.title);
      for (const heading of [messages.metaTitle, messages.title]) {
        expect(heading).not.toMatch(/agence\s+IA|AI\s+agency/i);
      }
    }
  });

  test("new copy has no dashes, certification claims, prices or stray placeholders", () => {
    const forbidden = [
      /[—–]/, // em dash, en dash
      /\bSOC\s?2\b/i,
      /certifi/i,
      /\bISO\b/,
      /\bHDS\b/,
      /hasCredential/,
      /[€$£]/,
      /\b(TJM|tarif|à partir de|starting at|per day|par jour)\b/i,
      /\/30min/,
    ];
    for (const messages of Object.values(MESSAGES)) {
      for (const [path, text] of strings(messages)) {
        for (const pattern of forbidden) {
          expect({ path, text, match: pattern.test(text) }).toEqual({ path, text, match: false });
        }
        const placeholder = /À CONFIRMER/.test(text);
        expect({ path, placeholder }).toEqual({
          path,
          placeholder: CUSTOM_AI_APP_PLACEHOLDER_KEYS.some((key) => path.startsWith(key)),
        });
      }
    }
  });

  test("case figures are limited to the briefed ones", () => {
    for (const messages of Object.values(MESSAGES)) {
      // Monka: only its kickoff and go-live dates.
      const monka = JSON.stringify(messages.cases.monka);
      expect(monka.match(/\d+/g)?.sort()).toEqual(["10", "9"]);
      // LocService: only the 87 % of drafts kept.
      const locservice = JSON.stringify(messages.cases.locservice);
      expect(locservice.match(/\d+/g)).toEqual(["87", "87"]);
    }
    expect(MESSAGES.fr.cases.monka.stats).toEqual({
      start: { label: "Démarrage", value: "9 mars" },
      production: { label: "En production", value: "10 mai" },
    });
    expect(MESSAGES.en.cases.monka.stats.start.value).toBe("March 9");
    expect(MESSAGES.en.cases.monka.stats.production.value).toBe("May 10");
    expect(MESSAGES.fr.cases.locservice.statNote).toContain("87 % des tickets");
    expect(MESSAGES.en.cases.locservice.statNote).toContain("87% of tickets");
  });

  test("the AFP facts come from the published AFP case study", () => {
    for (const locale of ["fr", "en"] as const) {
      const afp = getCustomer("afp", locale)!;
      const messages = MESSAGES[locale].cases.afp;
      expect(afp.points).toHaveLength(3);
      expect(messages.stats.tools.value).toBe(String(afp.points.length));
      expect(afp.results.map((stat) => stat.value)).toContain(messages.stats.horizon.value);
      expect(afp.sector).toContain(messages.stats.frame.value);
      // The three tools, word for word apart from punctuation.
      const normalize = (text: string) => text.replace(/[’']/g, "'").replace(/[,.]/g, "");
      for (const [i, point] of afp.points.entries()) {
        expect(normalize(messages.points[i])).toBe(normalize(point));
      }
      for (const partner of ["Kairntech", "Dawex", "Bpifrance"]) {
        expect(afp.summary).toContain(partner);
        expect(messages.intro).toContain(partner);
      }
    }
  });

  test("links only to case studies and articles that exist in the linked language", () => {
    for (const locale of ["fr", "en"] as const) {
      const slug = CUSTOM_AI_APP_RAG_ARTICLE_PATHS[locale].split("/").pop()!;
      expect(getContentItem("article", slug)?.language).toBe(locale);
      for (const { slug: caseSlug } of CUSTOM_AI_APP_CASES) {
        expect(getCustomer(caseSlug, locale)).toBeDefined();
      }
    }
  });

  test("the page body has one booking call and cross-links the Paris landing both ways", () => {
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
    expect(PAGE_SOURCE.match(/<AboutBookingCta\b/g)).toHaveLength(1);
    expect(PAGE_SOURCE).not.toMatch(/<FinalCTA\b|cal\.com|BOOKING_URL/);
    expect(PAGE_SOURCE).toContain("splitPath(AGENCY_PARIS_PATHS, locale)");
    expect(PARIS_SOURCE).toContain("CUSTOM_AI_APP_PATHS");
    expect(fr.agencyParis.offers.items.build.link).toBe(
      "Développement d'application IA sur mesure",
    );
    expect(en.agencyParis.offers.items.build.link).toBe("Custom AI app development");
    expect(AGENCY_PARIS_PATHS).toEqual({ fr: "/agence-ia-paris", en: "/ai-agency-paris" });
    expect(FOOTER_OFFERINGS.map(({ key }) => key)).toContain("customAiApp");
  });

  test("the FAQPage carries the publishable answers word for word, without link tags", () => {
    for (const messages of Object.values(MESSAGES)) {
      const items = CUSTOM_AI_APP_FAQ_KEYS.map((key) => ({
        key,
        question: messages.faq.items[key].q,
        answer: plainAnswer(messages.faq.items[key].a),
      }));
      for (const item of items) expect(item.answer).not.toMatch(/[<>]/);
      // The timeline answer names Monka, so it stays out of the markup.
      const kept = items.filter(
        (item) => isPublishable(item.question) && isPublishable(item.answer),
      );
      expect(kept.map((item) => item.key)).toEqual(["cost", "rag", "data", "code", "otherPages"]);
      const schema = faqPageSchema(items) as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      expect(schema.mainEntity.map((entry) => entry.name)).toEqual(
        kept.map((item) => item.question),
      );
      expect(schema.mainEntity.map((entry) => entry.acceptedAnswer.text)).toEqual(
        kept.map((item) => item.answer),
      );
    }
  });

  test("the Service is provided by the Organization and carries no offer", () => {
    const url = `${SITE}/fr/developpement-application-ia-sur-mesure`;
    const service = serviceNode({
      url,
      name: MESSAGES.fr.service.name,
      serviceType: "Custom AI application development",
      description: MESSAGES.fr.service.description,
    });

    expect(service).toMatchObject({
      "@type": "Service",
      name: "Développement d'application IA sur mesure",
      serviceType: "Custom AI application development",
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
    const url = `${SITE}/en/custom-ai-app-development`;
    expect(
      webPageNode({
        url,
        name: MESSAGES.en.title,
        description: MESSAGES.en.metaDescription,
        language: "en",
      }),
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
