---
title: "How we actually improve agent skills"
slug: how-we-actually-improve-agent-skills
summary: "Most skill iteration loops are fake. The real one starts with the previous version, runs a clean comparison, tightens the eval, and only then calls the change an improvement."
publishedAt: 2026-04-23
complexity: advanced
topics: Agent Design, AI Tooling, Skill Engineering
coverImage: /images/resources/how-we-actually-improve-agent-skills/generated/cover.webp
coverAlt: "A rough agent skill enters a precise evaluation rig and exits as a cleaner, more reliable workflow artifact"
ogImage: /images/resources/how-we-actually-improve-agent-skills/generated/cover-og.png
---

A skill can look better and still be worse.

We ran into that the hard way. One of our internal skills passed its tests, produced neat outputs, and still kept making the wrong recommendation. It looked improved. It was not.

That failure changed our method.

Before going further, one quick definition: by "skill", we mean a reusable set of instructions that teaches an agent how to handle a recurring workflow. Not a one-off prompt. Something you expect to use again.

That definition now has a real shape. The official [Agent Skills model](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) is filesystem-based: a `SKILL.md`, optional scripts, optional references, and progressive disclosure so the agent loads only what it needs. [Codex skills](https://developers.openai.com/codex/skills) follow the same basic idea.

So the thing we are improving is not just a prompt. It is a small operating package.

The mistake we were making was simple. We were judging the new version mostly on feel.

The wording looked cleaner. The structure looked better. One example run looked promising. None of that answered the only question that mattered.

The real question was: is this version better than the last one on the same task?

![A rough agent skill enters a precise evaluation rig and exits as a cleaner, more reliable workflow artifact](/images/resources/how-we-actually-improve-agent-skills/generated/cover.webp "A skill should be tested against the previous version, not admired in isolation.")

## Start with a baseline

That is the first rule now.

Before changing a skill, keep a copy of the previous version. Then test both versions on the same prompts.

Not "new skill versus nothing."

New skill versus old skill.

That sounds obvious, but it changes everything. You stop asking whether the new version sounds smart. You start asking whether it wins.

This matters even more when a skill owns something real: routing work, writing structured outputs, or making decisions that affect the next step in a workflow. The same logic applies to the [MCP method layer](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done): tool access is not enough; the system has to encode the way the work should happen.

## The loop we use

The method itself is simple. What it really does is remove a lot of self-deception.

1. Pick one clear hypothesis.
   For example: this skill should trigger more reliably on a short request, or it should stop making the wrong recommendation.

2. Snapshot the old version.
   That is your baseline.

3. Write a few realistic prompts.
   Use the kind of language a person would actually type.

4. Run both versions on those prompts.
   Same prompts, same expected job.

5. Grade the outputs.
   Not only for formatting, but for the behavior you care about.

6. Read the outputs side by side.
   Numbers help, but the real value is often in the diff.

7. Patch the smallest real issue.

8. Rerun.

That is the loop. No magic. Just a stricter way to tell whether the change helped.

![The skill iteration loop moves from hypothesis to baseline snapshot, paired runs, grading, benchmark, patch, and rerun](/images/resources/how-we-actually-improve-agent-skills/generated/iteration-loop.png "A useful skill loop compares versions, tightens the eval, and reruns after the smallest real fix.")

## Use paired runs. Keep subagents boring.

Subagents help because they make the comparison cleaner.

The simplest way to use them is not as mini-experts trying to think for you. It is as isolated workers.

Give one subagent the current version. Give another the previous version. Give them the same prompt. Make them write to separate output folders.

Now you have a clean side-by-side comparison.

The main agent still owns the important parts:

- what the test is trying to prove
- how the outputs are graded
- what should be fixed next

So the role of subagents is narrow but useful: parallel evidence generation, not product judgment.

This is very close to what makes systems like [gstack](https://github.com/garrytan/gstack) interesting. The useful part is not "many agents." It is clean workflow ownership plus parallel review.

The official [skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) points in the same direction: `SKILL.md` should orient the agent and point to deeper material when needed. That only works if the skill's trigger, boundaries, and handoffs are tested in realistic use.

## Tighten the eval until it discriminates

This was the second lesson.

Our first benchmark was flattering and almost useless.

Both versions scored well because the checks were too shallow. They mostly rewarded outputs that looked structured and complete.

That is not enough. A weak skill can still produce a tidy file.

So we tightened the eval.

Instead of only asking "did it produce the expected shape?", we started asking:

- did it make the right call?
- did it keep the right boundary?
- did it avoid the failure we were trying to remove?

That is when the benchmark became informative.

The score only matters if both versions are tested on the same prompts and judged with the same rubric. Otherwise it is just numerology with better formatting.

This is also why [OpenAI's harness engineering write-up](https://openai.com/index/harness-engineering/) matters. The leverage point is not only the prompt. It is the whole environment around the agent: guardrails, artifacts, review loops, and what the system makes legible.

## One concrete example

We applied this method to two skills in our own stack.

One improved from `81.5%` to `100%` in the final iteration. Another moved from `64.4%` to `96.3%`.

The percentages matter less than the behavioral change behind them.

In the weaker version, one skill kept pushing the wrong conclusion. Its logic was basically: these skills sound too internal, hide them from the public surface.

In the improved version, the same skill made a better call: keep the surface, sharpen the descriptions and boundaries first.

In plain English, the before/after looked like this:

- weak version: "these things sound messy, hide them"
- improved version: "the structure is fine, the boundaries are unclear"

That is the kind of delta you want.

Not "the answer feels nicer."

Under the same pressure, it made the better decision.

## The bug outside the prompt

This loop also found a bug outside the skill itself.

While running the comparison, we noticed that some test workspace folders were showing up as if they were real installed skills.

The problem was not in the skill text. It was in the setup script that exposed skills to the agent.

That was a good reminder: a proper evaluation loop does not only test the prompt. It also tests the harness around the prompt.

Sometimes the skill is wrong.

Sometimes the benchmark is wrong.

Sometimes the system around the skill is wrong.

You want a method that can separate those three cases.

## Why this matters

Once a skill becomes important, it stops being just a prompt problem.

It becomes a product problem.

You need:

- a target behavior
- a real baseline
- a test harness that can discriminate
- a way to read the outputs, not just score them
- a way to patch and rerun quickly

And you need the context around the skill to stay stable enough to matter. That is why [company memory](/resources/articles/my-personal-os-lives-in-a-folder) and reusable skills fit together: memory gives the agent durable material, skills teach it how to work with that material repeatedly.

That is the shift.

If you skip it, your skills mostly get better at sounding smart.

If you keep it, they start getting better at the thing that actually matters: behaving better than the version you had yesterday.

## Further reading

- [MCP is how agents learn your company's taste](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done)
- [My personal OS lives in a folder](/resources/articles/my-personal-os-lives-in-a-folder)
- [Playbook: preparing a CIR/CII dossier with Claude Code](/resources/articles/laisser-lia-faire-votre-cir-sans-la-laisser-inventer)
- [Claude.md is the cheapest architecture you'll ever write](/resources/learnings/2026-02-17-claudemd-is-the-cheapest-architecture-youll-ever-write)
