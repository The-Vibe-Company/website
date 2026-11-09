import { Bodoni_Moda } from "next/font/google";

/**
 * The direction's second voice: a high-contrast display serif, italic only,
 * set against Geist for emphasis words, figures and the pull quote. The
 * optical-size axis comes with it, so the hairlines thicken on their own when
 * the serif is set small.
 */
export const serif = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-editorial-serif",
  display: "swap",
});

/** Classes for a run of the serif: italic, regular weight. Callers set tracking. */
export const SERIF = "[font-family:var(--font-editorial-serif)] italic font-normal";
