import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { getCustomers } from "./customers";
import { SITE_NAME } from "./site";

// Case studies, portfolio and resources go through the `%s | ${SITE_NAME}` layout
// template; the home and agency titles are absolute and already carry the brand.
const BRAND_SUFFIX = ` | ${SITE_NAME}`;

const RENDERED = {
  "fr /": fr.meta.homeTitle,
  "en /": en.meta.homeTitle,
  "en /ai-agency-paris": en.agencyParis.metaTitle,
  "fr /case-studies": fr.caseStudiesPage.metaTitle + BRAND_SUFFIX,
  "en /case-studies": en.caseStudiesPage.metaTitle + BRAND_SUFFIX,
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

  test("case-study titles exist, fit 55–60 characters and are unique", () => {
    const titles = [...Object.values(RENDERED)];
    for (const locale of ["fr", "en"] as const) {
      for (const customer of getCustomers(locale)) {
        expect(customer.metaTitle).toBeDefined();
        const title = customer.metaTitle! + BRAND_SUFFIX;
        expect([...title].length).toBeGreaterThanOrEqual(55);
        expect([...title].length).toBeLessThanOrEqual(60);
        titles.push(title);
      }
    }
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("the French home title keeps its head term", () => {
    expect(fr.meta.homeTitle.startsWith("Agence IA à Paris")).toBe(true);
  });
});
