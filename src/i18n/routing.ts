import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  // French is the base language; English is served under /en.
  defaultLocale: "fr",
  // Language always lives in the first URL segment: /fr/... and /en/...
  localePrefix: "always",
  // Next Metadata owns canonical/hreflang declarations. This avoids generic
  // HTTP Link alternates for monolingual resource detail pages.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
