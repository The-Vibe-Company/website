import { resolve4, resolve6 } from "node:dns/promises";
import { isIP } from "node:net";
import http from "node:http";
import https from "node:https";

export class ScanError extends Error {
  constructor(public code: string) { super(code); }
}
export const USER_AGENT = "TVC-AgentReady/1.0 (+https://www.thevibecompany.co/en/tools/agent-ready)";
export type Resolver = (host: string) => Promise<string[]>;
export const resolveAddresses: Resolver = async (host) => {
  const results = await Promise.allSettled([resolve4(host), resolve6(host)]);
  return results.flatMap((r) => r.status === "fulfilled" ? r.value : []);
};

// IPv4 special-purpose networks excluded from public scan targets.
const IPV4_SPECIAL_CIDRS = [
  "0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8",
  "169.254.0.0/16", "172.16.0.0/12", "192.0.0.0/24", "192.0.2.0/24",
  "192.88.99.0/24", "192.168.0.0/16", "198.18.0.0/15",
  "198.51.100.0/24", "203.0.113.0/24", "224.0.0.0/4", "240.0.0.0/4",
].map((cidr) => {
  const [network, bits] = cidr.split("/");
  const mask = (0xffffffff << (32 - Number(bits))) >>> 0;
  return { network: ipv4Number(network), mask };
});
function ipv4Number(address: string): number {
  return address.split(".").reduce((value, octet) => (value * 256) + Number(octet), 0);
}

// Conservative global-unicast allowlist. Special-purpose IPv6, including all
// mapped/compatible IPv4 forms, is rejected rather than translated.
// Registries: https://www.iana.org/assignments/iana-ipv4-special-registry/
// https://www.iana.org/assignments/iana-ipv6-special-registry/
export function isPublicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const value = ipv4Number(address);
    return !IPV4_SPECIAL_CIDRS.some(({ network, mask }) => ((value & mask) >>> 0) === network);
  }
  if (isIP(address) !== 6) return false;
  const first = parseInt(address.split(":")[0], 16);
  if (!(first >= 0x2000 && first <= 0x3fff)) return false;
  // IETF special assignments, documentation and 6to4.
  const second = parseInt(address.split(":")[1] || "0", 16);
  return !(first === 0x2001 && (second <= 0x1ff || second === 0xdb8)) &&
    first !== 0x2002 && first !== 0x3fff;
}

export function normalizeUrl(input: string): URL {
  if (!input || input.length > 2048) throw new ScanError("invalid_url");
  let url: URL;
  try { url = new URL(input.includes("://") ? input : `https://${input}`); }
  catch { throw new ScanError("invalid_url"); }
  validateUrl(url);
  return new URL(url.origin);
}
function validateUrl(url: URL) {
  if (!["https:", "http:"].includes(url.protocol)) throw new ScanError("invalid_url");
  if (url.username || url.password) throw new ScanError("invalid_url");
  if (url.port && !["80", "443"].includes(url.port)) throw new ScanError("blocked_port");
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  // WHATWG URL canonicalizes decimal, octal and hex IPv4 before this check.
  if (isIP(host) || host === "localhost" || host.endsWith(".localhost") ||
    host.endsWith(".local") || !host.includes(".")) throw new ScanError("blocked_address");
}
export async function vetUrl(url: URL, resolver: Resolver = resolveAddresses) {
  validateUrl(url);
  const addresses = await resolver(url.hostname);
  if (!addresses.length) throw new ScanError("dns_failed");
  if (addresses.some((a) => !isPublicAddress(a))) throw new ScanError("blocked_address");
  return addresses[0];
}
export interface Resource { url: string; status: number; headers: Record<string, string>; body: string }
export type Transport = (url: URL, address: string, headers: Record<string, string>, signal: AbortSignal) => Promise<Resource>;

// Native Node transport pins lookup while retaining the original Host, SNI and
// TLS certificate validation. No proxy environment variables or ambient cookies.
export const requestPinned: Transport = (url, address, headers, signal) => new Promise((resolve, reject) => {
  const request = (url.protocol === "https:" ? https : http).request(url, {
    method: "GET", headers, signal, agent: false, family: isIP(address),
    lookup: (_host, _options, callback) => callback(null, address, isIP(address)),
  }, (response) => {
    const chunks: Buffer[] = [];
    let size = 0;
    response.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        request.destroy(new ScanError("body_too_large"));
        return;
      }
      chunks.push(chunk);
    });
    response.on("error", reject);
    response.on("end", () => resolve({
      url: url.href, status: response.statusCode ?? 0,
      headers: Object.fromEntries(Object.entries(response.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v ?? ""])),
      body: Buffer.concat(chunks).toString("utf8"),
    }));
  });
  request.on("error", reject);
  request.end();
});

export async function safeFetch(input: string, options: {
  headers?: Record<string, string>; signal?: AbortSignal;
  resolver?: Resolver; transport?: Transport;
} = {}): Promise<Resource> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  try {
    let url = new URL(input);
    for (let hop = 0; hop <= 5; hop++) {
      controller.signal.throwIfAborted();
      // DNS itself must also obey the deadline.
      const address = await Promise.race([
        vetUrl(url, options.resolver),
        new Promise<never>((_, reject) => controller.signal.addEventListener("abort", () => reject(new ScanError("timeout")), { once: true })),
      ]);
      const response = await (options.transport ?? requestPinned)(url, address, {
        "user-agent": USER_AGENT, accept: "*/*", "accept-encoding": "identity", ...options.headers,
      }, controller.signal);
      if (![301, 302, 303, 307, 308].includes(response.status)) return response;
      if (!response.headers.location) throw new ScanError("invalid_redirect");
      if (hop === 5) throw new ScanError("too_many_redirects");
      url = new URL(response.headers.location, url);
    }
    throw new ScanError("too_many_redirects");
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
