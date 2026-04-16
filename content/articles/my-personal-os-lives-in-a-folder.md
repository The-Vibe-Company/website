---
title: "My personal OS lives in a folder. My agents run my company from it."
slug: my-personal-os-lives-in-a-folder
summary: "I built Quivr. The system I actually use every day to run my company does the opposite. 188 markdown files, an MCP server that teaches agents a methodology, no semantic search, no embeddings. Here's why this is where personal software is going — and how I wrote this article with it."
publishedAt: 2026-04-15
complexity: advanced
topics: Personal OS, AI Infrastructure, Knowledge Management
coverImage: /images/resources/my-personal-os-lives-in-a-folder/granite-constellation.png
coverAlt: "Granite knowledge constellation — 188 interlinked markdown notes forming a settled graph"
---

Client call in ten minutes. I hadn't prepped. I typed one prompt to Claude: "Brief me on where we stand with this account."

Thirty seconds. The draft pulled pricing from a call four months ago, a technical blocker their CTO had flagged in a meeting I'd half-forgotten, open items from two different retros weeks apart, and a contract clause I'd negotiated over email. It stitched together notes I would not have found in an hour of digging. Every paragraph traced back to the exact source file.

No web search. No embeddings. The agent walked a graph of 188 markdown files. That graph is my company.

This post is about the system that made that possible. It is also an apology to anyone who watched me spend three years building the wrong layer.

I started [Quivr](https://github.com/QuivrHQ/quivr) in 2023 with Antoine Dewez, and a team built it with us over two years — open-source RAG, Y Combinator W24, #1 trending on GitHub in July 2023. For two years, Quivr was our thesis on how LLMs and private knowledge should meet. I don't believe that thesis anymore. The system I use now does the opposite. 188 markdown files, an MCP server, a SQLite index. That is the whole stack.

![Granite knowledge constellation — 188 interlinked markdown notes forming a settled graph](/images/resources/my-personal-os-lives-in-a-folder/granite-constellation.png "188 notes, 1819 links — the company, the clients, the methodology, one graph.")

## Karpathy tweeted my thesis in April

In early April 2026, Andrej Karpathy [tweeted the alternative to RAG](https://x.com/karpathy/status/2039805659525644595): instead of re-deriving knowledge from raw docs at every query, have an LLM build and maintain a persistent wiki. Markdown. Interlinked. He ended with, "there is room here for an incredible new product instead of a hacky collection of scripts."

I had already been building it. I just did not have the words.

The guy who wrote half the papers modern deep learning is built on had just described the product I was shipping. He did not know Granite existed.

## I built the wrong layer

The RAG bet: keep documents raw, re-derive knowledge on every query, bolt a vector store onto an LLM. It works. We shipped it in production. I also watched it plateau inside our own company, and realized the thing we were selling would be commoditized inside every agent framework within 18 months.

The deeper issue was architectural. RAG re-solves the same problem every time the user asks. Nothing compounds. The system forgets on purpose.

## I did not put semantic search in Granite. On purpose.

This is the part that makes people squint.

No ChromaDB. No embeddings. No vector store. No reranker. None of it.

The index is SQLite FTS5. Navigation is wikilinks. When the agent searches, it finds one good node and follows the links. At 188 notes that is faster than a vector query. At 500 it still is. At 5000 I'll reconsider. Not before.

At the start of every Claude or Codex session, a tool called `granite_wakeup` loads a compressed snapshot of the whole vault — clusters, hubs, people, recent notes — in 350 tokens. I took the format from [MemPalace](https://github.com/milla-jovovich/mempalace), an open-source memory system that calls it AAAK: a 30× compression any LLM reads without a decoder. I kept AAAK. I dropped their ChromaDB, their emotion codes, their temporal validity. At my scale, overkill.

The guy who started Quivr does not use embeddings for his own knowledge system. Do with that what you want.

## The MCP server is a teacher, not an API

The first version of the Granite MCP server exposed twelve obvious tools: `create_note`, `search_notes`, `update_note`, the usual. It worked. It also produced garbage. Agents treated the server like a database. I ended up with a pile of disconnected files.

I rewrote it with one rule: the MCP teaches a methodology. The `instructions` field became the most important part of the server. It tells every agent that connects:

- what it is ("You are the primary writer and gardener of this vault.")
- how to think (the capture → compile → query → output → lint loop)
- when to use each tool, not just what it does
- what good looks like ("Read before writing. Link aggressively. Act on recommendations.")

Tool descriptions went from "Create a note." to "Use this when you have a clear title and know the type. Search first. Returns recommendations — act on them."

This generalizes. A deployment MCP should teach CI/CD discipline. A CRM MCP should teach pipeline hygiene. The tools are the verbs. The instructions are the grammar.

## The runtime is dumb on purpose

Granite refuses to run an LLM inside itself. No embeddings, no agent loop, no scheduler, no prompt execution. The runtime stores markdown, indexes links, and computes graph signals. That's it.

Which means when the next model ships, Granite does not change. When Claude 5 lands, when GLM-5.1 beats GPT-5, when Gemini 3 wins something, Granite keeps doing the same thing. The client updates. The runtime doesn't.

That separation is the only reason the system holds up.

## How I wrote this article

I called `granite_wakeup`. 350 tokens. The agent knew what existed in the vault.

It called `granite_research_topic` four times: "semantic search vector embeddings absence", "graph traversal links navigation", "Granite design decisions", "wakeup AAAK compression". Fifteen notes came back, ranked.

It then called `granite_understand_note` on the six central nodes: `granite`, `granite-wakeup-aaak-compressed-vault-snapshot`, `an-mcp-server-is-a-methodology-not-an-api`, `granite-as-karpathy-s-knowledge-compiler`, `mempalace-ai-memory-system-analysis`, `quivr-to-the-vibe-company-pivot-synthesis`. For each one, the agent saw the body, the backlinks, the recommendations, the graph role.

The title came from a pattern codified in a Claude Code skill called `/vibe_article-craft`, which knows four headline formats that actually work. The anti-slop pass ran through `humanizer-zh`, a Chinese-language skill cataloguing 24 patterns of LLM writing I want out. The screenshot was taken by a Playwright script (`plans/shot.mjs`) that waits for the graph to settle, clicks "Fit map", injects CSS to hide client names, and captures at 2× DPR.

Every paragraph in this article points back to a note. Every note points back to a source. The reasoning is auditable.

## What this means if you build knowledge tools

If your users are humans, you are building a notes app. It will die like the others.

If your users are agents, you need to teach them a methodology, not expose endpoints. The graph compounds because the agent is the primary operator. The system learns the company, not the other way around.

We spent two years building RAG. What I actually needed was a file system the agent knew how to garden.
