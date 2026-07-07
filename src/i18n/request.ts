import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { routing } from "./routing";

export const LOCALE_COOKIE = "NEXT_LOCALE";

// Cookie-based locale (no per-language URLs yet). The middleware sets the
// cookie from geolocation on the first visit; the language switcher updates it.
export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
