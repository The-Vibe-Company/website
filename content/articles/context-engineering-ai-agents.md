---
title: "Context engineering: what your AI agents can't guess"
seoTitle: "Context engineering: what your AI agents can't guess"
seoDescription: "Context engineering for coding agents: a complete ticket, Grill Me before the code, a skill to split the work, a board to track it. A practical guide."
slug: context-engineering-ai-agents
translationKey: context-engineering-ai-agents
language: en
summary: "A coding agent cannot make up what the ticket leaves out. A practical guide to making its job easier: a ticket ready for an agent, Grill Me before you write, a skill to split the work, a lean repo and a board to track it all."
publishedAt: 2026-11-26
complexity: intermediate
topics: Context Engineering, AI Agents, Claude Code, Grill Me
author: stan-girard
coverImage: /images/resources/context-engineering-agents-ia/cover.webp
coverAlt: "The Vibe Company mascot fits the last piece into a ticket before handing it to the agents"
ogImage: /images/resources/context-engineering-agents-ia/cover.webp
---

Context engineering means choosing what an AI agent has in front of it while it works. For a coding agent, that context starts with the ticket. The agent can't guess what you left out of it. The job comes down to a complete ticket, decisions made before the code, a clean split and a board to track the work.

You already hand tickets to Claude Code or Codex. The PR comes back clean. The tests pass. And the result misses what you wanted. Before you blame the model, read the ticket again. Whatever was missing from it, the agent decided for you.

My rule fits in one sentence: if you want to give tasks to agents today, you have to take the time. Here is where to spend it, in the order the work happens.

## What is context engineering for a coding agent?

For a coding agent, context engineering comes down to deciding what the agent reads before it writes its first line. That covers the ticket and the repo, startup instructions included.

Anthropic, in [its post of September 29, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), presents context engineering as the natural progression of prompt engineering. Context there means the set of tokens given to the model. The prompt is part of it. So is the ticket.

For a product team, the consequence is practical. The ticket is the part of the context you write every day. I start there, before touching the prompt.

## Why can't an agent guess what the ticket leaves out?

Because it starts with none of the things your team knows without having written them down. It reads the ticket and the repo. Nothing else.

Take a one-line ticket: "Add CSV export for invoices". A developer on the team knows which columns accounting expects. She knows who may export. She remembers the product owner (PO) brought it up in a meeting. The agent has one line. It picks the columns and the permissions alone. The PR looks plausible, and you find a product decision while reading a diff.

My own wording is blunter (translated from French): "Agents can't make things up." I have seen it in real conditions. An agent fills the gaps with what it has.

What does a ticket with no gaps look like, then?

## What does a ticket ready for an agent look like?

A ticket ready for an agent holds the whole need and leaves no open question for the PO. Two tests, to pass before you hand it over.

The idea comes from the field. In my words: "At a client, Ready for Agent just measures whether the whole need has been written down in a ticket, and whether there is no question left for the PO."

That check also makes a finer comparison. "Ready for Agent measures the divergence between what you wrote in the plan and what actually gets done, against what it would have done with a human's context." It looks at the gap between what the plan says and what an agent would have done knowing everything a human on the team knows.

You can run it by hand. Read the ticket as someone who attended none of the meetings. Would that person have a question for the PO? The answer belongs in the ticket.

Scrum teams know the definition of ready. Here is its version for an agent, which has nobody to ask in the hallway.

| Criterion | Question to ask | Sign it's missing |
| --- | --- | --- |
| Whole need | Is everything the PO said out loud written in the ticket? | The ticket points to a meeting or to "as usual" |
| Zero open question | Would someone new to the subject have a question for the PO? | You find a product decision while reviewing the PR |
| Written decisions | Is every choice settled, including what you refuse? | A "to be discussed" or an "or maybe" in the text |
| Vertical slice | Does the ticket cross the schema, the API, the UI and the tests? | A ticket covers a single layer, for example all of the schema |
| Size | Does it fit in one fresh context window? | You need to have read other tickets to understand it |
| Dependencies | Which tickets must be finished before this one? | The order exists only in your head |
| Acceptance criteria | Can a check tell that the ticket is done? | "It works", with no test and no demo |

The first two rows come from the check seen at that client. The rows on slice, size and dependencies follow the to-tickets documentation, covered below. The wording is mine.

Rewritten, the export ticket lists the columns, the roles allowed and the file format. It also says what stays out of scope. It is longer. That is fine.

## Why run Grill Me before writing the ticket?

Because Grill Me brings out the decisions you have not made yet, before an agent makes them for you. It is the most direct way I know to close open questions.

Grill Me is a skill by Matt Pocock. According to [its documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md), you start it by typing `/grill-me`, and the agent won't start it on its own. It questions you in rounds. It writes no file. The docs advise leaving plan mode off, and I have already told [why I moved from plan mode to Grill Me](/en/resources/articles/claude-code-plan-mode).

Count the questions: they measure your scope. The docs give a benchmark of 46 questions across 4 rounds for an ordinary session. At 200 questions, the scope is too large, and they advise splitting the work first.

On Quivr V2, I answered about 200 questions before writing the tickets. The story is in [my AI agent orchestration setup](/en/resources/articles/ai-agent-orchestration). Don't take that number as a target. By the docs' own reading, it signals a large scope.

The docs also name the trap. It is passivity. Answering "agreed" forty times in a row decides nothing, because you own the scope. The agent asks the questions.

I rank that thinking time as high as the ticket. As I put it, running a Grill Me or getting skills to help you split the tickets and think things through is the same kind of work, and it matters a great deal.

Once you have made the decisions, the [to-spec](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-spec.md) skill publishes a spec. Nothing decided yet? Its docs point to grill-with-docs.

## Should a skill split your tickets?

Yes, as soon as the work is bigger than what an agent can do in one session. Below that, the skill is of no use.

The skill is [to-tickets](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md), also by Matt Pocock. In its docs, each ticket is a tracer bullet: a vertical slice that crosses the schema, the API, the UI and the tests. The skill sizes it for one fresh context window. The ticket also declares its dependencies, the blocking edges, meaning the tickets that must finish before it.

The docs cite a sobering case. One team had split its work into 26 tickets, by layer. It counted roughly 20 agent runs per closed ticket, about three quarters of them rework. I did not observe that case myself. It comes from the documentation.

Slicing by layer is still the natural reflex: all the schema first, then all the API. For the invoice export, a vertical slice would be, for example, the export of a single column, from the button to the file, test included. You can verify it alone.

The skill publishes nothing without your approval. It first puts its breakdown to you as a quiz. Use it. According to the docs, over-splitting is the most reported problem. And if everything fits in one context window, you don't need the skill.

## What should the agent find in the repo?

What every session needs, and as little as possible beyond that. The rest goes in the ticket.

The reason is a cost. According to the [writing-for-agents documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/writing-for-agents.md), `CLAUDE.md` loads into every session. Anything that applies in one session out of ten costs context in the other nine.

Keep in `CLAUDE.md` the rules that hold for the whole repo. A detail that concerns one task belongs in that task's ticket. It is the complete-ticket logic, seen from the repo.

Team-level settings are in [the Claude Code enterprise rollout guide](/en/resources/articles/claude-code-enterprise-rollout). And taking [AI agents into production](/en/ai-agents-in-production) is what The Vibe Company does.

## Who tracks what your agents do?

A shared board, which agents and humans read in the same place. With complete, well-split tickets, you can launch several agents. You then need to know who holds what and what is done.

Start small. Take your next ticket and run it through the table above. Launch the agent when the PO would have no question left.

On tracking, I moved too. For my own agents, I went from Linear to GitHub Issues. Then Vercel released Vercel Board, on November 18, 2026. I like the idea, with one reservation (translated from French): it "forces you to use their system, which is very good, but it forces you to use Vercel." I want to run my code wherever I want.

I built Open Board for that: agents and humans follow the agents' work there, on a board that runs on your side. The code is public at [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), under the Apache-2.0 license. Open Board speaks Vercel Board's HTTP protocol. It handles messages, tasks (lease, dependencies, waiting, assignment) and an event stream. It brings its own accounts, signed webhooks, an MCP endpoint, a web UI, a CLI (`ob`) and a skill. It runs on SQLite or on Postgres.

The details are in [my guide to coordinating your agents on a board](/en/resources/articles/multi-agent-system-vercel-board). A complete ticket tells the agent what to do. The board tells you what it did with it. I said it while building it: "I need an open board."

*Updated November 26, 2026. The benchmarks on Grill Me, to-tickets, to-spec and writing-for-agents come from the mattpocock/skills documentation, read on November 26, 2026.*

## FAQ

### What is the difference between context engineering and prompt engineering?

Prompt engineering works on the wording of instructions. Context engineering deals with everything the model receives: Anthropic defines context as the set of tokens given to the model, and presents context engineering as the natural progression of prompt engineering. For a coding agent, the ticket and the repo are part of it.

### What is a definition of ready for an AI agent?

A definition of ready for an AI agent comes down to two tests: the whole need is written in the ticket, and no question is left for the PO. Add settled decisions, declared dependencies and acceptance criteria that can be checked.

### What is Grill Me?

Grill Me is a skill by Matt Pocock that questions you about an idea, in rounds. You start it by typing `/grill-me`, the agent won't start it on its own, and it writes no file. Its documentation advises leaving plan mode off.

### What is a normal number of questions in a Grill Me session?

The Grill Me documentation gives 46 questions across 4 rounds as an ordinary session. A session that reaches 200 questions signals a scope that is too large. Split the work first.

### Do you need one ticket per agent session?

Yes, that is the to-tickets rule: each ticket is sized for one fresh context window and declares its dependencies. If the whole change fits in a single context window, you don't need to split it.

If you want to bring your tickets and your coding agents up to this level, [book a call](https://cal.com/stangirard/thevibecompany).
