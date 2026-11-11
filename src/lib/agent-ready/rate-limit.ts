import { createHash } from "node:crypto";
import { isIP } from "node:net";

// Canonicalize IPv6 spelling before retaining only its first 64 bits.
// IPv4 remains per-address; invalid/missing ingress values share one bucket.
function clientKey(ip: string): string {
  let identity = "unknown";
  if (isIP(ip) === 4) identity = ip;
  if (isIP(ip) === 6) {
    const canonical = new URL(`http://[${ip}]`).hostname.slice(1, -1);
    const [left, right] = canonical.split("::");
    const head = left ? left.split(":") : [];
    const tail = right ? right.split(":") : [];
    const words = right === undefined ? head : [
      ...head, ...Array<string>(8 - head.length - tail.length).fill("0"), ...tail,
    ];
    identity = words.slice(0, 4).map((word) => word.padStart(4, "0")).join(":");
  }
  return createHash("sha256").update(identity).digest("hex");
}

export function createRateLimiter(cap = 10000) {
  const windows = new Map<string, number[]>();
  const windowMs = 60000;
  // Returns retry-after seconds, or zero when accepted. Only hashes and
  // timestamps are retained, with stale timestamps purged on every request.
  return (ip: string, now = Date.now()): number => {
    for (const [key, times] of windows) {
      const active = times.filter((time) => now - time < windowMs);
      if (active.length) windows.set(key, active);
      else windows.delete(key);
    }
    const key = clientKey(ip);
    const times = windows.get(key) ?? [];
    if (times.length >= 5)
      return Math.max(1, Math.ceil((windowMs - (now - times[0])) / 1000));
    if (!windows.has(key) && windows.size >= cap)
      windows.delete(windows.keys().next().value!);
    // Map insertion order tracks the oldest last-accepted request.
    windows.delete(key);
    windows.set(key, [...times, now]);
    return 0;
  };
}
