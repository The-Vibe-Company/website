import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL, CONTACT_EMAIL } from "./booking";
import { PRIVACY_SECTION_KEYS } from "./privacy";

const MESSAGES = { fr, en } as const;
const TBC = { fr: "À CONFIRMER", en: "TO BE CONFIRMED" } as const;

/** Every string under a messages subtree, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("contact and privacy copy", () => {
  test.each(["fr", "en"] as const)("%s never claims a certification", (locale) => {
    const copy = strings([MESSAGES[locale].contact, MESSAGES[locale].privacy]).join("\n");
    expect(copy).not.toMatch(/SOC\s*2/i);
    expect(copy).not.toMatch(/certifi/i);
    expect(copy).not.toMatch(/ISO\s*27001/i);
  });

  test.each(["fr", "en"] as const)("%s privacy policy has every section, in both languages alike", (locale) => {
    const sections = MESSAGES[locale].privacy.sections as Record<string, unknown>;
    expect(Object.keys(sections)).toEqual([...PRIVACY_SECTION_KEYS]);
  });

  test("French and English privacy tables have the same shape", () => {
    for (const key of PRIVACY_SECTION_KEYS) {
      const frSection = fr.privacy.sections[key] as { table?: { columns: string[]; rows: string[][] } };
      const enSection = en.privacy.sections[key] as { table?: { columns: string[]; rows: string[][] } };
      expect(Boolean(frSection.table)).toBe(Boolean(enSection.table));
      if (!frSection.table || !enSection.table) continue;
      expect(frSection.table.columns.length).toBe(enSection.table.columns.length);
      expect(frSection.table.rows.map((row) => row.length)).toEqual(
        enSection.table.rows.map((row) => row.length),
      );
    }
  });

  test.each(["fr", "en"] as const)("%s marks missing facts with its own language's marker only", (locale) => {
    const other = locale === "fr" ? TBC.en : TBC.fr;
    const copy = strings([MESSAGES[locale].contact, MESSAGES[locale].privacy]).join("\n");
    expect(copy).toContain(TBC[locale]);
    expect(copy).not.toContain(other);
  });

  test("the contact page names the founders, the town and the address to write to", () => {
    for (const messages of [fr, en]) {
      expect(messages.contact.lede).toContain("Stan Girard");
      expect(messages.contact.lede).toContain("Antoine Dewez");
      expect(messages.contact.lede).toContain("Montreuil");
      expect(messages.contact.metaDescription).toContain(CONTACT_EMAIL);
    }
    expect(CONTACT_EMAIL).toBe("stan@thevibecompany.co");
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });
});
