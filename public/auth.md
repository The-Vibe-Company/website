---
name: The Vibe Company public agent access
authentication: none
---

# auth.md — public access

No authentication, account, API key, OAuth token, or agent registration is required
to read The Vibe Company's public website or use its public read-only agent tools.

- Content index: https://www.thevibecompany.co/llms.txt
- Sitemap: https://www.thevibecompany.co/sitemap.xml
- MCP endpoint: https://www.thevibecompany.co/mcp (Streamable HTTP, JSON responses)
- MCP discovery: https://www.thevibecompany.co/.well-known/mcp/server-card.json
- A2A discovery: https://www.thevibecompany.co/.well-known/agent-card.json
- Skills: https://www.thevibecompany.co/.well-known/agent-skills/index.json

The MCP tools are `list_articles`, `read_article`, and `get_booking_link`.
They return only public content. They cannot modify data, make bookings, access
accounts, or retrieve private customer information. The booking link opens Cal.com,
where the user chooses whether to book and submits their own details.

There is no OAuth authorization server or protected resource on these public
endpoints. Do not send credentials. This document describes unauthenticated access;
it does not advertise an agent registration or token issuance service.
