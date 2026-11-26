---
title: "Context engineering: a ticket with no questions for the PO"
seoTitle: "Context engineering: a ticket with no questions for the PO"
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

You already hand tickets to Claude Code or Codex. The PR comes back clean, tests green. The result still misses what you wanted. Before you blame the model, read the ticket again. Whatever was missing from it, the agent decided for you.

The test: would the PO still have a question after reading this ticket?

My rule fits in one sentence: if you want to give tasks to agents today, you have to take the time.

## What is context engineering for a coding agent?

For a coding agent, context engineering comes down to deciding what the agent reads before it writes its first line. That covers the ticket and the repo, startup instructions included.

Anthropic, in [its post of September 29, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), presents context engineering as the natural progression of prompt engineering. Context there means the set of tokens given to the model. The prompt is part of it. So is the ticket.

The ticket is the part of the context your product team writes every day. I start there, before touching the prompt.

## Why can't an agent guess what the ticket leaves out?

Because it starts with none of the things your team knows without having written them down. It reads the ticket and the repo. Nothing else.

Take a one-line ticket: "Add CSV export for invoices". A developer on the team knows which columns accounting expects and who may export. She remembers the product owner (PO) bringing it up in a meeting. The agent has one line. So it picks the columns and the permissions alone. The PR looks plausible, and you find a product decision while reading a diff.

My own wording is blunter (translated from French): "Agents can't make things up." I have seen it in real conditions. An agent fills the gaps with what it has.

## What does a ticket ready for an agent look like?

A ticket ready for an agent holds the whole need and leaves no open question for the PO. Two tests, to pass before you hand it over.

The idea comes from the field, at a client. There, in my words (translated from French), "Ready for Agent just measures whether the whole need has been written down in a ticket, and whether there is no question left for the PO."

Matt Pocock uses a close label in his [triage](https://github.com/mattpocock/skills/blob/main/docs/engineering/triage.md) skill: `ready-for-agent`, for a ticket that is fully specified, with an agent brief attached. The check seen at that client goes further: zero open questions for the PO.

That check also compares the agent's work with what someone who knows everything the team knows would have done. Translated from French: "Ready for Agent measures the divergence between what you wrote in the plan and what actually gets done, against what it would have done with a human's context."

You can run it by hand. Read the ticket as someone who attended none of the meetings. Would that person have a question for the PO? The answer belongs in the ticket.

Scrum teams know the definition of ready. An agent has nobody to ask in the hallway: its ticket has to say everything.

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

Rewritten, the export ticket lists the columns and the roles allowed. The file format is in there, and so is what stays out of scope. The ticket gets longer. That is fine. The template below, on a fictional example, is ready to copy:

```markdown
<!-- Fictional example: replace every [bracket] with your own content -->
## CSV export for invoices

**Need**: [who wants what, and what for]
**Columns**: [exact list, in order, with each field's format]
**Who can export**: [allowed roles; roles explicitly excluded]
**Format**: [encoding, separator, file name]
**Out of scope**: [what this ticket does not do]
**Dependencies**: [tickets to finish before this one, or "none"]
**Acceptance criteria**:
- [ ] [check 1, testable]
- [ ] [check 2, testable]

**Open questions for the PO**: none
```

## Why run Grill Me before writing the ticket?

Because Grill Me brings out the decisions you have not made yet, before an agent makes them for you. It is the most direct way I know to close open questions.

Matt Pocock wrote this skill. According to [its documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md), you start it by typing `/grill-me`, and the agent won't start it on its own. The skill questions you in rounds. It writes no file. The same page advises leaving plan mode off, and I have already told [why I moved from plan mode to Grill Me](/en/resources/articles/claude-code-plan-mode).

The grill-me docs tell you to count rounds, not questions. Their [Common questions section](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md#common-questions) gives a benchmark: 46 questions across 4 rounds is an ordinary session. If a session climbs to 200 questions, the usual cause is a scope that is too large. The docs then advise asking the agent to break the work into smaller pieces first, then grilling each one.

The trap is called passivity. Answering "agreed" forty times in a row decides nothing, because you own the scope. The agent asks the questions.

I rank that thinking time as high as the ticket. As I put it, running a Grill Me or getting skills to help you split the tickets and think things through is the same kind of work, and it matters a great deal.

Once you have made the decisions, the [to-spec](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-spec.md) skill publishes a spec. If nothing is decided yet, its docs point to grill-with-docs.

## Should a skill split your tickets?

Yes, as soon as the work is bigger than what an agent can do in one session. Below that, the skill is of no use.

That skill is [to-tickets](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md), also by Matt Pocock. In its docs, [each ticket is a tracer bullet](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md#tracer-bullets-not-layers): a vertical slice that crosses the schema, the API, the UI and the tests. The skill sizes it for one fresh context window. The ticket also declares its dependencies, the blocking edges, meaning the tickets that must finish before it.

Those docs cite a sobering case. One team had split its work into 26 tickets, by layer. It counted roughly 20 agent runs per closed ticket, about three quarters of them rework. I did not observe that case myself.

Slicing by layer is still the natural reflex: all the schema first, then all the API. For the invoice export, a vertical slice would be, for example, the export of a single column, from the button to the file, test included. You can verify it alone.

The skill publishes nothing without your approval. You first get its breakdown as a quiz. Use it. Over-splitting is [the most reported problem](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md#common-questions) with this skill. And if everything fits in one context window, you don't need the skill.

## What should the agent find in the repo?

What every session needs, and as little as possible beyond that. The rest goes in the ticket.

The reason is a cost. According to the [writing-for-agents documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/writing-for-agents.md#the-two-loads), `CLAUDE.md` loads into every session. Anything that applies in one session out of ten costs context in the other nine.

Keep in `CLAUDE.md` the rules that hold for the whole repo. A detail that concerns one task belongs in that task's ticket. Same logic as the complete ticket, seen from the repo.

Team-level settings are in [the Claude Code enterprise rollout guide](/en/resources/articles/claude-code-enterprise-rollout).

## Who tracks what your agents do?

A shared board, which agents and humans read in the same place. With complete, well-split tickets, you can launch several agents. You then need to know who holds what and what is done.

On tracking, I moved too. For my own agents, I went from Linear to GitHub Issues. Then Vercel released Vercel Board, on [November 18, 2026](https://vercel.com/blog/introducing-vercel-board). I like the idea, with one reservation (translated from French): it "forces you to use their system, which is very good, but it forces you to use Vercel." I want to run my code wherever I want.

I built Open Board for that: agents and humans follow the agents' work there, on a board that runs on your side. The code is public at [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), under the Apache-2.0 license. Open Board speaks Vercel Board's HTTP protocol and handles messages, tasks (lease, dependencies, waiting, assignment) and an event stream. On top come its own accounts, signed webhooks, an MCP endpoint, a web UI, a CLI (`ob`) and a skill. All of it runs on SQLite or on Postgres.

The details are in [my guide to coordinating your agents on a board](/en/resources/articles/multi-agent-system-vercel-board). A complete ticket tells the agent what to do. The board tells you what it did with it.

*Updated November 26, 2026. The benchmarks on Grill Me, to-tickets, to-spec and writing-for-agents come from the mattpocock/skills documentation, read on November 26, 2026.*

Start small. Take your next ticket and run it through the table above. Launch the agent when the PO would have no question left.

To bring your tickets and your [AI agents in production](/en/ai-agents-in-production) up to this level, [book a call](https://cal.com/stangirard/thevibecompany).

## FAQ

### What is the difference between context engineering and prompt engineering?

Prompt engineering works on the wording of instructions. Context engineering deals with everything the model receives: Anthropic defines context as the set of tokens given to the model, and presents context engineering as the natural progression of prompt engineering. For a coding agent, the ticket and the repo are part of it.

### What is a definition of ready for an AI agent?

A definition of ready for an AI agent comes down to two tests: the whole need is written in the ticket, and no question is left for the PO. Settled decisions and declared dependencies come next. Acceptance criteria you can check close the list.

### What is Grill Me?

Grill Me is a skill by Matt Pocock that questions you about an idea, in rounds. You start it yourself by typing `/grill-me`: the agent won't start it on its own. Grill Me writes no file, and its documentation advises leaving plan mode off.

### What is a normal number of questions in a Grill Me session?

The Grill Me documentation says to count rounds rather than questions: 46 questions across 4 rounds is an ordinary session. At 200 questions, the scope is usually too large. Split the work, then grill each piece.

### Do you need one ticket per agent session?

Yes, that is the to-tickets rule: each ticket is sized for one fresh context window and declares its dependencies. If the whole change fits in a single context window, you don't need to split it.
