---
title: "My personal OS lives in a folder. My agents run my company from it."
slug: my-personal-os-lives-in-a-folder
summary: "I built Quivr. The system I actually use every day to run my company looks nothing like it. 188 plain markdown files, an MCP server that teaches agents a methodology, and a local runtime. Here's why this is where personal software is going."
publishedAt: 2026-04-15
complexity: advanced
topics: Personal OS, AI Infrastructure, Knowledge Management
coverImage: /images/resources/my-personal-os-lives-in-a-folder/granite-constellation.png
coverAlt: "Granite knowledge constellation — 188 interlinked markdown notes forming a settled graph"
---

Last Sunday I asked Claude to write an investor update for me. Thirty seconds later it had pulled this quarter's client numbers, cross-referenced three meeting notes from last week, and produced a draft I barely edited. I did not upload anything. I did not paste context. The agent walked into a folder on my laptop, read what it needed, and wrote.

I used to spend an hour on those.

This post is about the system that made that possible. It is also an apology to anyone who watched me spend three years building the wrong thing.

I built [Quivr](https://github.com/QuivrHQ/quivr) — open-source RAG, Y Combinator W24, #1 trending on GitHub for two days in July 2023. For two years, Quivr was my thesis about how LLMs and private knowledge should meet. I don't believe that thesis anymore. The system I run now does the opposite of RAG, and it handles my knowledge, my writing, my client work, and my operations. It is 188 plain markdown files, an MCP server, and a local runtime. That is the entire stack.

![Granite knowledge constellation — 188 interlinked markdown notes forming a settled graph](/images/resources/my-personal-os-lives-in-a-folder/granite-constellation.png "188 notes, 1819 links — the company, the clients, the methodology, one graph.")

Here is how it works, and why I think this is where personal software is going.

## RAG was the wrong layer

The RAG bet was: keep documents raw, re-derive knowledge at every query, bolt a vector store onto an LLM. It works. I shipped it in production. I also watched it plateau inside my own company and realized the thing I was selling would be commoditized inside any agent framework within 18 months.

The deeper issue was architectural. RAG re-solves the same problem every time the user asks a question. Nothing compounds. The system forgets on purpose.

On April 4, 2026, Andrej Karpathy tweeted the alternative: instead of RAG over raw docs, have the LLM incrementally build and maintain a persistent wiki. Markdown files. Interlinked. Karpathy called the missing product "an incredible new product instead of a hacky collection of scripts."

I had already been building it. I just did not have the words.

## The system: Granite

Granite is open source at [github.com/The-Vibe-Company/Granite](https://github.com/The-Vibe-Company/Granite). It is a markdown knowledge base with four note types:

- `source` — imported material, close to the original. Provenance.
- `note` — one atomic idea per file. The backbone.
- `synthesis` — compiled knowledge connecting several notes. The most valuable type.
- `output` — audience-specific deliverables. Always `derived_from` something durable.

Flow: `source → note → synthesis → output`. Plain `.md` files with YAML frontmatter. SQLite FTS5 index derived from the files. If my disk survives and the database does not, I lose nothing.

Right now my vault is 188 files. Here is what `granite status` prints in my terminal:

```
My Vault

  188 notes: 111 notes, 54 sources, 16 syntheses, 7 outputs
  Attention: 14 inbox, 28 drafts, 5 orphans
  Health: 1 error(s) — run granite doctor

Next:
  → Process your inbox: 14 note(s) waiting
  → Review drafts: 28 active draft(s)
  → Connect 5 orphan note(s)
```

Every investor update, client memo, weekly retro, and X article I publish points back to that graph through `derived_from` metadata. I can audit my own reasoning.

The human rarely edits notes. The LLM does.

## The real insight: the MCP server is a teacher, not an API

My first version of Granite exposed twelve obvious tools: `create_note`, `search_notes`, `update_note`, the usual. It worked. It also produced garbage. Agents treated it like a database. I ended up with a pile of disconnected files.

Then I rewrote it with one rule: the MCP server teaches a methodology. The `instructions` field became the most important part of the server. It tells every agent that connects:

- what it is ("You are the primary writer and gardener of this vault.")
- how to think (the capture → compile → query → output → lint loop)
- when to use each tool, not just what it does
- what good looks like ("Read before writing. Link aggressively. Act on recommendations.")

Tool descriptions stopped being "Create a note." They became "Use this when you have a clear title and know the type. Search first. Returns recommendations — act on them."

This generalizes to anything. A deployment MCP should teach CI/CD hygiene. A CRM MCP should teach pipeline discipline. If your MCP server ships without instructions, you are shipping a skeleton. The tools are the verbs. The instructions are the grammar.

## Garden: the runtime around the vault

Granite is deterministic on purpose. It stores, indexes, computes graph signals. It does not run agent loops or schedule work. Everything with state over time lives in a second layer I call Garden — a local runtime that owns scheduling, webhook ingestion, workflow execution, and the attention queue. Garden is AI-capable, not AI-native. It works with or without an LLM in the loop.

This separation matters. Granite stays a markdown engine I can trust. Garden decides what I should look at next. The LLM sits outside both and operates them through MCP.

## The skill layer that makes it compound

On top of Granite and Garden, I run about a dozen Claude Code skills that chain into three pipelines:

- **Knowledge**: `/vibe_capture-url` → `/granite-capture` → `/vibe_vault-garden` → `/granite-compile` → `/granite-brief`. URLs become sources, sources become notes, notes get gardened into syntheses, syntheses become audience-specific outputs.
- **Content**: `/vibe_meeting-digest` or `/vibe_daily-learning` → `/vibe_article-craft` → `/vibe_site-publish` or `/vibe_x-publish`. Meetings and learnings turn into articles and threads. Outcomes go back into the vault.
- **Operations**: `/vibe_retro` → `/vibe_vault-garden` → next-week priorities. Weekly retros pull from Granite, git, and X and tell me where to aim next.

`granite_wakeup` loads a 300-token compressed vault snapshot at the start of every Claude session. That alone prevents entire categories of stupid agent behavior. No more "I don't have access to your files." The agent walks in already knowing what exists.

## What this means if you are building a knowledge tool

Three things compound that do not compound in Notion, Obsidian, or any other app I have tried:

1. **The graph compounds.** Every new source touches five to fifteen existing notes through wikilinks. What was already there gets richer every week.
2. **The agent gets better at operating my life.** The MCP teaches methodology. Any Claude Code or Codex session connecting to Granite immediately knows how to behave. No re-explaining.
3. **Every output is traceable.** Every brief, email, article has `derived_from` pointing at durable notes. The reasoning is auditable.

If you are building for humans as primary users, you are building a notes app and it will die like the others. Build for agents as primary operators.

I spent three years building RAG. The system I actually use is the opposite. Plain markdown. Local first. Agents as operators. An MCP server that teaches them how to behave.

Pull Granite. Point an MCP-compatible client at it. Let the agent do the gardening.

The human curates. The agent compiles. The graph compounds.
