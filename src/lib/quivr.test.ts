import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  formatStars,
  formatStarsCompact,
  getQuivrStars,
  parseStargazers,
} from "./quivr";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function stubFetch(impl: (input: RequestInfo | URL) => Promise<Response>) {
  const fn = mock(impl);
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe("parseStargazers", () => {
  test("reads the count from a GitHub repository payload", () => {
    expect(parseStargazers({ stargazers_count: 39587 })).toBe(39587);
  });

  test("rejects anything that is not a non-negative integer", () => {
    expect(parseStargazers(null)).toBeNull();
    expect(parseStargazers({})).toBeNull();
    expect(parseStargazers({ stargazers_count: "39587" })).toBeNull();
    expect(parseStargazers({ stargazers_count: -1 })).toBeNull();
    expect(parseStargazers({ stargazers_count: 1.5 })).toBeNull();
  });
});

describe("getQuivrStars", () => {
  test("returns the live count", async () => {
    const fetchMock = stubFetch(async () =>
      Response.json({ stargazers_count: 39587 }),
    );
    expect(await getQuivrStars()).toBe(39587);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://api.github.com/repos/The-Vibe-Company/quivr",
    );
  });

  test("returns null when GitHub refuses (rate limit)", async () => {
    stubFetch(async () => new Response("rate limited", { status: 403 }));
    expect(await getQuivrStars()).toBeNull();
  });

  test("returns null when the network fails", async () => {
    stubFetch(async () => {
      throw new Error("offline");
    });
    expect(await getQuivrStars()).toBeNull();
  });
});

describe("formatStars", () => {
  test("prints the exact live count in the reader's locale", () => {
    expect(formatStars(39587, "en")).toBe("39,587");
    expect(formatStars(39587, "fr").replace(/\s/g, " ")).toBe("39 587");
  });

  test("falls back to a floor, never a made-up exact figure", () => {
    expect(formatStars(null, "en")).toBe("39k+");
    expect(formatStarsCompact(null, "fr")).toBe("39k+");
  });

  test("compacts the count for running text", () => {
    expect(formatStarsCompact(39587, "en")).toBe("39.6K");
  });
});
