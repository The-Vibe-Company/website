import { getImageProps } from "next/image";
import { preload } from "react-dom";

/**
 * The image optimizer's candidates for the mascot, as next/image builds them
 * (so they follow the `images` config: widths, qualities, loader), cut at 640w.
 * The source is 488px wide and is never enlarged, so 640w and every larger
 * width are the same 488px file: next/image listed them all (up to 3840w).
 * Stopping at 640w keeps the bytes every screen downloads, and so its pixels,
 * and drops the duplicate candidates from the HTML and the preload.
 */
const MAX_WIDTH = 640;
const CANDIDATES = (getImageProps({
  src: "/images/home/mascot-cutout.webp",
  alt: "",
  width: 488,
  height: 672,
  sizes: "280px",
}).props.srcSet ?? "")
  .split(", ")
  .map((candidate) => {
    const [url, descriptor] = candidate.split(" ");
    return { url, width: Number.parseInt(descriptor, 10) };
  })
  .filter((candidate) => candidate.width <= MAX_WIDTH);
const SRC_SET = CANDIDATES.map(({ url, width }) => `${url} ${width}w`).join(", ");
const SRC = CANDIDATES[CANDIDATES.length - 1].url;

/** The `lg` breakpoint, as Tailwind writes it, and its exact complement. */
const DESKTOP = "(min-width: 64rem)";
const PHONE = "not all and (min-width: 64rem)";

const VARIANTS = {
  /** Under the pitch on phones: their largest contentful paint. */
  phone: {
    sizes: "(min-width: 1024px) 0px, 280px",
    media: PHONE,
    fetchPriority: "high",
    className: "absolute left-1/2 top-0 w-[280px] max-w-none -translate-x-1/2 landing-float",
  },
  /** The right column on desktops. */
  desktop: {
    sizes: "(min-width: 1024px) 470px, 0px",
    media: DESKTOP,
    fetchPriority: undefined,
    className: "h-auto w-full landing-float",
  },
} as const;

/**
 * The hero mascot, on the homepage and the service landings. A plain <img>
 * with the same optimized URLs, size and classes next/image rendered, plus:
 * - a preload limited to the screens that show this variant (`media`), so a
 *   phone no longer preloads the desktop mascot and the reverse;
 * - `decoding="sync"`: the picture is decoded for the frame that first
 *   paints it, rather than a frame or more later, so the mascot (the LCP
 *   element on phones) arrives with the first paint.
 */
export function MascotCutout({ variant }: { variant: keyof typeof VARIANTS }) {
  const { sizes, media, fetchPriority, className } = VARIANTS[variant];
  preload(SRC, { as: "image", imageSrcSet: SRC_SET, imageSizes: sizes, fetchPriority, media });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      width={488}
      height={672}
      decoding="sync"
      fetchPriority={fetchPriority}
      sizes={sizes}
      srcSet={SRC_SET}
      src={SRC}
      className={className}
      style={{ color: "transparent" }}
    />
  );
}
