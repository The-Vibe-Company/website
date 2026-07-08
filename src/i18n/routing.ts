import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  // French is the base language; English is served under /en.
  defaultLocale: "fr",
  // Language always lives in the first URL segment: /fr/... and /en/...
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
