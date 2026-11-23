import { describe, expect, test } from "bun:test";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { backLinkLeadsHome, caseStudyHref, isHomePath, isHomeReferrer } from "./case-study-links";
import { cardOriginFor, rememberCardClick } from "./case-study-origin";

const ORIGIN = "https://www.thevibecompany.co";

describe("isHomeReferrer", () => {
  test("same-host home pages", () => {
    for (const path of ["/", "/fr", "/en", "/fr/", "/en/"]) {
      expect(isHomeReferrer(`${ORIGIN}${path}`, ORIGIN)).toBe(true);
    }
    expect(isHomeReferrer(ORIGIN, ORIGIN)).toBe(true);
    expect(isHomeReferrer(`${ORIGIN}/en?utm=x#top`, ORIGIN)).toBe(true);
  });

  test("other paths on the same host", () => {
    expect(isHomeReferrer(`${ORIGIN}/en/case-studies`, ORIGIN)).toBe(false);
    expect(isHomeReferrer(`${ORIGIN}/fr/case-studies/afp`, ORIGIN)).toBe(false);
    expect(isHomeReferrer(`${ORIGIN}/de`, ORIGIN)).toBe(false);
  });

  test("other hosts", () => {
    expect(isHomeReferrer("https://www.google.com/", ORIGIN)).toBe(false);
    expect(isHomeReferrer("https://evil.example/en", ORIGIN)).toBe(false);
    expect(isHomeReferrer("http://www.thevibecompany.co/", ORIGIN)).toBe(false);
  });

  test("empty or invalid referrer", () => {
    expect(isHomeReferrer("", ORIGIN)).toBe(false);
    expect(isHomeReferrer("not a url", ORIGIN)).toBe(false);
  });
});

describe("case study links", () => {
  test("href has no query string", () => {
    expect(caseStudyHref("afp")).toBe("/case-studies/afp");
    expect(caseStudyHref("afp")).not.toContain("?");
  });

  test("isHomePath", () => {
    for (const path of ["/", "/fr", "/en", "/en/", ""]) expect(isHomePath(path)).toBe(true);
    for (const path of ["/en/case-studies", "/de", "/english"]) expect(isHomePath(path)).toBe(false);
  });

  test("no case-study link in the source carries a ?from= param", () => {
    const glob = new Bun.Glob("**/*.{ts,tsx}");
    const offenders: string[] = [];
    for (const file of glob.scanSync({ cwd: join(import.meta.dir, ".."), absolute: true })) {
      if (/case-studies\/[^"'`\s]*\?from=/.test(readFileSync(file, "utf8"))) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});

describe("backLinkLeadsHome", () => {
  const page = `${ORIGIN}/en/case-studies/afp`;

  test("a card clicked on the home page leads home", () => {
    for (const from of ["/en", "/fr/", "/"]) {
      expect(
        backLinkLeadsHome({ cardOriginPath: from, referrer: "", currentUrl: page, initialDocumentUrl: `${ORIGIN}/en` }),
      ).toBe(true);
    }
  });

  test("a card clicked elsewhere leads to the case studies, whatever the referrer", () => {
    expect(
      backLinkLeadsHome({
        cardOriginPath: "/en/case-studies",
        referrer: `${ORIGIN}/en`,
        currentUrl: page,
        initialDocumentUrl: page,
      }),
    ).toBe(false);
  });

  test("full page load uses the referrer", () => {
    expect(
      backLinkLeadsHome({ cardOriginPath: null, referrer: `${ORIGIN}/fr`, currentUrl: page, initialDocumentUrl: page }),
    ).toBe(true);
    expect(
      backLinkLeadsHome({ cardOriginPath: null, referrer: "https://www.google.com/", currentUrl: page, initialDocumentUrl: page }),
    ).toBe(false);
    expect(backLinkLeadsHome({ cardOriginPath: null, referrer: "", currentUrl: page, initialDocumentUrl: page })).toBe(false);
  });

  test("client-side navigation ignores the stale referrer", () => {
    expect(
      backLinkLeadsHome({
        cardOriginPath: null,
        referrer: `${ORIGIN}/en`,
        currentUrl: page,
        initialDocumentUrl: `${ORIGIN}/en/resources`,
      }),
    ).toBe(false);
    expect(
      backLinkLeadsHome({ cardOriginPath: null, referrer: `${ORIGIN}/en`, currentUrl: page, initialDocumentUrl: null }),
    ).toBe(false);
  });
});

describe("cardOriginFor", () => {
  test("returns the origin for the clicked case study, repeatably", () => {
    rememberCardClick("/en", "/en/case-studies/afp");
    expect(cardOriginFor("/en/case-studies/afp")).toBe("/en");
    expect(cardOriginFor("/en/case-studies/afp")).toBe("/en");
  });

  test("drops a note for another page", () => {
    rememberCardClick("/en", "/en/case-studies/afp");
    expect(cardOriginFor("/en/case-studies/monka")).toBeNull();
    expect(cardOriginFor("/en/case-studies/afp")).toBeNull();
  });
});
