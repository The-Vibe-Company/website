import { describe, expect, test } from "bun:test";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { FOOTER_OFFERINGS } from "./footer-offerings";
import { INDEXABLE_SPLIT_PATH_ROUTES } from "./site";

describe("footer offerings", () => {
  test("every entry has a label in both languages, and no label is orphaned", () => {
    const keys = FOOTER_OFFERINGS.map(({ key }) => key).sort();
    expect(Object.keys(fr.footer.offerings).sort()).toEqual(keys);
    expect(Object.keys(en.footer.offerings).sort()).toEqual(keys);
  });

  test("only links indexable landings", () => {
    const indexable = new Set(INDEXABLE_SPLIT_PATH_ROUTES.map(({ paths }) => paths));
    for (const { paths } of FOOTER_OFFERINGS) expect(indexable.has(paths)).toBe(true);
  });
});
