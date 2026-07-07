import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";
const YEAR = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;

  // Respect a locale already chosen (by geo before, or by the switcher).
  if (existing && (routing.locales as readonly string[]).includes(existing)) {
    return NextResponse.next();
  }

  // French by default; only switch to English when we know the visitor is
  // outside France. Unknown geolocation (e.g. localhost) stays French.
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const locale = country && country !== "FR" ? "en" : "fr";

  // Make this first request render in the detected locale...
  request.cookies.set(LOCALE_COOKIE, locale);
  const response = NextResponse.next({ request });
  // ...and remember it for next time.
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: YEAR });
  return response;
}

export const config = {
  // Run on page routes only, not on API, assets, PostHog proxy, or files.
  matcher: ["/((?!api|_next|ingest|.*\\.).*)"],
};
