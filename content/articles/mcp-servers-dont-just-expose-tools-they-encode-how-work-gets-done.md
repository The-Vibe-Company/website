---
title: "MCP Servers Don't Just Expose Tools. They Encode How Work Gets Done."
slug: mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done
summary: "Most MCP writing stops at interoperability. The real leverage is deeper: good MCP servers teach agents a method. They encode context loading, sequencing, approval, safety, and what good work looks like."
publishedAt: 2026-04-08
complexity: advanced
topics: MCP, AI Infrastructure, Agent Design
coverImage: /images/resources/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done/cover-method-over-tools.svg
coverAlt: "Editorial cover illustration for an article about MCP servers and workflow"
---

The first Granite MCP server had the obvious tools.

`create_note`. `search_notes`. `update_note`. `get_note`. The kind of clean surface every engineer writes on the first pass.

It worked, technically. It also produced garbage.

Agents used the vault like a database. They created notes, stored fragments, searched a little, then moved on. The result was not a knowledge graph. It was a pile of disconnected markdown files with YAML frontmatter.

So we changed the server.

Not the storage layer. Same markdown files. Same SQLite index. Same vault. The change was the method.

The MCP server stopped saying "here are database operations" and started teaching the agent how the system works: wake up the vault, research before writing, capture carefully, compile scattered knowledge, preserve provenance, lint the graph, and only then produce an output. That is when the system became useful.

This is the part of MCP that most people still understate.

[MCP](https://modelcontextprotocol.io/specification/2025-11-25) is usually described as a protocol for connecting LLM applications to external tools and context. True. Useful. Necessary.

But the deeper shift is this: MCP lets us package a way of working. An API exposes what can be called. A good MCP server encodes how work should be done.

![Editorial cover for the MCP article](/images/resources/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done/cover-method-over-tools.svg "The strongest MCP servers encode the workflow, not just the tools.")

## The tools are not the product

The standard pitch for MCP is interoperability.

Instead of wiring every model, IDE, chat client, and internal system through bespoke integrations, you expose a common protocol. Servers can provide resources, prompts, and tools. Clients can connect to them in a predictable way. The ecosystem gets a shared interface. That matters, but it is table stakes.

If your MCP server only exposes a flat list of functions, the agent still has to infer everything important:

- what context to load first;
- which actions are safe reads and which are dangerous writes;
- what sequence to follow;
- when to ask the user for approval;
- how to recover when the output is weak;
- what "done" actually means.

That is too much judgment to leave implicit. A thin server gives the model reach. A strong server gives it direction.

This is why "what tools does it expose?" is the wrong first question. The better question is:

> What behavior does this server make more likely?

If the answer is "the agent can call our API", you have built an adapter. If the answer is "the agent now follows the way our best operator would do the work", you are building something more interesting.

## The instructions are the grammar

The MCP spec has three server-side primitives that matter here: resources, prompts, and tools.

Most teams obsess over the tools. That is natural. Tools feel concrete. They mutate state. They ship demos. They are easy to count.

But the behavior of an agent is shaped by the entire surface:

| Surface | What it teaches |
| --- | --- |
| Instructions | The role, method, boundaries, and definition of quality |
| Resources | What context should be loaded before action |
| Prompts | Reusable workflows and operating procedures |
| Tools | What the agent can do |
| Tool descriptions | When and why each action should be used |
| Responses | What the agent should do next |
| Authorization | Where the workflow must stop and ask |

The tools are the verbs. The instructions are the grammar. That grammar is where the methodology lives.

A deployment MCP should not merely expose `create_build`, `read_logs`, and `deploy_project`. It should teach release discipline: inspect the target environment, read failing checks first, distinguish preview from production, never promote without approval, summarize risk before mutation.

A CRM MCP should not merely expose `create_contact` and `update_deal`. It should teach pipeline hygiene: search before creating duplicates, preserve source attribution, separate notes from commitments, escalate stale opportunities, never invent next steps.

A knowledge MCP should not merely expose `create_note` and `search_notes`. It should teach research, capture, linking, compilation, output, and linting. Same protocol. Very different product.

## Granite is the clean example

[Granite](https://github.com/The-Vibe-Company/Granite) made this obvious because the underlying system did not change.

The weak version exposed generic note operations. The agent behaved like a CRUD client.

The stronger version made the public surface map to the knowledge workflow:

| Weak surface | Stronger surface |
| --- | --- |
| `search_notes` | `granite_research_topic` |
| `create_note` | `granite_capture_knowledge` |
| `get_note` | `granite_understand_note` |
| `update_note` | `granite_revise_note` |
| "List notes" | `granite_wakeup` |
| "Find problems" | `granite_plan_garden` |

The names matter less than the shift in intent. `granite_wakeup` does not just return data. It orients the agent in the vault: clusters, hubs, recent changes, people, stale areas. The first move is no longer random search. The agent starts with a map.

`granite_research_topic` does not just search text. It tells the agent to research before writing, avoid duplicates, and pull context from the graph.

`granite_plan_garden` does not ask the model to "think of improvements." Granite computes deterministic opportunities from graph and metadata signals, then the agent decides what to do. The runtime stays boring: markdown, links, SQLite, deterministic indexes. The MCP server teaches the operating model.

![Granite MCP example](/images/resources/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done/granite-same-vault-better-surface.svg "Granite becomes more useful when the server exposes the knowledge workflow instead of generic note CRUD.")

This is the design move I care about. The MCP server is not a nicer API wrapper. It is where the domain's working method becomes executable by agents.

## The CIR playbook made the same point

The same pattern showed up in a much less abstract setting: our [CIR/CII playbook](/resources/articles/laisser-lia-faire-votre-cir-sans-la-laisser-inventer).

On paper, the setup sounds like a connector story.

Give the agent access to Linear. Give it GitHub. Give it Notion. Give it Google Drive. Add exports. Let it write the dossier. That framing is wrong. The value was not the connector list. The value was the sequence.

The agent had to:

1. read the project rules;
2. explore the sources;
3. create a manifest of what each source proves;
4. extract dated evidence;
5. classify lots as CIR, CII, out of scope, or "to validate";
6. build a proof matrix;
7. identify missing evidence;
8. draft only from validated material;
9. mark weak claims instead of beautifying them;
10. compile the final document.

That is not "tool use." That is an operating procedure.

Linear did not make the project work. GitHub did not make the project work. Drive did not make the project work. The proof-compilation method made the project work.

And that is exactly the kind of method an MCP server should encode. Not necessarily all inside one tool. Sometimes in instructions. Sometimes in resources. Sometimes in prompts. Sometimes in the shape of the tool surface itself. But somewhere, the method has to exist. Otherwise the agent just has more ways to be wrong.

## Security is behavior design

Once you see MCP this way, security stops being a bolt-on checklist.

It becomes product design. The official MCP docs are explicit about consent, data privacy, tool safety, authorization, and trust boundaries. That is not incidental. MCP servers sit at the exact place where an LLM can move from text into action.

Bad MCP design does not only create vulnerabilities. It creates bad defaults.

A vague write tool encourages vague writes. An over-broad token encourages over-broad behavior. A missing approval boundary teaches the agent that production is just another environment. A server that mixes safe reads with destructive actions in the same flat surface makes it harder for the client and the user to reason about risk.

The protocol cannot magically fix that. The spec can define the architecture. Security guidance can name the risks. But your server still has to encode the actual boundaries of the work.

Good MCP design makes the safe path the obvious path. It separates read, propose, and mutate. It returns structured context instead of raw dumps. It asks for approval at the point where a human would expect to review. It makes the agent explain what it is about to do before it does something expensive, public, irreversible, or sensitive.

That is not merely security engineering. That is workflow engineering.

## What a strong MCP server should feel like

A good MCP server should feel like connecting to a senior operator, not a bag of endpoints.

Before adding another tool, ask:

| Question | Why it matters |
| --- | --- |
| What is the first thing an agent should know when it connects? | Orientation beats random search |
| What context must be loaded before action? | Most mistakes start with missing context |
| Which actions are reversible? | Reversibility should shape approval |
| What should the agent do when confidence is low? | Weak evidence should create questions, not prose |
| What does "done" mean in this domain? | The agent needs a quality bar |
| What should never happen automatically? | Boundaries should be explicit |
| What should the response tell the agent to do next? | Outputs can guide the next move |

This is where teams will differentiate. Not by connecting to more tools, but by encoding better judgment into the surface area agents use every day.

Two companies can expose the same project tracker, the same code host, the same docs, the same CRM, the same calendar.

One MCP server says:

> Here are 40 tools. Good luck.

The other says:

> Here is how this work is done here. Here is the context you load first. Here are the safe moves. Here are the review gates. Here is what good looks like.

The second one wins.

## The real competitive layer

MCP is becoming infrastructure. That is the point of a protocol. But standards do not remove differentiation. They move it.

The first wave is connectivity: can the model reach the system?

The second wave is methodology: can the model operate the system well?

That second layer is where the leverage is. It is also where most teams will underinvest, because it looks less glamorous than another integration. It is mostly instructions, naming, tool shape, resource design, consent boundaries, and boring review loops.

But this is exactly the work that makes agents useful in companies. The model does not only need tools. It needs the grammar of the work.

Ship the grammar.

## Further reading

- [My personal OS lives in a folder. My agents run my company from it.](/resources/articles/my-personal-os-lives-in-a-folder)
- [Playbook : préparer votre dossier CIR avec Claude Code en 10 étapes](/resources/articles/laisser-lia-faire-votre-cir-sans-la-laisser-inventer)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security%5Fbest%5Fpractices)
- [Anthropic introducing MCP](https://www.anthropic.com/news/model-context-protocol)
- [OpenAI MCP documentation](https://developers.openai.com/api/docs/mcp)
- [Granite on GitHub](https://github.com/The-Vibe-Company/Granite)
