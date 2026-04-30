---
title: "Why I replaced prompts with skills"
slug: why-i-replaced-prompts-with-skills
language: en
summary: "A prompt is a disposable instruction. A skill is a versioned workflow package with triggers, scripts, references, review gates, artifacts, and memory."
publishedAt: 2026-04-24
complexity: intermediate
topics: Agent Design, AI Operations, Skills
coverImage: /images/resources/why-i-replaced-prompts-with-skills/generated/prompts-to-skills-cover.png
coverAlt: "A fragile prompt becomes a versioned agent skill with workflow files, scripts, review gates, and output artifacts"
ogImage: /images/resources/why-i-replaced-prompts-with-skills/generated/prompts-to-skills-cover-og.png
---

I used to save prompts.

Not because I believed prompt libraries were the future. Because the same work kept coming back.

Write the article. Triage the inbox. Prepare the meeting digest. Turn a source into a note. Review the vault. Package the post. Every time, I would paste a better version of the previous instruction and hope the agent remembered the parts that mattered.

The prompts got longer. The results did not get proportionally safer.

That was the clue. I was not repeating text. I was repeating workflows.

So I stopped treating those instructions as prompts and started turning them into skills.

![A fragile prompt becomes a versioned agent skill with workflow files, scripts, review gates, and output artifacts](/images/resources/why-i-replaced-prompts-with-skills/generated/prompts-to-skills-cover.png "Repeated instructions should become workflow infrastructure.")

## A prompt is an instruction. A skill is a workflow package.

By "skill", I mean a small directory that teaches an agent how to handle a recurring job. It has a `SKILL.md` entrypoint, a trigger description, markdown instructions, and sometimes scripts, templates, examples, references, or runtime state.

The official Claude Code docs describe the moment clearly: [create a skill](https://code.claude.com/docs/en/skills) when you keep pasting the same playbook, checklist, or multi-step procedure into chat.

That is exactly the line.

If I ask once, a prompt is fine.

If I ask twice, I probably need a skill.

The difference is not cosmetic. A prompt lives in the current conversation. A skill lives in the system. It can be found again. It can be versioned. It can carry files. It can call scripts. It can define what "done" means. It can improve after a bad run.

That makes it closer to software than to copywriting.

## The prompt was hiding three jobs

Most long prompts are trying to do three jobs at once.

First, they give context: who I am, what project this is, what tone I like, which files matter, what not to touch.

Second, they prescribe method: read this before writing, split the work into stages, ask for approval here, preserve sources, run these checks.

Third, they specify output: write a brief, produce a draft, create a PR, generate a preview, summarize the blockers.

When those three jobs stay inside one pasted prompt, everything is fragile. The context gets stale. The method is hard to audit. The output contract changes depending on my patience that day.

A skill separates the pieces.

The trigger description says when to use it. The body defines the method. Supporting files hold references. Scripts handle repeatable mechanics. Runtime artifacts preserve the work. The output contract says what should exist at the end.

This is not about making the model "smarter." It is about removing ambiguity from the environment around the model.

That is the same lesson we learned with MCP. A weak MCP surface exposes tools. A strong one teaches the company's method. A weak prompt tells the model what you want right now. A strong skill teaches the agent how this kind of work is done here.

The broader version of that argument is in [MCP is how agents learn your company's taste](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done).

## Skills turn repetition into infrastructure

The first skill that made this obvious for me was inbox zero.

I did not need another email app. I needed the agent to know my mailbox routing, my archive rules, my active clients, my follow-up posture, and the difference between noise and a real relationship signal.

That does not fit in a cute prompt.

It became a skill: use cases, confidence thresholds, Granite lookups, a local HTML review surface, state files, and a small bridge so decisions made in the browser can be read back by the agent.

The same pattern showed up in publishing. A good article workflow is not "write a blog post." It is brief, internal research, external research, outline, draft, critique, semantic cocoon, asset decisions, repo packaging, preview validation, and publication gates.

If that stays as a prompt, half the workflow depends on whether the current chat has enough room and whether I remembered to paste the latest version.

As a skill, the workflow has a home.

## The real value is not reuse. It is improvement.

People usually explain skills as reusable prompts. That undersells them.

Reuse is useful, but the bigger shift is that a skill can get better.

When a prompt fails, you often patch it emotionally. Add one more line. Make a warning louder. Add "do not forget" in capital letters. The next run feels better, but you rarely know if the system actually improved.

With a skill, you can treat the previous version as a baseline.

Snapshot it. Run the old and new versions on the same task. Compare outputs. Tighten the trigger. Move brittle shell commands into a script. Add an output contract. Add a review gate. Rerun.

That loop changes the standard. The question is no longer "does this prompt sound good?" It becomes "does this skill produce better behavior than the version we had yesterday?"

That is a product question.

## A useful skill has boundaries

The best skills in my workspace are not broad.

They do not say "help with marketing" or "do operations." They own one workflow.

`vibe_publish` owns content from idea to packaged preview. `vibe_inbox-zero` owns mailbox triage and disposition. `vibe_meeting-digest` owns post-meeting capture, synthesis, and follow-up. `vibe_skill-system` owns the health of the skill architecture itself.

The rule is simple: one workflow, one owner.

That matters because agents are very good at blurring responsibilities. If a skill is vague, the agent will use it vaguely. If three skills can plausibly own the same work, the system starts negotiating with itself.

Good skills are boring in the right places:

- clear trigger
- narrow scope
- staged process
- explicit artifacts
- known tools
- approval gates
- out-of-scope boundaries
- checks before completion

That is not prompt engineering. That is operations design.

OpenAI's agent guide frames agents as systems that perform workflows using a model, tools, and instructions. The skill is where those instructions stop being a one-off chat message and become part of the operating surface around the agent.

## Skills also make delegation cleaner

Once the workflow is packaged, subagents become more useful.

Without a skill, delegating often means copying a long instruction into another context and hoping the worker interprets it the same way.

With a skill, the main agent can keep ownership while the subagent handles a bounded slice: review this draft as the target reader, run this benchmark, inspect these files, compare these two outputs.

The skill keeps the method stable. The subagent provides parallel evidence.

That distinction matters. I do not want subagents inventing the operating system. I want them working inside it.

## The company memory connection

Skills become much more powerful when they are connected to memory.

A publishing skill that cannot see prior articles will repeat them. An inbox skill that cannot see client history will archive the wrong thing. A meeting skill that cannot write durable notes will create nice summaries and lose the actual learning.

That is why Granite sits underneath most of my workflows. It gives skills a shared company memory: sources, notes, syntheses, outputs, people, organizations, links, and wakeup context.

The skill defines the job. The memory gives the job continuity.

I wrote the personal version of that system in [My personal OS lives in a folder](/resources/articles/my-personal-os-lives-in-a-folder).

This is where prompts really break down. A prompt can ask the model to "remember the company context." A skill can actually load the relevant context, write artifacts back, and make the next run better.

## The rule I use now

My current rule is blunt:

If I have to explain the same workflow twice, the system is incomplete.

The first time is discovery. A prompt is fine.

The second time is evidence. Something is recurring.

The third time should not happen as a pasted instruction. It should become a skill, or belong inside an existing owner skill.

That does not mean every task deserves a folder. Most one-off work should stay one-off. But recurring work should stop depending on my memory of the last prompt.

Prompts are where I discover the work.

Skills are where I put the work once I understand it.

## Prompt libraries were the prototype

The old habit was to collect prompts.

The better habit is to collect operating surfaces.

A saved prompt can remind you how you asked last time. A skill can run the workflow again, with the right context, the right tools, the right artifacts, and a clearer definition of done.

That is why I replaced prompts with skills.

Not because prompts stopped working.

Because the work started repeating.

And repeated work deserves infrastructure.

## Further reading

- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [OpenAI: A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- [MCP is how agents learn your company's taste](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done)
- [My personal OS lives in a folder](/resources/articles/my-personal-os-lives-in-a-folder)
