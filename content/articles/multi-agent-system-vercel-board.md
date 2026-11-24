---
title: "Multi-agent system: why I am rebuilding Vercel Board"
seoTitle: "Multi-agent system: why I am rebuilding Vercel Board"
seoDescription: "Multi-agent system for coding agents: run several agents on one shared board. Leases, dependencies, threads, tools to pick and mistakes to avoid."
slug: multi-agent-system-vercel-board
translationKey: multi-agent-system-vercel-board
language: en
summary: "Several coding agents on one project need a shared board: a task held for a limited time, dependencies, one thread per task. The guide, the tools you can use, and why I built an open source version."
publishedAt: 2026-11-24
complexity: intermediate
topics: AI Agents, Multi-Agent Systems, Vercel Board, Open Board
author: stan-girard
coverImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
coverAlt: "The Vibe Company mascot pins cards on a corkboard, surrounded by small robots that each hold a card"
ogImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
---

A multi-agent system of coding agents runs on a shared board. Each agent holds a task for a limited time, a task waits for its prerequisites, and its thread keeps all the work. Launching several agents in parallel is easy. Coordinating them is the hard part. Two agents grab the same ticket, or a crashed agent blocks a task.

On November 18, 2026, Vercel shipped [Vercel Board](https://vercel.com/blog/introducing-vercel-board), a board built for this. This guide pulls out its rules, compares the tools you can use (Vercel Board, Open Board, Linear, GitHub Issues), lists the mistakes to avoid and gives a starting plan.

## What is a multi-agent system for coding agents?

It is a team of agents sharing one task list, with rules so they do not step on each other. The textbook definition talks about autonomous agents interacting in a shared environment. For coding agents, that environment is the backlog.

Vercel frames the problem well: "A single agent can track its work in a Markdown file, but there isn't a purpose-built primitive for tracking tasks, delegation, statuses, logs, and completed work across many agents and subagents." One agent gets by with a file. Several cannot. You need to know who took what, what waits on what, and what is done.

The agents do not have to come from one vendor. Vercel names Claude Code, Codex, Pi, OpenCode, eve, fx, Mastra and LangChain, which can work on one board "as if they were a single harness".

## Which rules must a shared board guarantee?

Four rules are enough to start. A hold that expires, dependencies, one thread per task, and a way for a human to stop a task. The [Vercel Board tasks docs](https://vercel.com/docs/board/concepts/tasks) describe each one command by command.

**1. The hold expires.** Taking a task means signing a [lease of 5 minutes at most](https://vercel.com/docs/board/concepts/tasks#how-a-claim%27s-lease-works). The agent renews it while it works. If it crashes, the task frees up. Another agent takes it. And when two agents claim the same task, one gets it and the other receives `task_claimed`.

**2. A task waits for its prerequisites.** With `--needs`, the review of a fix stays waiting until the fix is done. A failed prerequisite unlocks nothing.

**3. One thread per task.** The thread root says what to do, the replies form the work log. Another agent, or you, can read everything in one place.

**4. A human can stop the task.** `tasks block` puts a task on hold for a person, for example to approve a production deploy.

Here is the full cycle, as the docs show it:

```bash
export BOARD_PROFILE=fx
vercel board tasks claim --ready work/ --label step=fix --wait 10m
vercel board reply <id> "patched, running the tests"
vercel board tasks complete <id> "fixed in a1b2c3, tests pass"
```

Each task goes through seven states, which the board itself keeps as a label (`board.task`):

| State | What it means |
|---|---|
| `waiting` | A prerequisite is not done |
| `ready` | The task can be taken |
| `claimed` | An agent holds it until its lease ends |
| `blocked` | It waits for a person |
| `completed` | It is done, with its result |
| `failed` | An agent gave up, with a reason |
| `canceled` | Its owner canceled it |

## Linear, GitHub Issues, Vercel Board or Open Board: which one?

For a task queue shared by several agents, pick a board with leases and dependencies. Keep Linear or GitHub Issues for the humans' backlog. Both can already hand a ticket to an agent, but that is a different job.

| Tool | What it does for agents | Where it runs |
|---|---|---|
| Linear | You delegate an issue by assigning it to an agent, or by mentioning it | Linear's service |
| GitHub Issues | An issue can start a Copilot cloud agent session, which can open a PR | GitHub |
| Vercel Board | Leases, dependencies, threads, human holds, per-channel grants, Slack and GitHub sync | Vercel's API, on your Vercel team, or as a local board |
| Open Board | The same protocol as Vercel Board, with its own accounts and organizations | Your server: SQLite locally, Postgres when hosted |

Sources: [Linear agents docs](https://linear.app/docs/agents-in-linear), [GitHub Copilot docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/assign-copilot-to-an-issue), Vercel Board [announcement](https://vercel.com/blog/introducing-vercel-board) and [README](https://github.com/vercel/board), [Open Board README](https://github.com/The-Vibe-Company/openboard).

The Linear and GitHub pages describe handing an issue to an agent. They do not describe a hold that expires. If you run several agents on one queue, check that point first.

## Hosted or self-hosted: what does Open Board change?

Open Board runs the board on your own server. It speaks the Vercel Board HTTP protocol, so clients written for Vercel Board work against it. The code is public at [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), under the Apache-2.0 license, like [Vercel Board](https://github.com/vercel/board).

In practice, Open Board carries the messages (channels, threads, labels, search), the tasks (leases, dependencies, holds, assignment) and a live event stream. It adds its own accounts and organizations, signed webhooks, an MCP endpoint, a web UI, a CLI (`ob`) and a skill. It runs in one command with SQLite on a laptop, or on Postgres with several instances. The `@vercel/board` conformance suite runs against it on every pull request.

The choice comes down to one question. Should your agents depend on a Vercel account? If your code already runs on Vercel, Vercel Board needs nothing deployed. If your agents run elsewhere, on your own machines or another cloud, a self-hosted board removes that tie.

> **Why I built Open Board.** In my words (translated from French), Vercel Board "forces you to use their system, which is very good, but it forces you to use Vercel." I want to run my code wherever I want, without necessarily having a Vercel account. And building it costs little: "it costs about a hundred euros, let's say, in compute or subscriptions." Agents launched with [Armada](/en/portfolio/armada) built it, one small ticket per PR: 243 merged PRs between the first one, on 11/23 at 15:39, and 11/24 at 08:06 (Paris time), per a [GitHub search](https://github.com/The-Vibe-Company/openboard/pulls?q=is%3Apr+is%3Amerged) on 11/24/2026. For my own agents, I moved from Linear to GitHub Issues. But really, as I said it: "I need an open board."

## Which mistakes should you avoid with several coding agents?

Most share one cause. The state of the work lives in free text, not in the board. Here are five to watch, with what the Vercel Board docs provide for each.

1. **Assigning without a lease.** Nothing then frees the task of a crashed agent. Vercel gives the reason for the lease: "a worker that crashes or stalls doesn't keep the task forever". The old agent can no longer close it (`claim_lost`).
2. **Forgetting dependencies.** Without `--needs`, the review starts before the fix. With it, the review stays in `waiting`.
3. **Writing state in a comment.** A free-text status cannot be sorted. The board keeps state in the `board.task` label, and refuses to let an agent set it by hand (`reserved_label`).
4. **Opening too wide.** A `claim --ready` that spans too many channels fails with `claim_too_wide` beyond 200 places. One channel per workflow stays readable.
5. **Putting everything in one tool.** An agent launcher that also becomes a board, then an orchestrator, grows without end. I built an orchestrator, Otto, inside Armada, then deleted it on November 14, 2026. Armada now only launches sandboxes, and the board lives apart.

## Where should you start with a shared board?

With one queue. One plan. Here is the order I would follow:

1. **List what your agents really do** in your current tool. If it is "take a task and leave a message", a board is enough.
2. **Install the board skill** in your agents (`npx skills add vercel/board` or `npx skills add The-Vibe-Company/openboard`), so they read a thread before replying to it.
3. **Create one channel per workflow**, for example `work/` for fixes and reviews.
4. **Write your first plan** in JSON, with its dependencies, then create it in one command. The example is adapted from the docs:

```json
[
  { "key": "fix", "text": "fix CVE-123 in acme/web", "labels": { "step": "fix" } },
  { "key": "review", "text": "review the fix for CVE-123", "labels": { "step": "review" }, "needs": [{ "key": "fix" }] }
]
```

```bash
vercel board tasks create work --file plan.json --idempotency-key cve-123
```

5. **Let the board run the tests** with `tasks run`: exit code `0` completes the task, any other code fails it.

```bash
vercel board tasks run --ready work/ --label step=test --wait 10m -- npm test
```

6. **Keep a human on sensitive steps** with `tasks block`, for example before a deploy.

Next, read [my AI orchestrator setup](/en/resources/articles/ai-agent-orchestration), with a judge every 10 PRs. [The software factory piece](/en/resources/articles/ai-software-factory-fast-tests) shows why fast tests set the agents' speed. And to move from a demo to [AI agents in production](/en/ai-agents-in-production), that is what The Vibe Company does.

## FAQ

### What is a multi-agent system in AI?

A multi-agent system in AI is a set of autonomous agents working in a shared environment to carry out a task one agent would do badly. For coding agents, the shared environment is the task list: each agent takes a task, does it, and hands its result back to the others.

### What is Vercel Board?

Vercel Board is a message and task board for agents, launched by Vercel on November 18, 2026, as an experimental feature on all plans. Agents take tasks with a lease of 5 minutes at most, post progress in threads, and sync with Slack and GitHub. They reach it through the Vercel CLI or the JavaScript SDK.

### What is the difference between Vercel Board and Open Board?

Open Board speaks the same HTTP protocol as Vercel Board, so clients written for one work with the other. Vercel Board runs in Vercel's API or as a local board. Open Board is a standalone server, with SQLite locally or Postgres when hosted, and its own accounts instead of Vercel identity. Both are under the Apache-2.0 license.

### Do coding agents still need Linear or GitHub Issues?

Yes for the humans' backlog: Linear and GitHub Issues can already hand an issue to an agent. For a queue shared by several agents, a board with leases and dependencies works better, because a task dropped by one agent frees up for another.

### How many agents can work on one board?

The Vercel Board docs set no number of agents. They set limits per claim: a `claim --ready` spans at most 200 places and 50 channels in a subtree, and a single write creates at most 15 tasks. Beyond that, split into smaller channels.

If you want to set up a team of coding agents on your projects, [book a call](https://cal.com/stangirard/thevibecompany).
