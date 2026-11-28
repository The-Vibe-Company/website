/**
 * Shared visual tokens for the 6 commercial offer landing pages.
 * All values reuse the site's ink-and-warm-paper design system (globals.css, DESIGN.md).
 */

export const OFFER_SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";

export const OFFER_BAND = `${OFFER_SECTION} py-20 md:py-28 lg:py-32`;

export const OFFER_H2 =
  "m-0 text-balance font-bold text-foreground text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.94] tracking-[-0.045em]";

export const OFFER_H2_SPLIT =
  "m-0 max-w-[16ch] text-balance font-bold text-foreground text-[clamp(2rem,4vw,3.5rem)] leading-[0.96] tracking-[-0.04em]";

export const OFFER_H3 =
  "m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]";

export const OFFER_MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

export const OFFER_PROSE =
  "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";

export const OFFER_PROSE_LEAD =
  "m-0 text-[17px] leading-[1.6] text-soft-foreground md:text-[18px]";

export const OFFER_INLINE_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";

export const OFFER_MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";

export const OFFER_LIST_RULE =
  "mt-[0.72em] h-px w-[0.6em] shrink-0 bg-muted-foreground";

/** Soft orange radial glow for ink emphasis bands (matches LitQuote on the homepage). */
export const OFFER_INK_GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";

export const OFFER_INK_GLOW_QUOTE =
  "radial-gradient(55% 75% at 22% 60%, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.04) 55%, transparent 80%)";
