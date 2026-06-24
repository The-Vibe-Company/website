import posthog from "posthog-js";

export const isPostHogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (!isPostHogEnabled) return;
  posthog.capture(eventName, properties);
}
