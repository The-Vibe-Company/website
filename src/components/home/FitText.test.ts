import { describe, expect, test } from "bun:test";
import { emWidth } from "./FitText";

// Widths of each line at 1em in Geist ExtraBold, kerning included, measured in
// Chrome with canvas measureText at 1000px.
// The hero poster and the closing CTAs, in both languages.
const MEASURED: Record<string, number> = {
  Agence: 3.802,
  "IA-First.": 4.069,
  "We build": 4.326,
  "your product,": 6.708,
  "Un problème": 6.293,
  "à résoudre ?": 6.143,
  "Got a problem": 7.018,
  "to solve?": 4.584,
  "Un projet IA santé": 8.917,
  "à cadrer ?": 4.962,
  "Un outil IA pour": 7.653,
  "votre rédaction ?": 8.558,
  "Need an AI tool": 7.564,
  "for your newsroom?": 9.925,
};

describe("FitText server estimate", () => {
  for (const [line, width] of Object.entries(MEASURED)) {
    test(`"${line}" lands within 1.5% of its measured width`, () => {
      expect(Math.abs(emWidth(line) / width - 1)).toBeLessThan(0.015);
    });
  }

  test("accented letters take their base letter's advance", () => {
    expect(emWidth("été")).toBeCloseTo(emWidth("ete"), 6);
  });
});
