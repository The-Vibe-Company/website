import { describe, expect, test } from "bun:test";

import sitemap from "./sitemap";

describe("sitemap", () => {
  test("lists the Quivr page in both languages with hreflang and x-default", () => {
    const entries = sitemap().filter((entry) => entry.url.endsWith("/quivr"));
    const languages = {
      fr: "https://www.thevibecompany.co/fr/quivr",
      en: "https://www.thevibecompany.co/en/quivr",
      "x-default": "https://www.thevibecompany.co/fr/quivr",
    };

    expect(entries.map((entry) => entry.url).sort()).toEqual([
      "https://www.thevibecompany.co/en/quivr",
      "https://www.thevibecompany.co/fr/quivr",
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual(languages);
    }
  });

  test("keeps the other static pages without x-default", () => {
    const home = sitemap().find(
      (entry) => entry.url === "https://www.thevibecompany.co/en",
    );
    expect(home?.alternates?.languages).toEqual({
      fr: "https://www.thevibecompany.co/fr",
      en: "https://www.thevibecompany.co/en",
    });
  });
});
