import { captureEvent, type EventProperties } from "@/lib/posthog";

/** Where the header's contact action sits: the bar, or the phone menu sheet. */
export type ContactLocation = "nav" | "mobile_menu";

type Capture = (eventName: string, properties?: EventProperties) => void;

/**
 * What a header contact choice reports. Before the porcelaine redesign the
 * header's "Nous contacter" button opened a menu and every contact started
 * with `get_in_touch_clicked { location }`; the menu is gone (booking and
 * e-mail are now direct), so each choice reports that same event first, then
 * the one naming the choice. Funnels built on `get_in_touch_clicked` keep
 * counting header contacts.
 */
export function trackHeaderContact(
  choice: "book" | "email",
  location: ContactLocation,
  capture: Capture = captureEvent,
) {
  capture("get_in_touch_clicked", { location });
  capture(choice === "book" ? "discovery_call_clicked" : "contact_email_clicked", { location });
}
