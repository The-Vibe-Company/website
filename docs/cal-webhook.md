# Cal.com booking analytics

`POST /api/webhooks/cal` verifies the hex HMAC-SHA256 signature against the raw
request bytes before parsing JSON. Only `BOOKING_CREATED` on a Vercel production
runtime sends `booking_completed`. Authenticated Ping tests return 200 without
sending an event. Missing configuration or delivery failures return 5xx.

## Setup

1. Cal.com: **Settings > Developer > Webhooks > New**.
   - Subscriber URL: `https://<production domain>/api/webhooks/cal`.
   - Event triggers: **Booking Created only**.
   - Secret: generate a strong random value, e.g. `openssl rand -hex 32`.
   - Payload template: **default**. Save, then use **Ping test** after deploying
     the route and configuring Vercel.
2. Vercel: **Project > Settings > Environment Variables**.
   - Add `CAL_WEBHOOK_SECRET` with the same value, scoped to **Production**.
   - Add `CAL_WEBHOOK_HASH_SALT`, a separate strong random value (same generation
     command), scoped to **Production**. It is used only if the booking UID is absent.
   - Confirm `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` exist for
     **Production** and are readable server-side. Use the absolute ingestion host,
     e.g. `https://us.i.posthog.com`, rather than the frontend `/ingest` proxy.
   - Redeploy to apply environment variables. Keep secret and salt server-only.
3. After release, make a real booking and check PostHog for `booking_completed`.
   Preview environments still authenticate webhooks but send no analytics.

## Captured data and attribution limitations

- `distinct_id` is `payload.uid`; fallback is SHA-256 of normalized first-attendee
  email followed by `CAL_WEBHOOK_HASH_SALT`. No raw email is sent.
- Properties: `source: cal_webhook`, `$process_person_profile: false`, `event_type`
  from `payload.type` (a slug), or numeric `event_type_id` from `payload.eventTypeId`;
  normalized `booking_start_time` and positive `duration_minutes` from start/end.
- Never copy the payload, responses, metadata, attendees, organizer, notes, title,
  or meeting location into PostHog. Cal's booking title can contain names and its
  location may be an address, phone number, or private meeting URL. GeoIP is off.
- The current [default webhook examples](https://cal.com/docs/developing/guides/automation/webhooks)
  include `responses` (booking question values) and `metadata` (which may contain
  `videoCallUrl`). They do **not** document automatic UTM fields, `tracking`, a
  website referrer, source page, or website CTA location. `bookerUrl` is a Cal
  booking-app base URL; `location` / `responses.location` describe the meeting,
  not the website CTA. None are used as website attribution.
- The current [payload builder](https://github.com/calcom/cal.com/blob/main/packages/features/webhooks/lib/factory/versioned/v2021-10-20/BookingPayloadBuilder.ts)
  and [CalendarEvent type](https://github.com/calcom/cal.com/blob/main/packages/types/Calendar.d.ts)
  also have no standard `tracking` or UTM fields. Do not assume Calendly's tracking
  schema applies to Cal.com.
- Optional, explicitly populated custom fields are supported:
  `payload.metadata.utm_source`, `.utm_medium`, `.utm_campaign`, `.utm_term`,
  `.utm_content`, or the same keys under `payload.responses` as `{ value: "..." }`
  (plain strings also accepted). Metadata takes precedence over responses.
  Availability depends on Cal's configuration/version and the booking flow;
  this change does not configure or forward those values from the site.
- UTM values are restricted to 1–120 ASCII letters/digits/underscores/hyphens;
  values containing long digit runs or attendee identity fragments are omitted.
  Configure these fields exclusively with marketing codes, never personal data.
  Arbitrary free text, URLs, spaces and encoded values are deliberately omitted.
- Referrer, source page and CTA location are **unavailable in the standard
  payload**, so the route does not invent properties for them. Current plain Cal
  links do not forward this data. Custom forwarding would require a separate change.
- The booking UID does not join the anonymous browser identity from
  `booking_link_clicked`. This supports booking counts, not a person-level funnel.
  Delivery retries may repeat an event; this route does not maintain a deduplication store.

## Verification

Run `bun run test`, `bun run lint`, `bunx tsc --noEmit`, and the existing CI build.
Tests mock PostHog and use synthetic secrets/attendee data; they send no events.
