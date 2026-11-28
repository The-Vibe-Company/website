import { describe, expect, test } from "bun:test";

import { CLIENTS } from "@/components/home/Clients";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

const OFFER_NAMESPACES = [
  "agencyParis",
  "agentsProduction",
  "hardening",
  "customAiApp",
  "mediaAi",
  "healthcareAi",
] as const;

describe("site-wide Softway anonymisation & offer hero invariants", () => {
  test("never names Softway anywhere in user-visible messages (including caseStudiesPage.about.p2)", () => {
    expect(fr.caseStudiesPage.about.p2).not.toMatch(/Softway/i);
    expect(en.caseStudiesPage.about.p2).not.toMatch(/Softway/i);
    expect(fr.caseStudiesPage.about.p2).toContain("Monka");
    expect(fr.caseStudiesPage.about.p2).toContain("Theodo");
    expect(fr.caseStudiesPage.about.p2).toContain("deux mois");
    expect(fr.caseStudiesPage.about.p2).toContain("tous les deux jours");
    expect(en.caseStudiesPage.about.p2).toContain("Monka");
    expect(en.caseStudiesPage.about.p2).toContain("Theodo");
    expect(en.caseStudiesPage.about.p2).toContain("two months");
    expect(en.caseStudiesPage.about.p2).toContain("every two days");

    expect(JSON.stringify(fr)).not.toMatch(/Softway/i);
    expect(JSON.stringify(en)).not.toMatch(/Softway/i);
  });

  test("never lists Softway in CLIENTS", () => {
    for (const client of CLIENTS) {
      expect(client.name).not.toMatch(/Softway/i);
      expect(client.src).not.toMatch(/softway/i);
      expect(client.url).not.toMatch(/softway/i);
    }
  });

  test("offer namespaces carry no redundant displayTitle and match H1 to metaTitle", () => {
    for (const messages of [fr, en]) {
      for (const ns of OFFER_NAMESPACES) {
        const copy = messages[ns] as Record<string, unknown>;
        expect(copy).not.toHaveProperty("displayTitle");
        expect(copy.metaTitle).toBe(`${copy.title} | The Vibe Company`);
      }
    }
  });
});
