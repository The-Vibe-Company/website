/**
 * Builds the Quivr product images from the raw screenshot of the Quivr V2 web
 * app (public/projects/quivr-v2-product-feed.png, kept as the source).
 *
 *   bun scripts/build-quivr-images.ts
 *
 * Writes, next to the source:
 * - quivr-v2-product-feed-{1200,2400}.{avif,webp}: the on-page image, served
 *   through <picture> on /portfolio/quivr and used as the project cover;
 * - quivr-og.jpg: the 1200x630 Open Graph / Twitter image.
 *
 * The capture carries a few pixels of macOS window chrome (a dark strip on
 * top, rounded dark corners); they are cropped off first. Re-run after
 * replacing the source; the outputs are committed.
 */
import sharp from "sharp";
import path from "node:path";

const DIR = path.join(import.meta.dir, "..", "public", "projects");
const SOURCE = path.join(DIR, "quivr-v2-product-feed.png");

/** Pixels of window chrome to drop on each side of the raw capture. */
const CROP = { left: 4, top: 6, right: 6, bottom: 6 };
const WIDTHS = [1200, 2400] as const;
const OG = { width: 1200, height: 630 };

async function main() {
  const meta = await sharp(SOURCE).metadata();
  if (!meta.width || !meta.height) throw new Error(`Cannot read ${SOURCE}`);

  const cropped = await sharp(SOURCE)
    .extract({
      left: CROP.left,
      top: CROP.top,
      width: meta.width - CROP.left - CROP.right,
      height: meta.height - CROP.top - CROP.bottom,
    })
    .flatten({ background: "#ffffff" })
    .toBuffer();

  for (const width of WIDTHS) {
    const resized = sharp(cropped).resize({ width, withoutEnlargement: true });
    const base = path.join(DIR, `quivr-v2-product-feed-${width}`);
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 82, effort: 6 }).toFile(`${base}.webp`);
  }

  // Social cards are about 1.9:1; the capture is about 1.83:1, so the bottom
  // of the feed is trimmed and the toolbar, feed and trending topics stay.
  await sharp(cropped)
    .resize({ ...OG, fit: "cover", position: "top" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(DIR, "quivr-og.jpg"));

  const out = await sharp(path.join(DIR, `quivr-v2-product-feed-${WIDTHS[0]}.webp`)).metadata();
  console.log(`Built Quivr images (${out.width}x${out.height} at ${WIDTHS[0]}w) and quivr-og.jpg`);
}

await main();
