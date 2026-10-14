import { routing } from "@/i18n/routing";
import { BOOKING_LOCATION_ATTRIBUTE } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";

/**
 * `booking_link_clicked` fires on every click on a cal.com link, wherever it
 * is rendered: React CTAs, the header, the footer, and links written inside
 * article Markdown (which reach the DOM as raw HTML, out of React's reach).
 * One delegated listener (see BookingLinkTracker) covers them all.
 *
 * Properties:
 * - `page`: the current pathname, locale prefix included.
 * - `location`: where on the page the link sits. Read from the nearest
 *   `data-booking-location` ancestor (or the link itself), then from the
 *   nearest `<header>`/`<nav>` or `<footer>`, else "other".
 * - `article_slug`: the article's slug on an article page, else null.
 */
export const BOOKING_LINK_CLICKED = "booking_link_clicked";

/** True for cal.com URLs (cal.com itself or any of its subdomains). */
export function isBookingHref(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    const { hostname } = new URL(href, "https://invalid.local");
    return hostname === "cal.com" || hostname.endsWith(".cal.com");
  } catch {
    return false;
  }
}

const ARTICLE_PATH = new RegExp(
  `^(?:/(?:${routing.locales.join("|")}))?/resources/articles/([^/]+)/?$`,
);

/** The article slug when `pathname` is an article page, else null. */
export function getArticleSlug(pathname: string): string | null {
  const match = ARTICLE_PATH.exec(pathname);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function getBookingLocation(link: Element): string {
  const tagged = link.closest(`[${BOOKING_LOCATION_ATTRIBUTE}]`);
  const location = tagged?.getAttribute(BOOKING_LOCATION_ATTRIBUTE);
  if (location) return location;
  if (link.closest("header, nav")) return "header";
  if (link.closest("footer")) return "footer";
  return "other";
}

export function getBookingLinkClickedProperties(link: Element, pathname: string) {
  return {
    page: pathname,
    location: getBookingLocation(link),
    article_slug: getArticleSlug(pathname),
  };
}

export function trackBookingLinkClick(link: Element, pathname: string) {
  // The CTAs navigate the same tab to cal.com: skip the batch queue so the
  // request (a keepalive fetch) leaves before the page unloads.
  captureEvent(BOOKING_LINK_CLICKED, getBookingLinkClickedProperties(link, pathname), {
    send_instantly: true,
  });
}
