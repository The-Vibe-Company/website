---
title: "MCP servers at work: security principles and requirements"
seoTitle: "What is an MCP server? Security for business"
slug: what-is-an-mcp-server
translationKey: mcp-server-business-guide
language: en
summary: "What is an MCP server? Security requirements of the 2026-07-28 spec, four 2025 incidents, 300 registry servers probed on November 11, 2026, and a checklist."
publishedAt: 2026-10-21
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, AI Operations, Security
coverImage: /images/resources/serveur-mcp-entreprise/cover-mascotte.webp
coverAlt: "The mascot plugs a universal connector into a switchboard that links an AI agent to the company's tools, each cable fitted with a padlock"
ogImage: /images/resources/serveur-mcp-entreprise/cover-mascotte.webp
---

On November 11, 2026, 179 of the 276 reachable remote servers in a sample of the official MCP registry accepted a connection without a token. That isn't a flaw: the 2026-07-28 spec leaves authorization optional. But the registry doesn't tell you which servers require a token, and checking that is up to you.

This breakdown follows the order of a CIO or a CISO whose team asks to plug in an agent. First come the spec's principles and requirements, then what already broke in 2025, then the details of the probe on 300 registry servers. The checklist comes last.

## MCP in four lines: host, client, and server

[Anthropic open-sourced MCP on November 25, 2024](https://www.anthropic.com/news/model-context-protocol), as a standard for connecting AI assistants to the systems where data lives. An MCP server at work exposes a tool, such as a CRM or a database, to AI agents through this standard protocol. On December 9, 2025, the [Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) formed the Agentic AI Foundation (AAIF), which received MCP. MCP then counted more than 10,000 published servers, according to the Linux Foundation. Claude, Cursor, Microsoft Copilot, Gemini, VS Code, and ChatGPT have adopted it.

The [official documentation](https://modelcontextprotocol.io/docs/learn/architecture) describes three roles. The host is the AI application, which manages one or more clients. Each client holds a dedicated connection to one server, and the server exposes tools to act, resources to read, and reusable prompts. A local STDIO server typically serves a single client, and a remote Streamable HTTP server serves many. For remote servers, MCP recommends OAuth.

## MCP spec 2026-07-28: principles, requirements, and recommendations

![The 4 control points of an MCP server, from user to downstream API: principle, requirements, recommendation. Detailed below.](/images/resources/what-is-an-mcp-server/4-mcp-server-control-points.png){.diagram}

The [spec](https://modelcontextprotocol.io/specification/2026-07-28) separates principles, which it says it can't enforce at the protocol level ("While MCP itself cannot enforce these security principles at the protocol level"), from key words in capitals: MUST for a requirement, SHOULD for a recommendation. Its key words carry their normative meaning only "when, and only when, they appear in all capitals": a lowercase "must" binds no one.

### Two principles: consent and tools

**Consent.** Among its "Key Principles", the spec wants hosts to obtain explicit user consent before exposing user data to a server and before calling a tool: "Hosts must obtain explicit user consent before invoking any tool". This lowercase "must" remains a principle. Your contract can turn it into a requirement: the AI tool you pick shows each tool call and waits for approval.

**Tools.** In the same principles, the spec states "Tools represent arbitrary code execution" and asks you to treat tool descriptions as untrusted, unless the server is trusted. Plugging in a server means running code in your environment.

### The spec's requirements, in capitals

**Authorization.** It stays optional: "Authorization is OPTIONAL for MCP implementations". When a server supports it, the server must (MUST) implement OAuth 2.0 Protected Resource Metadata (RFC 9728). A server without authorization stays compliant. So at each purchase, ask whether the server requires a token.

**The token.** A server must (MUST) "validate that tokens presented to them were specifically issued for their use", and clients must use PKCE S256 when they can. It must not (MUST NOT) relay the token it got from the client: "The MCP server MUST NOT pass through the token it received from the MCP client". The [official best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) call this relay "Token passthrough": accepting a token meant for another service and forwarding it to the downstream API.

**Elicitation.** A server must not (MUST NOT) use form mode to request sensitive information. URL mode sends the user to an external page, so that these exchanges "must not pass through the MCP client".

### Recommendations and best practices

**Scopes.** The spec recommends (SHOULD) least privilege: "MCP clients SHOULD follow the principle of least privilege by requesting only the scopes necessary for their intended operations". A server that supports authorization should also (SHOULD) "include a `scope` parameter in the `WWW-Authenticate` header" of its 401 response. Ask for minimal scopes at the start.

**Best practices on scopes.** The examples files:*, db:*, and admin:* come from the best practices cited above. That document, published in the docs rather than in the specification, presents itself as "complementing the MCP Authorization specification". It warns that "Poor scope design increases token compromise impact". Broad scopes granted up front worsen the impact of a stolen token.

**Local servers.** The same best practices note that "Local MCP servers are binaries that are downloaded and executed" on the machine. Without a sandbox or consent, they expose that machine to attacks.

## Version 2026-07-28 changes MCP client registration

Version 2026-07-28 deprecates Dynamic Client Registration (DCR) in favor of Client ID Metadata Documents (CIMD), according to the [official protocol blog](https://blog.modelcontextprotocol.io/posts/2026-07-28/): "Dynamic Client Registration itself is now formally deprecated in favor of CIMD". DCR still works, but it will go away. Clients must also validate the iss parameter (RFC 9207) before exchanging a code: "This closes an authorization-server mix-up hole". So ask your vendor which spec version its server follows.

## The 2025 MCP incidents show four risks

Four incidents from 2025 each show one risk: malicious content, a vulnerable client, a booby-trapped package, and a leak between organizations.

| Incident | Date | What broke | Spec rule that would have limited it (reading) |
| --- | --- | --- | --- |
| [GitHub's official MCP server](https://invariantlabs.ai/blog/mcp-github-vulnerability), according to Invariant Labs | May 26, 2025 | A malicious issue hijacks the user's agent and makes it leak data from private repositories | Untrusted descriptions and content, consent before each tool call |
| [mcp-remote](https://jfrog.com/blog/2025-6514-critical-mcp-remote-rce-vulnerability/), CVE-2025-6514, CVSS 9.6 | 2025 | OS command injection when connecting to an untrusted MCP server, versions 0.0.5 to 0.1.15, fixed in 0.1.16 | Untrusted servers treated as arbitrary code |
| [postmark-mcp](https://www.bleepingcomputer.com/news/security/unofficial-postmark-mcp-npm-silently-stole-users-emails/), according to BleepingComputer | September 2025 | Unofficial npm package, clean up to 1.0.15; version 1.0.16 blind-copied every email to an external address | Local server run as a binary on the machine |
| [Asana](https://www.bleepingcomputer.com/news/security/asana-warns-mcp-ai-feature-exposed-customer-data-to-other-orgs/), according to BleepingComputer | May 1 to June 4, 2025 | A logic flaw exposed one organization's data to others | Token issued for the server, minimal scopes |

The last column is a reading: it ties each incident to a spec rule, without claiming the rule would have prevented it. For postmark-mcp, the facts come from Koi Security, cited by BleepingComputer, with around 1,500 downloads in one week. For Asana, BleepingComputer cites an Asana spokesperson, who puts the incident at about 1,000 customers. Asana took the server offline. For mcp-remote, the [NVD](https://nvd.nist.gov/vuln/detail/CVE-2025-6514) places the injection in the authorization_endpoint URL.

## The official MCP registry doesn't guarantee authorization

On November 11, 2026, out of 300 remote servers drawn at random from the official MCP registry, 179 of the 276 reachable ones, or 65%, accepted an initialize request without a token, and 95, or 34%, answered 401. Of the 95 responses with a 401, 79 (83%) pointed to their OAuth metadata (RFC 9728) in the WWW-Authenticate header. At least 32 (34%) announced a scope.

The registry held 61,974 latest-version entries that day, 61,002 of them active. The probe sent a single initialize request, with no token, to 300 streamable-http endpoints drawn from 40,211, and it never listed or called any tool. The limits fit in a few words: a single pass, a margin of about ±6 points, a header cut at 300 characters. A server can accept the connection and ask for authentication later, at the tool level. No server is named.

This result reveals no flaw, since authorization is optional in MCP. It shows what the registry doesn't tell you: whether a server requires a token, and which scopes it asks for. That test is yours to run.

The [official registry](https://modelcontextprotocol.io/registry/about) is also in preview, with breaking changes or resets possible before general availability. It delegates security scanning to package registries, such as npm, PyPI, and Docker Hub, and to downstream aggregators. It can manually remove spam or malicious servers.

## Install an existing MCP server or build your own

| Situation | Sensible choice |
| --- | --- |
| The tool's vendor publishes an official server | Start there, after reviewing the permissions it requests |
| Only a community server exists | Read it before installing it, or rewrite it |
| Internal tool, business database, in-house process | Build a dedicated server, limited to the useful actions |
| A whole team, sensitive data | A remote server, with authentication and logging |

A good dedicated server exposes few actions, well named and tied to real tasks.

## Checklist before you plug an agent into an MCP server

1. **Level of authority.** For each exposed tool, decide whether the agent can read, propose, prepare, or execute. Start read-only. The full grid is in [the real risk of AI agents, authority (in French)](/fr/resources/articles/agents-ia-formation-autorite).
2. **Authentication.** A remote server must know who is calling it. If it supports authorization, the spec requires RFC 9728.
3. **No relayed token.** The spec forbids it (MUST NOT). Turn down a server that forwards to the downstream API a token meant for another service.
4. **The user's rights, nothing more.** An agent acting for a person sees only what that person sees. Minimal scopes remain a recommendation of the spec (SHOULD). Require them in the contract.
5. **Human approval on sensitive actions, written into the contract.** The spec makes it a principle it can't enforce: require in the contract explicit approval before each sensitive tool call. Form mode, for its part, never serves to request sensitive information (MUST NOT).
6. **The log.** Each tool call leaves a trace: who, what, when, with what result.

To begin, three steps are enough:

1. Pick a single use case, with one tool and one repetitive task.
2. Plug in a read-only server for a small team, and watch what the agent really asks for.
3. Open writing one action at a time, with human approval at first.

Further reading: the [guide to AI agents for business](/en/resources/articles/ai-agents-for-business), the [POC to production checklist](/en/resources/articles/ai-agent-poc-to-production), and [enterprise RAG](/en/resources/articles/enterprise-rag). Also: [the company memory agents lack](/en/resources/articles/agents-dont-lack-tools-they-lack-company-memory) and [what a good MCP server encodes](/en/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done).

## FAQ

**Does a listing in the official MCP registry guarantee a server's security?**
No. The registry delegates security scanning to package registries and downstream aggregators, and it can only manually remove spam or malicious servers. It is also in preview. It doesn't tell you whether a server requires a token either: test that point yourself before you plug in an agent.

**What is the difference between an LLM and an MCP server?**
The spec calls the host an "LLM application": it is the AI application, such as Claude or ChatGPT, that uses the model. The MCP server isn't a model. It's the program that exposes tools, resources, and prompts to that host, through a dedicated client. MCP only governs the context exchange and leaves the use of the LLM to the application.

**Must an MCP server require authentication?**
The spec makes authorization optional. When a server supports it, the server must implement RFC 9728, check that each token is meant for it, and never relay a token to the downstream API. Minimal scopes are a recommendation (SHOULD). For a remote server that touches your data, MCP recommends OAuth: require it in your specifications.

## Plug your agents into an MCP server

You want to plug your agents into your internal tools, or have an MCP server reviewed before you install it. Bring the list of tools and requested permissions.

[Book a call](https://cal.com/stangirard/thevibecompany)
