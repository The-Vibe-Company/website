---
title: "Enterprise agent harness: loops, sandbox, skills"
seoTitle: "Enterprise agent harness: loops, sandbox, skills"
slug: enterprise-agent-harness
translationKey: enterprise-agent-harness
language: en
summary: "Enterprise agent harness: the loop, sandbox, skills, evals and risk-based review to build around the model before your AI agents reach production."
publishedAt: 2026-10-29
complexity: intermediate
topics: AI Agents, AI Infrastructure, Security
coverImage: /images/resources/agent-harness-entreprise/cover-mascotte.webp
coverAlt: "The mascot turns a wrench on the base of a glass dome protecting a glowing crystal, surrounded by a looping rail track, a tool rack, checked gauges and a traffic light"
ogImage: /images/resources/agent-harness-entreprise/cover-mascotte.webp
---

An agent harness is everything around the model: the loop that calls it, the tools and skills it can use, the sandbox where it runs code, the context it gets and the checks that decide whether its work is accepted. In a company, that's where an AI agent's reliability and security get decided. Switching models takes one line of config. Building the harness around it takes weeks, and that's the part that holds up, or doesn't, in production.

We wrote this for CTOs and engineering leads who want to move from demo agents to agents that run on real systems. We'll cover the six building blocks of a harness, why you should start with a single agent, and what Anthropic's October 27, 2026 research on Chrome exploit chains changes for your sandbox and your patch cycle.

## Agent harness: a simple definition

LangChain sums it up in [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness): "Agent = Model + Harness. If you're not the model, you're the harness." The model reads text and produces text. It keeps no state between sessions, runs no code and has no access to your systems. The harness provides all of that.

In practice, a harness contains:

- a loop that calls the model, runs its tool requests, returns the results and decides when to stop;
- tools (internal APIs, MCP servers, bash) and skills, meaning business procedures the agent loads when it needs them;
- an isolated execution environment: files, network, secrets, process lifetime;
- context management: what enters the model's window, what leaves it, what gets remembered;
- controls: budgets, tests, human approvals, traces.

The same model can produce very different results depending on the harness. LangChain says it moved its coding agent from the top 30 to the top 5 on Terminal Bench 2.0 by changing only the harness.

## Why the harness matters more than the model choice

Enterprise debates often focus on the model: Claude, GPT, Gemini, open source. It matters, but you can change it later. What blocks a production rollout almost always comes from elsewhere:

- the agent loops forever on a task and burns the budget;
- it has a production write tool when it was only supposed to read;
- nobody can say whether the new version is better or worse than the old one;
- a booby-trapped web page or document makes it run a command;
- a sensitive diff gets merged without review.

Swapping the model fixes none of these. The harness does. That's also why people talk about a software factory: a shared base of tools, agents, skills and rules that every team uses. With [Theodo](/en/case-studies/theodo), we build this kind of base for hundreds of developers, and most of the work is about what surrounds the model.

## The six building blocks around the model

| Block | What it does | Question for your team |
|---|---|---|
| Loop | Calls the model, runs tools, stops | What turn and cost budget per task? |
| Tools and skills | Give the agent hands and methods | How many tools, grouped how, with which rights? |
| Sandbox | Isolates code, files, network, secrets | What can the agent break if it is tricked? |
| Context and memory | Chooses what the model sees | What is loaded by default, and why? |
| Evals | Measure whether a version is better | Do you have 10 replayable reference tasks? |
| Risk-based review | Decides who approves what | Which actions require a human? |

### 1. The loop: budgets and stop conditions

The basic loop is simple: the model proposes tool calls, the harness runs them, returns the results, and repeats. The real question is the limits. In its guide [When to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop), Anthropic describes a loop that stops when the model answers or hits a budget, with turn and cost budgets and "write gates" set in the harness, not in the prompt.

What to put in place:

- a turn and cost cap per task, with a clean stop that explains where the agent was;
- a task state outside the conversation (running, blocked, awaiting approval, done) so work can resume;
- a check after the answer where possible: tests, schema validation, comparison with real data.

### 2. Tools and skills: few, grouped, with rights built in

Anthropic observes that beyond 30 to 50 tool definitions in the system prompt, the model picks tools less reliably. Its advice: group tools by user intent rather than one tool per API endpoint, and load detailed descriptions only when the agent needs them.

Skills do the same for methods. A skill describes how your team does a job: steps, rules, edge cases. The agent sees a short description and loads the rest only when relevant. To connect the agent to your systems, see [what an MCP server is](/en/resources/articles/what-is-an-mcp-server).

One thing people miss: permissions live in the tool. Anthropic recommends that each tool check what the calling user may see or do, and return a plain refusal the model can read. One agent can then serve users with different access, without one agent per permission level.

### 3. Sandbox and isolation: assume the agent will be tricked

As soon as an agent runs code, reads web pages or handles files, assume malicious content will eventually reach it. The sandbox limits the damage:

- an ephemeral environment per task, destroyed at the end;
- an allow-list of commands and network egress limited to the domains you need;
- no production secrets mounted by default, short-lived credentials when needed;
- a file system restricted to the repository or working folder;
- an up-to-date browser and dependencies in the sandbox image.

We covered attacks that target the agents themselves (stolen secrets, poisoned dependencies) in [Black October](/en/resources/articles/black-october-ai-agent-security).

### 4. Context and memory: load less, load better

The fuller the context window, the more the model drifts. The harness decides what is loaded at start (a short instructions file, for example) and what is fetched on demand (docs, history, knowledge base). Anthropic says it cut Claude Code's system prompt for its more advanced models by over 80%, partly through this progressive loading of skills and tools.

### 5. Evals: 10 reference tasks before any change

Without evals, any change to the prompt, the tools or the model is a bet. Anthropic recommends one end-to-end test set owned by a small central team, and notes that 10 golden examples are enough to start. Two practical tips from the same guide:

- look at which tasks flipped, not only the overall score;
- run each task more than once, because some regressions only show up in one run out of two.

### 6. Review by risk level

Not everything deserves the same review. A simple rule: rank each agent action by how reversible it is.

- Read and summarize: no approval.
- Propose a diff, a ticket, a draft: light or automated review.
- Prepare a sensitive action (permissions, migration, secret rotation): mandatory human approval.
- Execute something irreversible in production: a human, always.

We show how this applies to CI in [AI agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas).

## One agent before the swarm

It's tempting to build an orchestrator and a dozen specialist subagents, one per team. Anthropic warns against this pattern, which it compares to Conway's law: the architecture ends up copying the org chart. In its article on [multi-agent systems](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), Anthropic says these systems typically use 3 to 10 times more tokens than a single agent for an equivalent task. In its more recent guide, it cites a customer whose single loop ran roughly twice as fast as the multi-agent setup it replaced.

Anthropic keeps subagents for three cases:

- the single loop degrades measurably because of context bloat;
- several independent tasks need to run in parallel;
- the agent picks the wrong tools or gets conflicting instructions.

Outside those cases, the proposed method (also published as an [open source kit](https://github.com/anthropics/single-agent-loop-kit)) is to measure first, merge subagents that always work together, then turn the others into skills and tools, one at a time, keeping only those that do better on the eval.

## What Anthropic's Frontier Red Team research changes for your harness

On October 27, 2026, Anthropic's Frontier Red Team published [Discovering and exploiting vulnerabilities in critical, real-world software with Claude](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude). Using an unreleased internal research model, the team found critical vulnerabilities and built five working attack chains:

- Chrome: one-click code execution outside the browser sandbox, chaining four flaws (V8 engine, V8 memory sandbox, CacheStorage, FedCM);
- Safari: a same-origin policy bypass, without arbitrary code execution;
- Android: extracting photos from a locked Pixel 9 over USB;
- Windows: remote denial of service in the kernel's QUIC implementation (CVE-2026-33096), found through binary analysis with Ghidra;
- Linux: zero-click remote command execution as root via multipath TCP (CVE-2026-98432).

On Chrome, Anthropic says 62 CVEs have been assigned and patched as of version 156, all rated critical or high. The [Chrome release notes of October 27](https://chromereleases.googleblog.com/) (156.0.8078.73/.74) credit several fixes to "Xinyang Ge (Anthropic), assisted by Claude", including two critical ones. Be careful with the numbers going around: that update contains 52 security fixes from all reporters combined. Anthropic's count covers a different scope.

Four lessons for an enterprise harness:

**A sandbox alone isn't enough.** The Chrome chain got through two successive sandboxes. If the most audited browser on the market can be crossed by a chain of four flaws, your agent's container shouldn't be your only barrier. Stack layers: sandbox, restricted network, no secrets, least privilege in the tools.

**Update what your agents use.** Many agents drive a headless Chromium to browse or test. Their sandbox image must follow stable releases, like employee laptops. Here: 156.0.8078.73 or later.

**The results came from a harness, not a prompt.** Anthropic describes a platform of scanning agents running in parallel, each measured by how many additional vulnerabilities it contributes, with coverage tracking, automated variant analysis and a standardized verification and risk rating pipeline. Those are the same blocks as above: loop, tools, evals, review.

**Scan at PR time.** Fixing the backlog only solves half the problem, Anthropic writes: the other half is cutting the rate at which new vulnerabilities enter the codebase. The team recommends scanning every pull request and has released a Claude Code plugin for it. Its conclusion: scanning your own code is more important than ever. Finding and chaining multiple flaws used to be the work of a few specialist teams; according to Anthropic, frontier models now do it with little human involvement.

## Checklist: is your agent ready for production?

1. The loop has a turn and cost budget, and a resumable task state.
2. Fewer than 30 tools exposed, grouped by intent, with permissions checked inside each tool.
3. Business procedures are versioned skills, with an owner per team.
4. Code runs in an ephemeral environment, with filtered network and no production secrets.
5. Sandbox images (browser, dependencies) are patched like the rest of your fleet.
6. A set of 10 reference tasks runs before every prompt, tool or model change.
7. Every action is ranked by risk level, with human approval for anything irreversible.
8. Traces (model calls, tools, approvals) are kept and searchable.
9. One agent first; a subagent only when the eval shows it does better.
10. Pull requests go through an automated security scan.

To get from a prototype to this level, see also [from POC to production for an AI agent](/en/resources/articles/ai-agent-poc-to-production) and our guide to [AI agents for business](/en/resources/articles/ai-agents-for-business).

## FAQ

### What is an agent harness?

It's all the code and configuration around a language model that turns it into an agent: the execution loop, tools and skills, the sandbox, context management and controls (budgets, tests, approvals). The model proposes; the harness executes and constrains.

### What is the difference between an agent harness and an agent framework?

A framework provides code building blocks to build an agent. The harness is the complete system running in production with your tools, your permissions, your sandbox and your approval rules. You can build a harness with a framework, or use the one shipped with a product like Claude Code or Codex.

### Do companies need several specialist agents?

Not at first. Anthropic recommends starting with a single agent that loads skills and tools on demand, and keeping a subagent only if context saturates, tasks must run in parallel or the agent picks the wrong tools, and an eval confirms it.

### Is a sandbox enough to secure an AI agent?

No. The Frontier Red Team research Anthropic published on October 27, 2026 shows an exploit chain that escapes Chrome's sandbox. Stack protections: ephemeral environment, filtered network, no production secrets, permissions in the tools, human approval for irreversible actions.

### Where should you start when building a harness?

With evals and limits: 10 replayable reference tasks, a budget per task, a short list of tools with their rights, and a clear rule on what needs a human. The model choice comes next, and can change without rebuilding everything.

## Build the harness for your agents

The Vibe Company is an AI agency in Paris. We build agents, AI products and software factories that run in production, with the loops, skills, sandbox and review rules that go with them. Want to audit your agents' harness or set up a first one? Let's talk.

[Book a call about your agents →](https://cal.com/stangirard/thevibecompany)
