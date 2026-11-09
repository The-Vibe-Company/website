import { Darker_Grotesque } from "next/font/google";

/**
 * Darker Grotesque: a tall, tight grotesque cut like a film title. Set at 900
 * it carries the giant lines of this direction; Geist stays for everything
 * that is read.
 */
export const darker = Darker_Grotesque({
  subsets: ["latin"],
  variable: "--font-eclipse",
  display: "swap",
});

/** Utility for the display face (the variable is set on the direction root). */
export const DISPLAY = "font-[family-name:var(--font-eclipse)]";
