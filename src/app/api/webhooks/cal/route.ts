import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { PostHog } from "posthog-node";

export const runtime = "nodejs";

type ObjectValue = Record<string, unknown>;
const object = (value: unknown): ObjectValue =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ObjectValue)
    : {};

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Only marketing tokens, never arbitrary form answers, URLs, or meeting details. */
function marketingToken(value: unknown, attendees: unknown[]): string | undefined {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,120}$/.test(value)) return;
  if (/\d{7}/.test(value)) return;
  const token = value.toLowerCase();
  for (const attendee of attendees) {
    const person = object(attendee);
    for (const field of [person.name, person.firstName, person.lastName, person.email, person.phoneNumber]) {
      if (typeof field !== "string") continue;
      const parts = field.toLowerCase().split(/[^a-z0-9]+/).filter((part) => part.length > 1);
      if (parts.some((part) => token.includes(part))) return;
    }
  }
  return value;
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  const signature = request.headers.get("x-cal-signature-256");
  if (!secret || !signature || !/^[a-fA-F0-9]{64}$/.test(signature)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rawBody = Buffer.from(await request.arrayBuffer());
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const supplied = Buffer.from(signature, "hex");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: ObjectValue;
  try {
    body = object(JSON.parse(rawBody.toString("utf8")));
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (body.triggerEvent !== "BOOKING_CREATED" || process.env.VERCEL_ENV !== "production") {
    return new Response(null, { status: 200 });
  }

  const payload = object(body.payload);
  const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];
  let distinctId = typeof payload.uid === "string" && payload.uid ? payload.uid : undefined;
  if (!distinctId) {
    const email = object(attendees[0]).email;
    const salt = process.env.CAL_WEBHOOK_HASH_SALT;
    if (typeof email !== "string" || !email || !salt) {
      return new Response("Missing booking identity configuration", { status: 500 });
    }
    distinctId = createHash("sha256").update(email.trim().toLowerCase()).update(salt).digest("hex");
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || !host) return new Response("Analytics not configured", { status: 500 });

  const properties: Record<string, string | number | boolean> = {
    source: "cal_webhook",
    $process_person_profile: false,
  };
  // Cal's title contains attendee/organizer names. Use only the event slug or ID.
  const eventType = marketingToken(payload.type, attendees);
  if (eventType) properties.event_type = eventType;
  else if (typeof payload.eventTypeId === "number" && Number.isSafeInteger(payload.eventTypeId)) {
    properties.event_type_id = payload.eventTypeId;
  }
  const start = typeof payload.startTime === "string" ? Date.parse(payload.startTime) : NaN;
  const end = typeof payload.endTime === "string" ? Date.parse(payload.endTime) : NaN;
  if (Number.isFinite(start)) properties.booking_start_time = new Date(start).toISOString();
  if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
    properties.duration_minutes = (end - start) / 60000;
  }
  // These containers can carry explicitly configured custom UTM fields. Cal's
  // default payload does not promise attribution or a `tracking` object.
  for (const name of utmKeys) {
    const response = object(payload.responses)[name];
    const value = marketingToken(object(payload.metadata)[name], attendees)
      ?? marketingToken(object(response).value ?? response, attendees);
    if (value) properties[name] = value;
  }

  const client = new PostHog(key, { host, flushAt: 1, flushInterval: 0, disableGeoip: true });
  try {
    // Immediate capture propagates delivery failures so Cal can retry; shutdown
    // also completes before the serverless invocation is allowed to finish.
    await client.captureImmediate({ distinctId, event: "booking_completed", properties });
    return new Response(null, { status: 200 });
  } catch {
    // Do not log SDK errors: they can include the original request/event.
    return new Response("Analytics delivery failed", { status: 502 });
  } finally {
    await client.shutdown();
  }
}
