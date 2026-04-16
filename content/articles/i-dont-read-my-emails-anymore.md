---
title: "I don't read my emails anymore. My agent classifies, archives, and briefs me."
slug: i-dont-read-my-emails-anymore
summary: "A 650-line Claude Code skill replaced my manual inbox zero ritual. It classifies every thread, archives noise, drafts replies from my knowledge vault, and generates a morning brief I review in two minutes. Here is how it works and why I built it."
publishedAt: 2026-04-16
complexity: advanced
topics: Personal OS, AI Agents, Automation, Claude Code
coverImage: /images/resources/i-dont-read-my-emails-anymore/cover-inbox-zero-agent.png
coverAlt: "A pile of chaotic envelopes on the left dissolving into a clean desk with a single card on the right"
---

Tuesday morning, 8:12 AM. I open my terminal. I type `/inbox-zero`. Three minutes later, an HTML page opens in my browser. Two emails need a click. Fourteen have already been archived. I approve a client reply, keep a prospect thread visible for a follow-up on Thursday, and close the tab.

Inbox zero. Before my coffee.

I built [Quivr](https://github.com/QuivrHQ/quivr), an open-source RAG tool that crossed 36,000 stars on GitHub. We processed other people's documents. Now I run The Vibe Company, and the document I process most is my own email. I applied the same logic: an agent that reads, classifies, and proposes an action. Except this time, the agent runs inside [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview), and the entire system fits in a SKILL.md file.

If you have read [my personal OS article](/resources/articles/my-personal-os-lives-in-a-folder), you know the stack: 188 markdown files, an [MCP server](https://modelcontextprotocol.io/) called [Granite](https://github.com/The-Vibe-Company/granite), no embeddings, no vector store. The inbox zero skill is the first real workflow that runs on top of that system. It is also the one that proved the architecture works.

## The problem with inbox zero

Inbox zero is not a discipline problem. It is a classification problem.

Every morning, a founder's inbox contains a mix of cold outbound spam, supplier invoices, client emails waiting for a reply, prospect threads to follow up on, admin alerts, and relationship context that demands nothing but you don't want to lose. The real work is not reading everything. It is knowing what to do with each thread in under five seconds.

A basic auto-sorting tool is not enough. It archives too much or too little. It does not know that a given contact is an active client, that a given thread deserves a follow-up in three days, or that the real information lives in the attachment, not the email body.

## A skill, not an app

My solution is not a SaaS. It is a [Claude Code skill](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done). A folder with a 650-line `SKILL.md` file that encodes the entire workflow.

If you are not familiar with Claude Code skills, think of them as instruction files that turn a general-purpose AI agent into a specialized operator. The `SKILL.md` file describes what the agent should do, when, and how. The agent reads it and follows it. No code to compile, no API to deploy. A markdown file and a few supporting scripts.

The skill knows my mailboxes. It knows which transport to use for each address. It knows my archiving rules, my confidence thresholds, and my active contacts via [Granite](https://github.com/The-Vibe-Company/granite), my personal knowledge vault. When I type `/inbox-zero`, it connects to Gmail, pulls every non-archived thread, and starts working.

### 10 use cases

Every thread is classified into exactly one use case:

- `trash` and `cold_outbound_spam` — direct archive, zero friction
- `finance` — invoices detected, forwarded to accounting, archived
- `admin_security` — Google Workspace, GitHub, IAM alerts: risk summary + proposed action
- `reply` — someone is waiting for an answer, the skill searches Granite for context and drafts a response
- `follow_up` — I was the last sender, no reply, thread stays visible with a follow-up date
- `waiting_or_follow_up` — pending action, not the right time to act yet
- `knowledge` — durable context to capture in Granite
- `fyi_relationship` — relationship signal, no action needed, but I want to know
- `done_archive` — closed loop, quick recap then archive

Classification is strict: no important action without a locked use case. Spam goes straight out. Everything else passes through a decision grid.

## The morning brief

The default output format is not a wall of text in the terminal. It is a local HTML page the agent generates and opens in the browser.

![Morning brief hero section showing a scoreboard with 2 items to handle, 3 useful signals, 14 automatic decisions, and 4 already done](/images/resources/i-dont-read-my-emails-anymore/cover-inbox-zero-agent.png)

At the top: a scoreboard. How many emails to handle, how many useful signals, how many automatic decisions, how many already done. In ten seconds, I know where I stand.

The "Handle now" section only contains threads that need a real human decision. Each card shows the subject, sender, proposed action, and context chips: "known client in vault", "meeting confirmed for Friday", "attachment: scope document". Below each card: buttons to Approve, Keep visible, Archive, or Comment.

"Good to know today" shows useful signals with no action required. Payment received, domain renewal in 30 days, positive feedback from a workshop attendee. Context, not cognitive load.

The automatic journal is collapsed by default. It lists every decision made without intervention: 8 cold outbound spam threads archived, 3 vendor notices filed, 2 payment receipts archived. Each rule has a button to keep it on auto, ask next time, or pause. And a durable comment field that persists across mornings.

## What Gmail filters can't do

Three mechanisms set this apart from a classic filter.

**Granite as relationship memory.** Before classifying a thread, the skill checks whether the sender, company, or project already exists in my knowledge vault. An email from a known contact will never be silently archived. A thread from an active prospect automatically triggers a follow-up proposal. And when the skill needs to draft a reply, it pulls context from Granite: relationship history, past decisions, project terminology. This is the same [knowledge graph described in the personal OS article](/resources/articles/my-personal-os-lives-in-a-folder) — 188 notes, no semantic search, just a linked graph the agent walks.

**Delegated rules that evolve.** The system maintains a `state.json` file with automatic archiving rules by mail type. Overdue CRM digests: auto-archive. Zendesk article reminders: auto-archive. Stripe receipts: auto-archive. These rules build up over passes. The first time, the skill asks me. The second time, if the pattern is clear, the rule becomes permanent.

**The JSON bridge.** Each brief generates a machine-readable snapshot. When I click "Approve" on an action, the state is saved locally via a lightweight Python server. The agent can read that file back and execute the approved decisions without a new chat message. The workflow: read the brief, click, let the agent apply.

## What it changes day to day

Before this skill, an inbox pass took me 20 to 40 minutes. Not because I had many important emails, but because the mental noise of sorting spam, notifications, and ambiguous threads consumed all the attention.

Now, normal mornings look like this: 2 minutes to open the brief, approve 1-2 actions, and move on. On busy mornings, the skill has already sorted everything and presents the 3-4 real subjects with a draft reply informed by vault context.

The real gain is not time. It is that the system learns. Every pass makes the next one quieter. Every delegated rule removes a type of noise forever. Every Granite capture makes the next draft reply more relevant.

## Under the hood

The entire skill is a folder in my repo:

```
skills/vibe_inbox-zero/
  SKILL.md                    # 650 lines — the brain
  state.json                  # machine config — rules, archive posture
  scripts/state.py            # CLI to inspect/modify state
  scripts/review_bridge.py    # micro-server to persist clicks
  templates/morning-brief-template.html  # reusable template
  runtime/briefs/             # briefs generated each morning
  runtime/review-state/       # JSON snapshots of decisions
```

No database. No backend. No API to maintain. A markdown file that tells the agent what to do, a JSON that remembers preferences, and an HTML template that serves as the interface.

The skill runs on [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) and [Codex](https://openai.com/index/introducing-codex/) alike. The same instruction produces the same result because all the business logic is in the file, not in the tool. That is the core idea behind [MCP as methodology](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done): the instruction file carries the workflow, not the runtime.

---

Agent-driven inbox zero is not magic. It is 650 lines of business rules written by someone who was tired of sorting his email. The bar is simple: if I have to explain the same rule to the agent twice, the skill is not finished.

---

**Related reading:**
- [My personal OS lives in a folder](/resources/articles/my-personal-os-lives-in-a-folder) — the knowledge vault this skill runs on
- [MCP servers encode how work gets done](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done) — why SKILL.md works
- [AI gets more valuable with better context, not speed](/resources/learnings/2026-04-08-ai-gets-more-valuable-when-it-has-better-context-not-when-it-moves-faster) — the design principle behind Granite
- [An MCP server is not an API](/resources/learnings/2026-04-07-an-mcp-server-is-not-an-api) — short learning on the same idea
- [Granite on GitHub](https://github.com/The-Vibe-Company/granite) — the open-source knowledge vault
- [Quivr on GitHub](https://github.com/QuivrHQ/quivr) — the RAG tool that started it all
