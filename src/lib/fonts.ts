/**
 * The site's fonts, self-hosted under public/fonts and declared in globals.css
 * (served with a one-year immutable cache, see next.config.ts). They used to
 * go through next/font, which put their @font-face rules in extra
 * render-blocking stylesheets that often arrived last and held the first frame
 * back. Bump a file's version suffix (here, in globals.css, and in
 * scripts/fonts/build-bricolage.py for Bricolage) when it changes.
 *
 * - Bricolage Grotesque, two instances built by scripts/fonts/build-bricolage.py:
 *   text (wdth 100, opsz 16, weights 300-800) and display (titles: wdth 92,
 *   opsz 96, weights 600-700). OFL.
 * - Geist Mono and Geist, latin subsets of the Google Fonts files. OFL.
 */
export const PRELOADED_FONT_URLS = [
  "/fonts/bricolage-text-latin-v1.woff2",
  "/fonts/bricolage-display-latin-v1.woff2",
  "/fonts/geist-mono-latin-v1.woff2",
] as const;
