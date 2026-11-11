import { test, expect } from "bun:test";
import { POST, GET } from "./route";
let sequence = 0;
function request(body: string, ip = "198.51.100." + ++sequence) {
  return new Request("https://example.com/api/tools/agent-ready", {
    method: "POST", headers: { "x-real-ip": ip }, body,
  });
}
test("API validation stays offline and returns stable errors", async () => {
  for (const [body, code] of [
    ["{", "invalid_json"], ['{}', "invalid_url"],
    ['{"url":"http://127.0.0.1"}', "blocked_address"],
    ['{"url":"https://example.com:22"}', "blocked_port"],
  ]) {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: code });
    expect(response.headers.get("cache-control")).toBe("no-store");
  }
  expect((await POST(request("x".repeat(4097)))).status).toBe(400);
  expect(GET().status).toBe(405);
  expect(GET().headers.get("allow")).toBe("POST");
});
test("API sliding window limits even invalid requests", async () => {
  for (let i = 0; i < 5; i++) expect((await POST(request("{}", "203.0.113.1"))).status).toBe(400);
  const limited = await POST(request("{}", "203.0.113.1"));
  expect(limited.status).toBe(429);
  expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
});

test("API rate limit groups IPv6 clients by /64", async () => {
  for (let i = 1; i <= 5; i++)
    expect((await POST(request("{}", `2606:4700:abcd:1234::${i}`))).status).toBe(400);
  expect((await POST(request("{}", "2606:4700:abcd:1234:ffff::1"))).status).toBe(429);
  expect((await POST(request("{}", "2606:4700:abcd:1235::1"))).status).toBe(400);
});
