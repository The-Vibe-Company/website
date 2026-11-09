import { Doto } from "next/font/google";

/**
 * Dot-matrix display face for the live readouts: counters, the clock, the
 * response countdown. Only figures and short codes are set in it, never prose.
 */
export const doto = Doto({
  subsets: ["latin"],
  weight: "variable",
  axes: ["ROND"],
  display: "swap",
  variable: "--font-doto",
});
