import { createHash } from "node:crypto";
import { scanSite, type Report } from "@/lib/agent-ready";
import { normalizeUrl, ScanError, vetUrl } from "@/lib/agent-ready/safe-fetch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const cache = new Map<string, { expires: number; report: Report }>();
const windows = new Map<string, number[]>();
function reply(body: unknown, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
export async function POST(request: Request) {
  const now = Date.now();
  for (const [key, times] of windows) if (times.every((t) => now - t >= 60000)) windows.delete(key);
  for (const [key, entry] of cache) if (entry.expires <= now) cache.delete(key);
  // Trusted ingress must overwrite these headers. Untrusted direct deployments
  // need an upstream limiter; this instance-local limiter is not a global quota.
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ?? "unknown").trim();
  const key = createHash("sha256").update(ip).digest("hex");
  const times = (windows.get(key) ?? []).filter((t) => now - t < 60000);
  if (times.length >= 5 || windows.size >= 10000 && !windows.has(key))
    return reply({ error: "rate_limited" }, 429, { "Retry-After": String(Math.max(1, Math.ceil((60000 - (now - (times[0] ?? now))) / 1000))) });
  windows.set(key, [...times, now]);
  try {
    // Stream-limit even chunked input; do not buffer an unbounded request.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "invalid_json" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 4096) { await reader.cancel(); return reply({ error: "invalid_url" }, 400); }
      chunks.push(value);
    }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString()); }
    catch { return reply({ error: "invalid_json" }, 400); }
    if (!body || typeof body !== "object" || !("url" in body) || typeof body.url !== "string")
      return reply({ error: "invalid_url" }, 400);
    const url = normalizeUrl(body.url.trim());
    // Guard validation even on cache hits; timeout also bounds DNS.
    await Promise.race([vetUrl(url), new Promise<never>((_, reject) => {
      const timer = setTimeout(() => reject(new ScanError("dns_failed")), 1000);
      timer.unref();
    })]);
    // Origin separates http/https, avoiding cross-scheme cache poisoning.
    const cached = cache.get(url.origin);
    if (cached && cached.expires > now) return reply(cached.report);
    const report = await scanSite(url.origin);
    if (cache.size >= 500) cache.delete(cache.keys().next().value!);
    cache.set(url.origin, { expires: Date.now() + 300000, report });
    return reply(report);
  } catch (error) {
    return reply({ error: error instanceof ScanError ? error.code : "scan_failed" }, error instanceof ScanError ? 400 : 502);
  }
}
export function GET() { return reply({ error: "method_not_allowed" }, 405, { Allow: "POST" }); }
