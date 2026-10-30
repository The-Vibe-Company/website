---
name: The Vibe Company public agent access
authentication: none
---

# The Vibe Company auth.md

Audience: AI agents accessing The Vibe Company's public resources.

## Registration and provisioning

Registration/provisioning endpoint: none required. No registration, account,
API key, OAuth token, or other credentials are needed for public access.

## Supported methods

Anonymous/no-auth public access only. All public site pages, Markdown
representations, `/mcp`, `/a2a`, and well-known discovery documents are public
and read-only. There is no OAuth authorization server or protected resource
on these endpoints.

## Credential use

None. Do not send credentials, cookies, API keys, or bearer tokens to these
public resources. No credentials are issued or stored by these agent tools.

## Public resources

- Content index: https://www.thevibecompany.co/llms.txt
- Sitemap: https://www.thevibecompany.co/sitemap.xml
- MCP endpoint: https://www.thevibecompany.co/mcp (Streamable HTTP, JSON responses)
- A2A endpoint: https://www.thevibecompany.co/a2a
- MCP discovery: https://www.thevibecompany.co/.well-known/mcp/server-card.json
- A2A discovery: https://www.thevibecompany.co/.well-known/agent-card.json
- Skills: https://www.thevibecompany.co/.well-known/agent-skills/index.json

The MCP and browser tools are `list_articles`, `read_article`, and
`get_booking_link`. They return only public content. They cannot modify data,
make bookings, access accounts, or retrieve private customer information. The
booking link opens Cal.com, where the user chooses whether to book and submits
their own details.
