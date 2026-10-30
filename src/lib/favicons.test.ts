import { describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import manifest from "@/app/manifest";
import { config } from "@/middleware";
import { SITE_ICONS, SITE_LOGO } from "./site";

const PUBLIC_DIR = path.join(process.cwd(), "public");

type Icon = { url: string; sizes?: string; type: string };

const declared: Icon[] = [
  ...SITE_ICONS.icon,
  ...SITE_ICONS.apple,
  ...(manifest().icons ?? []).map((i) => ({ url: i.src, sizes: i.sizes, type: i.type ?? "" })),
  { url: SITE_LOGO.path, sizes: `${SITE_LOGO.width}x${SITE_LOGO.height}`, type: "image/png" },
];

/** Sizes of each entry of an ICO file, read from its directory. */
function icoSizes(data: Buffer): string[] {
  return Array.from({ length: data.readUInt16LE(4) }, (_, i) => {
    const side = data.readUInt8(6 + i * 16) || 256;
    return `${side}x${side}`;
  });
}

describe("favicons", () => {
  test.each(declared.map((icon) => [icon.url, icon] as const))("%s exists at its declared size", async (_, icon) => {
    const data = await fs.readFile(path.join(PUBLIC_DIR, icon.url));
    if (icon.type === "image/x-icon") {
      expect(icoSizes(data).join(" ")).toBe(icon.sizes!);
    } else if (icon.type === "image/png") {
      const { format, width, height } = await sharp(data).metadata();
      expect(format).toBe("png");
      expect(`${width}x${height}`).toBe(icon.sizes!);
    }
    // Small enough for every crawler and the first paint.
    expect(data.length).toBeLessThan(16 * 1024);
  });

  test("Google gets a square raster favicon that is a multiple of 48 px", () => {
    const sides = SITE_ICONS.icon
      .filter((icon) => icon.type === "image/png")
      .map((icon) => Number(icon.sizes!.split("x")[0]));
    expect(sides.length).toBeGreaterThan(0);
    for (const side of sides) expect(side % 48).toBe(0);
  });

  test("icon URLs bypass the locale middleware", () => {
    const matchers = config.matcher.map((source) => new RegExp(`^${source}$`));
    expect(matchers.some((m) => m.test("/fr/about"))).toBe(true);
    for (const url of [...declared.map((icon) => icon.url), "/manifest.webmanifest"]) {
      expect(matchers.some((m) => m.test(url))).toBe(false);
    }
  });
});
