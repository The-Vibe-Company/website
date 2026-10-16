import { describe, expect, test } from "bun:test";

import sitemap from "./sitemap";

const SITE = "https://www.thevibecompany.co";

describe("sitemap", () => {
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

  test("keeps the static pages without x-default", () => {
    const home = sitemap().find((entry) => entry.url === `${SITE}/en`);
    expect(home?.alternates?.languages).toEqual({
      fr: `${SITE}/fr`,
      en: `${SITE}/en`,
    });
  });
});
