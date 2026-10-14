/** The 30-minute discovery call every "book a call" CTA on the site opens. */
export const BOOKING_URL = "https://cal.com/stangirard/30min";

/**
 * Tags where a booking link sits on the page; `booking_link_clicked` reports
 * it as `location`. Spread `{...bookingLocation("hero")}` on the link or any of
 * its ancestors. Kept here, free of analytics imports, so server components
 * can tag their markup without pulling posthog-js into the server graph.
 */
export const BOOKING_LOCATION_ATTRIBUTE = "data-booking-location";

export function bookingLocation(location: string) {
  return { [BOOKING_LOCATION_ATTRIBUTE]: location };
}
