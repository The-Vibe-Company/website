---
title: "Claude Code skills: why your company needs a skill architect"
seoTitle: "Claude Code skills: why your company needs a skill architect"
seoDescription: "Claude Code skills at company scale: who writes them, who approves them, where they live, when to retire them, and why one named skill architect holds it."
slug: claude-code-skills-governance
translationKey: claude-code-skills-governance
language: en
summary: "A Claude Code skill shipped to the whole company changes how everyone who receives it works. Roles, proof before rollout, where each skill lives, retirement when a better model ships: the framework, and why a skill architect has to own it."
publishedAt: 2026-11-25
complexity: intermediate
topics: Claude Code, Skills, AI Governance, AI Adoption
author: stan-girard
coverImage: /images/resources/gouvernance-skills-claude-code/cover-mascotte.webp
coverAlt: "The Vibe Company mascot weighs a skill on a balance scale before letting it go out to the teams"
ogImage: /images/resources/gouvernance-skills-claude-code/cover-mascotte.webp
---

Governing Claude Code skills in a company means deciding who writes them, who approves them before rollout, where they live and when they retire. As long as a skill stays on your machine, it is your own business. The day it lands on every colleague's machine, it changes how they work. From then on it needs an owner, measured proof and someone to guard the door. I call that person the skill architect.

The name comes from a hunch of mine. New profiles and new experts are coming, the skill architects, and they are a bit like the DBAs of tomorrow. In many engineering teams, the DBA, the database administrator, looks after the databases everyone shares. Shared skills deserve the same keeper.

Their most useful rule fits in one line: at every new model, replay each shipped skill with and without it. A skill freezes the method of the day it was written, and the next model may well do better on its own.

## Why is a company-wide skill risky?

Because a skill changes the work of everyone who uses it, and not always for the better. A skill is a procedure Claude loads and follows. It imposes a method.

My take, in my own words: some skills have a huge impact on the process, and not necessarily a positive one. Scale makes it worse. Create a skill, ship it to 200 people, roll it out, and you get a mess.

The first shape hangs on a single line of text. Claude picks a skill from its description. Write that description too broadly and the skill shows up in tasks that are none of its business. The whole team inherits it.

Next comes the gut-feel update. Someone tweaks a skill, likes the result and pushes it to everyone. No measurement. A tweaked version is not automatically better, so [measure it against the old one](/en/resources/articles/claude-code-skills-ship-on-gut-feel).

Third shape, the hidden cost. According to the [Claude Code docs](https://code.claude.com/docs/en/skills), every skill in the listing adds to your context on every turn, whether or not Claude uses it. A skill nobody calls still costs something.

The last one is the least visible: a skill anchors the model in the method of the day someone wrote it. More on that below, where it gets its own section.

## Who writes, who approves and who retires a skill?

Anyone can write a skill. One named person approves the ones that go company-wide, and every shared skill has an owner who can pull it. I recommend the following split.

| Role | What they do | When they step in |
| --- | --- | --- |
| Author | Writes the skill and brings proof that it solves a problem | At creation and at every new version |
| Owner | Maintains the skill over time, collects feedback, publishes versions | As long as the skill is shipped |
| Skill architect | Approves skills before company-wide rollout and coaches authors | Before every wide rollout, and at every new model |
| Users | Report what breaks or slows down their work | All the time |

Your personal skills stay out of all this. A skill to write better emails? That is your business. Governance starts the moment a skill touches other people's work.

The loop stays short. An improvement request starts in a team and lands with the skill's owner, then the new version flows back to every team after approval.

## What is a skill architect?

A skill architect is the person who approves skills before they go to production for the whole company. They check whether the skill is well structured, whether it solves a real problem and whether the proof holds. They don't need to be an expert in the business domain, because the with-and-without measurement speaks for the author.

The DBA analogy helps me explain it. A badly designed database schema slows down every application that uses it. A badly designed skill, shipped company-wide, slows down everyone who uses it. Both need someone whose job it is.

That job has three sides. Before each company-wide rollout, the skill architect reviews the proof the author brings. When a new model arrives, they rerun the measurements. In between, they read the teams' skills and give feedback, so those teams learn to write good ones.

The workload depends on the company: how many shared skills, teams and models you run. What matters is that the role has a name and a person.

Creation stays open. The skill architect guards a single door, the one to wide rollout. To open it, they ask for proof.

## What proof should you require before rolling out a skill?

Require a comparison with and without the skill, on real cases, with a metric written down before the test.

At one client, I had skills adopted by fifty people go to production just because the developer thought they made things better. He didn't know. He pushed his skills to all of them on gut feel, without measuring. Nothing says these skills degraded the results. Nothing said they improved them either. The validation gate exists to close that gap.

My rule: you absolutely have to create skills well and measure them well.

The author starts by gathering a few realistic prompts taken from the team's work. Then, before any test, they write down what matters, and so what winning means. Next they build the skill with [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), the `create-skill-tools` skill I built to set up evaluation from day one. Last, the skill architect reviews the with-and-without results before any company-wide rollout.

The Claude Code docs cite a `skill-creator` plugin, made by Anthropic, which runs a similar loop with its own `evals/evals.json` format. Don't confuse the two tools.

The [docs describe this measurement themselves](https://code.claude.com/docs/en/skills#evaluate-and-iterate-on-a-skill). They advise running a few realistic prompts in a fresh session, once with the skill and once without, then comparing. For a skill that ships in a plugin, [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals) replays each prompt with and without the plugin, grades the outputs and exits non-zero below a threshold. That is enough to block a bad update in CI.

For a personal or project skill, the without-skill run comes down to one setting, `skillOverrides` set to `"off"`. Here is the example from the docs, to adapt with your skill's name. The `/skills` menu writes it for you to `.claude/settings.local.json`.

```json
{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}
```

Copy this rollout rule into your skills repo. Every skill up for a wide rollout fills it in before it goes to the skill architect.

```text
Skill: [name]
Owner: [person]
Target scope: personal / project / plugin / enterprise
Problem solved: [one sentence]
Evaluation cases: [number of real prompts, location]
Metric and threshold: [what matters, value needed to win]
Result with the skill: [fill in]
Result without the skill: [fill in]
Model tested: [name and version]
Approved by: [skill architect, date]
Next review: at the next model adopted
```

Three public skills show what the gate asks for in practice.

| Skill | What the source says | Measurement to require | Decision rule |
| --- | --- | --- | --- |
| Your in-house code review skill | Claude Code already ships `/code-review`. A project skill named `code-review` replaces the built-in command | Your recent PRs, reviewed by your skill and then by `/code-review` alone | Shipped if it beats `/code-review` on the chosen metric. Otherwise, keep the built-in |
| [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md) (`create-skill-tools`) | Its SKILL.md says to build realistic eval prompts and run the skill against a baseline | The evaluations it produces, reviewed by the skill architect | Wide rollout once its evaluations hold on your own cases |
| The [anthropics/skills](https://github.com/anthropics/skills) pack | Its README says these skills are provided for demonstration purposes and asks you to test them in your own environment before relying on them | `claude plugin eval` with and without the plugin, on your prompts | Personal or project scope until the evaluation passes |

This table holds no results. The last two columns are my recommendations, and the numbers will be yours.

For a new version of an existing skill, the question changes: version 1.2 has to beat 1.1. The method is in [my piece on Claude Code skills that ship on gut feel](/en/resources/articles/claude-code-skills-ship-on-gut-feel).

## Team skill or company skill: where should it live?

Put a skill as close as possible to the people who use it, because the location decides who gets it. The Claude Code docs list several.

| Location | Path | Who gets it | For which skill |
| --- | --- | --- | --- |
| Personal | `~/.claude/skills/<name>/SKILL.md` | You, in all your projects on this machine | Your experiments, your personal skills |
| Project | `.claude/skills/<name>/SKILL.md` in the repo | Every session in that repo | A team skill tied to the code |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is enabled, as `/plugin-name:skill-name` | A bundle of skills shared across teams |
| Enterprise | `.claude/skills/` in the managed settings directory | All users on machines where the organization deploys it | The few skills imposed on everyone |

Two details in that table weigh on governance. When names clash, enterprise wins over personal, and personal wins over project. A plugin skill loads next to a skill with the same name, because its name is prefixed with the plugin's.

A plugin makes distribution easy, and that is also its danger. A plugin skill loads wherever the plugin is enabled, and a bad version lands there too. That is where the validation gate matters most.

Moving from a team skill to a company skill takes one more proof. Rerun the comparison on cases from other teams, on top of those from the team that wrote the skill.

For a risky skill, there is a handbrake: `disable-model-invocation: true` in its frontmatter. Claude stops loading it on its own, and the skill only runs when a human types `/name`.

## What happens to your Claude Code skills when a better model ships?

Put them back on the test bench, with and without the skill, on the new model. If the model alone does as well, slim the skill down. Or retire it.

This is the fourth risk, the one I set aside earlier. In my words: skills anchor the LLM in a reality that belongs to the past. They impose a method, and when a new model version gets better, the skill keeps it anchored there. A skill written to make up for a weakness of the old model can hold the next one back. It pulls it into the past.

I recommend keeping a baseline measurement of the model alone, without skills. Each skill has to show what it adds on top of it. When the model changes, the baseline changes too.

For the cleanup, Claude Code gives you two tools. The `/skill-doctor` command shows what each skill costs and how often it gets used, and it flags the ones that have never been invoked. It needs Claude Code v2.1.252 or later. The `skillOverrides` setting, seen above, changes a skill's visibility without touching its file: `"name-only"` shows Claude only its name, `"off"` hides it entirely.

Every time the company adopts a new model, the skill architect reruns the with-and-without comparison on the skills shipped to everyone.

## When does this framework not pay off yet?

As long as your skills stay personal or live in a single repo, one owner per skill is enough. The team that uses it quickly sees if it gets in the way, and can fix it themselves.

The skill architect becomes useful the moment a skill leaves the team that wrote it. That can be a plugin shared across teams, managed settings for the whole organization, or several teams proposing skills for the same ground. Before that point, a central validation gate would slow things down without protecting many people.

The role does not replace measurement. A skill architect who approves without a with-and-without comparison is approving on gut feel, like the developer from earlier.

## Where do you start this week?

Start with the inventory and the owners. New skills can wait.

1. List the shared skills, the ones in repos, internal plugins and managed settings.
2. Run `/skill-doctor` to find the ones nobody uses.
3. Give each skill an owner. A skill without an owner gets retired, or goes back to personal.
4. Name the skill architect, with the workload that fits your size.
5. Write the rollout rule from the fill-in template above. For plugin skills, wire the measurement into CI with `claude plugin eval` and a threshold.
6. Note the review, due again at every new model.

If you are rolling out Claude Code at scale, this framework sits on top of the security settings in [the Claude Code enterprise rollout guide](/en/resources/articles/claude-code-enterprise-rollout). To share approved skills with your teams, a hub like [Skillpack](/en/portfolio/skillpack) works as the catalog. And if the line between skills and prompts is still blurry for your team, start with [why I replaced prompts with skills](/en/resources/articles/why-i-replaced-prompts-with-skills).

A skill already runs on every colleague's machine and nobody can say what it adds? Start with that one. Replay it with and without it.

*Updated November 25, 2026. The Claude Code features cited here come from the official "Extend Claude with skills" documentation.*

## FAQ

### What is a Claude Code skill?

A Claude Code skill is a folder with a `SKILL.md` file of instructions, sometimes with supporting files such as scripts. Claude uses the skill when a task matches its description, or when you type `/skill-name`. The body of the skill only loads when it is used.

### Where do you install Claude Code skills for a whole team?

For a team that shares a repo, commit the skill to the repo's `.claude/skills/` folder. For several teams, bundle the skills in a plugin. To impose a skill on the whole organization, deploy it in the managed settings directory. When names clash, the enterprise skill wins over the personal one, and the personal one over the project's.

### Who should approve a skill before it ships?

A personal skill needs no approval. A skill shipped to the whole company goes through one named person, the skill architect. They judge a with-and-without comparison, on real cases and against a metric chosen before the test. Creation stays open: approval covers wide rollout.

### Should you review your skills at every new model?

Yes for the skills shipped to everyone. A skill imposes a method written for a given model, and the next model may do better on its own. Rerun the with-and-without comparison on the new model, then slim down or retire what no longer helps. The `/skill-doctor` command also flags skills that have never been invoked.

### Can you turn off a Claude Code skill without deleting it?

Yes. The `skillOverrides` setting turns off a personal or project skill without touching its file. Set the skill to `"off"` to hide it, or to `"name-only"` to leave only its name visible to Claude. To stop Claude from running it on its own, add `disable-model-invocation: true` to its frontmatter. Plugin skills are managed from `/plugin`.

If you want to set up this framework on your own skills, with the validation gate and measurement in CI, [book a call](https://cal.com/stangirard/thevibecompany).
