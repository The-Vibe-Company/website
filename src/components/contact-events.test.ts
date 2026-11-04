import { describe, expect, test } from "bun:test";
import type { EventProperties } from "@/lib/posthog";
import { trackHeaderContact } from "./contact-events";

function recorder() {
  const sent: [string, EventProperties | undefined][] = [];
  return { sent, capture: (event: string, properties?: EventProperties) => void sent.push([event, properties]) };
}

describe("header contact events", () => {
  test("booking from the bar reports get_in_touch_clicked first, with main's properties", () => {
    const { sent, capture } = recorder();
    trackHeaderContact("book", "nav", capture);
    expect(sent).toEqual([
      ["get_in_touch_clicked", { location: "nav" }],
      ["discovery_call_clicked", { location: "nav" }],
    ]);
  });

  test("e-mail from the phone menu reports get_in_touch_clicked then contact_email_clicked", () => {
    const { sent, capture } = recorder();
    trackHeaderContact("email", "mobile_menu", capture);
    expect(sent).toEqual([
      ["get_in_touch_clicked", { location: "mobile_menu" }],
      ["contact_email_clicked", { location: "mobile_menu" }],
    ]);
  });
});
