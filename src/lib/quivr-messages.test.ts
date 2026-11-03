import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { QUIVR_MEDIAGEN_SOURCE } from "./quivr";

/** Every leaf path of a message tree, arrays included as one leaf. */
function leaves(node: unknown, prefix = ""): string[] {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return [prefix];
  return Object.entries(node).flatMap(([key, value]) =>
    leaves(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe("quivr messages", () => {
  test("French and English carry the same keys", () => {
    expect(leaves(fr.quivr).sort()).toEqual(leaves(en.quivr).sort());
  });

  test("never claim a certification", () => {
    for (const messages of [en.quivr, fr.quivr]) {
      const text = JSON.stringify(messages);
      expect(text).not.toMatch(/\bSOC ?2\b/i);
      expect(text).not.toMatch(/\bISO ?\d*\b/);
    }
  });

  // The page was written from the Quivr README and docs only, which keep
  // customer names out since the repository went public (THE-676). Stan
  // cleared one sourced line naming MediaGen and AFP (THE-2187): it is the
  // only place either name may appear, word for word, and AFP is never
  // presented as a user of Quivr.
  test("name MediaGen and AFP only in the sourced consortium line", () => {
    const exact = {
      fr: "Quivr fait partie du consortium de MediaGen, un projet d’IA générative pour les médias porté par l’AFP et sélectionné dans le cadre de France 2030.",
      en: "Quivr is part of the consortium behind MediaGen, a generative AI project for the media led by AFP and selected under the France 2030 plan.",
    };
    for (const [locale, messages] of [["fr", fr.quivr], ["en", en.quivr]] as const) {
      const { mediagen, ...features } = messages.features;
      const rest = JSON.stringify({ ...messages, features });
      expect(rest).not.toMatch(/\bMediaGen\b/i);
      expect(rest).not.toMatch(/\bAFP\b/i);
      expect(mediagen.text).toBe(exact[locale]);
      expect(mediagen.text).not.toMatch(/utilisée? par l.AFP|used by AFP/i);
      expect(QUIVR_MEDIAGEN_SOURCE[locale]).toMatch(/^https:\/\/www\.afp\.com\//);
    }
  });
});
