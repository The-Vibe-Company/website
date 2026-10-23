import { describe, expect, test } from "bun:test";

import {
  contentAlternates,
  localizedAlternates,
  localizedSocialMetadata,
  monolingualAlternates,
  splitPathAlternates,
} from "./site";

const SITE = "https://www.thevibecompany.co";

describe("localizedSocialMetadata", () => {
  test("falls back to the site logo on the small card without an image", () => {
    const meta = localizedSocialMetadata({ locale: "en", path: "/about", title: "T", description: "D" });
    const url = `${SITE}/icon.png`;
    expect(meta.twitter).toMatchObject({ card: "summary", images: [url] });
    expect(meta.openGraph).toMatchObject({
      locale: "en_US",
      url: `${SITE}/en/about`,
      images: [{ url, width: 1024, height: 1024, alt: "The Vibe Company" }],
    });
  });

  test("declares an absolute OG image and the large Twitter card", () => {
    const meta = localizedSocialMetadata({
      locale: "fr",
      path: "/portfolio/quivr",
      title: "T",
      description: "D",
      image: { path: "/projects/quivr-og-fr.jpg", width: 1200, height: 630, alt: "Alt" },
    });
    const url = "https://www.thevibecompany.co/projects/quivr-og-fr.jpg";
    expect(meta.openGraph).toMatchObject({
      images: [{ url, width: 1200, height: 630, alt: "Alt" }],
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: [url] });
  });
});

describe("alternates", () => {
  test("pages served in both languages declare fr, en and the French x-default", () => {
    expect(localizedAlternates("en", "/portfolio")).toEqual({
      canonical: `${SITE}/en/portfolio`,
      languages: {
        fr: `${SITE}/fr/portfolio`,
        en: `${SITE}/en/portfolio`,
        "x-default": `${SITE}/fr/portfolio`,
      },
    });
  });

  test("translated paths keep x-default on the French URL", () => {
    expect(splitPathAlternates("en", { fr: "/a-propos", en: "/about" })).toEqual({
      canonical: `${SITE}/en/about`,
      languages: {
        fr: `${SITE}/fr/a-propos`,
        en: `${SITE}/en/about`,
        "x-default": `${SITE}/fr/a-propos`,
      },
    });
  });

  test("single-language content declares itself as x-default", () => {
    const path = "/resources/articles/premier-site";
    expect(monolingualAlternates("fr", path)).toEqual({
      canonical: `${SITE}/fr${path}`,
      languages: { fr: `${SITE}/fr${path}`, "x-default": `${SITE}/fr${path}` },
    });
    expect(contentAlternates("fr", path, [{ language: "fr", path }])).toEqual(
      monolingualAlternates("fr", path),
    );
  });
});
