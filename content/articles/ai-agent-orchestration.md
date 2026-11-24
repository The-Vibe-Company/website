---
title: "AI agent orchestration: my setup, a judge every 10 PRs"
seoTitle: "AI agent orchestration: my setup, a judge every 10 PRs"
seoDescription: "AI agent orchestration, my real setup: Grill Me, tickets, an orchestrator that spawns subagents, one model per role, a judge every 10 PRs, and Armada."
slug: ai-agent-orchestration
translationKey: ai-agent-orchestration
language: en
summary: "Running ten agents in parallel is no longer the hard part. What matters is who splits the work, which model does what, who checks the direction and where the agents run. My real setup with Armada."
publishedAt: 2026-11-23
complexity: intermediate
topics: AI Agents, Agent Orchestration, Claude Code, Armada
author: stan-girard
coverImage: /images/resources/orchestrateur-ia-agents/cover-mascotte.webp
coverAlt: "The Vibe Company mascot conducts a fleet of small boats from a control desk, each boat in its own basin"
ogImage: /images/resources/orchestrateur-ia-agents/cover-mascotte.webp
---

AI agent orchestration means one agent splits the work, spawns subagents (secondary agents that each get one task) on each piece and checks that the whole thing is heading the right way. For a long time the question was how many agents you could run at once. Today the real question is how well you orchestrate them.

I really do work this way every day. Between 9 and 22 November 2026, the GitHub repo of [Armada](https://github.com/The-Vibe-Company/armada), the tool I built to run these agents, received 2,584 pull requests, 2,543 of them merged. Apart from 79 automated release PRs, they come from the agents I orchestrate. Counted on 23/11/2026 with the GitHub search [repo:The-Vibe-Company/armada is:pr created:2026-11-09..2026-11-22](https://github.com/The-Vibe-Company/armada/pulls?q=is%3Apr+created%3A2026-11-09..2026-11-22).

Here is the setup, role by role, with what works and what still goes off the rails.

## Why is running more agents no longer enough?

Because past a handful of agents, you become the bottleneck. I used to talk to lots of agents at once: four, five, six, sometimes ten in parallel. I spent my day switching context from one conversation to the next. It worked for a while.

Then models got much better at managing other agents. My reading: Claude Code pushed subagents forward, then reinforcement learning at Anthropic, OpenAI and the others made models stronger at orchestration. Newer models such as Opus 5.5 or Fable are better still.

Hence where I stand today. In a voice note in French, I put it this way: "the problem is no longer how many agents you can launch at once, it is rather how well you orchestrate these agents" (my translation).

In practice, orchestrating means answering four questions. Who splits the work? Which model does what? Who checks the direction? Where do the agents run? Those are the same questions you have to settle to go from a demo to [AI agents in production](/en/ai-agents-in-production).

## Quivr V2: from Grill Me to tickets, in three moves

An interrogation, tickets, then an orchestrator that hands out the work. The first time I worked this way at scale was for Quivr V2.

**1. Get grilled.** I ran [Grill Me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md), a skill by Matt Pocock. The agent questions you, round after round, until no decision is left implicit. I answered about 200 questions.

**2. Turn the answers into tickets.** Another skill by Matt Pocock then helped me turn those answers into tickets. Each ticket carried a decision already made, so the agents did not have to guess it. For agents to split those tickets, a shared board does the job better than Linear, as I explain in [the piece on multi-agent systems and Vercel Board](/en/resources/articles/multi-agent-system-vercel-board).

**3. Let an orchestrator hand out the work.** I told an agent, running Fable at the time, to spawn lots of subagents and do all the tickets. A first version of Armada drove those agents inside Conductor.

Step 1 matters more than it looks. Every answer given upfront is a question no subagent has to settle alone, halfway through a PR.

From Quivr V2 to today, the steps:

- **Quivr V2**: Grill Me (about 200 questions), then tickets, then an orchestrator spawning subagents.
- **30/09/2026**: first PR on the Armada repo.
- **9 to 22/11/2026**: 2,584 PRs on Armada, 2,543 of them merged.
- **Today**: Opus 5.5, Sol 6.2 and Fable test.

That left a very physical problem.

## Where do you run ten agents without melting your laptop?

In sandboxes, isolated environments that run off your machine. Launch ten agents on your laptop and it overheats. I got fed up with that, which is why I built Armada.

Sandboxes have one drawback: they cost money. There are plenty of providers. I like [Boat](https://boat.dev), and there is also [Modal](https://modal.com). Depending on the job I need one or the other, or a machine I host myself.

[Armada](/en/portfolio/armada) handles that. According to its README, it is an open source project under the MIT licence that gives every coding task its own machine:

- **Several providers.** Sandboxes run on a connected Boat or Modal account, or on a Docker host you register yourself.
- **One agent, one model.** You launch Claude Code, Codex or OpenCode with the model and reasoning effort you pick. Armada never swaps in another model.
- **One task, one sandbox.** Each launch gets its own sandbox, with only that agent's credentials.
- **A ready starting point.** A snapshot keeps your repos and setup. Every launch forks it and pulls the latest commits.
- **Live steering.** You follow events, redirect the agent mid-turn, stop it and pick it up later.

The CLI installs with `npm install -g @the-vibe-company/armada`. There is also a web dashboard and an MCP server, all wired to the same Armada server. That last part is what matters for orchestration: an orchestrator agent can itself launch and follow other agents.

If your tests take hours, fix that first. I cover it in [the piece on the AI software factory](/en/resources/articles/ai-software-factory-fast-tests): an orchestrator never moves faster than the test suite that clears its merges.

Once you have sorted the machines, you still have to decide who does what.

## Which model for which role in a team of agents?

The best model for each role, and the expensive one only where it pays. Here is the setup I am testing right now.

| Role | Model (my current setup) | Why |
| --- | --- | --- |
| Orchestrator | Opus 5.5 | Splits the work, spawns the subagents and tracks progress |
| Backend subagents | Sol 6.2 (OpenAI) | In my view, it is better for backend work |
| Frontend subagents | Opus 5.5 | In my view, it is very good for the front |
| Judge, every 10 PRs | Fable | A very smart model called now and then to check the direction |

Status: in testing for about two weeks, no result yet.

The judge is the most interesting piece. Every ten PRs, the orchestrator spawns a subagent on Fable. That subagent looks at what the other subagents have produced and says whether the project is heading the right way.

Why not run everything on the smartest model? Cost. I do not want to spend too many Opus tokens on orchestration. The Fable judge only steps in once every ten PRs, and it brings a very sharp eye to the direction.

This setup may seem to contradict [the piece on the agent harness](/en/resources/articles/enterprise-agent-harness), which advises one agent before the swarm. In its [post on multi-agent systems](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), Anthropic advises against splitting agents by type of work, but keeps exceptions: frontend and backend work proceeding in parallel when a well-defined API contract separates them, and the verification subagent, useful to enforce explicit checkpoints. My backend and frontend split can fit the first, provided an API contract separates them. My judge every ten PRs is close to the second, though it gives an opinion on direction rather than checking against criteria. And my cost reason matches Anthropic's figure: multi-agent systems typically use 3 to 10 times more tokens than a single agent for equivalent tasks.

I added that judge for a specific reason.

## Why do agents go off the rails, and what is the judge for?

Because an orchestrator left alone with a big goal can head the wrong way. For a few weeks now I have been running a test: Armada works on improving itself, on its own. I spend half an hour to an hour on it each evening, no more.

What I have seen so far:

- **It is a bit slower** than when I am behind it pushing things forward.
- **Agents go off the rails.** You give the orchestrator a big goal, it creates lots of tickets and goes for it. It spends time fixing things, and sometimes it sets up too much inefficient machinery.

The judge every ten PRs is my answer to that second point. It only gives its opinion on the direction and does not write code. If the orchestrator has started piling up useless work, that is where I expect to catch it. The test will tell whether it works.

If you use Claude Code, part of this setup already lives in the tool.

## Are Claude Code subagents enough to orchestrate?

Inside one session, yes: Claude Code subagents handle side tasks in their own context and send back only a summary. According to [the Claude Code documentation](https://code.claude.com/docs/en/sub-agents), each subagent runs in its own context window, with its own system prompt, tools and permissions.

Three points that matter for orchestration:

- **You define them in files.** A Markdown file in `.claude/agents/` for one project, or in `~/.claude/agents/` for all your projects.
- **You pick the model per subagent.** The `model` field accepts `sonnet`, `opus`, `haiku`, `fable`, a full ID such as `claude-opus-5-5`, or `inherit`.
- **They count against your limits.** Their requests count toward the same usage limits as the main conversation.

For one session, that is what you need. The docs state that subagents work within a single session. To run many independent sessions in parallel, they point to background agents, and for a coordinated team of sessions Claude spawns and supervises, to agent teams. Armada comes in when you also need several machines and models from several vendors. For the company side, see how to [roll out Claude Code in the enterprise](/en/resources/articles/claude-code-enterprise-rollout).

## Where should you start with AI agent orchestration?

With the split, before the machines. Here is the order I would follow today:

1. **Get grilled** on the project with Grill Me, until no decision is left implicit.
2. **Turn the answers into short tickets**, each with its decision.
3. **Check that your tests run in minutes**, or the orchestrator will wait.
4. **Give each role a model**: orchestrator, backend, frontend.
5. **Add a periodic judge** on a very smart model, for example every ten PRs.
6. **Move the agents off your machine** as soon as you run more than a few.

## FAQ

### What is an AI agent orchestrator?

It is an agent that takes a goal, splits it into tasks, spawns subagents on each one and tracks their progress. In my setup it runs on Opus 5.5 and launches subagents through Armada.

### What is the difference between an orchestrator and agents run in parallel?

With agents in parallel, you split the work, track it and switch context between conversations. With an orchestrator, an agent does that coordination for you, and you step in on the direction.

### Should every agent use the same model?

No. I give each role its own model: Opus 5.5 for the orchestrator and the frontend, OpenAI's Sol 6.2 for the backend, and Fable as a judge every ten PRs, so I do not burn too many Opus tokens.

### Can you run ten agents on your own computer?

You can try, but the machine overheats. Sandboxes fix that, but they cost money. Armada lets you launch agents on Boat, on Modal or on a Docker host you manage.

### What are Claude Code subagents?

They are specialised assistants, defined in `.claude/agents/`, each working in its own context window and returning a summary. They work inside a single Claude Code session.

If you want to set up this kind of orchestration on your own projects, [book a call](https://cal.com/stangirard/thevibecompany).
