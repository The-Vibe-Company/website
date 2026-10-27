import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { SITE_NAME } from "./site";

// Portfolio and resources go through the `%s | ${SITE_NAME}` layout
// template; the home title is absolute and already carries the brand.
const BRAND_SUFFIX = ` | ${SITE_NAME}`;

const RENDERED = {
  "fr /": fr.meta.homeTitle,
  "fr /portfolio": fr.portfolio.metaTitle + BRAND_SUFFIX,
  "en /portfolio": en.portfolio.metaTitle + BRAND_SUFFIX,
  "fr /resources": fr.resources.metaTitle + BRAND_SUFFIX,
  "en /resources": en.resources.metaTitle + BRAND_SUFFIX,
} as const;

describe("SEO page titles", () => {
  test.each(Object.entries(RENDERED))("%s fits in 60 characters", (_, title) => {
    expect([...title].length).toBeLessThanOrEqual(60);
  });

  test.each(
    Object.entries(RENDERED).filter(([route]) => route !== "fr /"),
  )("%s is long enough to carry search intent", (_, title) => {
    expect([...title].length).toBeGreaterThanOrEqual(55);
  });

  test("the French home title keeps its head term", () => {
    expect(fr.meta.homeTitle.startsWith("Agence IA à Paris")).toBe(true);
  });
});
