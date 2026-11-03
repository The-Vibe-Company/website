import { randomUUID } from "node:crypto";
import { PUBLIC_TOOLS, callPublicTool } from "@/lib/public-agent-tools";
import { AGENT_HTTP_HEADERS, isAllowedAgentOrigin, isRecord, readAgentJson, rpcError } from "@/lib/agent-http";

/** A2A 0.3 message/send: immediate public answers, no tasks or persistence. */
export async function POST(request: Request) {
  if (!isAllowedAgentOrigin(request)) return rpcError(null, -32000, "Origin not allowed", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return rpcError(null, -32600, "Content-Type must be application/json", 415);
  }
  let body: unknown;
  try { body = await readAgentJson(request); }
  catch { return rpcError(null, -32700, "Invalid JSON or oversized body", 400); }
  if (!isRecord(body) || body.jsonrpc !== "2.0" || (typeof body.id !== "string" && typeof body.id !== "number")) {
    return rpcError(null, -32600, "Invalid JSON-RPC request", 400);
  }
  // Core task methods are present for A2A compatibility. This service never
  // creates or persists tasks, so there is nothing to retrieve or cancel.
  if (body.method === "tasks/get" || body.method === "tasks/cancel") {
    if (!isRecord(body.params) || typeof body.params.id !== "string" || !body.params.id) {
      return rpcError(body.id, -32602, "A task id is required");
    }
    return rpcError(body.id, -32001, "Task not found");
  }
  if (body.method !== "message/send") return rpcError(body.id, -32601, "Method not found");
  const message = isRecord(body.params) ? body.params.message : undefined;
  if (!isRecord(message) || message.role !== "user" || typeof message.messageId !== "string" ||
      !Array.isArray(message.parts) || message.parts.length === 0) {
    return rpcError(body.id, -32602, "A user message with messageId and parts is required");
  }
  // Structured requests use the same explicit read-only operations as MCP.
  // Text messages receive the public discovery/booking links, not invented answers.
  const part = message.parts.find((part: unknown) => isRecord(part) && part.kind === "data");
  let output: unknown;
  try {
    if (isRecord(part) && isRecord(part.data)) {
      const { name, arguments: args } = part.data;
      if (typeof name !== "string" || !PUBLIC_TOOLS.some((tool) => tool.name === name)) {
        return rpcError(body.id, -32602, "Use a public tool name in the data part");
      }
      output = callPublicTool(name, args ?? {});
    } else {
      output = {
        ...callPublicTool("get_booking_link"),
        articles: "/llms.txt",
        instructions: "Send a data part with {name: list_articles | read_article | get_booking_link, arguments: {...}}. Public read-only data only.",
      };
    }
  } catch (error) {
    return rpcError(body.id, -32602, error instanceof Error ? error.message : "Invalid arguments");
  }
  return Response.json({ jsonrpc: "2.0", id: body.id, result: {
    kind: "message", role: "agent", messageId: randomUUID(),
    parts: [{ kind: "text", text: JSON.stringify(output) }],
  } }, { headers: AGENT_HTTP_HEADERS });
}
