import { AGENT_SERVER_INFO, MCP_PROTOCOL_VERSIONS, PUBLIC_TOOLS, callPublicTool } from "@/lib/public-agent-tools";
import { AGENT_HTTP_HEADERS, isAllowedAgentOrigin, isRecord, readAgentJson, rpcError } from "@/lib/agent-http";

/** Stateless Streamable HTTP, JSON response mode (MCP 2025-06-18). */
export async function POST(request: Request) {
  if (!isAllowedAgentOrigin(request)) return rpcError(null, -32000, "Origin not allowed", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return rpcError(null, -32600, "Content-Type must be application/json", 415);
  }
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("application/json") || !accept.includes("text/event-stream")) {
    return rpcError(null, -32600, "Accept must include application/json and text/event-stream", 406);
  }
  const version = request.headers.get("mcp-protocol-version");
  if (version && !MCP_PROTOCOL_VERSIONS.includes(version)) return rpcError(null, -32600, "Unsupported protocol version", 400);

  let message: unknown;
  try { message = await readAgentJson(request); }
  catch (error) {
    return rpcError(null, -32700, "Invalid JSON or oversized body", error instanceof Error && error.message === "Body too large" ? 413 : 400);
  }
  if (!isRecord(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string" ||
      (message.id !== undefined && typeof message.id !== "string" && typeof message.id !== "number") ||
      (message.params !== undefined && !isRecord(message.params))) {
    return rpcError(null, -32600, "Invalid JSON-RPC request", 400);
  }
  const { id, method } = message;
  if (id === undefined) return new Response(null, { status: 202, headers: AGENT_HTTP_HEADERS });
  const params = isRecord(message.params) ? message.params : {};
  let result: unknown;
  switch (method) {
    case "initialize":
      if (typeof params.protocolVersion !== "string" || !isRecord(params.capabilities) || !isRecord(params.clientInfo)) {
        return rpcError(id, -32602, "Invalid initialize parameters");
      }
      result = {
        protocolVersion: MCP_PROTOCOL_VERSIONS.includes(params.protocolVersion) ? params.protocolVersion : MCP_PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: AGENT_SERVER_INFO,
        instructions: "Public TVC content only. Tools never create bookings or modify data.",
      };
      break;
    case "ping": result = {}; break;
    case "tools/list": result = { tools: PUBLIC_TOOLS }; break;
    case "tools/call":
      if (typeof params.name !== "string" || !PUBLIC_TOOLS.some((tool) => tool.name === params.name)) {
        return rpcError(id, -32602, "Unknown tool");
      }
      try {
        const output = callPublicTool(params.name, params.arguments ?? {});
        result = { content: [{ type: "text", text: JSON.stringify(output) }], structuredContent: output, isError: false };
      } catch (error) {
        result = { content: [{ type: "text", text: error instanceof Error ? error.message : "Invalid tool arguments" }], isError: true };
      }
      break;
    default: return rpcError(id, -32601, "Method not found");
  }
  return Response.json({ jsonrpc: "2.0", id, result }, { headers: AGENT_HTTP_HEADERS });
}

// No server-initiated events or sessions: SSE and session deletion are optional.
export function GET(request: Request) {
  if (!isAllowedAgentOrigin(request)) return rpcError(null, -32000, "Origin not allowed", 403);
  return new Response(null, { status: 405, headers: { ...AGENT_HTTP_HEADERS, Allow: "POST, OPTIONS" } });
}

export function OPTIONS(request: Request) {
  if (!isAllowedAgentOrigin(request)) return rpcError(null, -32000, "Origin not allowed", 403);
  return new Response(null, { status: 204, headers: AGENT_HTTP_HEADERS });
}
