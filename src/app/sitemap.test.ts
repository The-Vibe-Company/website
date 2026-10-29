import { describe, expect, setSystemTime, test } from "bun:test";
import { contentPath, getAllContent } from "@/lib/content-source";
import { CUSTOMER_SLUGS, getCustomer } from "@/lib/customers";
import { PROJECT_SLUGS } from "@/lib/projects";
import { localizedAlternates } from "@/lib/site";
import {
  CUSTOMER_LASTMOD,
  PROJECT_LASTMOD,
  SPLIT_PATH_LASTMOD,
} from "@/lib/sitemap-lastmod";

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

  test("lists the healthcare AI landing on its translated paths, with x-default", () => {
    const entries = sitemap().filter((entry) =>
      /\/(fr\/ia-sante-hds|en\/healthcare-ai-hds)$/.test(entry.url),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/healthcare-ai-hds`,
      `${SITE}/fr/ia-sante-hds`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/ia-sante-hds`,
        en: `${SITE}/en/healthcare-ai-hds`,
        "x-default": `${SITE}/fr/ia-sante-hds`,
      });
    }
  });

  test("every lastmod is stable across deploys (not the build timestamp)", () => {
    setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const atStart = sitemap().map((entry) => [entry.url, (entry.lastModified as Date).toISOString()] as const);
    setSystemTime(new Date("2030-01-01T00:00:00.000Z"));
    const atEnd = sitemap().map((entry) => [entry.url, (entry.lastModified as Date).toISOString()] as const);
    setSystemTime();

    expect(atEnd).toEqual(atStart);
  });

  test("no lastmod is in the future", () => {
    // Articles under /resources use their frontmatter `publishedAt`, which can
    // be a future date for a scheduled post; everything else must be <= today.
    setSystemTime(new Date("2026-10-29T00:00:00.000Z"));
    const today = new Date("2026-10-29T23:59:59.999Z");
    const futures = sitemap().filter(
      (entry) =>
        !entry.url.includes("/resources/") &&
        (entry.lastModified as Date).getTime() > today.getTime(),
    );
    setSystemTime();

    expect(futures).toEqual([]);
  });

  test("the sitemap keeps its 108 URLs and every entry still declares x-default", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(108);
    for (const entry of entries) {
      const keys = Object.keys(entry.alternates!.languages!);
      expect(keys).toContain("x-default");
      // Pages served at the same path in both languages (homepage, portfolio,
      // case studies, projects) carry the full fr/en/x-default set. Content
      // and split-path landings are covered by their own dedicated tests.
    }

    // The 46 URLs that used to carry the build timestamp still each declare
    // the full self-inclusive fr/en/x-default set.
    const buildTimeUrls = entries.filter(
      (entry) =>
        !entry.url.includes("/resources/articles/") &&
        !entry.url.includes("/resources/skills/"),
    );
    for (const entry of buildTimeUrls) {
      expect(Object.keys(entry.alternates!.languages!).sort()).toEqual([
        "en",
        "fr",
        "x-default",
      ]);
    }
  });

  test("every PROJECT_SLUGS entry has a lastmod date", () => {
    for (const slug of PROJECT_SLUGS) {
      expect(PROJECT_LASTMOD[slug]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("every CUSTOMER_SLUGS entry has a lastmod date", () => {
    for (const slug of CUSTOMER_SLUGS) {
      expect(CUSTOMER_LASTMOD[slug]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("every split-path landing has a lastmod date keyed by its FR path", () => {
    const landings = [
      "/a-propos",
      "/agence-ia-paris",
      "/agents-ia-securite-produit",
      "/agents-ia-production",
      "/ia-sante-hds",
      "/ia-medias",
    ];
    for (const path of landings) {
      expect(SPLIT_PATH_LASTMOD[path]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("lists the media AI landing on its translated paths, with x-default", () => {
    const entries = sitemap().filter((entry) =>
      /\/(fr\/ia-medias|en\/ai-for-media)$/.test(entry.url),
    );

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      `${SITE}/en/ai-for-media`,
      `${SITE}/fr/ia-medias`,
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        fr: `${SITE}/fr/ia-medias`,
        en: `${SITE}/en/ai-for-media`,
        "x-default": `${SITE}/fr/ia-medias`,
      });
    }
  });
  test("lists every article and skill once, under its own language's prefix only", () => {
    const content = getAllContent();
    const expected = content.map((item) => `${SITE}/${item.language}${contentPath(item)}`);
    const entries = sitemap().filter((entry) =>
      /\/resources\/(articles|skills)\//.test(entry.url),
    );

    // A French-only article never shows up under /en (nor an English-only one
    // under /fr): that URL redirects to the canonical one.
    expect(entries.map((entry) => entry.url).sort()).toEqual(expected.sort());
  });
});
