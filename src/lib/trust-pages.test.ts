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
    expect(CONTACT_EMAIL).toBe("founders@thevibecompany.co");
    expect(BOOKING_URL).toBe("https://cal.com/stangirard/thevibecompany");
  });

  test.each(["fr", "en"] as const)("%s carries the verified publisher and host details", (locale) => {
    const privacy = strings(MESSAGES[locale].privacy).join("\n");
    const contact = strings(MESSAGES[locale].contact).join("\n");
    for (const fact of [
      "981 841 109",
      "FR96 981 841 109",
      "44 boulevard Paul Vaillant-Couturier, 93100 Montreuil",
      "10 rue La Vacquerie, 75011 Paris",
      "440 N Barranca Avenue #4133, Covina, CA 91723",
      "Google Workspace",
      "Quivr SAS",
    ]) {
      expect(privacy).toContain(fact);
    }
    expect(contact).toContain("44 boulevard Paul Vaillant-Couturier, 93100 Montreuil");
    expect(contact).toContain("10 rue La Vacquerie, 75011 Paris");
    expect(contact).toContain("SIREN 981 841 109");
    // No registry city is published for the RCS: never name one.
    expect(privacy).not.toMatch(/RCS (de |of )?[A-Z]/);
  });

  test.each(["fr", "en"] as const)("%s exposes founders@ only, names the publication director, and lists no PostHog storage", (locale) => {
    const copy = strings([MESSAGES[locale].contact, MESSAGES[locale].privacy]).join("\n");
    expect(copy).toContain("founders@thevibecompany.co");
    expect(copy).not.toContain("stan@");
    const director = MESSAGES[locale].privacy.sections.controller.table.rows.find(([label]) =>
      ["Directeur de la publication", "Publication director"].includes(label),
    );
    expect(director?.[1]).toBe("Stan Girard");
    const storage = MESSAGES[locale].privacy.sections.cookies.table.rows.map(([name]) => name);
    expect(storage.some((name) => name.startsWith("ph_"))).toBe(false);
  });

  test.each(["fr", "en"] as const)("%s keeps the marker on every claim that depends on a pending decision", (locale) => {
    const privacy = MESSAGES[locale].privacy.sections;
    const marker = TBC[locale];
    // The CNIL exemption is a goal, not a granted status.
    expect(privacy.cookies.after[1]).toContain(marker);
    // The audience legal basis.
    expect(privacy.purposes.table.rows[0][2]).toContain(marker);
    // Cookieless counting only works once the PostHog project setting is on.
    expect(privacy.collected.items[0].paragraphs[2]).toContain(marker);
    // Web Vitals need a session ID, which cookieless mode never creates.
    expect(strings(privacy).join("\n")).not.toContain("Web Vitals");
  });

  test.each(["fr", "en"] as const)("%s names Stan Girard as the personal data lead, without claiming a DPO", (locale) => {
    const privacy = MESSAGES[locale].privacy.sections;
    const lead = privacy.controller.table.rows.find(([label]) =>
      ["Responsable / contact données personnelles", "Personal data lead / contact"].includes(label),
    );
    expect(lead?.[1]).toBe("Stan Girard, founders@thevibecompany.co");
    // No DPO has been officially designated: never name one.
    expect(strings(privacy).join("\n")).not.toContain("DPO");
    expect(privacy.rights.paragraphs[1]).toContain("Stan Girard");
  });
});
