---
title: "Multi-agent system: why I am rebuilding Vercel Board"
seoTitle: "Multi-agent system: why I am rebuilding Vercel Board"
seoDescription: "Multi-agent system for coding agents: mine never needed Linear, they needed a shared board. Vercel Board, my open source Open Board, and Armada."
slug: multi-agent-system-vercel-board
translationKey: multi-agent-system-vercel-board
language: en
summary: "Coding agents that work together need one place to take a task, hold it for a limited time and hand back the result. Vercel Board does that. I built an open source version, Open Board, with Armada."
publishedAt: 2026-11-24
complexity: intermediate
topics: AI Agents, Multi-Agent Systems, Vercel Board, Armada
author: stan-girard
coverImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
coverAlt: "The Vibe Company mascot pins cards on a corkboard, surrounded by small robots that each hold a card"
ogImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
---

A multi-agent system, for coding agents, is several agents sharing one project. Each one takes a task, holds it while it works, then hands the result back to the others. Launching the agents is the easy part. The hard part is giving them one shared place to split the work.

Until now, that place was Linear for me. I used it just to make tickets and let the agents talk to each other. On November 18, 2026, Vercel shipped [Vercel Board](https://vercel.com/blog/introducing-vercel-board). I dug into it on the 23rd and saw that this was what I actually needed. The same day, I pointed Armada at it to build an open source version: [Open Board](https://github.com/The-Vibe-Company/openboard).

## What is a multi-agent system when the agents write code?

It's a team of agents sharing a backlog, with rules that keep them out of each other's way. The textbook definition (Wikipedia, IBM, Google Cloud) is a set of autonomous agents interacting in a shared environment. For coding agents, the shared environment is the list of work to do.

Vercel frames the problem well in its launch post: "A single agent can track its work in a Markdown file, but there isn't a purpose-built primitive for tracking tasks, delegation, statuses, logs, and completed work across many agents and subagents." One agent gets by with a file. Several agents need to know who took what, what waits on what, and what's done.

Those agents can run on different machines and in different tools. Vercel names Claude Code, Codex, Pi, OpenCode, eve, fx, Mastra and LangChain, which can collaborate "as if they were a single harness".

## Why wasn't Linear enough for my agents?

Because I only used Linear for one thing: a place where agents find a ticket and leave a message. That's not much. Cycles, roadmaps and views did nothing for my agents. As I put it after reading about Vercel Board, technically I didn't need that, I needed a Vercel board.

A ticket stays where you put it. A board for agents has to handle the agent that takes a task and then crashes. In Vercel Board, taking a task means signing a lease of 5 minutes at most. The agent renews it while it works. If it stops, the task is free again. The vercel/board README sums it up: "A claim is a lease the board gives to one agent, so two agents never hold one task."

I had tried to add a ticketing system to Armada a while back. I stopped. It was ticketing, and the idea of a shared board hadn't crossed my mind.

## What does Vercel Board actually do?

Vercel Board is a message and task board for agents, available since November 18, 2026 on all Vercel plans, as an experimental feature. Agents read and write to it through the Vercel CLI or the JavaScript SDK. Vercel first built it for its own security agents, then rebuilt v0's software factory on it, which "now merges over 50% of PRs" according to the launch post.

The model is simple. Each board holds channels and threads. A thread keeps the original report, the discussion and the pull request, so another agent or a person can review the work. Here is a task's life cycle, as the launch post shows it:

```bash
# Claim the next ready task in a channel
vercel board tasks claim --ready dev --label kind=bug --wait 10m

# Post progress
vercel board post <id> "Working on it. This might take me ~30 minutes."

# Extend the lease if the task is harder than expected
vercel board tasks renew <id> --lease 1h

# Hand back the result
vercel board tasks complete <id> "Can I get a review? <pr-url>"
```

The rest comes down to six features, all described in the launch post and the docs:

| What a team of agents needs | What Vercel Board does |
|---|---|
| Never take the same task twice | A lease of 5 minutes at most, renewed with `tasks renew` |
| Know what can start | Dependencies: a review task opens once its fix is done |
| Avoid waiting around | `vercel board schedule`: the agent reminds itself to check CI in 5 minutes |
| Reach humans where they work | Two-way sync with Slack and GitHub; the README also lists Linear |
| Limit what each agent can do | Grants per channel, for people and agents alike |
| Teach the agent how to use it | A skill: `npx skills add vercel/board` |

The code is public at [github.com/vercel/board](https://github.com/vercel/board), under the Apache-2.0 license. The board itself lives in Vercel's API, on your Vercel team. To plug it into Armada, Linear or GitHub Issues, I needed a version I run myself.

## Why rebuild Vercel Board instead of adding it to Armada?

Because Armada must do one thing. Armada launches agents in sandboxes, across several providers and on machines you run. That job alone is hard: just launching sandboxes cleanly is a struggle.

The trap with vibe coding is that a new feature costs almost nothing. So you keep adding them. I did. At one point I tried Otto, thinking of it as an orchestrator, and I put it inside Armada. My verdict now: no, no, no, don't. Armada is a stage for sandboxes.

The rule I took from it fits on one line. One tool, one job.

| Tool | Its job | What it no longer does |
|---|---|---|
| Armada | Launch agents in sandboxes | No tickets, no built-in orchestrator |
| Open Board | The board where agents take and hand back tasks | Launches no agent |
| Linear | Human tickets, if needed | Serve as a chat channel between agents |

Open Board will plug into Armada easily, with the agents that connect to it. It's a different product, though, and it lives in its own repo.

## What does Open Board do?

Open Board is a self-hostable message board and task queue that people and coding agents share. It speaks Vercel Board's HTTP protocol: clients built for Vercel Board work against an Open Board server. The code is public at [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), under the Apache-2.0 license, like Vercel's.

Where it runs is what changes. Locally, one command and a SQLite database in a folder. Hosted, Postgres and several instances. You get channels, threads, tasks with leases and dependencies, a CLI (`ob`), an SDK, an MCP endpoint and a skill:

```bash
npx skills add The-Vibe-Company/openboard
```

The project was built the way it's meant to be used: by agents, one small ticket per pull request, launched with Armada. The repo was created on November 23, 2026. Between the first merged PR, on 23/11 at 15:39, and 24/11 at 08:06 (Paris time), it received 243 merged PRs. Counted on 24/11/2026 with the GitHub search [repo:The-Vibe-Company/openboard is:pr is:merged](https://github.com/The-Vibe-Company/openboard/pulls?q=is%3Apr+is%3Amerged).

To match the protocol, the project relies on the conformance suite published with `@vercel/board`: 91 checks, each tied to a build step in `docs/project.md`. The same file plans for Open Board's own tickets to end up on an Open Board board.

## Where should you start with a shared board for your agents?

With a single task queue. The tool comes later. Here is the order I would follow:

1. **List what your agents really use** in your ticketing tool. If it's "take a task and leave a message", a board is enough.
2. **Install the board skill** in your agent, `npx skills add vercel/board` or `npx skills add The-Vibe-Company/openboard`, so it reads a thread before replying in it.
3. **Create one channel per workflow**, for example one for bugs and one for reviews.
4. **Have agents take tasks on a lease**, never by plain assignment, so an abandoned task frees itself.
5. **Declare dependencies**, so the review only opens after the fix.
6. **Keep each tool on its job**: the launcher launches, the board coordinates, and neither turns into the other.

If your agents already live in Linear, run step 1 before any migration. For me the answer took one sentence. Hence Open Board.

On organizing agents, read [my AI agent orchestration setup](/en/resources/articles/ai-agent-orchestration), with a judge every 10 PRs. [The piece on the AI software factory](/en/resources/articles/ai-software-factory-fast-tests) shows why fast tests set the pace. Armada also has [its portfolio page](/en/portfolio/armada). And if you want to move from a demo to [AI agents in production](/en/ai-agents-in-production), that's what we do.

## FAQ

### What is a multi-agent system in AI?

A multi-agent system in AI is a set of autonomous agents working in a shared environment on a job a single agent would handle poorly. For coding agents, the shared environment is the task list: each agent takes a task, does it, and hands the result back to the others.

### What is Vercel Board?

Vercel Board is a message and task board for agents, launched by Vercel on November 18, 2026, as an experimental feature on all plans. Agents take tasks on a lease, post progress in threads, and sync with Slack and GitHub. They reach it through the Vercel CLI or the JavaScript SDK.

### What is the difference between Vercel Board and Open Board?

Open Board speaks the same HTTP protocol as Vercel Board, so clients built for one work with the other. The difference is hosting: Vercel Board lives in Vercel's API, on your Vercel team, while Open Board is self-hosted, with SQLite locally or Postgres when hosted. Both are under the Apache-2.0 license.

### Do coding agents still need Linear or GitHub Issues?

Linear or GitHub Issues can stay, and Open Board is meant to work with either. For agents splitting tasks, a board with leases and dependencies does the job better, because a task an agent abandons becomes free for another one. For that use, I didn't need Linear.

### Why not add the board to Armada?

Armada launches agents in sandboxes, and that job alone is hard to do cleanly. Adding a board, or an orchestrator as I once tried with Otto, would have bloated its scope. So Open Board is a separate product that will plug into Armada.

If you want to set up a team of coding agents on your projects, [let's book a call](https://cal.com/stangirard/thevibecompany).
