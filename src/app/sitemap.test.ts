import { describe, expect, test } from "bun:test";
import { CUSTOMER_SLUGS, getCustomer } from "@/lib/customers";
import { localizedAlternates } from "@/lib/site";

import sitemap from "./sitemap";

const SITE = "https://www.thevibecompany.co";

describe("sitemap", () => {
  test("lists the case-study index and every served customer locale with the page's hreflang", () => {
    const locales = ["fr", "en"] as const;
    const expected = [
      ...locales.map((locale) => `${SITE}/${locale}/case-studies`),
      ...CUSTOMER_SLUGS.flatMap((slug) =>
        locales
          .filter((locale) => getCustomer(slug, locale))
          .map((locale) => `${SITE}/${locale}/case-studies/${slug}`)
      ),
    ];
    const entries = sitemap().filter((entry) =>
      new URL(entry.url).pathname.includes("/case-studies"),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual(expected.sort());
    for (const entry of entries) {
      const url = new URL(entry.url);
      const [, locale, ...segments] = url.pathname.split("/");
      const page = localizedAlternates(locale, `/${segments.join("/")}`);

      expect(entry.url).toBe(page.canonical);
      expect(entry.alternates?.languages).toEqual(page.languages);
      expect(Object.keys(entry.alternates!.languages!).sort()).toEqual(["en", "fr", "x-default"]);
      expect(url.search).toBe("");
      expect(entry.changeFrequency).toBe("monthly");
      expect(entry.priority).toBe(segments.length === 1 ? 0.8 : 0.7);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  test("lists the Quivr project page in both languages with hreflang and x-default", () => {
    const entries = sitemap().filter((entry) =>
      entry.url.endsWith("/portfolio/quivr"),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/portfolio/quivr`,
      `${SITE}/fr/portfolio/quivr`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/portfolio/quivr`,
        en: `${SITE}/en/portfolio/quivr`,
        "x-default": `${SITE}/fr/portfolio/quivr`,
      });
    }
  });

  test("drops the old /quivr URLs, which now redirect", () => {
    expect(sitemap().some((entry) => /\/(fr|en)\/quivr$/.test(entry.url))).toBe(false);
  });

  test("declares the French URL as x-default on the static pages", () => {
    const home = sitemap().find((entry) => entry.url === `${SITE}/en`);
    expect(home?.alternates?.languages).toEqual({
      fr: `${SITE}/fr`,
      en: `${SITE}/en`,
      "x-default": `${SITE}/fr`,
    });
  });

  test("declares x-default on the translated About page", () => {
    const about = sitemap().find((entry) => entry.url === `${SITE}/en/about`);
    expect(about?.alternates?.languages).toEqual({
      fr: `${SITE}/fr/a-propos`,
      en: `${SITE}/en/about`,
      "x-default": `${SITE}/fr/a-propos`,
    });
  });

  test("lists the AI agency in Paris landing page in both languages with x-default", () => {
    const entries = sitemap().filter((entry) =>
      /\/(fr\/agence-ia-paris|en\/ai-agency-paris)$/.test(entry.url),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/ai-agency-paris`,
      `${SITE}/fr/agence-ia-paris`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/agence-ia-paris`,
        en: `${SITE}/en/ai-agency-paris`,
        "x-default": `${SITE}/fr/agence-ia-paris`,
      });
    }
  });

  test("lists the hardening landing on its translated paths, with x-default", () => {
    const entries = sitemap().filter((entry) =>
      /\/(agents-ia-securite-produit|ai-agents-product-hardening)$/.test(entry.url),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/ai-agents-product-hardening`,
      `${SITE}/fr/agents-ia-securite-produit`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/agents-ia-securite-produit`,
        en: `${SITE}/en/ai-agents-product-hardening`,
        "x-default": `${SITE}/fr/agents-ia-securite-produit`,
      });
    }
  });

  test("lists the agents in production landing on its translated paths, with x-default", () => {
    const entries = sitemap().filter((entry) =>
      /\/(agents-ia-production|ai-agents-in-production)$/.test(entry.url),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/ai-agents-in-production`,
      `${SITE}/fr/agents-ia-production`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/agents-ia-production`,
        en: `${SITE}/en/ai-agents-in-production`,
        "x-default": `${SITE}/fr/agents-ia-production`,
      });
    }
  });
});
