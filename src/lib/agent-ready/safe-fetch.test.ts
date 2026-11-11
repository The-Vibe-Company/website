import { expect, test, spyOn } from "bun:test";
import http from "node:http";
import { PassThrough } from "node:stream";
import { requestPinned, MAX_BODY_BYTES, type Resource } from "./safe-fetch";
import * as checks from "./checks";

// Mock the native transport boundary so oversized chunks exercise the real
// collector and socket teardown, without DNS or external network access.
async function collect(body: string, chunks = [Buffer.from(body)]): Promise<Resource> {
  const response = Object.assign(new PassThrough(), {
    statusCode: 200, headers: { "content-type": "text/html", "x-fixture": "retained" },
  });
  const request = Object.assign(new PassThrough(), {
    end() {
      queueMicrotask(() => {
        callback(response);
        for (const chunk of chunks) {
          if (response.destroyed) break;
          response.write(chunk);
        }
        if (!response.destroyed) response.end();
      });
      return this;
    },
  });
  let callback: (res: typeof response) => void;
  const mock = spyOn(http, "request").mockImplementation(((_url: unknown, _options: unknown, cb: typeof callback) => {
    callback = cb;
    return request;
  }) as unknown as typeof http.request);
  try {
    const result = await requestPinned(new URL("http://example.test/"), "8.8.8.8", {}, new AbortController().signal);
    if (result.truncated) {
      expect(response.destroyed).toBe(true);
      expect(request.destroyed).toBe(true);
    }
    expect(result.status).toBe(200);
    expect(result.headers["x-fixture"]).toBe("retained");
    return result;
  } finally { mock.mockRestore(); }
}

test("oversized single and multi-chunk responses resolve with exactly the bounded prefix", async () => {
  const body = "x".repeat(MAX_BODY_BYTES + 500);
  for (const chunks of [
    [Buffer.from(body)],
    [Buffer.from(body.slice(0, 100)), Buffer.from(body.slice(100))],
  ]) {
    const r = await collect(body, chunks);
    expect(r.body).toBe(body.slice(0, MAX_BODY_BYTES));
    expect(Buffer.byteLength(r.body)).toBe(MAX_BODY_BYTES);
    expect(r.truncated).toBe(true);
  }
});
test("short responses remain complete; reaching the cap stops immediately", async () => {
  expect((await collect("fixture")).truncated).toBe(false);
  expect((await collect("x".repeat(MAX_BODY_BYTES))).truncated).toBe(true);
});
test("truncated HTML and bot responses remain usable, but challenges still fail", async () => {
  const r = await collect("<h1>Welcome</h1><main>" + "visible content ".repeat(MAX_BODY_BYTES / 8));
  expect(checks.rawHtmlContent(r).status).toBe("pass");
  expect((await checks.aiBotAccess(async () => r)).status).toBe("pass");
  expect((await checks.aiBotAccess(async () => ({ ...r, body: "Just a moment" }))).status).toBe("fail");
});
test("truncated sitemap XML is accepted, HTML is not", async () => {
  const r = await collect('<?xml version="1.0"?><sitemapindex>' + " ".repeat(MAX_BODY_BYTES));
  expect((await checks.sitemap(async () => ({ ...r, headers: { "content-type": "application/xml" } }), null)).status).toBe("pass");
  expect((await checks.sitemap(async () => r, null)).status).toBe("fail");
});
test("truncated robots, llms and JSON discovery fail explicitly even with a valid prefix", async () => {
  const r = await collect('{"ok":true}' + " ".repeat(MAX_BODY_BYTES));
  const json = { ...r, headers: { "content-type": "application/json" } };
  for (const check of [checks.mcpServerCard, checks.a2aAgentCard, checks.agentSkills, checks.oauthDiscovery, checks.oauthProtectedResource, checks.apiCatalog]) {
    const result = await check(async () => check === checks.apiCatalog
      ? { ...json, headers: { "content-type": "application/linkset+json" } } : json);
    expect(result.status).toBe("fail");
    expect(result.details).toContain("response too large");
  }
  const text = { ...r, headers: { "content-type": "text/plain" }, body: "# Site\nUser-agent: *\nAllow: /\nContent-Signal: ai-input=yes" };
  for (const result of [checks.robotsTxt(text), checks.robotsAiRules(text), checks.contentSignal(text), await checks.llmsTxt(async () => text)]) {
    expect(result.status).toBe("fail");
    expect(result.details).toContain("response too large");
  }
});
