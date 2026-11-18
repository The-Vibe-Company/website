---
title: "Your AI software factory is waiting on a four-hour CI"
seoTitle: "AI software factory: start with tests that run in minutes"
seoDescription: "An AI software factory starts with tests that run in minutes on the machine. Field notes: a nightly CI brought from 4h27 down to 4 min 30, then sandboxes."
slug: ai-software-factory-fast-tests
translationKey: ai-software-factory-fast-tests
language: en
summary: "Before you add more agents, make your tests fast on the machine. Field notes from a nightly CI and from a mobile app tested by its own agents."
publishedAt: 2026-11-18
complexity: intermediate
topics: Software Factory, AI Agents, Testing, Claude Code
author: stan-girard
coverImage: /images/resources/software-factory-ia-tests-rapides/cover-mascotte.webp
coverAlt: "The Vibe Company mascot in front of a test bench running fast"
ogImage: /images/resources/software-factory-ia-tests-rapides/cover-mascotte.webp
---

Say "AI software factory" and everybody sees the same picture: a fleet of agents picking up tickets, coding in parallel and shipping while the team sleeps. The pages that define the term talk about coding agents, where humans fit, and which controls to put on the agents. So people start by counting agents.

The first step isn't the number of agents, it's the speed of your tests. To get an efficient software factory, you first have to be able to run all your tests fast, on the machine. Agents that wait until the next morning to learn whether they broke something are useless.

I say it that bluntly because of what I saw at a client. Their CI, the pipeline that runs the tests automatically, ran at night, and the integration tests took more than four hours. You write code during the day and find out the next day whether it holds up.

I pointed agents at it to try to optimize the whole thing. On my machine, I got those integration tests from 4h27 down to 4 min 30. Read the units again: hours on the left, minutes on the right.

That figure was measured on my machine, and I'm claiming nothing here about the client's nightly CI. The how is another story. What it makes possible fits in a few words: a very fast agentic loop. The agent writes, runs the tests, reads what broke, fixes it and goes again, without waiting for anybody.

## A human can wait until tomorrow morning, an agent can't

A nightly CI is perfectly reasonable when humans write the code. They can check the next day, look at what happened, and pick it back up. The pipeline's pace roughly matches the person's.

An agent needs fast feedback. It doesn't go home in the evening. It finishes its change and needs the answer right away to decide what to do next. If the answer comes tomorrow, it stops, or it carries on blind.

Then there's volume. Where a human can do one ticket, an agent can do four or five, and you can have ten agents running at all times. At that rate you have no choice: the tests must be fast. Otherwise you end up with very, very slow feedback loops, and everything your agents produce piles up in front of the same test suite. The suite is the bottleneck.

Picture the morning after a nightly CI with a team of agents. A whole day of work lands in a single block, and the first job is to work out which change knocked over which test.

I mean all the tests. Integration tests, end-to-end tests (the kind that walk through the whole application) and the rest: try to make them pass as fast as possible. And on the machine, where the agent works. Adding new tests has to be easy too.

Same reasoning as with [Claude Code skills shipped on gut feel](/en/resources/articles/claude-code-skills-ship-on-gut-feel): measure before you roll out. For an agent that writes code, the measurement is called a test suite, and it only helps if it answers while the agent is still working.

On [Monka's mobile app](/en/case-studies/monka), I saw what happens when you take that idea all the way.

## At Monka, agents test what they just wrote themselves

There, everything was set up to run locally: the whole app, the backend, the configuration, and test environments that come pre-filled. Whatever an agent needs to check its work is already on the machine.

That left testing for real, in a simulator. MCP servers handled it, notably [XcodeBuildMCP](https://github.com/getsentry/MobileBuildMCP) (now MobileBuildMCP, maintained under the getsentry organization on GitHub), an MCP server that gives agents tools for working on iOS and macOS projects. They drove the simulators in an identical, reproducible way, so each agent could test the feature it had just implemented directly in the app.

That was the key to testing efficiently. With five agents running, each can validate its own work before handing it back to you.

You have an objection in mind, and it's the right one: the machine won't cope. True. The bottleneck leaves the CI and moves onto your machine. As soon as you launch five Xcode simulators at once, they eat every resource you have, and the end-to-end tests are pulling on the same resources at the same moment.

There's a less glamorous problem too. All those local test runs generate artifacts, and every three days about 100 GB of data had to be deleted. It was a pain.

The objection is fair. It also shows where the machine's ceiling is, and so what to build next.

## Sandboxes come later, once your AI software factory already tests itself fast

The logical next step is ephemeral environments, or sandboxes. After round after round of disk cleanup, I can very much see the appeal of an environment that disappears when the work is done.

Above all, sandboxes let you scale out. An orchestrator launches five or six agents on the tickets and, at the end, merges if everything is good. That's the subject of the article on [the enterprise agent harness](/en/resources/articles/enterprise-agent-harness), which covers loops, sandboxes and skills.

But the order matters. "Everything is good" means the tests pass. They give the green light for the merge, and the orchestrator goes no faster than they do. Put sandboxes in front of a suite that takes hours and you've multiplied the waiting, nothing else.

![Three steps of an AI software factory: tests that run in minutes on the machine, agents that validate their own work, then ephemeral sandboxes driven by an orchestrator](/images/resources/software-factory-ia-tests-rapides/etapes-en-480.png "Fast tests first, then parallel agents, then sandboxes.")

So before you count your agents, get a stopwatch out. Run your full test suite on a single machine, integration and end-to-end included, and write down the time. If it's measured in hours, you've found where to start. [Book a call](https://cal.com/stangirard/thevibecompany) if you'd like me to look at that number with you.

The fleet of agents can wait a little. Right now, it's the fleet that's waiting on your CI.
