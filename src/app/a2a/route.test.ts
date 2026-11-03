import { expect, test } from "bun:test";
import { POST } from "./route";

const send = (data: unknown) => POST(new Request("https://www.thevibecompany.co/a2a", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
}));

test("A2A message/send returns a public answer without creating a task", async () => {
  const response = await send({ jsonrpc: "2.0", id: 1, method: "message/send", params: {
    message: { role: "user", messageId: "test", parts: [{ kind: "data", data: { name: "get_booking_link" } }] },
  } });
  const { result } = await response.json();
  expect(result.kind).toBe("message");
  expect(result.role).toBe("agent");
  expect(result.parts[0].text).toContain("https://cal.com/stangirard/thevibecompany");
});

test("A2A rejects task mutations and unknown operations", async () => {
  for (const method of ["tasks/get", "tasks/cancel"]) {
    expect((await (await send({ jsonrpc: "2.0", id: 1, method, params: { id: "nonexistent" } })).json()).error.code).toBe(-32001);
    expect((await (await send({ jsonrpc: "2.0", id: 1, method })).json()).error.code).toBe(-32602);
  }
  expect((await (await send({ jsonrpc: "2.0", id: 1, method: "message/send", params: {
    message: { role: "user", messageId: "test", parts: [{ kind: "data", data: { name: "write" } }] },
  } })).json()).error.code).toBe(-32602);
});
