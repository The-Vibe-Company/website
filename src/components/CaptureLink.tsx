"use client";

import type { AnchorHTMLAttributes } from "react";
import { captureEvent, type EventProperties } from "@/lib/posthog";

/**
 * A plain link that reports one analytics event when clicked. It lets a
 * server component keep its click tracking without becoming a client
 * component itself: only this anchor is hydrated, its children stay server
 * rendered.
 */
export function CaptureLink({
  event,
  properties,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  properties?: EventProperties;
}) {
  return <a {...props} onClick={() => captureEvent(event, properties)} />;
}
