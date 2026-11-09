import { Anybody } from "next/font/google";

/**
 * Anybody, a variable grotesk with a width axis from 50% to 150%: the giant
 * words of this direction stretch and squeeze on it as the page moves. Geist
 * stays for everything that is read rather than seen.
 */
export const anybody = Anybody({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-cinetique",
  display: "swap",
});

/** The display face, for the giant words only. */
export const DISPLAY = "font-[family-name:var(--font-cinetique)]";
