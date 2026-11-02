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

type Properties = Record<string, string | number | boolean | null | undefined>;

let client: Promise<PostHog> | undefined;
let startLoading: (() => void) | undefined;
let loadRequested = false;

/**
 * posthog-js is ~56 KB of compressed script. Imported statically it sat in the
 * first chunks of every page and ran before hydration, so on a phone the
 * download held back the hero's paint (it was most of the homepage's LCP in
 * Lighthouse). It is now fetched at the visitor's first interaction, once the
 * page has loaded and the main thread is idle, or as soon as an event needs
 * it, whichever comes first. Events captured before then wait for it.
 */
function posthogClient(): Promise<PostHog> | undefined {
  if (!isPostHogEnabled || typeof window === "undefined") return undefined;
  if (!client) {
    const gate = new Promise<void>((resolve) => {
      startLoading = resolve;
    });
    if (loadRequested) startLoading?.();
    client = gate
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
      })
      .catch((error: unknown) => {
        // A failed download (offline, a deploy replacing the chunk) would
        // otherwise turn analytics off for the rest of the visit.
        client = undefined;
        throw error;
      });
  }
  return client;
}

/** Loads PostHog now rather than at the next idle moment. */
function loadPostHogNow() {
  loadRequested = true;
  posthogClient();
  startLoading?.();
}

/**
 * Schedules PostHog off the critical path: after the load event and an idle
 * moment, or at the first pointer or key press, which comes before the click
 * of a booking CTA that navigates away.
 */
export function loadPostHogWhenIdle() {
  if (!posthogClient()) return;
  for (const type of ["pointerdown", "keydown"] as const) {
    window.addEventListener(type, loadPostHogNow, { once: true, capture: true, passive: true });
  }
  // Safari has no requestIdleCallback.
  const whenIdle = () =>
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(loadPostHogNow, { timeout: 3000 })
      : window.setTimeout(loadPostHogNow, 1);
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

/**
 * Captures once PostHog is there. PostHog reads the URL and the time when the
 * event is sent, so both are pinned here: a queued event keeps the page and
 * the moment it happened on, even after a client-side navigation.
 */
function enqueue(eventName: string, properties: Properties | undefined, options: CaptureOptions | undefined) {
  const pending = posthogClient();
  if (!pending) return;
  const pinned = {
    $current_url: window.location.href,
    $pathname: window.location.pathname,
    ...properties,
  };
  const timestamp = options?.timestamp ?? new Date();
  pending.then(
    (posthog) => posthog.capture(eventName, pinned, { ...options, timestamp }),
    // Analytics is best effort: a failed load drops this event, not the page.
    () => undefined,
  );
}

export function captureEvent(eventName: string, properties?: Properties, options?: CaptureOptions) {
  if (!isPostHogEnabled) return;
  enqueue(eventName, properties, options);
  // A click on a booking CTA can come before the idle moment: start the load
  // right away so the event still has a chance to leave before navigation.
  loadPostHogNow();
}

/**
 * The pageview fires on every route mount, hydration included, so it waits for
 * the scheduled load instead of forcing it: forcing it would put PostHog back
 * in front of the first paint.
 */
export function capturePageview(url: string) {
  enqueue("$pageview", { $current_url: url }, undefined);
}
