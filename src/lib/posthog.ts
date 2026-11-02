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

// posthog-js weighs ~57 KB gzipped. It is fetched on demand rather than
// bundled with the page, so it never competes with the first paint: see
// schedulePostHogLoad(). Until then captures wait in `pending` with their own
// timestamp; once it is in they go out synchronously, which matters for
// clicks that navigate the tab away.
let loading: Promise<PostHog> | null = null;
let loaded: PostHog | null = null;
const pending: Parameters<PostHog["capture"]>[] = [];

export function loadPostHog(): Promise<PostHog> {
  loading ??= import("posthog-js").then(({ default: posthog }) => {
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
    loaded = posthog;
    for (const args of pending.splice(0)) posthog.capture(...args);
    return posthog;
  });
  return loading;
}

/**
 * Loads PostHog once the page has finished loading and the main thread is
 * idle, or at the first interaction if that comes sooner. Events captured
 * before then wait for it instead of being dropped.
 */
export function schedulePostHogLoad() {
  if (!isPostHogEnabled || typeof window === "undefined") return;

  const load = () => {
    for (const type of INTERACTIONS) removeEventListener(type, load, true);
    void loadPostHog();
  };
  const loadWhenIdle = () => {
    if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 2000 });
    else setTimeout(load, 1);
  };

  for (const type of INTERACTIONS) addEventListener(type, load, { capture: true, once: true, passive: true });
  if (document.readyState === "complete") loadWhenIdle();
  else addEventListener("load", loadWhenIdle, { once: true });
}

const INTERACTIONS = ["pointerdown", "keydown", "scroll"] as const;

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
  options?: CaptureOptions,
) {
  if (!isPostHogEnabled) return;
  if (loaded) {
    loaded.capture(eventName, properties, options);
    return;
  }
  pending.push([eventName, properties, { ...options, timestamp: options?.timestamp ?? new Date() }]);
}
