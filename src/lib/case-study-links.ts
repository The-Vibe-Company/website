import { routing } from "@/i18n/routing";

/** Internal href of a case study, with no query string (one canonical URL). */
export function caseStudyHref(slug: string): string {
  return `/case-studies/${slug}`;
}

const HOME_PATHS = new Set(["/", ...routing.locales.map((locale) => `/${locale}`)]);

/** True for the home page path: `/`, `/fr`, `/en`, with or without a trailing slash. */
export function isHomePath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return HOME_PATHS.has(path || "/");
}

/** True when the referrer is this site's home page, on the same origin as the current page. */
export function isHomeReferrer(referrer: string, currentOrigin: string): boolean {
  if (!referrer) return false;
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return false;
  }
  return url.origin === currentOrigin && isHomePath(url.pathname);
}

/**
 * Whether the case study's back link should lead home.
 *
 * - `cardOriginPath`: path of the page whose case card was clicked, kept in
 *   memory across a client-side navigation (null when there was none).
 * - Otherwise `document.referrer` is only meaningful when the case study was
 *   a full page load (`initialDocumentUrl` is the current URL): client-side
 *   navigations leave it pointing at the first page of the tab.
 */
export function backLinkLeadsHome({
  cardOriginPath,
  referrer,
  currentUrl,
  initialDocumentUrl,
}: {
  cardOriginPath: string | null;
  referrer: string;
  currentUrl: string;
  initialDocumentUrl: string | null;
}): boolean {
  if (cardOriginPath !== null) return isHomePath(cardOriginPath);
  let current: URL;
  try {
    current = new URL(currentUrl);
  } catch {
    return false;
  }
  if (!initialDocumentUrl) return false;
  let initial: URL;
  try {
    initial = new URL(initialDocumentUrl);
  } catch {
    return false;
  }
  const fullLoad = initial.origin === current.origin && initial.pathname === current.pathname;
  return fullLoad && isHomeReferrer(referrer, current.origin);
}
