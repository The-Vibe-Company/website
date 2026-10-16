import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

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

  test("never name a client or a certification the page must not claim", () => {
    for (const messages of [en.quivr, fr.quivr]) {
      const text = JSON.stringify(messages);
      expect(text).not.toMatch(/\bMediaGen\b/i);
      expect(text).not.toMatch(/\bSOC ?2\b/i);
      expect(text).not.toMatch(/\bISO ?\d*\b/);
    }
  });
});
