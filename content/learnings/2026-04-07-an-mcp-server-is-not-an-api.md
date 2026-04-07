---
title: "An MCP server is not an API. It's a teacher."
slug: 2026-04-07-an-mcp-server-is-not-an-api
summary: "The instructions field matters more than the tools."
publishedAt: 2026-04-07
topics: AI & Automation, Development
---
We built an MCP server with 12 tools. "Create note." "Search notes." "Update note." Clean API, good docs.

The agent used it like a database. It created notes, stored them, never connected them. The vault was a pile of files.

We rewrote the instructions. Same 12 tools. But now each tool says when and why to use it. The server teaches a methodology: capture, compile, query, output, lint. The agent stopped being a CRUD client and started being a knowledge gardener.

**Rule:** the tools are the verbs. The instructions are the grammar. Ship the grammar.
