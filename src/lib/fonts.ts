/**
 * The display cut of Bricolage Grotesque (titles: wdth 92, opsz 96, weights
 * 600-700), built by scripts/fonts/build-bricolage.py. It is declared in
 * globals.css rather than through next/font so that each page chooses whether
 * to preload it: pages whose first screen carries a multi-line display title
 * preload it (the swap from the fallback would re-wrap the title and shift the
 * page); the project pages, whose title is one word, leave it off the mobile
 * LCP path. Bump the version suffix when the file changes (it is served with a
 * one-year immutable cache, see next.config.ts).
 */
export const DISPLAY_FONT_URL = "/fonts/bricolage-display-latin-v1.woff2";
