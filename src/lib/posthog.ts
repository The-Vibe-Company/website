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

export type EventProperties = Record<string, string | number | boolean | null | undefined>;

type QueuedCapture = [eventName: string, properties: EventProperties, options: CaptureOptions];

export type BrowserUrl = { get: () => string; set: (url: string) => void };

export type PostHogQueueOptions = {
  /** Fetches posthog-js. Retried, with `initPostHog`, when either throws. */
  importPostHog: () => Promise<PostHog>;
  initPostHog: (posthog: PostHog) => void;
  /** Where the visitor is right now, stamped on events that have to wait. */
  pageContext?: () => EventProperties;
  browserUrl?: BrowserUrl;
  maxAttempts?: number;
  /** Delay before the second attempt, doubled before each following one. */
  retryDelayMs?: number;
  maxPending?: number;
  wait?: (ms: number) => Promise<void>;
};

/**
 * The URL posthog-js would read itself if it were loaded. A queued event is
 * sent later, possibly after a client-side navigation, so it carries these
 * instead of the URL at send time. `$referrer` is left out: posthog-js takes
 * it from the session, not the event, and it does not change on client-side
 * navigations anyway.
 */
export function currentPageContext(): EventProperties {
  if (typeof window === "undefined") return {};
  const { href, host, pathname } = window.location;
  return { $current_url: href, $host: host, $pathname: pathname };
}

/**
 * posthog-js also reads `location` on its own when it initializes and sends:
 * campaign parameters (utm_*, gclid...), the session entry URL, the person's
 * initial URL, `$prev_pageview_pathname`. So queued events are replayed with
 * the address bar briefly set back to the URL each one happened on, then
 * restored, all in the same task. The native replaceState is called rather
 * than the one Next.js patches, so the router never sees it. Only the `title`
 * posthog-js stamps on a `$pageview` still comes from the page on screen.
 */
const addressBar: BrowserUrl = {
  get: () => location.href,
  set: (url) => History.prototype.replaceState.call(history, history.state, "", url),
};

const MAX_REPLAYED_URLS = 5;

/**
 * Captures go to `pending` with their own timestamp and URL until posthog-js
 * is in; then they are replayed in order and later ones go out synchronously,
 * which matters for clicks that navigate the tab away.
 *
 * A failed load (flaky network, chunk evicted by a deploy) is retried a few
 * times with backoff. After the last attempt the queue is dropped and captures
 * become no-ops for the rest of the page, so nothing grows or loops forever.
 * The queue itself is capped and keeps the oldest events, which include the
 * landing `$pageview`.
 */
export function createPostHogQueue({
  importPostHog,
  initPostHog,
  pageContext = currentPageContext,
  browserUrl = addressBar,
  maxAttempts = 3,
  retryDelayMs = 1000,
  maxPending = 100,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}: PostHogQueueOptions) {
  let loading: Promise<PostHog | null> | null = null;
  let loaded: PostHog | null = null;
  let abandoned = false;
  const pending: QueuedCapture[] = [];

  // Runs `send` with the address bar showing the URL of each event it is
  // handed, starting with the oldest one, and restores the real URL after.
  // Browsers throttle replaceState (Safari throws past ~100 calls in 10 s),
  // so a queue spanning many pages is sent without the rewrite: its events
  // still carry their own $current_url and $pathname.
  function atUrlsOf(events: QueuedCapture[], send: (showUrlOf: (event: QueuedCapture) => void) => void) {
    const urls = new Set(events.map(([, properties]) => properties.$current_url));
    if (events.length === 0 || urls.size > MAX_REPLAYED_URLS) return send(() => {});
    const actualUrl = browserUrl.get();
    let shownUrl = actualUrl;
    const show = (url: unknown) => {
      if (typeof url !== "string" || url === shownUrl) return;
      try {
        browserUrl.set(url);
      } catch {
        // Same fallback as a long queue: the event carries its own URL.
      }
      // Read back: Chrome ignores throttled calls without throwing.
      shownUrl = browserUrl.get();
    };
    try {
      show(events[0][1].$current_url);
      send((event) => show(event[1].$current_url));
    } finally {
      // Tried twice: a tab left on an old URL breaks reloads and shared links.
      for (let tries = 0; tries < 2 && shownUrl !== actualUrl; tries++) show(actualUrl);
      if (shownUrl !== actualUrl) console.warn(`PostHog could not restore the address bar to ${actualUrl}.`);
    }
  }

  async function importWithRetry(): Promise<PostHog | null> {
    for (let attempt = 1; ; attempt++) {
      try {
        const posthog = await importPostHog();
        atUrlsOf(pending, () => initPostHog(posthog));
        return posthog;
      } catch (error) {
        if (attempt >= maxAttempts) {
          console.warn(`PostHog failed to load after ${attempt} attempts, analytics are off for this page.`, error);
          return null;
        }
        await wait(retryDelayMs * 2 ** (attempt - 1));
      }
    }
  }

  function load(): Promise<PostHog | null> {
    loading ??= importWithRetry().then((posthog) => {
      if (!posthog) {
        abandoned = true;
        pending.length = 0;
        return null;
      }
      const queued = pending.splice(0);
      loaded = posthog;
      atUrlsOf(queued, (showUrlOf) => {
        for (const event of queued) {
          showUrlOf(event);
          try {
            posthog.capture(...event);
          } catch {
            // One bad event must not hold back the rest of the queue.
          }
        }
      });
      return posthog;
    });
    return loading;
  }

  function capture(eventName: string, properties?: EventProperties, options?: CaptureOptions) {
    if (loaded) {
      loaded.capture(eventName, properties, options);
      return;
    }
    if (abandoned || pending.length >= maxPending) return;
    pending.push([
      eventName,
      { ...pageContext(), ...properties },
      { ...options, timestamp: options?.timestamp ?? new Date() },
    ]);
  }

  return { load, capture };
}

// posthog-js weighs ~57 KB gzipped. It is fetched on demand rather than
// bundled with the page, so it never competes with the first paint: see
// schedulePostHogLoad().
//
// Turbopack remembers a chunk that failed to load and rejects every later
// import() of it without going back to the network, so once the bundled chunk
// has failed the retries load PostHog's own build through the /ingest proxy
// instead.
let bundledChunkFailed = false;

const queue = createPostHogQueue({
  importPostHog: () => (bundledChunkFailed ? loadPostHogScript() : importBundledPostHog()),
  initPostHog: (posthog) => {
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
  },
});

async function importBundledPostHog(): Promise<PostHog> {
  try {
    return (await import("posthog-js")).default;
  } catch (error) {
    bundledChunkFailed = true;
    throw error;
  }
}

function loadPostHogScript(): Promise<PostHog> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/ingest/static/array.js";
    script.async = true;
    script.onload = () => {
      const { posthog } = window as Window & { posthog?: PostHog };
      if (posthog) resolve(posthog);
      else reject(new Error("/ingest/static/array.js did not define window.posthog"));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("Failed to load /ingest/static/array.js"));
    };
    document.head.append(script);
  });
}

export const loadPostHog = queue.load;

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

export function captureEvent(eventName: string, properties?: EventProperties, options?: CaptureOptions) {
  if (!isPostHogEnabled) return;
  queue.capture(eventName, properties, options);
}
