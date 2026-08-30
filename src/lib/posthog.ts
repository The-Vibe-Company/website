import posthog from "posthog-js";

// We only want real production traffic in PostHog. Vercel preview deployments
// (`*.vercel.app`, one per branch) were sending events to the same project and
// polluting analytics with our own editing traffic: on a recent 7-day window,
// previews accounted for ~60% of page views. We gate on two independent signals
// so a single missing/renamed variable can never silently kill production events:
//  1. Vercel exposes the deployment target client-side as NEXT_PUBLIC_VERCEL_ENV
//     ("production" | "preview" | "development"). We disable on preview/development.
//  2. As a belt-and-suspenders runtime check, we also disable on any *.vercel.app
//     host. When the env var is absent (self-host/local) and the host is not a
//     preview, we fall open so production is never accidentally muted.
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
const isNonProductionDeploy =
  vercelEnv === "preview" || vercelEnv === "development";
const isPreviewHost =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith(".vercel.app");

export const isPostHogEnabled =
  Boolean(posthogKey) && !isNonProductionDeploy && !isPreviewHost;

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (!isPostHogEnabled) return;
  posthog.capture(eventName, properties);
}
