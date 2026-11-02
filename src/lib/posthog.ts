import type { CaptureOptions, PostHog } from "posthog-js";

/**
 * PostHog only runs on the production deployment. `NEXT_PUBLIC_VERCEL_ENV` is
 * inlined from Vercel's `VERCEL_ENV` in next.config.ts, so local dev, preview
 * deployments and CI builds never initialize it, even when a key is present.
 * Every capture below is a no-op in that case.
 */
export const isPostHogEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

let client: Promise<PostHog> | undefined;
let startLoading: (() => void) | undefined;

/**
 * posthog-js is ~56 KB of compressed script. Imported statically it sat in the
 * first chunks of every page and ran before hydration, so on a phone the
 * download held back the hero's paint (it was most of the homepage's LCP in
 * Lighthouse). It is now fetched once the page has loaded and the main thread
 * is idle, or as soon as an event needs it, whichever comes first. Events
 * captured before then wait for it instead of being dropped.
 */
function posthogClient(): Promise<PostHog> | undefined {
  if (!isPostHogEnabled || typeof window === "undefined") return undefined;
  client ??= new Promise<void>((resolve) => {
    startLoading = resolve;
  })
    .then(() => import("posthog-js"))
    .then(({ default: posthog }) => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: "2026-01-30",
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: "identified_only",
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      });
      return posthog;
    });
  return client;
}

/** Loads PostHog now rather than at the next idle moment. */
function loadPostHogNow() {
  posthogClient();
  startLoading?.();
}

/** Schedules PostHog for after the load event, off the critical path. */
export function loadPostHogWhenIdle() {
  if (!posthogClient()) return;
  // Safari has no requestIdleCallback.
  const whenIdle = () =>
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(loadPostHogNow, { timeout: 3000 })
      : window.setTimeout(loadPostHogNow, 1);
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
  options?: CaptureOptions,
) {
  const pending = posthogClient();
  if (!pending) return;
  // A click on a booking CTA can come before the idle moment: start the load
  // right away so the event still has a chance to leave before navigation.
  loadPostHogNow();
  void pending.then((posthog) => posthog.capture(eventName, properties, options));
}

/**
 * The pageview fires on every route mount, hydration included, so it waits for
 * the scheduled load instead of forcing it: forcing it would put PostHog back
 * in front of the first paint.
 */
export function capturePageview(url: string) {
  void posthogClient()?.then((posthog) => posthog.capture("$pageview", { $current_url: url }));
}
