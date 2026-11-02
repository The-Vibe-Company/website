import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";

// The loader reads the build-time flags when it is imported, and the browser
// globals when it runs: both are faked before the module is loaded, and put
// back afterwards for the other test files sharing this process.
const originalEnv = {
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
};
process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";

const listeners = new Map<string, () => void>();
const location = { href: "https://example.test/fr", pathname: "/fr" };
Object.assign(globalThis, {
  window: {
    location,
    addEventListener: (type: string, fn: () => void) => listeners.set(type, fn),
    requestIdleCallback: (fn: () => void) => fn(),
    setTimeout,
  },
  document: { readyState: "loading" },
});

const init = mock(() => {});
const capture = mock((...args: unknown[]) => void args);
mock.module("posthog-js", () => ({ default: { init, capture } }));

let posthog: typeof import("./posthog");
beforeAll(async () => {
  posthog = await import("./posthog");
});

afterAll(() => {
  const globals = globalThis as { window?: unknown; document?: unknown };
  delete globals.window;
  delete globals.document;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

/** A new copy of the module, with its own loader state. */
const freshLoader = (tag: string): Promise<typeof import("./posthog")> => import(`./posthog?${tag}`);

const flush = () => new Promise((resolve) => setTimeout(resolve, 10));

describe("lazy PostHog loader", () => {
  beforeEach(() => {
    init.mockClear();
    capture.mockClear();
  });

  test("a pageview waits for the scheduled load, then keeps its own URL and time", async () => {
    posthog.loadPostHogWhenIdle();
    const queuedAt = Date.now();
    posthog.capturePageview("https://example.test/fr");
    location.href = "https://example.test/fr/portfolio";
    location.pathname = "/fr/portfolio";
    await flush();
    expect(capture).not.toHaveBeenCalled();

    listeners.get("load")?.();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    const [event, properties, options] = capture.mock.calls[0] as [string, Record<string, unknown>, { timestamp: Date }];
    expect(event).toBe("$pageview");
    expect(properties.$current_url).toBe("https://example.test/fr");
    expect(properties.$pathname).toBe("/fr");
    expect(options.timestamp.getTime()).toBeGreaterThanOrEqual(queuedAt);
    expect(options.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test("events go out in the order they were captured, options kept", async () => {
    posthog.captureEvent("first", { location: "hero" });
    posthog.captureEvent("second", undefined, { send_instantly: true });
    await flush();
    expect(capture.mock.calls.map((call) => call[0])).toEqual(["first", "second"]);
    expect((capture.mock.calls[1][2] as { send_instantly: boolean }).send_instantly).toBe(true);
    expect(init).not.toHaveBeenCalled();
  });
});

describe("lazy PostHog loader, fresh instances", () => {
  beforeEach(() => {
    init.mockClear();
    capture.mockClear();
    listeners.clear();
  });

  test("the first pointer press starts the load", async () => {
    const fresh = await freshLoader("pointer");
    fresh.loadPostHogWhenIdle();
    fresh.capturePageview("https://example.test/en");
    await flush();
    expect(init).not.toHaveBeenCalled();

    listeners.get("pointerdown")?.();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls.map((call) => call[0])).toEqual(["$pageview"]);
  });

  // Bun caches a mocked module, so the failure is raised by init(), which
  // fails the same promise a broken chunk download would.
  test("a failed load is retried by the next event", async () => {
    const fresh = await freshLoader("retry");
    init.mockImplementationOnce(() => {
      throw new Error("chunk load failed");
    });
    fresh.captureEvent("lost");
    await flush();
    expect(capture).not.toHaveBeenCalled();

    fresh.captureEvent("kept");
    await flush();
    expect(capture.mock.calls.map((call) => call[0])).toEqual(["kept"]);
  });

  test("does nothing outside production", async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    const fresh = await freshLoader("preview");
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(fresh.isPostHogEnabled).toBe(false);
    fresh.loadPostHogWhenIdle();
    fresh.captureEvent("ignored");
    fresh.capturePageview("https://example.test/fr");
    await flush();
    expect(listeners.size).toBe(0);
    expect(init).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });
});
