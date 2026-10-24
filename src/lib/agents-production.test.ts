import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import {
  AGENTS_GUIDE_PATHS,
  AGENTS_PRODUCTION_CASE_SLUGS,
  AGENTS_PRODUCTION_FAQ_KEYS,
  AUTOMATION_GUIDE_PATHS,
  POC_CHECKLIST_PATHS,
} from "./agents-production";
import { BOOKING_URL } from "./booking";
import { getContentItem } from "./content-source";
import { getCustomer } from "./customers";
import { AGENTS_PRODUCTION_PATHS, splitPathAlternates } from "./site";
import { faqPageSchema, serviceNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const MESSAGES = { fr: fr.agentsProduction, en: en.agentsProduction } as const;

describe("agents in production landing", () => {
  test("each language is canonical on its own path and declares the other", () => {
    expect(splitPathAlternates("fr", AGENTS_PRODUCTION_PATHS)).toEqual({
      canonical: `${SITE}/fr/agents-ia-production`,
      languages: {
        fr: `${SITE}/fr/agents-ia-production`,
        en: `${SITE}/en/ai-agents-in-production`,
        "x-default": `${SITE}/fr/agents-ia-production`,
      },
    });
    expect(splitPathAlternates("en", AGENTS_PRODUCTION_PATHS).canonical).toBe(
      `${SITE}/en/ai-agents-in-production`,
    );
  });

  test("keeps the briefed title, meta description and H1", () => {
    expect(MESSAGES.fr.metaTitle).toBe("Agents IA en production : du POC au run | The Vibe Company");
    expect(MESSAGES.fr.title).toBe("Agents IA en entreprise : on les mène jusqu'en production");
    expect(MESSAGES.fr.metaDescription).toBe(
      "Déployez des agents IA en entreprise jusqu'en production : outils, garde-fous, mesure, passation. Cas LocService (87 % des tickets). Agence Paris, YC W24.",
    );
    expect(MESSAGES.en.metaTitle).toBe("AI Agents in Production: from POC to run | The Vibe Company");
    expect(MESSAGES.en.title).toBe("AI agents at work: we take them all the way to production");
    expect(MESSAGES.en.metaDescription).toBe(
      "Deploy AI agents in your company to production: tools, guardrails, measurement, handoff. LocService case (87% of tickets). Paris agency, YC W24.",
    );
    expect(MESSAGES.fr.kicker).toBe("// AGENTS · POC → PRODUCTION");
    for (const messages of Object.values(MESSAGES)) {
      expect(messages.metaTitle.length).toBeLessThanOrEqual(60);
      expect(messages.metaDescription.length).toBeLessThanOrEqual(160);
    }
  });

  test("never claims a certification, a price or a generic timeline", () => {
    const forbidden = [
      /\bSOC\s?2\b/i,
      /\bISO\b/,
      /certifi(é|e)e?s?\s+HDS/i,
      /HDS[- ]certified/i,
      /[€$£]/,
      /\b\d+\s*(semaines?|weeks?|jours ouvrés|business days)\b/i,
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
      for (const paths of [AGENTS_GUIDE_PATHS, POC_CHECKLIST_PATHS, AUTOMATION_GUIDE_PATHS]) {
        const slug = paths[locale].split("/").pop()!;
        expect(getContentItem("article", slug)?.language).toBe(locale);
      }
      for (const slug of AGENTS_PRODUCTION_CASE_SLUGS) {
        expect(getCustomer(slug, locale)).toBeDefined();
      }
    }
  });

  test("cites LocService first and keeps its published 87% figure", () => {
    expect(AGENTS_PRODUCTION_CASE_SLUGS[0]).toBe("locservice");
    expect(getCustomer("locservice", "fr")?.metric).toBe("87%");
    expect(MESSAGES.fr.proof.cases.locservice).toContain("87 %");
    expect(MESSAGES.en.proof.cases.locservice).toContain("87%");
  });

  test("the whole FAQ goes into the FAQPage markup", () => {
    for (const messages of Object.values(MESSAGES)) {
      const items = AGENTS_PRODUCTION_FAQ_KEYS.map((key) => ({
        question: messages.faq.items[key].q,
        answer: messages.faq.items[key].a,
      }));
      const schema = faqPageSchema(items) as { mainEntity: unknown[] };
      expect(schema.mainEntity).toHaveLength(AGENTS_PRODUCTION_FAQ_KEYS.length);
    }
  });

  test("the Service is provided by the Organization and carries no offer", () => {
    const url = `${SITE}/fr/agents-ia-production`;
    const service = serviceNode({
      url,
      name: MESSAGES.fr.service.name,
      serviceType: "Enterprise AI agent deployment and production operations",
      description: MESSAGES.fr.service.description,
    });

    expect(service).toMatchObject({
      "@type": "Service",
      url,
      name: "Déploiement d'agents IA en production",
      serviceType: "Enterprise AI agent deployment and production operations",
      description: MESSAGES.fr.service.description,
      provider: { "@id": `${SITE}/#organization` },
    });
    expect(service).not.toHaveProperty("offers");
  });
});
