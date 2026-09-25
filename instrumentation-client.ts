import posthog from "posthog-js";
import { isPostHogEnabled } from "@/lib/posthog";

if (isPostHogEnabled) {
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

  // Team opt-out so our own visits never pollute the metrics. Preview deploys are
  // already excluded upstream (see lib/posthog), but our visits to the *production*
  // site would still be counted. A team member opens any page once per browser with
  // ?ph_optout to exclude that browser from all capture for good (PostHog persists
  // the choice); ?ph_optin re-enables it.
  const params = new URLSearchParams(window.location.search);
  if (params.has("ph_optout")) {
    posthog.opt_out_capturing();
  } else if (params.has("ph_optin")) {
    posthog.opt_in_capturing();
  }
}
