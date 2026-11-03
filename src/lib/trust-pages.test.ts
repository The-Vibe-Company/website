import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { BOOKING_URL, CONTACT_EMAIL } from "./booking";
import { PRIVACY_SECTION_KEYS } from "./privacy";

const MESSAGES = { fr, en } as const;

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

  test.each(["fr", "en"] as const)("%s states every fact: no pending marker, no Google provider, no strike-off", (locale) => {
    const copy = strings([MESSAGES[locale].contact, MESSAGES[locale].privacy]).join("\n");
    expect(copy).not.toMatch(/À CONFIRMER|TO BE CONFIRMED|à valider|to be validated/i);
    expect(copy).not.toMatch(/Google Workspace|Gmail/);
    // Google Fonts is a technical fact (no request goes there), not a provider.
    expect(copy.replaceAll("Google Fonts", "")).not.toContain("Google");
    expect(copy).not.toMatch(/radiation|radiée|struck off/i);
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
      "RCS Bobigny 981 841 109",
      "Quivr SAS",
    ]) {
      expect(privacy).toContain(fact);
    }
    expect(contact).toContain("44 boulevard Paul Vaillant-Couturier, 93100 Montreuil");
    expect(contact).toContain("10 rue La Vacquerie, 75011 Paris");
    expect(contact).toContain("SIREN 981 841 109");
    // From the Kbis: the RCS registration only. Nothing personal from it.
    expect(privacy).not.toMatch(/naissance|birth|nationalit|code de vérification|verification code|numéro de gestion/i);
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

  const DECIDED = {
    fr: {
      bases: [
        "Intérêt légitime, dans le cadre de l’exemption de consentement prévue par la CNIL pour la mesure d’audience",
        "Mesures précontractuelles prises à votre demande",
        "Intérêt légitime",
        "Intérêt légitime",
        "Cookie strictement nécessaire, exempté de consentement",
      ],
      retention: {
        "Événements PostHog": "25 mois maximum",
        "Traceurs de mesure d’audience": "13 mois maximum ; la mesure sans cookie n’en dépose aucun",
        "E-mails": "3 ans après le dernier contact",
        "Données de rendez-vous sur cal.com": "3 ans après le dernier contact",
        "Journaux d’hébergement et de sécurité chez Vercel": "12 mois",
        "Identifiant de visite dans votre navigateur": "En mémoire seulement, effacé au rechargement ou à la fermeture de la page",
        "Identifiant de visite dans les événements PostHog": "Même durée que les événements PostHog : 25 mois maximum",
      },
      president: "Président",
    },
    en: {
      bases: [
        "Legitimate interest, under the CNIL consent exemption for audience measurement",
        "Pre-contractual steps taken at your request",
        "Legitimate interest",
        "Legitimate interest",
        "Strictly necessary cookie, exempt from consent",
      ],
      retention: {
        "PostHog events": "25 months maximum",
        "Audience measurement trackers": "13 months maximum; cookieless measurement stores none",
        Emails: "3 years after the last contact",
        "Booking data on cal.com": "3 years after the last contact",
        "Hosting and security logs at Vercel": "12 months",
        "Visit identifier in your browser": "In memory only, cleared when the page is reloaded or closed",
        "Visit identifier in PostHog events": "Same as PostHog events: 25 months maximum",
      },
      president: "President",
    },
  } as const;

  test.each(["fr", "en"] as const)("%s gives the decided legal bases and retention periods, and keeps the IP facts exact", (locale) => {
    const privacy = MESSAGES[locale].privacy.sections;
    const decided = DECIDED[locale];
    expect(privacy.purposes.table.rows.map((row) => row[2])).toEqual([...decided.bases]);
    const retention = new Map(privacy.retention.table.rows.map(([label, value]) => [label, value]));
    for (const [label, value] of Object.entries(decided.retention)) {
      expect(retention.get(label)).toBe(value);
    }
    const president = privacy.controller.table.rows.find(([label]) => label === decided.president);
    expect(president?.[1]).toBe("Stan Girard");
    // The project does not anonymize IPs: never claim it does.
    const posthog = privacy.collected.items[0].paragraphs.join("\n");
    expect(posthog).toMatch(locale === "fr" ? /anonymise les adresses IP n’est pas activée/ : /anonymizes IP addresses isn’t turned on/);
    expect(posthog).not.toMatch(/retire l’adresse IP|strips the IP/);
    // In-memory persistence keeps a session ID, so Web Vitals are collected.
    expect(posthog).toContain("Web Vitals");
    // No cookieless-mode wording: the site does not use that mode.
    expect(strings(privacy).join("\n")).not.toMatch(
      /random salt|daily salt|daily hash|counting hash|sel aléatoire|sel quotidien|empreinte quotidienne|empreinte de comptage|\$posthog_cookieless/i,
    );
    // Default GeoIP enrichment applies (project IP anonymization is off): say what it adds.
    expect(posthog).toMatch(
      locale === "fr"
        ? /localisation approximative \(pays, région, ville, coordonnées approximatives, fuseau horaire\)/
        : /approximate location from it \(country, region, city, approximate coordinates, time zone\)/,
    );
    // The visit identifier lives in memory only.
    expect(posthog).toMatch(locale === "fr" ? /ne vit qu’en mémoire/ : /lives in memory only/);
  });

  test.each(["fr", "en"] as const)("%s names Stan Girard as the personal data lead, without claiming a DPO", (locale) => {
    const privacy = MESSAGES[locale].privacy.sections;
    const lead = privacy.controller.table.rows.find(([label]) =>
      ["Responsable / contact données personnelles", "Personal data lead / contact"].includes(label),
    );
    expect(lead?.[1]).toBe("Stan Girard, founders@thevibecompany.co");
    // No DPO has been officially designated: never name one, in any wording.
    const copy = strings([MESSAGES[locale].contact, MESSAGES[locale].privacy]).join("\n");
    expect(copy).not.toMatch(/\bDPO\b|délégué à la protection|data protection officer/i);
    // One contact row only, merged with the lead.
    const withEmail = privacy.controller.table.rows.filter(([, value]) => value.includes(CONTACT_EMAIL));
    expect(withEmail).toHaveLength(1);
    expect(privacy.rights.paragraphs[1]).toContain("Stan Girard");
  });
});
