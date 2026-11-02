import { schedulePostHogLoad } from "@/lib/posthog";

// PostHog is loaded after the page has painted, not imported here: see
// schedulePostHogLoad() in src/lib/posthog.ts.
schedulePostHogLoad();
