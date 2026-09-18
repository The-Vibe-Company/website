import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { ENSEMBLE_PATH } from "@/lib/coup-de-pates-ensemble";

const intlMiddleware = createMiddleware(routing);

// Pages that exist in French only. Every other variant of the URL (prefix-less
// or /en) resolves to the French one, whatever the visitor's cookie or country
// says, so a shared link always opens the page it promises.
const FRENCH_ONLY_PATHS = new Set<string>([ENSEMBLE_PATH]);

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

function withoutLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // French-only pages: one hop to the French URL, and no locale cookie written,
  // so the visitor's language choice for the rest of the site is left alone.
  const barePath = withoutLocalePrefix(pathname);
  if (FRENCH_ONLY_PATHS.has(barePath) && pathname !== `/fr${barePath}`) {
    const url = request.nextUrl.clone();
    url.pathname = `/fr${barePath}`;
    return NextResponse.redirect(url, 308);
  }

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

  // Prefixed URL: let next-intl handle routing and remember the locale in a
  // cookie. Canonical and alternate links are declared through Next Metadata.
  return intlMiddleware(request);
}

export const config = {
  // Page routes only, not API, assets, PostHog proxy, or files with an extension.
  // The trailing `.*\.` exclusion is what keeps /brand/*.png out of the locale
  // redirect: those URLs are pasted in email signatures and must never 308.
  matcher: ["/((?!api|_next|ingest|.*\\.).*)"],
};
