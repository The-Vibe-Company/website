---
title: "Your Claude Code skills go to prod on gut feel"
seoTitle: "Claude Code skill: stop shipping on gut feel"
seoDescription: "A Claude Code skill improved by gut feel can ship without getting better. Here is how to measure it, and why a consultant first installs that evaluation loop."
slug: claude-code-skills-ship-on-gut-feel
translationKey: claude-code-skills-ship-on-gut-feel
language: en
summary: "A new skill version is not better just because you edited it. The story of one field test, and the method for measuring a skill before it ships."
publishedAt: 2026-11-17
complexity: intermediate
topics: Skills, Evaluation, Claude Code, AI Adoption
author: stan-girard
coverImage: /images/resources/vos-skills-ia-en-prod-au-doigt-mouille/cover-mascotte.webp
coverAlt: "The Vibe Company mascot compares two skill versions on a test bench before letting either one ship"
ogImage: /images/resources/vos-skills-ia-en-prod-au-doigt-mouille/cover-mascotte.webp
---

When you edit a Claude Code skill, you assume the new version beats the old one, because you just improved it. So you push it to the whole team and wait to see whether anyone complains.

French has an expression for this: *au doigt mouillé*, a wet finger held up to the wind. It slipped out of me in early November, in a meeting at a mid-sized software vendor I work with, about updates to an internal tool. Here it is in English, like my other quotes below: "It's more of a wet finger in the wind. You figure it will improve things, and afterwards it's the human feedback that validates."

The wet finger validates after the fact, once the version is already running for everyone. But [a skill is a versioned workflow package, where a prompt is a throwaway instruction](/en/resources/articles/why-i-replaced-prompts-with-skills), and something you version deserves a measurement before it ships. You hold some cases out, you run the old version and the new one on them, judges compare the outputs, and the new version goes out only if it wins.

At that same company, one skill did get measured. The result showed something no gut-feel reread could have caught.

## When a skill got measured for real, the new version caught no more defects

The starting point is ordinary: 8 tickets out of 10 reached QA with no test procedure. Hence an end-of-development skill, whose job is to prepare each ticket better before QA.

In early November, that skill got a proper evaluation. It covered tickets where QA had already given its feedback. On that set, the skill caught 40 to 45% of the defects QA would go on to raise, before the ticket ever reached QA.

Nice number. In the team's shoes, you put it on a slide for the next steering meeting and you move on.

Except the protocol had a flaw, and it was hiding in the control. To know what a skill adds, you compare work done with it against work done without it. Here, the "no skill" condition still received an instruction along the lines of "check the known traps". That is a step developers don't usually perform. So the skill was up against an unrealistically strong control, a developer more careful than any real one.

The second surprise is the one that stayed with me. The evaluation also compared version 1.2 of the skill with version 1.1, and the new one caught no more defects than the old one. What it improved was somewhere else: its test procedures are clearer and easier for QA to act on.

That is real progress, and it is about readability. On detection, a draw.

## To know whether a Claude Code skill got better, run the new version against the old one

Before a skill exists, comparing "with" and "without" makes sense. Once it is in place, the useful question becomes whether the new version beats the old one.

The method I set up at this company to answer it, as I said in a meeting, "wasn't pulled out of a hat either". It builds on [SkillOpt](https://github.com/microsoft/SkillOpt), a methodology published by Microsoft, which treats the skill file as an artifact you train and validate. The opposite, in other words, of a prompt you patch by feel.

It comes down to a few moves, in this order.

1. Freeze the model the skill runs on.
2. Set real cases aside to serve as your evaluation set.
3. Run the old version and the new one on those same cases.
4. Hand the outputs to judges, blind if you can.
5. Keep the change only if it wins.

![A skill evaluation loop: held-out cases, old version versus new, a judge, then keep or reject](/images/resources/vos-skills-ia-en-prod-au-doigt-mouille/eval-loop-en-480.png "A new skill version ships only if it beats the current one on held-out cases.")

The last move is the one that hurts. In SkillOpt a tie is a rejection, and a text that merely looks cleaner doesn't make the cut either. I went through the mechanics in [an earlier article on how to use SkillOpt to train your agent skills](/en/resources/articles/how-to-use-skillopt-to-train-agent-skills).

To have this method there from day one, I created [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), a skill that sets up the evaluation at the moment you create yours. A second one, [Refine Skill](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/refine-skill-tools/SKILL.md), reuses it at every iteration.

This protocol has a side effect I like: it forces you to write down, before the test runs, what "winning" means. Take the new version of the QA skill again. A draw on defects caught, a win on how clear the procedures are. Depending on the criterion you picked at the start, that is a rejection or a release. By gut feel it was just "better", and everyone heard what they wanted in the word.

## This protocol doesn't install itself, because nobody has the time

None of this is complicated. You need to know the protocol, then find the time to install it, and that is where it gets stuck.

I am badly placed to lecture anyone. A few days after the wet-finger meeting, in another session, I heard myself say: "Because there's no measure of improvement on it. They do it by gut feel. They improve something, they do it by gut feel. But I don't have the time."

The last sentence is the most honest one. I know the method, I built the skills that install it, and that day I still didn't have the time. Now picture the people who look after skills on top of their actual job.

In mid-November, at this company, a skill update could still ship with nothing checking it. The goal I set is a check in CI. As soon as someone changes a skill, the new version has to prove it is better than the old one.

I ran into the same reflex with model choice. One day I asked a developer: "Why are you using Sonnet and not Opus". He had been using Claude since August, had never been curious enough to try Opus, and had always been happy with Sonnet. So he had compared nothing. I see other teams stay on Sonnet thinking it saves time, when Opus 5.5 does the job very well.

Measuring has to be somebody's job, and that is where I put the AI consultant. In-house, that somebody has a name: [the skill architect](/en/resources/articles/claude-code-skills-governance). A consultant is there to build what will stay with you: internal resources, policy, drive, skills. The evaluation harness is part of that, and you plan for it as early as [your company's Claude Code rollout](/en/resources/articles/claude-code-enterprise-rollout). The build team comes after, when you lack the people in-house to build or you need to go faster. That holds even more in AI, where the gaps in level are wide.

Now go back to your next skill edit. Before you ship it, open the repo where your skills live, or [a skills hub like Skillpack](/en/portfolio/skillpack) if that is what shares them with the team. Next to the skill your team uses most, put an evaluation set: real cases held out, plus the criterion that says whether a version wins. The next version will play against the old one, and your finger can stay dry.

[Book a call](https://cal.com/stangirard/thevibecompany) if you want this method installed on your own skills: I'll look with you at how to set up the harness and the CI check.

*The results told here come from an evaluation run in early November 2026, limited to tickets that already had QA feedback; the gain on other tickets was not measured the same way.*

## FAQ

### How do you know whether a new version of a Claude Code skill beats the old one?

Run the old version and the new one on the same cases, set aside in advance, with the same model. Judges then compare the outputs, blind if possible. You keep the new version only if it wins.

### Should you compare work done "with the skill" and "without the skill"?

That comparison makes sense when you create the skill. Once the skill is in place, the useful question becomes whether the new version beats the old one. Watch your control condition too: if it receives a step your developers don't usually perform, the control is unrealistically strong and the comparison is biased.

### What is SkillOpt?

SkillOpt is a methodology published by Microsoft for evaluating the quality of skills and guiding their iterations. The target model stays frozen, and an edit to the skill is accepted only if it improves a score on a held-out set of cases. Ties are rejected. [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), the skill I created to set up that evaluation when a skill is created, builds on SkillOpt.
