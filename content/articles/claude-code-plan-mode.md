---
title: "Claude Code plan mode is a ritual that reassures, not a tool that protects"
seoTitle: "Claude Code plan mode reassures you. It doesn't protect you"
seoDescription: "Claude Code plan mode reassures more than it protects. Why I stopped reading plans and now spend my time on the ticket, grilled with Matt Pocock's Grill Me."
slug: claude-code-plan-mode
translationKey: claude-code-plan-mode
language: en
summary: "For a long time I asked the AI for a plan before every line of code. Today I don't look at plans at all: I spend my time on the ticket, with Grill Me."
publishedAt: 2026-11-19
complexity: intermediate
topics: Claude Code, AI Agents, Engineering
author: stan-girard
coverImage: /images/resources/claude-code-mode-plan/cover-mascotte.webp
coverAlt: "The Vibe Company mascot writes on a blank ticket surrounded by question bubbles, while a rolled, sealed plan gathers dust beside it"
ogImage: /images/resources/claude-code-mode-plan/cover-mascotte.webp
---

Claude Code plan mode reassures more than it protects. You ask the agent for a plan, you read it, you approve it, and you feel like you stayed in control. I did that for a long time. I first reread the plans, then wrote skills to make them cheaper, before moving up to the ticket with Grill Me. Today I don't look at plans at all, and the work that matters happens before the code.

## What Claude Code plan mode does

Plan mode is one of Claude Code's permission modes. According to [the official documentation](https://code.claude.com/docs/en/common-workflows), Claude reads files and proposes a plan, but makes no edits until you approve.

To turn it on, start Claude with `claude --permission-mode plan`. Mid-session, press `Shift+Tab` until the status bar shows "plan mode on".

The idea is sound. Before the agent touches the disk, you see what it intends to do and you can correct course. On paper, it's a gate between the agent and your code.

## I read plans, less and less carefully

At one point I always asked the AI for a plan before it wrote any code. Then I read it. At first, line by line. Then skimming. By the end, I was scanning for the two or three words that would have worried me, and approving.

A well-formatted plan looks serious. It has numbered steps, it names your files, it speaks the vocabulary of your codebase. After a while, I no longer had the attention it takes to find the mistake. And the mistake, when there is one, rarely hides in the steps. It hides in what nobody decided beforehand.

That's where the ritual takes over. I approved because I had read it, not because I had checked it.

## Then I tried to make plans cheaper

My next move was tooling. I wrote skills to help the agent produce its plans and to cut what they cost. It's the reflex I argue for in [why I replaced prompts with skills](/en/resources/articles/why-i-replaced-prompts-with-skills): when a task keeps coming back, I encode it instead of rewriting the prompt.

The plans came out faster and cost less. But I was optimizing a step I had already stopped really reading. A cheaper plan that I skim is still a plan that I skim.

## The real work moved up to the ticket

So I moved one step up the chain. These days I spend my time on the ticket. I think hard about the subject and give it structure, and for that I use [Grill Me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me), a skill by Matt Pocock.

Grill Me does one simple thing: it interviews you. You start it yourself with `/grill-me`, the agent never reaches for it on its own. It asks its questions in rounds until you have made every decision. It writes no files. What comes out is a clearer idea, which I then put into the ticket.

Once the ticket is set up like that, the AI is smart enough to implement the subject almost every time. The plan it would produce wouldn't tell me anything I hadn't already settled during the grilling.

Skip that work and a session drifts. You open Claude Code with a fuzzy goal, and dozens of prompts later the agent has rewritten half the module. A well-grilled ticket before you start is still the simplest way not to get there.

## Matt Pocock turns plan mode off to interrogate

What struck me is that [the Grill Me documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md) says it in plain words: "Leave plan mode off. Plan mode makes the agent hurry to produce a plan, when you want it to keep asking questions." That advice is for the grilling session itself.

The same page describes the trap I kept falling into. Answer "agreed" forty times in a row and you come out with a plan the agent wrote and you nodded at. It feels productive because it was long. You decided nothing. That's exactly what I was doing as I read my plans less and less carefully.

It all comes down to which way the question points. In plan mode, the agent proposes and you approve. In Grill Me, the agent asks and you decide. The first leaves you passive in front of a convincing text. The second makes you commit.

| | Plan mode | Grill Me |
| --- | --- | --- |
| Who asks the questions | The agent, along the way, then it proposes its plan | The agent, in rounds, until you have made every decision |
| Who decides | You, by approving the plan | You, question after question |
| When | Before the agent touches the code | Before any plan, on the ticket |
| What remains | A written plan to reread | Decisions in your head, then in the ticket |

## Anthropic says read the plan, and get yourself interviewed

The fairest objection comes from Anthropic. In [Claude Academy](https://academy.claude.com/courses/claude-code-in-action/steering-long-sessions), the lesson on long sessions says: "When you get that plan, actually read it. Don't skim it."

I agree with the intention. A plan nobody reads is useless. My point is something else: even an honest read comes too late if you hadn't made the decisions beforehand.

And Anthropic says that too, in its [Claude Code best practices](https://code.claude.com/docs/en/best-practices): "Ask Claude to interview you instead." When you don't know exactly what you want yet, get yourself interviewed. That is exactly the move Grill Me forces, and the reason the time I spent rereading plans moved up to the ticket.

## So, should you use plan mode?

The plan is what you keep when you want human control at that exact point. If you're [rolling Claude Code out to a team](/en/resources/articles/claude-code-enterprise-rollout) that is new to agents, seeing the plan before the edits can help people build trust. Just don't mistake it for protection.

In practice, I don't care about it at all. Today I don't look at plans anymore. I spend a lot of time in Grill Me on the ticket, and that's it.

If you'd like me to look at your tickets with you rather than your plans, [book a call](https://cal.com/stangirard/thevibecompany).

## FAQ

### What is Claude Code plan mode?

It's a permission mode in which Claude reads files and proposes a plan, without making any edits until you approve it.

### How do you turn on plan mode in Claude Code?

Run `claude --permission-mode plan`, or press `Shift+Tab` mid-session until the status bar shows "plan mode on".

### Should you use plan mode?

Yes, if you want human control before every edit. But reading a plan protects you very little. Your time is better spent on the ticket, for example with Grill Me.

### Does Grill Me replace plan mode?

They don't do the same job. Plan mode has the agent propose a plan. Grill Me interviews you until you have made every decision, and its documentation advises leaving plan mode off during the session.
