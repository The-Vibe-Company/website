---
title: "The benchmark that finally explains why Codex felt better than Claude"
slug: why-codex-felt-better-than-claude-deepswe
language: en
summary: "DeepSWE gives a measurable reason why Codex with GPT-5.5 has felt stronger than Claude Opus 4.7 for long, multi-file vibe coding tasks: it tests the ability to close the loop."
publishedAt: 2026-05-28
complexity: advanced
topics: Agent Design, AI Infrastructure, Evaluation, Vibe Coding
coverImage: /images/resources/why-codex-felt-better-than-claude-deepswe/cover.png
coverAlt: "A premium operating table showing coding-agent workstreams, benchmark signals, code review cards, and a verified software task"
ogImage: /images/resources/why-codex-felt-better-than-claude-deepswe/cover.png
---

For the past few months, I had a very clear feeling in my day-to-day work: when I needed to actually move code forward, Codex with GPT-5.5 felt more reliable than Claude Opus 4.7.

Not "more intelligent" in some vague general sense. Not better in every context. Better in one very specific moment of vibe coding: when you give an agent a complex task and expect it to hold the loop until the end. Understand the repo. Find the right files. Change several places. Run the tests. Fix the side effects. Avoid dropping a requirement along the way.

![A premium operating table showing coding-agent workstreams, benchmark signals, code review cards, and a verified software task](/images/resources/why-codex-felt-better-than-claude-deepswe/cover.png "The useful question is not which model wins everywhere. It is which model closes this part of the loop.")

The problem was that this feeling was hard to explain cleanly.

On many public benchmarks, frontier models looked close. Sometimes Claude was ahead. Sometimes GPT was ahead. But in practice, my workflow was becoming clearer and clearer: I would often use Opus to create the plan, then pass that plan to Codex through Conductor for execution.

That was not a very satisfying explanation. "It feels better" is not a method.

The new [DeepSWE](https://deepswe.datacurve.ai/) benchmark from Datacurve finally gives that gap a name.

DeepSWE is not a benchmark of small coding exercises. It is a long-horizon software engineering benchmark: [113 original tasks](https://github.com/datacurve-ai/deep-swe), across 91 open-source repositories, in 5 languages. The tasks are not taken from existing commits or pull requests. They are written from scratch, with verifiers that test observable behavior rather than the exact shape of the implementation.

That matters because it is much closer to what we ask agents to do in real repositories. We do not always say: "modify this function with this signature." More often, we say: "this is the behavior I want, figure out how to integrate it properly."

And the results are quite telling: on the [DeepSWE leaderboard](https://deepswe.datacurve.ai/), GPT-5.5 at xhigh reaches 70% +/-4%. GPT-5.4 reaches 56% +/-5%. Claude Opus 4.7 at max reaches 54% +/-5%.

That is not a small leaderboard difference. It is exactly the kind of difference you feel when you spend several hours a day working with these tools.

What interests me most is not even "GPT beats Claude." It is the type of work where the gap appears.

DeepSWE forces the model to do what real coding agents have to do: explore a codebase, keep several constraints in mind, choose an implementation, edit multiple files, verify that the behavior is correct, and avoid breaking the rest of the system. In Datacurve's [published methodology](https://deepswe.datacurve.ai/blog), DeepSWE prompts are shorter on average than SWE-Bench Pro prompts, but the reference solutions are much longer: 668 added lines on average, compared with 120 for SWE-Bench Pro. Less specification, more engineering.

That is exactly where vibe coding becomes serious.

When you are prototyping a small feature, almost every strong model feels magical. When you are working on a real application, with local conventions, tests, side effects, technical debt, and files that depend on one another, the question changes. It is no longer: "Can the model code?" It becomes: "Can it finish a task without losing the thread?"

That is where my use of Opus and Codex started to split.

Opus is still very good at taking a fuzzy intention and turning it into a plan. It structures well. It helps surface the pieces, the risks, the open questions. When I need to frame the work, clear the fog, or reason through a strategy, I still find it strong.

But once the plan exists, execution is a different job. The agent has to be literal. It has to hold details. It has to apply the plan without reinterpreting it at every step. It has to go back to the tests, read the errors, fix, continue. In that mode, Codex with GPT-5.5 more often feels like an agent that keeps moving toward closure.

This is also why benchmarks and workflow design have to be read together. In the [SkillOpt article](/resources/articles/how-to-use-skillopt-to-train-agent-skills), the useful lesson was that agent behavior improves when the instruction layer is validated against real tasks. DeepSWE is making a related point from the model-evaluation side: the benchmark has to look like the work.

DeepSWE does not prove my exact Conductor workflow. The main leaderboard uses a standardized harness, [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent), to compare models in the same environment. So this is not a direct test of Codex CLI versus Claude Code, and certainly not a direct test of my local Conductor setup.

But it measures something very close to what matters: a model's ability to hold a long software engineering task inside a living repository.

And that is probably why the benchmark resonates so strongly with the field experience.

Previous benchmarks were useful, but they had become too easy to misread. When the best models sit inside a narrow band, it is tempting to believe they are interchangeable. They are not, at least not in an agentic workflow. Two models can score similarly on a short task and behave very differently during a three-hour session.

Datacurve also points to another issue: according to their audit, SWE-Bench Pro verifiers often misgrade submissions, with much higher false positive and false negative rates than DeepSWE. That claim will need independent reproduction, but it reinforces a simple point: a benchmark is only as good as its tasks and its grading system.

A coding agent is not just a model. It is a model inside a harness, with tools, working memory, instructions, a verification loop, and a way to recover when it makes a mistake. That is why the right question is not "Claude or GPT?" in the abstract. The right question is: which model, for which part of the work, inside which system?

This is the same reason I stopped treating repeated agent instructions as prompts and started turning them into durable workflow packages. The longer version is in [Why I replaced prompts with skills](/resources/articles/why-i-replaced-prompts-with-skills). The model matters. The surrounding operating surface matters too.

Today, my rule looks roughly like this:

Opus when I need to clarify intent, challenge a plan, unfold an architecture, or look at a problem from a distance.

Codex when I need to execute a long, concrete, multi-file software engineering task with a mergeable outcome at the end.

This is not model religion. It is routing.

And that is probably the most important point in DeepSWE: it does not only tell us which model is first on a leaderboard. It reminds us that useful benchmarks are the ones that look like the work we actually do.

In vibe coding, the real test is not generating code. It is closing a long loop without losing the constraints.

On that terrain, my feeling from the past few months just received a pretty solid signal.

## Further reading

- [DeepSWE benchmark](https://deepswe.datacurve.ai/)
- [DeepSWE on GitHub](https://github.com/datacurve-ai/deep-swe)
- [DeepSWE methodology](https://deepswe.datacurve.ai/blog)
- [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)
- [How to use SkillOpt: train your agent skills, not your model](/resources/articles/how-to-use-skillopt-to-train-agent-skills)
- [Agents don't lack tools. They lack company memory.](/resources/articles/agents-dont-lack-tools-they-lack-company-memory)
