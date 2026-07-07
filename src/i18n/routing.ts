import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  // French is the base language; English is served under /en.
  defaultLocale: "fr",
  // Default locale (fr) has no prefix, English is at /en.
  localePrefix: "as-needed",
  // We run our own geo-based detection in the middleware.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
