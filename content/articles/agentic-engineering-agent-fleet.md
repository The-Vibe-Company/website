---
title: "Agentic engineering: my method for running 5 to 25 agents"
seoTitle: "Agentic engineering: my method for running 5 to 25 agents"
seoDescription: "Agentic engineering step by step: Grill Me, Skillpack, Armada, Open Board and Captain to run 5 to 25 agents. Real projects, git numbers and limits."
slug: agentic-engineering-agent-fleet
translationKey: agentic-engineering-agent-fleet
language: en
summary: "My agentic engineering method in six steps you can reproduce, what it produced on Armada, Quivr and Open Board, the problems behind each piece, then its limits."
publishedAt: 2026-11-27
complexity: intermediate
topics: Agentic Engineering, AI Agents, Claude Code, Armada
author: stan-girard
coverImage: /images/resources/agentic-engineering-equipe-agents/cover.webp
coverAlt: "The Vibe Company mascot, dressed as a captain on a dock, gives a heading to a fleet of small boats, each in its own lane"
ogImage: /images/resources/agentic-engineering-equipe-agents/cover.webp
---

Agentic engineering is a way of building software: a human sets the goal, coding agents ship the pull requests. In my practice, it comes down to six steps you can reproduce, from questions upfront to the orchestrator. On Armada's public repo, the pace went from 7.9 to 110.5 commits a day on `main`.

Nothing about it is automatic. In a voice note recorded in French on 27 November 2026 (my translation, here and below), I put it this way: "It's not automatic, I'm still there behind it, I give it a goal."

This piece covers the method step by step, what it produced on three projects, the problems that gave rise to each piece, then its limits. The orchestrator is called Captain, a skill in The Vibe Company's Skillpack library. Steps 1 to 4 rely on public tools. Captain, step 5, is not public: its main rules and the guardrails in step 6 are described here, so you can reuse them in your own coordinator.

*Updated November 27, 2026. I counted the commits on November 27, 2026 on public repos and described Captain at version 0.2.0.*

## What is agentic engineering, in my method?

In my method, agentic engineering comes down to six steps: questions upfront, skills, one sandbox per ticket, a board that anchors the goal, an orchestrator, and a human who sets the course. Between the human and the agents, the orchestrator hands out the work.

"Software factory" is my word for the whole thing. "My latest skill […] is called Captain, and it's the method I use to build my software factory, well, part of the method." The word "factory" misleads a little, because it suggests a line that runs by itself. An [AI software factory](/en/resources/articles/ai-software-factory-fast-tests) starts with fast tests anyway.

My time goes upstream. I no longer read the agents' plans. I answer the questions that pin down the goal, and the rest of the chain builds on those answers.

## Which steps reproduce the method?

Six steps, in this order. Each one answers a problem I ran into, told further down.

### 1. Grill the goal before the first ticket

[Grill Me](https://github.com/mattpocock/skills) is a skill by Matt Pocock. It asks questions in rounds until no decision is left implicit. For Quivr's V2, I answered about 200 questions. Another Matt Pocock skill then turned those answers into tickets.

"The idea of asking yourself lots of questions upfront is super important, because when the AI builds a better version 2, it can go off in every direction if you don't keep control."

Captain applies the same principle in its `plan` mode. It settles decisions with the `grilling` skill, then publishes a DAG of atomic tasks: a graph where each task declares its prerequisites with `needs`. Each task also lists the paths it is allowed to write.

### 2. Give the agents skills

[Skillpack](/en/portfolio/skillpack) lets agents use lots of skills. Its CLI, presented on [skillpack.app](https://skillpack.app), installs and publishes portable agent skills. Captain is one of them. It depends on two others, `grilling` and `ship-pr-dev`.

### 3. Launch one equipped sandbox per ticket

"Armada lets you have sandboxes. In the sandboxes, you can connect MCPs, add environment variables, pre-install CLIs." [Armada's code is public on GitHub](https://github.com/The-Vibe-Company/armada), under the MIT licence.

Preparation goes through a snapshot. According to the README, building one clones the repos and runs an optional `--setup` script. The `--init` commands run at every launch, after the pull. An agent then starts with `armada new <snapshot> --provider boat|modal --agent claude|codex`, and `--connections` attaches the MCPs. Variables and secrets are managed in the dashboard or through the vault API.

Captain's rule: one sandbox = one ticket = one PR, stopped as soon as it merges. According to the skill, reusing a sandbox from one ticket to the next leaks stale git state and build caches. These prepared machines are part of the [enterprise agent harness](/en/resources/articles/enterprise-agent-harness), the equipment around the model.

### 4. Anchor the goal in Open Board

"I used to use Linear, but now it's Open Board, it's just to track the sessions." [Open Board](https://github.com/The-Vibe-Company/openboard) is public, under the Apache-2.0 licence, with an `ob` CLI.

Captain publishes the DAG there. Open Board, Armada and GitHub are the source of truth. Local state fits in two files, `.captain/config.json` and `.captain/rules.md`. A fresh session, in `resume` mode, starts again from those three sources. The shared board idea is covered in my guide to the [multi-agent system](/en/resources/articles/multi-agent-system-vercel-board).

### 5. Hand orchestration to a coordinator (Captain, in my case)

Captain has no public version as of 27 Nov 2026. The rules below are the skill's own: copy them into the instructions of your own coordinator agent.

Captain turns the goal into merged pull requests. It does not code the tickets and delegates code reading to read-only agents. It has five modes:

- **`init`** checks the CLIs (`ob`, Armada 14.x or later, `gh`) and prepares the repo.
- **`plan`** splits the goal into a DAG.
- **`run`** launches the Armada fleet and supervises it.
- **`resume`** reconciles Open Board, Armada and GitHub.
- **`challenge`** runs an independent, read-only audit.

Before autonomy, a run contract is confirmed once. Its defaults: 8 sandboxes in flight, 5 open PRs, at most 3 rounds for CI failures, rebases and extensions, 2 nudges. The merge policy is a choice: `auto-merge`, `review-gate` (a human merges) or `draft-only`. Each worker ends its turn with `READY TO MERGE` or `BLOCKED`.

Start below those defaults, in `review-gate`. Without CI, Captain recommends `review-gate` or `draft-only`.

### 6. Keep the goal on the human side

Some guardrails are not negotiable. A red CI on `main` freezes merges, rebases and launches: that is the `MAIN_RED` state. Release PRs are never auto-merged. Database migrations go through one at a time. Each worker's brief forbids `.skip`, `.only`, `@ts-ignore`, `eslint-disable` and `--no-verify`.

That leaves drift. The Challenger audits every 10 or 20 merged PRs, on objective metrics: git log, hot files, reverts, added `.skip`. It never receives the coordinator's narrative. Its verdict is `ON_TRACK`, `DRIFTING` or `OFF_THE_RAILS`, with a mechanical floor it can make harsher, never softer. One added `--no-verify`, 10% reverts or more than 300 lines of production code without a test are enough for `DRIFTING`. An `OFF_THE_RAILS` pauses every new launch until a human says go.

The human keeps the goal, the contract, the releases and that go. "I don't want it to regulate itself, I'd like to give it precise goals and have it actually work." The Challenger can write stop rules in `.captain/rules.md`, and each one expires. The goal stays set by a human.

## What did the method produce on Armada, Quivr and Open Board?

On Armada, 110.5 commits a day on `main` between 30 Oct and 26 Nov 2026, against 7.9 over the previous 28 days. Fourteen times more, on the same repo.

| Repo | Period | Commits on `main` | Per day | Merged PRs |
| --- | --- | --- | --- | --- |
| Armada | 2 Oct to 29 Oct 2026 (28 days) | 222 (183 without the bot) | 7.9 (6.5 without the bot) | 225 |
| Armada | 30 Oct to 26 Nov 2026 (28 days) | 3,095 (2,981 without the bot) | 110.5 (106.5 without the bot) | 2,934 |
| Open Board | 23 Nov to 26 Nov 2026 (4 days) | 565 | 141 | 563 |

I cloned these public repos on 27 Nov 2026 and counted the commits on `main`, in Paris time. Every author counts, agents included: they commit under my git identity. "Without the bot" removes the release commits by `github-actions[bot]`. Armada and Open Board squash-merge, so one commit is roughly one PR. Merged PRs come from GitHub search, dates in UTC. The raw data is available for download: [commits per day (CSV)](/downloads/agentic-engineering/commits-per-day.csv) and [counting script](/downloads/agentic-engineering/count-commits.sh).

**Armada.** From 13 Nov to 26 Nov 2026, the pace climbs to 167 commits a day (2,338 commits). The single-day record: 479 commits, on 19 Nov. From 30 Oct to 26 Nov, 568 of the 2,981 commits without the bot fall between 00:00 and 06:59, or 19%. Out of roughly 2,900 PR commits, 2 start with "revert".

**[Quivr](/en/portfolio/quivr).** Here the work comes in phases: from 2 Oct to 15 Oct 2026, `main` received 352 commits during V2. The [public releases](https://github.com/The-Vibe-Company/quivr/releases) keep the trace, with 2.0.0-alpha prereleases from 6 Oct and version 2.0.0 on 29 Oct 2026. "Basically it goes in phases, on Quivr at least." Testing and rollout then happen without the system, hence a calmer November: 43 commits from 30 Oct to 26 Nov.

**Open Board.** This project was born with the method. The repo dates from 23 Nov 2026. In 4 days it received 565 commits for 563 merged PRs, or 141 a day, with a record of 340 on 24 Nov. Of those commits, 168 (30%) fall between 00:00 and 06:59.

## Why did Captain come after the method?

Because problems showed up along the way. "At first I wasn't using Captain, I created Captain because problems came up."

**The machine.** Ten agents running locally overheat a computer. Fed up with that, I created Armada. The repo's first PR dates from 30 Sep 2026.

**The V2 that goes off in every direction.** An AI rebuilding a product better opens too many paths. For Quivr, the 200 Grill Me questions came before any ticket. An orchestrator, Fable at the time, then launched sub-agents on all the tickets, with the first version of Armada inside Conductor.

**Goal drift.** "When you run long tasks, sometimes it drifts a little." The answer came piece by piece: "there could be drift from the goal, so that led to building Open Board, and other systems like that." Open Board replaced Linear.

**The overall direction.** A judge already ran every 10 PRs, and it only gave its opinion. I told its origin story in the piece on [AI agent orchestration](/en/resources/articles/ai-agent-orchestration). Captain keeps a periodic audit, every 10 or 20 merged PRs, and adds numeric floors to it.

On 26 Nov 2026, Captain packs those answers into a single skill. "It's sort of the beginnings of an agentic orchestration system for a project."

## What are the limits of the method?

They are real, and some touch the numbers themselves.

- **A commit measures throughput.** It says nothing about the value shipped.
- **My share and the agents' share blur.** Everything goes through the same git identity.
- **Captain is recent.** It dates from 26 Nov 2026. The October and November numbers measure the method, before the skill.
- **5 to 25 agents is an order of magnitude.** "It lets me have between 5 and 25 agents running at the same time per project." I have not measured it in any log.
- **Drift does not disappear.** The Challenger catches it at intervals, every 10 or 20 PRs.
- **The pace follows phases.** Quivr shows it: testing and rollout happen without the system.
- **Sandboxes cost money.** I have no figure to publish here.
- **A human stays behind it.** I describe it as "[…] not far from having a system that can run 24/7." Not yet.
- **Captain is not public.** It is an organisation skill, with no public version as of 27 Nov 2026.

My verdict: "An orchestrator that manages lots of agents in Armada and gets the job done, and it works really well." The same split applies to an [AI agent in production](/en/ai-agents-in-production): the machine executes, a human answers for the direction. If your team has not yet framed a [Claude Code enterprise rollout](/en/resources/articles/claude-code-enterprise-rollout), start with that guide.

## FAQ

### What is agentic engineering?

A way of building software: a human sets a precise goal, coding agents ship pull requests. In my practice, the goal first goes through Grill Me, then Captain splits it and drives the agents in Armada sandboxes.

### What is a realistic number of agents per project?

Between 5 and 25 for me, as an order of magnitude, not measured in logs. By default, Captain caps a fleet at 8 sandboxes in flight and 5 open PRs.

### Sandboxes or worktrees for a fleet of agents?

Captain works with Armada sandboxes: one per ticket, stopped as soon as the PR merges. Local worktrees are outside its scope.

### Does a human need to approve the agents' merges?

It depends on the run contract. In `review-gate`, workers open verified PRs and a human merges. In `auto-merge`, Captain requires CI checks, and release PRs always wait for human approval.

### Is Captain public?

No. As of 27 Nov 2026, Captain (version 0.2.0) is an organisation skill in The Vibe Company's Skillpack library. Armada and Open Board are public on GitHub, under the MIT and Apache-2.0 licences.

If you want to set up a fleet of agents on your projects without losing control, [book a call](https://cal.com/stangirard/thevibecompany).
