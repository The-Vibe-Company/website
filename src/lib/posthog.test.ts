import { describe, expect, spyOn, test } from "bun:test";
import type { PostHog } from "posthog-js";

import { createPostHogQueue, type EventProperties, type PostHogQueueOptions } from "./posthog";

type Sent = {
  event: string;
  properties: EventProperties | undefined;
  timestamp: Date | undefined;
  /** What the address bar showed when posthog-js got the event. */
  shownUrl: string;
};

const SITE = "https://www.thevibecompany.co";

/**
 * A visitor whose URL changes the way a client-side navigation changes it,
 * and the address bar the queue may briefly rewrite.
 */
function fakeLocation(path = "/fr") {
  const location = { href: `${SITE}${path}` };
  const urlChanges: string[] = [];
  const browserUrl = {
    get: () => location.href,
    set: (url: string) => {
      urlChanges.push(url);
      location.href = url;
    },
  };
  const navigate = (to: string) => {
    location.href = `${SITE}${to}`;
  };
  const pageContext = () => ({
    $current_url: location.href,
    $host: "www.thevibecompany.co",
    $pathname: new URL(location.href).pathname,
  });
  return { location, urlChanges, browserUrl, navigate, pageContext };
}

function fakePostHog(shownUrl: () => string = () => "") {
  const sent: Sent[] = [];
  const initializedAt: string[] = [];
  const posthog = {
    init: () => {
      initializedAt.push(shownUrl());
    },
    capture: (event: string, properties?: EventProperties, options?: { timestamp?: Date }) => {
      sent.push({ event, properties, timestamp: options?.timestamp, shownUrl: shownUrl() });
      return undefined;
    },
  } as unknown as PostHog;
  return { posthog, sent, initializedAt };
}

function queueWith(options: Partial<PostHogQueueOptions> & Pick<PostHogQueueOptions, "importPostHog">) {
  const delays: number[] = [];
  const queue = createPostHogQueue({
    initPostHog: (posthog) => posthog.init("phc_test"),
    pageContext: () => ({}),
    browserUrl: { get: () => "", set: () => {} },
    wait: async (ms) => {
      delays.push(ms);
    },
    ...options,
  });
  return { ...queue, delays };
}

describe("events queued before PostHog loads", () => {
  test("keep the URL of the page they happened on, not the page they are sent from", async () => {
    const { navigate, pageContext, browserUrl } = fakeLocation("/fr");
    const { posthog, sent } = fakePostHog(browserUrl.get);
    const queue = queueWith({ importPostHog: async () => posthog, pageContext, browserUrl });

    queue.capture("$pageview", { $current_url: `${SITE}/fr`, $pathname: "/fr" });
    queue.capture("cta_clicked", { cta: "hero" });
    navigate("/fr/resources?tag=ai");
    queue.capture("$pageview", { $current_url: `${SITE}/fr/resources?tag=ai`, $pathname: "/fr/resources" });
    navigate("/fr/contact");
    await queue.load();

    expect(sent.map(({ event, properties }) => [event, properties?.$current_url, properties?.$pathname])).toEqual([
      ["$pageview", `${SITE}/fr`, "/fr"],
      ["cta_clicked", `${SITE}/fr`, "/fr"],
      ["$pageview", `${SITE}/fr/resources?tag=ai`, "/fr/resources"],
    ]);
    expect(sent[1].properties).toEqual({
      $current_url: `${SITE}/fr`,
      $host: "www.thevibecompany.co",
      $pathname: "/fr",
      cta: "hero",
    });
  });

  // posthog-js reads location itself for campaign params, the session entry
  // URL and the previous pageview, so the address bar has to agree too.
  test("are replayed with the address bar on their own page, then put back", async () => {
    const { navigate, pageContext, browserUrl, location, urlChanges } = fakeLocation("/fr?utm_source=linkedin");
    const { posthog, sent, initializedAt } = fakePostHog(browserUrl.get);
    const queue = queueWith({ importPostHog: async () => posthog, pageContext, browserUrl });

    queue.capture("$pageview");
    queue.capture("cta_clicked");
    navigate("/fr/resources");
    queue.capture("$pageview");
    navigate("/fr/contact");
    await queue.load();

    expect(initializedAt).toEqual([`${SITE}/fr?utm_source=linkedin`]);
    expect(sent.map(({ event, shownUrl }) => [event, shownUrl])).toEqual([
      ["$pageview", `${SITE}/fr?utm_source=linkedin`],
      ["cta_clicked", `${SITE}/fr?utm_source=linkedin`],
      ["$pageview", `${SITE}/fr/resources`],
    ]);
    expect(location.href).toBe(`${SITE}/fr/contact`);
    expect(urlChanges).toEqual([
      `${SITE}/fr?utm_source=linkedin`,
      `${SITE}/fr/contact`,
      `${SITE}/fr?utm_source=linkedin`,
      `${SITE}/fr/resources`,
      `${SITE}/fr/contact`,
    ]);
  });

  test("are still sent when the address bar cannot be rewritten", async () => {
    const { navigate, pageContext, location } = fakeLocation("/fr");
    const { posthog, sent } = fakePostHog();
    const browserUrl = {
      get: () => location.href,
      set: () => {
        throw new DOMException("Too many calls", "SecurityError");
      },
    };
    const queue = queueWith({ importPostHog: async () => posthog, pageContext, browserUrl });

    queue.capture("$pageview");
    navigate("/fr/resources");
    await queue.load();

    expect(sent.map(({ properties }) => properties?.$pathname)).toEqual(["/fr"]);
  });

  test("keep the time they happened at", async () => {
    const { posthog, sent } = fakePostHog();
    const queue = queueWith({ importPostHog: async () => posthog });
    const clickedAt = new Date("2026-11-02T10:00:00Z");

    queue.capture("cta_clicked", undefined, { timestamp: clickedAt });
    queue.capture("booking_opened");
    await queue.load();

    expect(sent[0].timestamp).toBe(clickedAt);
    expect(sent[1].timestamp).toBeInstanceOf(Date);
  });

  test("go straight to PostHog once it is loaded, which reads the URL itself", async () => {
    const { pageContext, browserUrl, urlChanges } = fakeLocation("/fr");
    const { posthog, sent } = fakePostHog();
    const queue = queueWith({ importPostHog: async () => posthog, pageContext, browserUrl });

    await queue.load();
    queue.capture("cta_clicked", { cta: "hero" });

    expect(sent).toEqual([{ event: "cta_clicked", properties: { cta: "hero" }, timestamp: undefined, shownUrl: "" }]);
    expect(urlChanges).toEqual([]);
  });

  test("are capped, keeping the oldest", async () => {
    const { posthog, sent } = fakePostHog();
    const queue = queueWith({ importPostHog: async () => posthog, maxPending: 2 });

    for (const event of ["$pageview", "first_click", "second_click", "third_click"]) queue.capture(event);
    await queue.load();

    expect(sent.map(({ event }) => event)).toEqual(["$pageview", "first_click"]);
  });
});

describe("loading PostHog", () => {
  test("retries a failed import with backoff, then sends the queue", async () => {
    const { posthog, sent } = fakePostHog();
    let calls = 0;
    const queue = queueWith({
      importPostHog: async () => {
        calls++;
        if (calls < 3) throw new Error("ChunkLoadError");
        return posthog;
      },
    });

    queue.capture("$pageview");
    expect(await queue.load()).toBe(posthog);

    expect(calls).toBe(3);
    expect(queue.delays).toEqual([1000, 2000]);
    expect(sent.map(({ event }) => event)).toEqual(["$pageview"]);
  });

  test("retries when initialization throws", async () => {
    const { posthog, sent } = fakePostHog();
    let inits = 0;
    const queue = queueWith({
      importPostHog: async () => posthog,
      initPostHog: () => {
        inits++;
        if (inits === 1) throw new Error("init failed");
      },
    });

    queue.capture("$pageview");
    expect(await queue.load()).toBe(posthog);

    expect(inits).toBe(2);
    expect(sent.map(({ event }) => event)).toEqual(["$pageview"]);
  });

  test("gives up after the last attempt, drops the queue and ignores later events", async () => {
    let calls = 0;
    const queue = queueWith({
      importPostHog: async () => {
        calls++;
        throw new Error("ChunkLoadError");
      },
    });
    const warn = spyOn(console, "warn").mockImplementation(() => {});

    try {
      queue.capture("$pageview");
      expect(await queue.load()).toBeNull();
      queue.capture("cta_clicked");
      expect(await queue.load()).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }

    expect(calls).toBe(3);
    expect(queue.delays).toEqual([1000, 2000]);
  });

  test("shares one load between concurrent callers", async () => {
    const { posthog } = fakePostHog();
    let calls = 0;
    const queue = queueWith({
      importPostHog: async () => {
        calls++;
        return posthog;
      },
    });

    const [first, second] = await Promise.all([queue.load(), queue.load()]);

    expect(first).toBe(posthog);
    expect(second).toBe(posthog);
    expect(calls).toBe(1);
  });
});
