import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { createHash, createHmac } from "node:crypto";

const capture = mock(async (event: unknown) => { void event; });
const shutdown = mock(async () => {});
const constructor = mock((key: string, options: unknown) => {
  void key; void options;
  return { captureImmediate: capture, shutdown };
});
mock.module("posthog-node", () => ({ PostHog: constructor }));
const { POST } = await import("./route");

const envKeys = ["CAL_WEBHOOK_SECRET", "CAL_WEBHOOK_HASH_SALT", "VERCEL_ENV", "NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"] as const;
const original = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
const fixture = () => ({
  triggerEvent: "BOOKING_CREATED",
  payload: {
    uid: "booking-unique-id",
    type: "30min",
    eventTypeId: 123,
    title: "Meeting between Jane Doe and Host",
    startTime: "2026-10-20T10:00:00Z",
    endTime: "2026-10-20T10:30:00Z",
    attendees: [{ name: "Jane Doe", email: "jane@example.com", phoneNumber: "+15551234567" }],
    location: "123 Private Street",
    additionalNotes: "Private medical notes",
    metadata: { utm_source: "linkedin", videoCallUrl: "https://private.example/meeting" },
    responses: { email: { value: "jane@example.com" }, utm_campaign: { value: "fall_launch" } },
  },
});
function request(body = JSON.stringify(fixture()), signature?: string) {
  return new Request("https://example.test/api/webhooks/cal", {
    method: "POST",
    body,
    headers: { "X-Cal-Signature-256": signature ?? createHmac("sha256", "test-webhook-secret").update(body).digest("hex") },
  });
}

beforeEach(() => {
  process.env.CAL_WEBHOOK_SECRET = "test-webhook-secret";
  process.env.CAL_WEBHOOK_HASH_SALT = "test-independent-salt";
  process.env.VERCEL_ENV = "production";
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-project-key";
  process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://us.i.posthog.com";
  capture.mockClear(); shutdown.mockClear(); constructor.mockClear();
});
afterEach(() => {
  for (const key of envKeys) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

describe("Cal webhook", () => {
  test("captures a valid raw-body signature and completes delivery/shutdown", async () => {
    let finish!: () => void;
    shutdown.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; }));
    let responded = false;
    const pending = POST(request(JSON.stringify(fixture(), null, 2))).then((response) => { responded = true; return response; });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(responded).toBe(false);
    finish();
    expect((await pending).status).toBe(200);
    expect(constructor).toHaveBeenCalledWith("test-project-key", { host: "https://us.i.posthog.com", flushAt: 1, flushInterval: 0, disableGeoip: true });
    expect(capture).toHaveBeenCalledWith({ distinctId: "booking-unique-id", event: "booking_completed", properties: {
      source: "cal_webhook", $process_person_profile: false, event_type: "30min",
      booking_start_time: "2026-10-20T10:00:00.000Z", duration_minutes: 30,
      utm_source: "linkedin", utm_campaign: "fall_launch",
    } });
  });
  test.each(["0".repeat(64), "short", "z".repeat(64), "a".repeat(66)])("rejects bad signature %s", async (signature) => {
    expect((await POST(request(undefined, signature))).status).toBe(401);
    expect(constructor).not.toHaveBeenCalled();
  });
  test("rejects missing secret or header", async () => {
    const missingHeader = request(); missingHeader.headers.delete("X-Cal-Signature-256");
    expect((await POST(missingHeader)).status).toBe(401);
    delete process.env.CAL_WEBHOOK_SECRET;
    expect((await POST(request())).status).toBe(401);
  });
  test("rejects tampering and checks auth before parsing JSON", async () => {
    const signed = request();
    expect((await POST(request("{}", signed.headers.get("X-Cal-Signature-256")!))).status).toBe(401);
    expect((await POST(request("invalid", "0".repeat(64)))).status).toBe(401);
    expect((await POST(request("invalid"))).status).toBe(400);
  });
  test.each(["PING", "BOOKING_CANCELLED", "BOOKING_RESCHEDULED"])("ignores %s", async (triggerEvent) => {
    expect((await POST(request(JSON.stringify({ triggerEvent })))).status).toBe(200);
    expect(constructor).not.toHaveBeenCalled();
  });
  test.each(["preview", "development", undefined])("does not send in %s", async (environment) => {
    if (environment) process.env.VERCEL_ENV = environment; else delete process.env.VERCEL_ENV;
    expect((await POST(request())).status).toBe(200);
    expect((await POST(request(undefined, "0".repeat(64)))).status).toBe(401);
    expect(constructor).not.toHaveBeenCalled();
  });
  test("sends no attendee details, title, notes, location or arbitrary metadata", async () => {
    const booking = fixture();
    booking.payload.metadata.utm_source = "jane@example.com";
    booking.payload.responses.utm_campaign.value = "Jane-Doe";
    await POST(request(JSON.stringify(booking)));
    const event = JSON.stringify(capture.mock.calls[0]);
    for (const forbidden of ["Jane", "Doe", "jane", "example.com", "15551234567", "Private", "videoCallUrl", "responses", "attendees", "title", "location"]) expect(event).not.toContain(forbidden);
  });
  test("uses a salted hash only when uid is missing", async () => {
    const booking = fixture(); booking.payload.uid = "";
    await POST(request(JSON.stringify(booking)));
    expect(capture.mock.calls[0][0]).toMatchObject({ distinctId: createHash("sha256").update("jane@example.com").update("test-independent-salt").digest("hex") });
    delete process.env.CAL_WEBHOOK_HASH_SALT;
    expect((await POST(request(JSON.stringify(booking)))).status).toBe(500);
  });
  test("uses the event ID when the slug is absent and never falls back to title", async () => {
    const booking = fixture(); booking.payload.type = "";
    await POST(request(JSON.stringify(booking)));
    expect(capture.mock.calls[0][0]).toMatchObject({ properties: { event_type_id: 123 } });
  });
  test("fails safely for missing analytics configuration", async () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    expect((await POST(request())).status).toBe(500);
    expect(constructor).not.toHaveBeenCalled();
  });
  test("returns a retryable error on delivery failure and still shuts down", async () => {
    capture.mockRejectedValueOnce(new Error("synthetic delivery error"));
    expect((await POST(request())).status).toBe(502);
    expect(shutdown).toHaveBeenCalledTimes(1);
  });
});
