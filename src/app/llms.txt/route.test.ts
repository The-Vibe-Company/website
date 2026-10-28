import { describe, expect, test } from "bun:test";
import fr from "../../../messages/fr.json";
import en from "../../../messages/en.json";
import { getAllContent } from "@/lib/content-source";
import { getCustomers } from "@/lib/customers";
import { INDEXABLE_SPLIT_PATH_ROUTES, INDEXABLE_STATIC_ROUTES, localizedUrl, splitPath } from "@/lib/site";
import { GET } from "./route";

const text = await GET().text();
const french = text.split("## French canonical URLs")[1].split("## English canonical URLs")[0];
const english = text.split("## English canonical URLs")[1];

describe("llms.txt localized discovery", () => {
  test("French core pages use their existing page metadata", () => {
    const expected = [
      ["/", fr.meta.homeTitle, fr.meta.description],
      ["/portfolio", fr.portfolio.metaTitle, fr.portfolio.metaDescription],
      ["/resources", fr.resources.metaTitle, fr.resources.subtitle],
      ["/a-propos", fr.about.metaTitle, fr.about.metaDescription],
      ["/agence-ia-paris", fr.agencyParis.metaTitle, fr.agencyParis.metaDescription],
      ["/agents-ia-securite-produit", fr.hardening.metaTitle, fr.hardening.metaDescription],
      ["/agents-ia-production", fr.agentsProduction.metaTitle, fr.agentsProduction.metaDescription],
      ["/ia-sante-hds", fr.healthcareAi.metaTitle, fr.healthcareAi.metaDescription],
      ["/ia-medias", fr.mediaAi.metaTitle, fr.mediaAi.metaDescription],
    ];
    for (const [path, title, description] of expected) {
      expect(french).toContain(`[${title}](${localizedUrl("fr", path)}): ${description}`);
    }
  });

  test("English core entries remain unchanged", () => {
    for (const route of INDEXABLE_STATIC_ROUTES) {
      expect(english).toContain(`[${route.title}](${localizedUrl("en", route.path)}): ${route.description}`);
    }
    for (const route of INDEXABLE_SPLIT_PATH_ROUTES) {
      expect(english).toContain(`[${route.title}](${localizedUrl("en", splitPath(route.paths, "en"))}): ${route.description}`);
    }
  });

  test.each(["fr", "en"] as const)("%s includes the hub and every localized case study once", (locale) => {
    const section = locale === "fr" ? french : english;
    const messages = locale === "fr" ? fr : en;
    expect(section).toContain(`### ${locale === "fr" ? "Cas clients" : "Case studies"}`);
    expect(section).toContain(`[${messages.caseStudiesPage.back}](${localizedUrl(locale, "/case-studies")}): ${messages.caseStudiesPage.metaDescription}`);
    for (const customer of getCustomers(locale)) {
      const url = localizedUrl(locale, `/case-studies/${customer.slug}`);
      expect(section.split(url)).toHaveLength(2);
      expect(section).toContain(`[${customer.client} · ${messages.caseStudiesPage.back}](${url}): ${customer.metaDescription}`);
    }
  });

  test("skills are listed only in their own language", () => {
    for (const skill of getAllContent().filter((item) => item.type === "skill")) {
      const own = skill.language === "fr" ? french : english;
      const other = skill.language === "fr" ? english : french;
      expect(own).toContain(`/resources/skills/${skill.slug}`);
      expect(other).not.toContain(`/resources/skills/${skill.slug}`);
    }
    expect(text).not.toContain("https://thevibecompany.co/");
  });
});
