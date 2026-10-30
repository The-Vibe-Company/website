import { SITE_URL } from "@/lib/site";

export const AGENT_HTTP_HEADERS = {
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version",
};

/** No credentials or browser sessions; accept only known browser origins. */
export function isAllowedAgentOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Native MCP clients do not send Origin.
  const allowed = [new URL(request.url).origin, SITE_URL];
  for (const hostname of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (hostname) allowed.push(`https://${hostname}`);
  }
  return allowed.includes(origin);
}

/** Bound actual body bytes, including requests without Content-Length. */
export async function readAgentJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function rpcError(id: unknown, code: number, message: string, status = 200) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, {
    status, headers: AGENT_HTTP_HEADERS,
  });
}
