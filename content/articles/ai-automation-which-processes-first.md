---
title: "AI automation for companies: which processes to automate first"
slug: ai-automation-which-processes-first
translationKey: ai-process-automation
language: en
summary: "Classic workflow, AI step or agent: how a mid-size or large company should pick its first process to automate with AI, with a scoring grid, the metrics to track and real examples (LocService, our own bookkeeping)."
publishedAt: 2026-10-19
complexity: intermediate
topics: AI Adoption, AI Operations
coverImage: /images/resources/automatisation-ia-entreprise/cover-mascotte.webp
coverAlt: "The mascot picks the first process to automate on a large board, inside a workshop where folders move along a conveyor belt"
ogImage: /images/resources/automatisation-ia-entreprise/cover-mascotte.webp
---

Most large companies already use AI somewhere. According to [Eurostat](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2), 20% of EU enterprises with 10 or more employees used AI in 2025. In France, [Insee](https://www.insee.fr/fr/statistiques/9025878) puts the figure at 18% overall and 58% for companies with 250 employees or more.

Usage is not the problem. Results are. In [McKinsey's State of AI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) survey published in 2026, 37% of respondents attribute some EBIT impact to AI, and only 6% get at least 5% of their EBIT from it. [BCG](https://www.bcg.com/publications/2024/wheres-value-in-ai) found in 2024 that 4% of companies were creating substantial value from AI, while 74% had yet to show tangible value.

What separates the two groups often comes down to a decision made very early: which process you automate first, and how. This article gives you a simple method to make that call, instead of buying a tool first and looking for a use case later.

## Three levels of automation, three different risks

"Automating with AI" covers three things that are better kept apart.

| Level | How it works | Good example | Main risk |
| --- | --- | --- | --- |
| Classic workflow | Fixed rules: if X happens, do Y. No AI. | Create a CRM record when a form is submitted | Breaks as soon as the input falls outside the plan |
| Workflow with an AI step | The path stays fixed, but one step reads, classifies or drafts | Classify an incoming request and prepare a draft reply | An AI step that gets it wrong without anyone noticing |
| AI agent | The model picks its own steps and tools to reach a goal | Process a case by fetching documents across several tools | Unexpected actions that are hard to audit |

Our rule: use the simplest level that solves the problem. If rules are enough, you do not need AI. If one reading or drafting step unblocks everything, you do not need an agent. An agent makes sense when the path really changes from one case to the next.

Many failed projects start the other way round: someone wants "an agent", then looks for a place to put it.

## The grid for picking your first process

For a first project, you want a process that ticks as many boxes as possible. Score each candidate from 0 to 2 on these five criteria.

| Criterion | What to look at | 2 points if… |
| --- | --- | --- |
| Volume | How many times a day or a week | Dozens or hundreds of cases a day |
| Accessible data | Can a machine read the information | It lives in a tool with an API or a clean export |
| Cost of a mistake | What happens if the AI is wrong | The error can be caught before it reaches a customer |
| A human who validates | Does someone already review this work today | Yes, and they can approve in a few seconds |
| Measurement | Can you count the result before and after | Time, volume or error rate are already tracked |

A process scoring 8 or more is a good first candidate. Below 5, you usually need to fix something else first: scattered data, a process everyone runs their own way, or a mistake too costly for a first try.

The most underrated criterion is the fourth one. A human who validates is what lets you reach production fast without taking pointless risks. The AI prepares, the person decides. Later, when the numbers show it, you widen what the AI does on its own.

## Processes that work well first

These are the families that most often land at the top of the grid, with cases we know from the inside.

**Customer support replies.** High volume, a rich ticket history, and a human agent who already reviews every reply. At [LocService](https://www.thevibecompany.co/en/case-studies/locservice), a peer-to-peer rental platform handling several hundred support tickets a day, we built an assistant that reads past tickets and internal documentation to draft the reply to every new ticket. It is wired into their internal APIs to get the real customer context. Result: the AI drafts are used on 87% of tickets. The method is detailed in our article on [AI agents for customer support](https://www.thevibecompany.co/en/resources/articles/ai-customer-support-agent).

**Classifying documents and line items.** Invoices, statements, attachments, incoming requests. Our own bookkeeping is a good example: every month, the bank export goes into Claude Code with an instruction file, and a categorised spreadsheet comes out in a few minutes. The rule that makes it reliable fits in one line: when the AI does not recognise a line, it files it under "Other" instead of guessing, and a human decides. We wrote it up in [this piece on our Qonto bookkeeping](https://www.thevibecompany.co/fr/resources/articles/focus-skill-compta-qonto) (in French).

**Checking documents for compliance.** Making sure a product sheet, a contract or a file contains what it should. For [Coup de Pates](https://www.thevibecompany.co/en/case-studies/coup-de-pates), we built a library of AI skills that checks their product documents. The AI flags the gaps, the quality team keeps the decision.

**Monitoring and sorting information.** Reading sources, spotting what matters, routing it to the right place. Internally, our [automatic AI news monitor](https://www.thevibecompany.co/fr/resources/articles/veille-ia-automatique) (in French) drops every announcement into one of four buckets: an immediate Slack alert, an item in the team newsletter, a short note, or nothing. The real work is not collecting, it is sorting.

### What is better left for later

- **Irreversible decisions**: a payment, a cancellation, a rejected application. Start by having the AI prepare the decision, not make it.
- **Processes nobody can describe.** If two people on the team do the task two different ways, the AI will not settle it for you. Write the rule first.
- **Data that lives in emails and people's heads.** Without a reliable source, the AI makes things up or stops. In that case, the first project is data access.

## Redesign the process, do not just add a tool

The most useful number in the McKinsey survey is not the adoption rate. It is this one: nearly three quarters of AI high performers say they have fundamentally redesigned workflows because of AI, compared with a quarter of everyone else.

In practice, bolting a model onto an existing process rarely delivers the expected gain. Ask three questions before writing a line of code:

1. Which step really disappears, and which one changes nature (writing becomes reviewing, searching becomes checking)?
2. Who validates, when, and with what information in front of them?
3. What does the system do when it does not know? The answer must be written down, like the "Other" in our bookkeeping.

## Measure before you automate

If you do not measure the starting point, you cannot prove the gain. And without a proven gain, the second project will not get funded. Before you start, record at least:

| Metric | Why | Example |
| --- | --- | --- |
| Time per case | The most visible gain | Minutes spent per ticket or per file |
| Usage rate | Is the AI actually useful | Share of drafts sent as is or lightly edited (87% at LocService) |
| Correction rate | Real quality | Share of outputs heavily edited or rejected by the human |
| End-to-end lead time | What the customer sees | Time between the request and the answer |
| Running cost | What one case costs | Model calls, infrastructure, review time |

That last one matters more and more. In the same McKinsey survey, about one respondent in five says AI operating costs, including tokens, have constrained their use. A case that costs more in review time than it saves is not automation, it is moving work around.

## How we approach it at The Vibe Company

[The Vibe Company](https://www.thevibecompany.co/en) is an AI agency founded in Paris in 2024 by Stan Girard and Antoine Dewez (ex-Theodo, ex-Stockly), backed by Y Combinator (W24), with $1.7M raised. We have shipped dozens of projects, from LocService's support assistant to the products we delivered for [Monka](https://www.thevibecompany.co/en/case-studies/monka) in a health-data environment.

How we run an automation project:

- **We start from a single process**, picked with you using a grid like the one above, not from a catalogue of use cases.
- **We connect the AI to your real systems** (APIs, databases, business tools) rather than a frozen export, because that is where quality is decided.
- **We keep a human in the loop at first**, and widen autonomy when the numbers justify it.
- **We measure before and after**, so the decision to scale rests on facts.

For the next steps, two useful reads: our [checklist for taking an AI agent from POC to production](https://www.thevibecompany.co/en/resources/articles/ai-agent-poc-to-production), and our overview of [how to fund an AI project in France (CIR, CII, Diag Data IA, France 2030)](https://www.thevibecompany.co/en/resources/articles/fund-ai-project-france-cir-cii). If you are still choosing a partner, here is [how to choose an AI agency](https://www.thevibecompany.co/en/resources/articles/how-to-choose-an-ai-agency).

## FAQ

**Do you need an AI agent to automate a process?**
Often not. Many gains come from a classic workflow with one well-placed AI step (reading, classifying, drafting). An agent makes sense when the steps really change from one case to the next.

**Which process should you automate first?**
The one that combines volume, accessible data, recoverable mistakes, a human who already validates, and a measurable result. Customer support, document classification and compliance checks often come out on top.

**How long until a first result?**
It mostly depends on data access and how many tools need to be connected. The right instinct: aim for a first deliverable the team actually uses, on a single process, rather than a global plan.

**How do you stop the AI from making mistakes in production?**
Write down what it does when it does not know (a "to check" category, a handoff to a human), keep human validation at the start, and track the correction rate week after week.

**Will AI automation replace jobs?**
In the cases we see, it mostly changes the nature of the work: writing becomes reviewing, searching becomes checking. The time freed up goes to the complex cases, which are also where people make the difference.

## Let's talk about your first process

You have two or three processes in mind and do not know which one to tackle? Bring the volume, the tools in place and what is stuck today. We will run the grid together and tell you honestly which one will deliver a measurable result, and which one is better left for later.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
