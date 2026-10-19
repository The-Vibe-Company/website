import { describe, expect, test } from "bun:test";

import { localizedSocialMetadata } from "./site";

describe("localizedSocialMetadata", () => {
  test("keeps the small card without an image", () => {
    const meta = localizedSocialMetadata({ locale: "en", path: "/about", title: "T", description: "D" });
    expect(meta.twitter).toMatchObject({ card: "summary" });
    expect(meta.openGraph).not.toHaveProperty("images");
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
