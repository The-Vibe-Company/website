/**
 * Intrinsic size of every client logo under `public/images/clients/`, as read
 * by Sharp (SVG: their viewBox, rounded). Passed as `width`/`height` on each
 * `<img>` so the browser reserves the logo's box before the file arrives: the
 * CSS still sets the displayed height (`w-auto` keeps the ratio), but without
 * the attributes a lazy logo is 0px wide until it loads and shoves its row.
 *
 * `client-logos.test.ts` checks these against the files.
 */
export const CLIENT_LOGO_SIZES: Record<string, { width: number; height: number }> = {
  "/images/clients/afp.svg": { width: 299, height: 95 },
  "/images/clients/coup-de-pates.svg": { width: 583, height: 118 },
  "/images/clients/locservice.png": { width: 256, height: 43 },
  "/images/clients/monka.webp": { width: 600, height: 210 },
  "/images/clients/monka-color.webp": { width: 600, height: 210 },
  "/images/clients/theodo.svg": { width: 111, height: 24 },
  "/images/clients/trusk.svg": { width: 147, height: 44 },
  "/images/clients/zapa.svg": { width: 71, height: 20 },
};

/** `width`/`height` attributes for a client logo, to spread on its `<img>`. */
export function clientLogoSize(src: string): { width?: number; height?: number } {
  return CLIENT_LOGO_SIZES[src] ?? {};
}
