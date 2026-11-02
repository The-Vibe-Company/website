import { describe, expect, spyOn, test } from "bun:test";
import type { PostHog } from "posthog-js";

import { createPostHogQueue, type EventProperties, type PostHogQueueOptions } from "./posthog";

type Sent = { event: string; properties: EventProperties | undefined; timestamp: Date | undefined };

function fakePostHog() {
  const sent: Sent[] = [];
  const posthog = {
    capture: (event: string, properties?: EventProperties, options?: { timestamp?: Date }) => {
      sent.push({ event, properties, timestamp: options?.timestamp });
      return undefined;
    },
  } as unknown as PostHog;
  return { posthog, sent };
}

/** A visitor whose URL changes the way a client-side navigation changes it. */
function fakeLocation(path: string) {
  const location = { path };
  const pageContext = () => ({
    $current_url: `https://www.thevibecompany.co${location.path}`,
    $host: "www.thevibecompany.co",
    $pathname: location.path.split("?")[0],
  });
  return { location, pageContext };
}

function queueWith(options: Partial<PostHogQueueOptions> & Pick<PostHogQueueOptions, "importPostHog">) {
  const delays: number[] = [];
  const queue = createPostHogQueue({
    pageContext: () => ({}),
    wait: async (ms) => {
      delays.push(ms);
    },
    ...options,
  });
  return { ...queue, delays };
}

describe("events queued before PostHog loads", () => {
  test("keep the URL of the page they happened on, not the page they are sent from", async () => {
    const { posthog, sent } = fakePostHog();
    const { location, pageContext } = fakeLocation("/fr");
    const queue = queueWith({ importPostHog: async () => posthog, pageContext });

    queue.capture("$pageview", { $current_url: "https://www.thevibecompany.co/fr", $pathname: "/fr" });
    queue.capture("cta_clicked", { cta: "hero" });
    location.path = "/fr/resources?tag=ai";
    queue.capture("$pageview", {
      $current_url: "https://www.thevibecompany.co/fr/resources?tag=ai",
      $pathname: "/fr/resources",
    });
    location.path = "/fr/contact";
    await queue.load();

    expect(sent.map(({ event, properties }) => [event, properties?.$current_url, properties?.$pathname])).toEqual([
      ["$pageview", "https://www.thevibecompany.co/fr", "/fr"],
      ["cta_clicked", "https://www.thevibecompany.co/fr", "/fr"],
      ["$pageview", "https://www.thevibecompany.co/fr/resources?tag=ai", "/fr/resources"],
    ]);
    expect(sent[1].properties).toEqual({
      $current_url: "https://www.thevibecompany.co/fr",
      $host: "www.thevibecompany.co",
      $pathname: "/fr",
      cta: "hero",
    });
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
    const { posthog, sent } = fakePostHog();
    const { pageContext } = fakeLocation("/fr");
    const queue = queueWith({ importPostHog: async () => posthog, pageContext });

    await queue.load();
    queue.capture("cta_clicked", { cta: "hero" });

    expect(sent).toEqual([{ event: "cta_clicked", properties: { cta: "hero" }, timestamp: undefined }]);
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
