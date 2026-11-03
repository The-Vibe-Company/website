# Public agent access

The site exposes source-backed Markdown for `/`, `/fr`, `/en` and localized
`/resources/articles/<slug>` pages when the client accepts `text/markdown`.
HTML and Markdown vary on `Accept`; rewrites isolate Markdown from HTML SSG/ISR.
Article language redirects follow the existing HTML canonical rules.

Next.js 16.1.1 overwrites custom `Vary` values in its App Page response template
([upstream issue #85852](https://github.com/vercel/next.js/issues/85852)).
The Bun patch in `patches/next@16.1.1.patch` merges existing values with Next's
RSC fields in both distributed templates. The manifest patch also includes `Accept`
in the default RSC Vary fields consumed by Vercel's static/SSG adapter; otherwise
the CDN replaces the configured Vary header on prerendered HTML. Keep this patch until an upgrade
preserves custom `Vary` values; validate with `bun run agents:check` before removing it.

`/.well-known/agent-skills/index.json` describes the two static SKILL.md artifacts.
After changing a skill, update its index digest to the SHA-256 of the exact file
bytes. `bun test src/lib/agent-discovery.test.ts` validates digests and frontmatter.

`/mcp` implements stateless Streamable HTTP with JSON responses for MCP
2025-06-18. Clients send `Accept: application/json, text/event-stream`
and `Content-Type: application/json`. Supported methods: `initialize`, `ping`,
`tools/list`, `tools/call`; notifications receive 202. GET returns 405 because no
server-initiated SSE stream is offered. Only `list_articles`, `read_article`,
and `get_booking_link` are exposed. Lists have bounded pagination. Reads resolve
slugs through the existing public content index, never arbitrary filesystem paths
or remote URLs. No sessions, persistence, external model calls, or booking writes.

`/a2a` implements A2A 0.3 `message/send` with immediate Message responses. A user
message's DataPart can contain `{ "name": "read_article", "arguments": { "slug": "..." } }`
or another public MCP tool name. Text messages return discovery and booking links.
Tasks, streaming, push notifications and private content are not supported.

The MCP card uses the current Server Card v1 format at `/mcp/server-card`, with
an AI Catalog at `/.well-known/ai-catalog.json`. The scanner's older discovery
paths `/.well-known/mcp.json` and `/.well-known/mcp/server-card.json` are also served.
`/.well-known/api-catalog` serves the RFC 9727/RFC 9264 JSON linkset.

Public access is described by `/auth.md`. There is no OAuth issuer to advertise
for this website; publishing a fabricated authorization server would mislead
clients. This repository does not own the separate Skillpack authentication flow.

## Web Bot Auth follow-up

TODO: configure an outbound agent signing identity outside this repository before
publishing `/.well-known/http-message-signatures-directory`. Generate and store the
private signing key in the deployment secret manager, publish only its public JWK
and key identifier, and implement HTTP Message Signatures on outbound requests.
This site currently sends no signed agent requests; an empty or invented JWKS would
not provide Web Bot Auth. No private signing key is generated or stored here.

The scanner may also report DNS-AID, OAuth registration, commerce, WebMCP, or other
protocols that this public content site does not provide. Report those results
honestly; do not publish metadata for nonexistent services to improve the score.
