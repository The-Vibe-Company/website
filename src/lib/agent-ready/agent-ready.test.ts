import { describe, test, expect } from "bun:test";
import { normalizeUrl, vetUrl, safeFetch, isPublicAddress, type Resource } from "./safe-fetch";
import { parseRobots, botAllowed } from "./robots";
import { score } from "./scoring";
import type { Check } from "./types";
import { robotsTxt, rawHtmlContent, aiBotAccess } from "./checks";

describe("SSRF guard (offline)", () => {
  for (const input of ["http://127.0.0.1", "http://localhost", "http://0.0.0.0",
    "http://169.254.169.254", "http://10.1.2.3", "http://172.16.0.1", "http://192.168.1.1",
    "http://100.64.0.1", "http://[::1]", "http://[fe80::1]", "http://[fc00::1]",
    "http://[::ffff:127.0.0.1]", "http://2130706433", "http://0x7f000001",
    "http://017700000001", "https://example.com:8080", "https://example.com:22",
    "ftp://example.com", "file:///etc/passwd", "https://user:pass@example.com",
    "https://8.8.8.8"]) {
    test(input, () => expect(() => normalizeUrl(input)).toThrow());
  }
  test("normalization drops path and query", () => expect(normalizeUrl("example.com/a?b=2").href).toBe("https://example.com/"));
  for (const ip of ["127.0.0.1", "0.1.2.3", "169.254.169.254", "10.1.1.1", "172.31.0.1",
    "192.168.0.1", "100.127.1.1", "224.1.1.1", "255.255.255.255", "198.18.0.1",
    "192.0.2.1", "198.51.100.1", "203.0.113.1", "::", "::1", "::127.0.0.1",
    "::ffff:8.8.8.8", "fc00::1", "fe80::1", "ff02::1", "2001:db8::1", "2002:0808:0808::",
    "2001:2::1", "3fff::1"]) {
    test("reserved DNS answer " + ip, () => expect(isPublicAddress(ip)).toBe(false));
  }
  for (const [ip, allowed] of [
    ["192.2.1.1", true], ["192.0.2.1", false], ["192.0.0.1", false], ["192.1.1.1", true],
    ["192.0.1.0", true], ["192.0.3.0", true], ["192.88.99.255", false],
    ["192.88.100.0", true], ["198.19.255.255", false], ["198.20.0.0", true],
    ["100.63.255.255", true], ["100.128.0.0", true], ["240.0.0.0", false],
  ] as const) {
    test("exact IPv4 special range " + ip, () => expect(isPublicAddress(ip)).toBe(allowed));
  }
  test("mixed DNS results reject entire host", async () => {
    await expect(vetUrl(new URL("https://example.com"), async () => ["8.8.8.8", "10.0.0.1"])).rejects.toThrow("blocked_address");
  });
  test("public IPv4/IPv6 DNS", () => {
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
  });
  test("redirect to private literal refused before transport", async () => {
    let calls = 0;
    await expect(safeFetch("https://example.com", {
      resolver: async () => ["8.8.8.8"],
      transport: async () => { calls++; return { url: "", status: 302, headers: { location: "http://127.0.0.1/" }, body: "" }; },
    })).rejects.toThrow("blocked_address");
    expect(calls).toBe(1);
  });
  test("redirect DNS revalidated and pinned", async () => {
    let calls = 0;
    await expect(safeFetch("https://example.com", {
      resolver: async (host) => [host === "example.com" ? "8.8.8.8" : "192.168.0.1"],
      transport: async (_url, address) => { calls++; expect(address).toBe("8.8.8.8"); return { url: "", status: 302, headers: { location: "https://other.example/" }, body: "" }; },
    })).rejects.toThrow("blocked_address");
    expect(calls).toBe(1);
  });
  test("redirect budget", async () => {
    let calls = 0;
    await expect(safeFetch("https://example.com", {
      resolver: async () => ["8.8.8.8"],
      transport: async () => { calls++; return { url: "", status: 301, headers: { location: "/" }, body: "" }; },
    })).rejects.toThrow("too_many_redirects");
    expect(calls).toBe(6);
  });
});
test("robots combines exact groups, wildcard fallback, allow ties and end anchors", () => {
  const groups = parseRobots("User-agent: *\nDisallow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: GPTBot\nAllow: /$");
  expect(botAllowed(groups, "GPTBot")).toEqual({ covered: true, allowed: true });
  expect(botAllowed(groups, "ClaudeBot").allowed).toBe(false);
  expect(botAllowed(groups, "GPTBot", "/a").allowed).toBe(false);
  expect(botAllowed(parseRobots("User-agent: *\nDisallow:"), "GPTBot").allowed).toBe(true);
});
test("score excludes informative and na; rounds percentage and level", () => {
  const make = (weight: number, status: Check["status"], informative = false): Check =>
    ({ id: "x402", category: "commerce", weight, status, informative, details: "" });
  expect(score([make(3, "pass"), make(1, "fail"), make(100, "na"), make(100, "fail", true)]))
    .toEqual({ percentage: 75, level: 4 });
  expect(score([])).toEqual({ percentage: 0, level: 0 });
});
test("HTML fallback is not robots; script text is not content", () => {
  const r: Resource = { url: "https://example.com", status: 200, headers: { "content-type": "text/html" }, body: "<h1>Hi</h1><script>" + "x".repeat(300) + "</script>" };
  expect(robotsTxt(r).status).toBe("fail");
  expect(rawHtmlContent(r).status).toBe("fail");
});
test("bot challenges fail despite HTTP 200", async () => {
  const check = await aiBotAccess(async () => ({ url: "", status: 200, headers: {}, body: "<title>Just a moment...</title>" }));
  expect(check.status).toBe("fail");
});
test("adversarial HTML remains bounded", () => {
  const check = rawHtmlContent({ url: "", status: 200, headers: { "content-type": "text/html" }, body: "<".repeat(1024 * 1024) });
  expect(check.status).toBe("fail");
});
test("expanded IPv6 special ranges rejected", () => {
  expect(isPublicAddress("2001:0db8::1")).toBe(false);
  expect(isPublicAddress("2001:0100::1")).toBe(false);
});
test("native Node pinned transport streams a local fixture", async () => {
  // Exercise actual Node lookup semantics, not Bun's HTTP compatibility layer.
  const { execFileSync } = await import("node:child_process");
  const source = "data:text/javascript;base64," + Buffer.from(new Bun.Transpiler({ loader: "ts" })
    .transformSync(await Bun.file(new URL("./safe-fetch.ts", import.meta.url)).text())).toString("base64");
  const script = `
    import http from "node:http";
    import { requestPinned } from "${source}";
    const server = http.createServer((_req, res) => res.end("fixture"));
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    try {
      const port = server.address().port;
      const result = await requestPinned(new URL("http://example.test:" + port), "127.0.0.1", {}, AbortSignal.timeout(1000));
      if (result.status !== 200 || result.body !== "fixture") throw Error("bad response");
    } finally { server.closeAllConnections(); server.close(); }
  `;
  expect(() => execFileSync("node", ["--input-type=module", "-e", script], { timeout: 5000, stdio: "pipe" })).not.toThrow();
});

describe("robots.txt parsing stays linear on hostile input", () => {
  const hostile = (body: string): Resource =>
    ({ status: 200, url: "https://example.com/robots.txt", headers: { "content-type": "text/plain" }, body }) as Resource;
  test("1 MiB of newlines or one long line parses quickly", async () => {
    const { contentSignal, robotsAiRules } = await import("./checks");
    for (const body of ["\n".repeat(1 << 20), `a${" ".repeat(1 << 20)}b`, `User-agent:${" ".repeat(1 << 20)}x`]) {
      const started = performance.now();
      parseRobots(body);
      contentSignal(hostile(body));
      robotsAiRules(hostile(body));
      expect(performance.now() - started).toBeLessThan(1000);
    }
  });
  test("keeps parsing keys and values the same way", () => {
    expect(parseRobots("  User-Agent : GPTBot  # comment\nDisallow:  /private  \nAllow:\n")).toEqual([
      { agents: ["gptbot"], rules: [{ allow: false, path: "/private" }] },
    ]);
  });
});

describe("bot challenge detection", () => {
  const check = (body: string, status = 200, headers = {}) =>
    aiBotAccess(async () => ({ url: "https://example.com", status, headers, body }));

  test("Cloudflare marketing copy and passive JSD are accessible", async () => {
    const r = await check('<h1>Cloudflare</h1><p>Replace CAPTCHA with a better experience. Just a moment to learn more.</p><script src="/cdn-cgi/challenge-platform/scripts/jsd/main.js"></script>');
    expect(r.status).toBe("pass");
    expect(r.details).not.toContain("challenge");
  });
  test("cf-mitigated header is authoritative", async () => {
    expect((await check("", 200, { "cf-mitigated": "challenge" })).details).toContain("200 challenge");
    expect((await check("", 200, { "cf-mitigated": "other" })).status).toBe("pass");
  });
  test("403 is a failure, not necessarily a challenge", async () => {
    const r = await check("Forbidden", 403);
    expect(r.status).toBe("fail");
    expect(r.details).not.toContain("challenge");
  });
  for (const body of [
    "<title>Just a moment...</title>",
    "<title>Attention Required! | Cloudflare</title>",
    "<script>window._cf_chl_opt = {};</script>",
    "<script>cf_chl_opt = {};</script>",
    '<script src="/cdn-cgi/challenge-platform/h/g/orchestrate/chl_page/v1"></script>',
    '<form id="challenge-form"></form>',
    '<iframe src="https://geo.captcha-delivery.com/captcha/"></iframe>',
    '<div id="px-captcha"></div>', "<script>window._pxCaptcha = {};</script>",
    '<script src="/_Incapsula_Resource?x=1"></script>',
    '<script src="/akam/13/abc/def/ghi"></script>',
    ...["cf-turnstile", "g-recaptcha", "h-captcha"].map((name) =>
      '<div class="' + name + '"></div><script>' + "hidden ".repeat(200) + "</script><p>Verify you are human</p>"),
  ]) {
    test("interstitial: " + body.slice(0, 90), async () => {
      expect((await check(body)).details).toContain("200 challenge");
    });
  }
  test("normal content with an embedded captcha widget is not an interstitial", async () => {
    expect((await check('<div class="g-recaptcha"></div><p>' + "Content ".repeat(100) + "</p>")).status).toBe("pass");
  });
  for (const status of [403, 429, 503]) {
    test("error with challenge marker " + status, async () => {
      expect((await check('<div class="cf-chl-container"></div>', status)).details).toContain(status + " challenge");
    });
  }
});
