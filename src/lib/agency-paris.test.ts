import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import {
  AGENCY_PARIS_COMPARISON,
  AGENCY_PARIS_FAQ_KEYS,
  AGENCY_PARIS_PLAYERS,
  AGENCY_PARIS_SECTIONS,
  OFFICE_ADDRESS,
} from "./agency-paris";
import { BOOKING_URL } from "./booking";
import { faqPageSchema, isPublishable, serviceNode, webPageNode } from "./structured-data";

const SITE = "https://www.thevibecompany.co";
const LOCALES = { fr: fr.agencyParis, en: en.agencyParis };
/** The answer as the FAQPage JSON-LD carries it: the link markup dropped. */
const plain = (answer: string) => answer.replace(/<\/?link>/g, "");
/** Same tolerance as the copy brief: no player may appear out of order. */
function namesInOrder(text: string) {
  return AGENCY_PARIS_PLAYERS.map((player) => text.indexOf(player.name));
}

describe("AI agency in Paris landing", () => {
  test("keeps the title, description and H1 of the THE-2137 rewrite", () => {
    expect(fr.agencyParis.metaTitle).toBe("Agence IA à Paris pour PME et ETI | The Vibe Company");
    expect(fr.agencyParis.metaDescription).toBe(
      "Agence IA à Paris 11e pour PME et ETI. On construit vos produits et agents IA jusqu'en production : Monka en 2 mois, 87 % des tickets traités chez LocService.",
    );
    expect(fr.agencyParis.title).toBe("Agence IA à Paris : vos produits et agents IA en production");
    expect(en.agencyParis.metaTitle).toBe("AI Agency in Paris for SMEs and Mid-Caps | The Vibe Company");
    expect(en.agencyParis.metaDescription).toBe(
      "Paris AI agency for SMEs and mid-caps. We take AI products and agents to production: Monka live in 2 months, 87% of LocService tickets handled with AI drafts.",
    );
    expect(en.agencyParis.title).toBe("AI agency in Paris: your products and agents in production");
  });

  test("fits titles, descriptions and H1s in their limits, keyword first", () => {
    for (const copy of Object.values(LOCALES)) {
      expect([...copy.metaTitle].length).toBeLessThanOrEqual(60);
      expect([...copy.metaDescription].length).toBeLessThanOrEqual(160);
      expect([...copy.title].length).toBeLessThanOrEqual(60);
    }
    expect(fr.agencyParis.title.startsWith("Agence IA à Paris")).toBe(true);
    expect(en.agencyParis.title.startsWith("AI agency in Paris")).toBe(true);
  });

  test("does not reuse the homepage title or H1", () => {
    expect(fr.agencyParis.metaTitle).not.toBe(fr.meta.homeTitle);
    expect(en.agencyParis.metaTitle).not.toBe(en.meta.homeTitle);
  });

  test("never claims a certification, a price, a phone or the old booking link", () => {
    for (const copy of Object.values(LOCALES)) {
      const text = JSON.stringify(copy);
      expect(text).not.toMatch(/SOC\s?2|\bISO\b|certifi|30min|À CONFIRMER|TO PROVIDE|TO CHECK/i);
      expect(text).not.toMatch(/€\s?\/|TJM|à partir de|starting at/i);
      expect(text).not.toMatch(/\+33|\b0[1-9](?:[ .]?\d{2}){4}\b/);
    }
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test("uses no em dash or en dash in its copy", () => {
    for (const copy of Object.values(LOCALES)) {
      expect(JSON.stringify(copy)).not.toMatch(/[—–]/);
    }
  });

  test("has the same shape in both languages", () => {
    const shape = (value: unknown): unknown =>
      Array.isArray(value)
        ? value.map(shape)
        : value && typeof value === "object"
          ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
          : typeof value;
    expect(shape(en.agencyParis)).toEqual(shape(fr.agencyParis));
    for (const copy of Object.values(LOCALES)) {
      expect(copy.facts).toHaveLength(7);
      expect(Object.keys(copy.proof.cases)).toHaveLength(5);
      expect(Object.keys(copy.offers.items)).toHaveLength(3);
      expect(Object.keys(copy.method.steps)).toHaveLength(5);
      expect(copy.landscape.questions).toHaveLength(3);
      expect(Object.keys(copy.faq.items)).toEqual([...AGENCY_PARIS_FAQ_KEYS]);
    }
  });

  test("orders the sections with the landscape and the versus after the method", () => {
    expect(AGENCY_PARIS_SECTIONS.indexOf("landscape")).toBe(AGENCY_PARIS_SECTIONS.indexOf("method") + 1);
    expect(AGENCY_PARIS_SECTIONS.indexOf("versus")).toBe(AGENCY_PARIS_SECTIONS.indexOf("landscape") + 1);
    expect(AGENCY_PARIS_SECTIONS.indexOf("cta")).toBe(AGENCY_PARIS_SECTIONS.indexOf("proof") + 1);
  });

  test("lists the eight players in the mandatory order, SMEs first", () => {
    expect(AGENCY_PARIS_PLAYERS.map((player) => player.name)).toEqual([
      "The Vibe Company",
      "Juwa",
      "Galadrim",
      "Koïno",
      "Theodo",
      "Artefact",
      "Mistral AI",
      "Ekimetrics",
    ]);
    expect(AGENCY_PARIS_PLAYERS.map((player) => player.group)).toEqual([
      ...Array(4).fill("sme"),
      ...Array(4).fill("large"),
    ]);
  });

  test("names the players in that order in the FAQ, the pointers and the intro", () => {
    for (const copy of Object.values(LOCALES)) {
      const best = namesInOrder(copy.faq.items.best.a);
      expect(best.every((index) => index >= 0)).toBe(true);
      expect([...best].sort((a, b) => a - b)).toEqual(best);

      const pointers = ["Galadrim", "Koïno", "Theodo"].map((name) => copy.landscape.pointers.indexOf(name));
      expect([...pointers].sort((a, b) => a - b)).toEqual(pointers);
      expect(pointers.every((index) => index >= 0)).toBe(true);

      const intro = copy.landscape.intro;
      expect(intro.indexOf("The Vibe Company")).toBeLessThan(intro.indexOf("Theodo"));
    }
  });

  test("links the comparison article in both languages", () => {
    expect(AGENCY_PARIS_COMPARISON.fr.path).toBe("/resources/articles/meilleure-agence-ia-comparatif");
    expect(AGENCY_PARIS_COMPARISON.en.path).toBe("/resources/articles/best-ai-consulting-firms-france");
    for (const copy of Object.values(LOCALES)) {
      expect(copy.faq.items.best.a).toMatch(/<link>[^<]+<\/link>/);
    }
  });

  test("writes the office address the same way everywhere", () => {
    expect(OFFICE_ADDRESS.display).toBe("10 rue La Vacquerie, 75011 Paris, France");
    for (const copy of Object.values(LOCALES)) {
      expect(copy.facts[0].value).toContain(OFFICE_ADDRESS.display);
      expect(copy.faq.items.paris.a).toContain(OFFICE_ADDRESS.display);
    }
  });

  test("keeps the proof figures identical across lede, facts and proof", () => {
    const figures = {
      fr: ["2 mois", "87 %", "4 M€", "165 questions", "12 versions", "2 projets", "100 000"],
      en: ["2 months", "87%", "€4M", "165-question", "12 versions", "2 projects", "100,000"],
    };
    for (const [locale, copy] of Object.entries(LOCALES) as [keyof typeof figures, typeof fr.agencyParis][]) {
      const text = JSON.stringify(copy);
      for (const figure of figures[locale]) expect(text).toContain(figure);
      const lede = copy.lede.join(" ");
      expect(lede).toContain(figures[locale][0]);
      expect(lede).toContain(figures[locale][1]);
    }
  });

  test("the FAQPage carries the publishable answers word for word, without link tags", () => {
    for (const copy of Object.values(LOCALES)) {
      const items = AGENCY_PARIS_FAQ_KEYS.map((key) => ({
        key,
        question: copy.faq.items[key].q,
        answer: plain(copy.faq.items[key].a),
      }));
      for (const item of items) expect(item.answer).not.toMatch(/[<>]/);
      // Answers naming a client or a price stay out of the markup, as
      // site-wide; the other five go in word for word.
      const kept = items.filter((item) => isPublishable(item.question) && isPublishable(item.answer));
      expect(kept.map((item) => item.key)).toEqual(["paris", "generalist", "code", "related", "start"]);
      const faq = faqPageSchema(items) as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      expect(faq.mainEntity.map((entry) => entry.name)).toEqual(kept.map((item) => item.question));
      expect(faq.mainEntity.map((entry) => entry.acceptedAnswer.text)).toEqual(
        kept.map((item) => item.answer),
      );
    }
  });

  test("uses one call to action, the booking link", () => {
    for (const copy of Object.values(LOCALES)) {
      expect(copy.bookCall).toBe(copy.finalCta.bookCall);
      expect(JSON.stringify(copy)).not.toMatch(/https?:\/\//);
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
