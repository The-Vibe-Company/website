import posthog from "posthog-js";
import type { CaptureOptions } from "posthog-js";

/**
 * PostHog only runs on the production deployment. `NEXT_PUBLIC_VERCEL_ENV` is
 * inlined from Vercel's `VERCEL_ENV` in next.config.ts, so local dev, preview
 * deployments and CI builds never initialize it, even when a key is present.
 * Every capture below is a no-op in that case.
 */
export const isPostHogEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
  options?: CaptureOptions,
) {
  if (!isPostHogEnabled) return;
  posthog.capture(eventName, properties, options);
}
