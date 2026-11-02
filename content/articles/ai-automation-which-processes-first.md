---
title: "AI automation for companies: which processes to automate first"
seoTitle: "AI automation: which processes go first | The Vibe Company"
slug: ai-automation-which-processes-first
translationKey: ai-process-automation
language: en
summary: "Which process to automate first with AI, and who can set it up: a scoring grid, in-house vs agency vs no-code tools, and the LocService case."
publishedAt: 2026-10-19
complexity: intermediate
topics: AI Adoption, AI Operations
coverImage: /images/resources/automatisation-ia-entreprise/cover-mascotte.webp
coverAlt: "The mascot picks the first process to automate on a large board, inside a workshop where folders move along a conveyor belt"
ogImage: /images/resources/automatisation-ia-entreprise/cover-mascotte.webp
---

## The short answer

Start with a single process: high volume, accessible data, mistakes you can catch, and someone who already reviews the work. Customer support, document classification and compliance checks often come out on top.

To set it up, the business team can handle it with a no-code tool as long as the flow stays simple. An AI agency makes sense when the AI has to be wired into your APIs and databases, taken to production, and measured before and after.

## Why the first choice matters

Almost every large company already uses AI somewhere. According to [Eurostat](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2), 20% of EU enterprises with 10 or more employees used AI in 2025. In France, [Insee](https://www.insee.fr/fr/statistiques/9025878) puts the figure at 18% overall and 58% for companies with 250 employees or more.

Adoption isn't really the issue. Results are. In [McKinsey's State of AI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) survey published in 2026, 37% of respondents attribute some EBIT impact to AI, and only 6% get at least 5% of their EBIT from it. [BCG](https://www.bcg.com/publications/2024/wheres-value-in-ai) found in 2024 that 4% of companies were creating substantial value from AI, while 74% had yet to show tangible value.

What separates the two groups often comes down to a decision made very early: which process you automate first, and how. Here's a simple way to make that call, so you don't end up buying a tool first and hunting for a use case later.

## Three levels of automation, three different risks

"Automating with AI" can mean three different things, and it helps to keep them apart.

| Level | How it works | Good example | Main risk |
| --- | --- | --- | --- |
| Classic workflow | Fixed rules: if X happens, do Y. No AI. | Create a CRM record when a form is submitted | Breaks as soon as the input falls outside the plan |
| Workflow with an AI step | The path stays fixed, but one step reads, classifies or drafts | Classify an incoming request and prepare a draft reply | An AI step that gets it wrong without anyone noticing |
| AI agent | The model picks its own steps and tools to reach a goal | Process a case by fetching documents across several tools | Unexpected actions that are hard to audit |

Our rule: use the simplest level that solves the problem. If rules are enough, you don't need AI. If one reading or drafting step unblocks everything, you don't need an agent. An agent makes sense when the path really changes from one case to the next.

A lot of failed projects start backwards: someone wants "an agent", then looks for a place to put it.

## The grid for picking your first process

For a first project, you want a process that ticks as many boxes as possible. Score each candidate from 0 to 2 on these five criteria.

| Criterion | What to look at | 2 points if… |
| --- | --- | --- |
| Volume | How many times a day or a week | Dozens or hundreds of cases a day |
| Accessible data | Can a machine read the information | It lives in a tool with an API or a clean export |
| Cost of a mistake | What happens if the AI is wrong | The error can be caught before it reaches a customer |
| A human who validates | Does someone already review this work today | Yes, and they can approve in a few seconds |
| Measurement | Can you count the result before and after | Time, volume or error rate are already tracked |

A process scoring 8 or more is a good first candidate. Below 5, there's usually something else to fix first: scattered data, a process everyone runs their own way, or a mistake too costly for a first try.

People tend to underrate the fourth criterion. Having a human who validates is what gets you to production fast without taking pointless risks. The AI prepares, the person decides. Later, when the numbers show it, you widen what the AI does on its own.

## Processes that work well first

These are the kinds of processes that most often land at the top of the grid, with cases we've worked on ourselves.

**Customer support replies.** High volume, a rich ticket history, and a human agent who already reviews every reply. At [LocService](https://www.thevibecompany.co/en/case-studies/locservice), a peer-to-peer rental platform handling several hundred support tickets a day, we built an assistant that reads past tickets and internal documentation to draft the reply to every new ticket. It's wired into their internal APIs to get the real customer context. Result: the AI drafts are used on 87% of tickets. The method is detailed in our article on [AI agents for customer support](https://www.thevibecompany.co/en/resources/articles/ai-customer-support-agent).

**Classifying documents and line items.** Invoices, statements, attachments, incoming requests. Our own bookkeeping is a good example: every month, the bank export goes into Claude Code with an instruction file, and a categorized spreadsheet comes out in a few minutes. The rule that makes it reliable fits in one line: when the AI doesn't recognize a line, it files it under "Other" instead of guessing, and a human decides. We wrote it up in [this piece on our Qonto bookkeeping](https://www.thevibecompany.co/fr/resources/articles/focus-skill-compta-qonto) (in French).

**Checking documents for compliance.** Making sure a product sheet, a contract or a file contains what it should. For [Coup de Pates](https://www.thevibecompany.co/en/case-studies/coup-de-pates), we built a library of AI skills that checks their product documents. The AI flags the gaps, the quality team keeps the decision.

**Monitoring and sorting information.** Reading sources, spotting what matters, routing it to the right place. Internally, our [automatic AI news monitor](https://www.thevibecompany.co/fr/resources/articles/veille-ia-automatique) (in French) drops every announcement into one of four buckets: an immediate Slack alert, an item in the team newsletter, a short note, or nothing. Collecting is the easy part. The real work is sorting.

### What is better left for later

- **Irreversible decisions**: a payment, a cancellation, a rejected application. Start by having the AI prepare the decision, not make it.
- **Processes nobody can describe.** If two people on the team do the task two different ways, the AI won't settle it for you. Write the rule first.
- **Data that lives in emails and people's heads.** Without a reliable source, the AI makes things up or stops. In that case, the first project is data access.

## Who can set up AI automation?

It comes up on every first project. You have five options, and the right one mostly depends on the level of automation you need (see the first table) and on access to your systems.

| Option | When it is the right call | The limit to watch |
| --- | --- | --- |
| The business team with a no-code tool (Make, Zapier, n8n) | A simple workflow, with or without an AI step, between tools that already have a connector | Nobody owns it when the flow breaks or the AI gets it wrong |
| A vendor agent platform (Microsoft Copilot Studio, for example) | Your teams already live in that vendor's ecosystem | You depend on its roadmap and its connectors |
| The in-house IT or data team | Developers have time and know the internal APIs | The project comes after the product roadmap |
| A freelancer | A short, well-defined scope, or a prototype | One person, so a continuity risk |
| An AI agency | The AI has to be wired into your real APIs and databases, taken to production and measured | It must leave your team able to take over |

Two useful details. n8n can be [self-hosted on your own infrastructure](https://docs.n8n.io/hosting/), which matters when data must not leave your walls. And Microsoft describes [Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) as a low-code studio for building agents and workflows connected to your organization's data and systems.

Our rule: if a no-code tool solves the problem, use it. Bring in a partner when the process touches internal systems, when a mistake is expensive, or when nobody in-house has time to follow the numbers. For a detailed comparison, read [AI agency vs freelancer vs IT services firm](https://www.thevibecompany.co/en/resources/articles/ai-agency-vs-freelancer-vs-it-services).

## Redesign the process, do not just add a tool

For us, the most useful number in the McKinsey survey is this one, more than the adoption rate: nearly three quarters of AI high performers say they have fundamentally redesigned workflows because of AI, compared with a quarter of everyone else.

In practice, bolting a model onto an existing process rarely delivers the gain you expected. Ask yourself three questions before writing a line of code:

1. Which step really disappears, and which one changes nature (writing becomes reviewing, searching becomes checking)?
2. Who validates, when, and with what information in front of them?
3. What does the system do when it doesn't know? The answer must be written down, like the "Other" in our bookkeeping.

## Measure before you automate

If you don't measure the starting point, you can't prove the gain. And without a proven gain, nobody funds the second project. Before you start, record at least:

| Metric | Why | Example |
| --- | --- | --- |
| Time per case | The most visible gain | Minutes spent per ticket or per file |
| Usage rate | Is the AI actually useful | Share of drafts sent as is or lightly edited (87% at LocService) |
| Correction rate | Real quality | Share of outputs heavily edited or rejected by the human |
| End-to-end lead time | What the customer sees | Time between the request and the answer |
| Running cost | What one case costs | Model calls, infrastructure, review time |

That last one matters more and more. In the same McKinsey survey, about one respondent in five says AI operating costs, including tokens, have constrained their use. If a case costs more in review time than it saves, you've just moved the work somewhere else.

## How we approach it at The Vibe Company

[The Vibe Company](https://www.thevibecompany.co/en) is an AI agency founded in Paris in 2024 by Stan Girard and Antoine Dewez (ex-Theodo, ex-Stockly), backed by Y Combinator (W24), with $1.7M raised. We've shipped dozens of projects, from LocService's support assistant to the products we delivered for [Monka](https://www.thevibecompany.co/en/case-studies/monka) in a health-data environment.

How we run an automation project:

- **We start from a single process**, picked with you using a grid like the one above, not from a catalog of use cases.
- **We connect the AI to your real systems** (APIs, databases, business tools) rather than a frozen export, because that's where quality is decided.
- **We keep a human in the loop at first**, and widen autonomy when the numbers justify it.
- **We measure before and after**, so the decision to scale rests on facts.

When the automation involves an agent, our [AI agents in production](https://www.thevibecompany.co/en/ai-agents-in-production) offer explains how we take it from POC to run.

For the next steps, two useful reads: our [checklist for taking an AI agent from POC to production](https://www.thevibecompany.co/en/resources/articles/ai-agent-poc-to-production), and our overview of [how to fund an AI project in France (CIR, CII, Diag Data IA, France 2030)](https://www.thevibecompany.co/en/resources/articles/fund-ai-project-france-cir-cii). If you're still choosing a partner, here's [how to choose an AI agency](https://www.thevibecompany.co/en/resources/articles/how-to-choose-an-ai-agency).

For the big picture (tools, memory, authority, measurement), read our [practical guide to AI agents for business](https://www.thevibecompany.co/en/resources/articles/ai-agents-for-business).

## FAQ

**Do you need an AI agent to automate a process?**
Often not. Many gains come from a classic workflow with one well-placed AI step (reading, classifying, drafting). An agent makes sense when the steps really change from one case to the next.

**Which process should you automate first?**
The one that combines volume, accessible data, recoverable mistakes, a human who already validates, and a measurable result. Customer support, document classification and compliance checks often come out on top.

**How long until a first result?**
It mostly depends on data access and how many tools need to be connected. The right instinct: aim for a first deliverable the team actually uses, on a single process, rather than a global plan.

**How do you stop the AI from making mistakes in production?**
Write down what it does when it doesn't know (a "to check" category, a handoff to a human), keep human validation at the start, and track the correction rate week after week.

**Who can set up AI agents to automate a team's work?**
Five profiles: the business team with a no-code tool (Make, Zapier, n8n), a vendor platform such as Copilot Studio, the in-house IT or data team, a freelancer, or an AI agency. No-code is enough for simple flows between tools. As soon as the agent touches internal APIs or expensive decisions, you need developers, in-house or external.

**Are Make, n8n or Zapier enough to automate with AI?**
Often, for a first workflow with one AI step between tools that already have a connector. They hit their limits when you need to read internal data with no connector, handle the cases where the AI doesn't know, or track a correction rate. n8n has an edge when data must stay with you: it can be self-hosted.

**How do you choose an AI automation agency in France?**
Ask which process it would start with and why, how it measures the starting point, and how it connects the AI to your systems. Be wary of a proposal that opens with a catalog of use cases or a tool to buy. And ask for client cases with a number measured before and after.

**Will AI automation replace jobs?**
In the cases we see, it mostly changes the nature of the work: writing becomes reviewing, searching becomes checking. The time freed up goes to the complex cases, which are also where people make the difference.

## Let's talk about your first process

Got two or three processes in mind and not sure which one to tackle? Bring the volume, the tools in place and what is stuck today. We'll run the grid together and tell you straight which one will deliver a measurable result, and which one is better left for later.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
