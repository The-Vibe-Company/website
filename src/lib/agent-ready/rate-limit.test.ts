import { expect, test } from "bun:test";
import { clientIp, createRateLimiter, createScanSlots } from "./rate-limit";

test("IPv6 rotations and equivalent spellings share a /64 quota", () => {
  const limit = createRateLimiter();
  for (let i = 1; i <= 5; i++) expect(limit(`2606:4700:1234:abcd::${i}`, 0)).toBe(0);
  expect(limit("2606:4700:1234:abcd:ffff:ffff:ffff:ffff", 1000)).toBe(59);
  expect(limit("2606:4700:1234:abce::1", 1000)).toBe(0);
  const compressed = createRateLimiter();
  for (let i = 0; i < 5; i++) expect(compressed("2606::1", 0)).toBe(0);
  expect(compressed("2606:0000:0000:0000:0000:0000:0000:0002", 0)).toBe(60);
});

test("IPv4 clients retain individual quotas and expire at the window boundary", () => {
  const limit = createRateLimiter();
  for (let i = 0; i < 5; i++) expect(limit("8.8.8.8", 0)).toBe(0);
  expect(limit("8.8.8.8", 59999)).toBe(1);
  expect(limit("8.8.8.9", 59999)).toBe(0);
  expect(limit("8.8.8.8", 60000)).toBe(0);
});

test("at capacity, expired entries are removed before live entries", () => {
  const limit = createRateLimiter(2);
  expect(limit("8.8.8.8", 0)).toBe(0);
  for (let i = 0; i < 5; i++) expect(limit("1.1.1.1", 1000)).toBe(0);
  expect(limit("9.9.9.9", 60000)).toBe(0);
  expect(limit("1.1.1.1", 60000)).toBe(1);
});

test("at capacity, new clients evict oldest entries instead of global lockout", () => {
  const limit = createRateLimiter(2);
  for (let i = 0; i < 5; i++) expect(limit("8.8.8.8", 0)).toBe(0);
  for (let i = 0; i < 5; i++) expect(limit("1.1.1.1", 1000)).toBe(0);
  expect(limit("9.9.9.9", 2000)).toBe(0);
  expect(limit("1.1.1.1", 2000)).toBe(59);
  expect(limit("8.8.8.8", 2000)).toBe(0);
});

test("capacity eviction uses oldest activity, not first insertion", () => {
  const limit = createRateLimiter(2);
  expect(limit("8.8.8.8", 0)).toBe(0);
  for (let i = 0; i < 5; i++) expect(limit("1.1.1.1", 1000)).toBe(0);
  expect(limit("8.8.8.8", 2000)).toBe(0);
  expect(limit("9.9.9.9", 3000)).toBe(0);
  expect(limit("1.1.1.1", 3000)).toBe(0);
});


test("Vercel client IP wins over forwarded chains, with validated fallbacks", () => {
  expect(clientIp(new Headers({
    "x-real-ip": " 203.0.113.9 ",
    "x-vercel-forwarded-for": "203.0.113.8",
    "x-forwarded-for": "198.51.100.1, 198.51.100.2",
  }))).toBe("203.0.113.9");
  expect(clientIp(new Headers({
    "x-real-ip": "invalid", "x-vercel-forwarded-for": "2606:4700::1",
    "x-forwarded-for": "198.51.100.1",
  }))).toBe("2606:4700::1");
  expect(clientIp(new Headers({ "x-forwarded-for": "198.51.100.1, 198.51.100.2" }))).toBe("198.51.100.1");
  expect(clientIp(new Headers({ "x-real-ip": "", "x-forwarded-for": "bad" }))).toBe("unknown");
  expect(clientIp(new Headers())).toBe("unknown");
});

test("whole-scan slots are bounded and releases are idempotent", () => {
  const acquire = createScanSlots(2);
  const first = acquire()!;
  const second = acquire()!;
  expect(acquire()).toBeNull();
  first();
  first();
  const third = acquire()!;
  expect(acquire()).toBeNull();
  second();
  third();
  expect(acquire()).not.toBeNull();
  expect(acquire()).not.toBeNull();
  expect(acquire()).toBeNull();
});
