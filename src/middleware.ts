import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A URL without a language prefix: decide the language and redirect to it.
  // Order: the visitor's manual choice (cookie) first, then geolocation
  // (France -> fr, anywhere else -> en; unknown, e.g. localhost, stays fr).
  if (!hasLocalePrefix(pathname)) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    let locale: string = routing.defaultLocale;
    if (
      cookieLocale &&
      (routing.locales as readonly string[]).includes(cookieLocale)
    ) {
      locale = cookieLocale;
    } else {
      const country = request.headers.get("x-vercel-ip-country") ?? "";
      locale = country && country !== "FR" ? "en" : "fr";
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Prefixed URL: let next-intl handle it (remembers the locale in a cookie,
  // adds alternate-language headers, etc.).
  return intlMiddleware(request);
}

export const config = {
  // Page routes only, not API, assets, PostHog proxy, or files with an extension.
  matcher: ["/((?!api|_next|ingest|.*\\.).*)"],
};
