# Agent-ready scanner (v1)

One-shot public-origin scan. No database, scheduled work, email, external scan
service, browser or Cloudflare API. Findings are capability heuristics, not
certification of full protocol/schema conformance. Paths for emerging proposals
include compatibility fallbacks.

## Contract

POST /api/tools/agent-ready with JSON `{ "url": "example.com" }`.
Missing scheme defaults to HTTPS; paths, queries and fragments are discarded.
Only site origins are scanned. GET returns 405. All replies use no-store.
Types are exported from types.ts (and index.ts).

Report: url, finalUrl, scannedAt (ISO UTC), durationMs, score
{percentage, level}, categories [{id, percentage, level, checks}].
Checks: id, category, status (pass/fail/na), weight, details (technical English),
optional informative. Frontend should map stable check ids to localized copy
and fixes, rendering evidence as text, never HTML.

Errors use `{error: code}`: invalid_json, invalid_url, blocked_address,
blocked_port, dns_failed (400); rate_limited (429, Retry-After);
scan_failed (502); method_not_allowed (405).
Transport failures during checks become failed findings with unavailable
evidence, not an overall API error.

## Checks, weights and references

| Category | ID | Weight | Reference |
| --- | --- | --- | --- |
| discoverability | robots_txt | 3 | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) |
| discoverability | sitemap | 3 | [Sitemaps protocol](https://www.sitemaps.org/protocol.html) |
| discoverability | link_headers | 1 | [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) |
| discoverability | llms_txt | 2 | [llms.txt](https://llmstxt.org/) |
| content | markdown_negotiation | 2 | [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#section-12), [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) |
| content | raw_html_content | 4 | [HTML headings](https://html.spec.whatwg.org/multipage/sections.html) |
| ai_bots | robots_ai_rules | 3 | RFC 9309; vendor references in checks.ts |
| ai_bots | content_signal | 1 | [Content Signals](https://contentsignals.org/), [IETF draft](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/) |
| ai_bots | ai_bot_access | 4 | [HTTP](https://www.rfc-editor.org/rfc/rfc9110), vendor references in checks.ts |
| protocols | mcp_server_card | 1 | [MCP SEP-1649 proposal](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649) |
| protocols | a2a_agent_card | 1 | [A2A](https://a2a-protocol.org/latest/specification/) |
| protocols | agent_skills | 1 | [Agent Skills](https://agentskills.io/), [discovery proposal](https://github.com/cloudflare/agent-skills-discovery-rfc) |
| protocols | oauth_discovery | 1 | [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414), [OIDC discovery](https://openid.net/specs/openid-connect-discovery-1_0.html) |
| protocols | oauth_protected_resource | 1 | [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) |
| protocols | api_catalog | 1 | [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) |
| commerce | x402 | 0 | [x402](https://docs.x402.org/) |

Core accessible content gets the highest weight. Optional service protocols
get one point each so a marketing site is not primarily judged as an API.
Percentage = round(100 * passing weight / applicable weight), excluding na and
informative findings. Level = round(percentage / 20), from 0 to 5.
Global uses the unrounded category fractions weighted by applicable category
weight (equivalently all check weights). Commerce contributes nothing; an empty
applicable category scores 0, not an invented success.

## Security and operational limits

All literal IPs (including public ones and WHATWG-normalized numeric forms) are
rejected. DNS A and AAAA are checked on every hop; any non-public answer rejects
the hostname. Node HTTP(S) pins a vetted address via lookup with TLS SNI and
certificate checks still using the hostname. No cookies, proxy or credentials.
Only HTTP/HTTPS and ports 80/443; at most five manual redirects; no automatic
decompression; 1 MiB streamed body cap; 8 second fetch deadline including DNS.
Shared resource promises deduplicate requests. At most 16 active fetches per
scan and a 23 second scan deadline, returning partial failed checks on timeout.
API preflight DNS has a 1 second deadline.

Reports are cached by origin (hostname plus scheme to prevent scheme confusion)
for five minutes, capped at 500 entries. Hash-only in-memory IP sliding windows
allow five requests per minute, capped at 10000 active identities. Expired
entries are pruned on requests. No raw IP is retained. These controls are
instance-local and reset on restart. The trusted reverse proxy must overwrite
forwarded IP headers; distributed production abuse controls belong upstream.

Google-Extended has no HTTP user agent. Its robots token is tested separately;
the access probe uses Googlebot and reports that limitation. Protocol JSON
checks require 200, matching media type and a JSON object, not full schemas.
HTML visibility is approximate and does not execute JavaScript or CSS.

Offline tests: `bun test src/lib/agent-ready`.

Responses retain at most a 1 MiB body prefix (the existing safety budget), with
`truncated: true` when the cap is reached; status and headers survive socket
teardown. HTML, bot-access and sitemap heuristics can use that prefix. Robots,
llms.txt and JSON discovery require a complete response and report "response too
large" otherwise. The native transport requests identity encoding and does not
decompress responses, so there is no uncapped decompression buffer.

## Vercel deployment-wide protection — owner action required

The local limiter is best-effort, NOT a deployment-wide five/minute guarantee.
Fluid compute can reuse an instance concurrently, but may also scale to other
instances with independent Maps; restarts erase counters. IP selection prefers
validated `x-real-ip`, then `x-vercel-forwarded-for`, then the first
`x-forwarded-for` address, otherwise a shared unknown bucket. Self-hosted
ingress must overwrite these headers. No IP/debug data is returned to users.
See [Vercel headers](https://vercel.com/docs/headers/request-headers) and
[Fluid compute](https://vercel.com/docs/fluid-compute).

No shared KV/Redis/Upstash/Edge Config/Postgres client is wired in this repo.
The sample DATABASE_URL in .env.example is not a connected database. No store,
paid infrastructure, new environment variables or secrets were added.
Every POST counts before validation and cache lookup (including cache hits).
At most four uncached scans run concurrently per instance (each has at most
16 fetches); saturation returns 429 with Retry-After: 1 without queueing.
Slots release on success and failure; cache hits do not consume scan slots.

**Project owner: configure and enable this rule in Vercel → project → Firewall
→ Configure → New Rule**, applying it to production and preview traffic:

- Name: `agent-ready-post-per-ip`
- IF Request Path **equals** `/api/tools/agent-ready`
- AND Request Method **equals** `POST`
- THEN **Rate Limit**, strategy **Fixed Window**
- Time Window: **60 seconds**; Request Limit: **5**
- Rate-limit key: **IP Address** only (not URL, user agent or forwarded headers)
- Exceeded action: **Too Many Requests (429)**; enable/save the rule, not Log mode.

This is an owner follow-up, not a rule installed by this code change. Vercel
supports fixed-window rate limiting on all plans; confirm the project's included
rule allowance before enabling, without buying infrastructure. Firewall counters
are per region, not a strict cross-region sliding window: requests spanning
regions or a window boundary can exceed five in a rolling minute.
See [WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
Keep the local sliding window as defense in depth.

Diagnosis on 2026-11-11: eight sequential sandbox POSTs to the supplied e5368c9
preview with skillpack.app returned 200 × 5, then 429 × 3. Thus the reported
20/20 success was not reproduced; without per-instance logs it cannot be
attributed conclusively to IP selection versus instance churn. The structural
instance-local quota limitation is certain; a header preference fix alone
cannot remove it.
