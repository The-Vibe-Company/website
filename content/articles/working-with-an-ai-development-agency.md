---
title: "Working with an AI agency: project steps and clauses"
seoTitle: "Working with an AI agency: stages and contract clauses"
slug: working-with-an-ai-development-agency
translationKey: working-with-ai-agency-project-steps
language: en
summary: "Working with an AI agency: what to prepare, the five stages to production, five contract clauses (French IP Code, GDPR, AI Act), and the warning signs of drift."
publishedAt: 2026-10-23
dateModified: 2026-11-11
complexity: beginner
topics: AI Adoption, Strategy, AI Operations
coverImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
coverAlt: "The Vibe Company mascot and three client team members assembling a mechanical assistant together on a workbench, with a city at dusk behind them"
ogImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
---

When working with an AI agency, a project plays out in five stages, from scoping to handover, and in five clauses to write before you sign. These clauses cover code ownership, data, the AI Act role, the stop point, and reversibility, each with its legal text: the French Intellectual Property Code, Article 28 of the GDPR, the standard clauses of Decision 2021/915, and Article 3 of the AI Act. Choosing the partner has its own guide, [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency), and this one starts right after.

## MIT and Gartner on projects with an AI agency

The MIT NANDA report, "The GenAI Divide: State of AI in Business 2025", gives a figure that often gets misquoted. In its sample, external partnerships with learning-capable, customized tools reached deployment about 67% of the time, compared to about 33% for internally built tools, so twice as often, according to the [primary report](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf). These figures are self-reported. The report also states that they may not account for all confounding variables. They come from more than 300 public initiatives, 52 organizations, and 153 executives surveyed at four conferences. They describe that sample, not France.

[Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) predicts, without measuring it, that over 40% of agentic AI projects will be canceled by the end of 2027, due to escalating costs, unclear business value, or inadequate risk controls.

## First call with an AI agency: four answers to prepare

A thirty-page specification isn't needed, because four short answers are enough.

1. **The problem, in one sentence.** It names the process and the people involved.
2. **The volume and today's baseline.** How many tickets, documents, or files per day, and how long each one takes today. Without that starting point, nobody will be able to say later whether the project worked.
3. **The data and the tools.** Where the useful information lives, who has access, and the constraints: personal data, health data, trade secrets.
4. **The person who decides.** That person settles business questions, fast.

With these four answers, a good agency can tell you on the first call whether the topic suits AI, or whether an off-the-shelf tool is enough.

## The five stages of a project with an AI agency

![The 5 stages of a project with an AI agency and the 4 moments when each clause serves. Detailed below.](/images/resources/working-with-an-ai-development-agency/5-stages-4-contract-moments-ai-agency.png){.diagram}

A project that goes all the way to production goes through five stages, each with its own output.

### 1. Scoping: one problem, one metric, one scope

Scoping turns the opening sentence into a scope: process, users, data, success metric. It also lists what the project won't do, and it ends with the known risks, such as data access, legal review, or adoption. At the end, one question must have its answer: if the project succeeds, which number will have moved?

### 2. The prototype, on your real data

The prototype tests the most uncertain part, on a real sample of your data. Right after comes the stop point. If the contract provides for it (clause 4 of the kit), either side can then stop without penalty. The decision grid is in [the POC to production checklist](/en/resources/articles/ai-agent-poc-to-production).

### 3. Short iterations, shown to your teams

The agency then ships small versions. Your users test each version, comment on it, and get it fixed.

### 4. Production inside your systems

In production, the tool runs in-house. It comes with access rights, hosting, logging, and a person who monitors it. If the tool touches health data, these constraints get prepared from scoping onward, and [AI and health data (HDS)](/en/resources/articles/ai-health-data-hds-france) covers them.

### 5. Measure, hand over, evolve

Once the tool is live, the metric gets compared to the baseline. Then comes autonomy. The person who will evolve the tool needs the code, the documentation, and training.

## The kit: five clauses to sign with an AI agency

The kit fits in five clauses, each backed by a text you can cite to the agency.

| Clause | What it covers | Text | What to ask for |
| --- | --- | --- | --- |
| Ownership of code and prompts | The written assignment of rights to the code, prompts, test sets, and documentation | [CPI L111-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278868), [L113-9](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278890), [L131-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278958) | Each right assigned, its extent, its purpose, the place, and the duration |
| Data and subprocessors | The processing contract and written authorization of any other processor, including the model provider | [GDPR Art. 28](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679), [Decision 2021/915](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021D0915) | The name of the model provider or providers, their processing region, audits |
| AI Act role | Who is the provider, who is the deployer, who prepares the documentation | [AI Act Art. 3](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | A written split of the documentation work |
| Stop point | A moment, after the prototype, where either side can stop without penalty | The contract alone | The date of the stop point |
| Reversibility | Accounts and keys in the client's name, dated transfer, deletion or return of data | GDPR Art. 28(3)(g) | The transfer date for the code, accounts, and documentation |

### Code ownership: L111-1, L113-9, and L131-3 of the CPI

Article L111-1 of the French Intellectual Property Code (CPI) sets the starting rule, translated from the French: "The author of a work of the mind enjoys over that work, by the mere fact of its creation, an exclusive incorporeal property right enforceable against all." Article L113-9 gives the employer the economic rights to software and its documentation "created by one or more employees in the course of their duties", translated from the French. Article L131-3 sets the form of an assignment, which requires, translated from the French, "that each of the rights assigned be the subject of a separate mention in the deed of assignment", with a scope bounded in extent, purpose, place, and duration.

An agency isn't your employee: L113-9 doesn't apply. Without a written assignment clause, don't assume you own the code (to be checked by a lawyer). The clause follows the form set by Article L131-3: each right assigned, its extent, its purpose, the place, and the duration, for the code, prompts, test sets, and documentation.

### Data: GDPR Article 28 and the model provider

When the agency processes personal data on your behalf, GDPR Article 28(3) requires a contract that sets out the subject matter, duration, nature, and purpose of the processing, the type of data, and the categories of people. Article 28(2) adds: "The processor shall not engage another processor without prior specific or general written authorisation of the controller."

If the agency sends your personal data to an LLM's API, that model provider is therefore another processor that needs written authorization (to be checked by a lawyer). Have the contract name the model provider or providers and their processing region. The contract also provides for audits, including inspections, under Article 28(3)(h). At the end of the service, Article 28(3)(g) requires deletion or return of the data, at the controller's choice, and destruction of the copies, unless Union or Member State law requires their storage.

To write all this without starting from scratch, Commission Implementing Decision (EU) 2021/915 provides official standard contractual clauses. They "fulfil the requirements for contracts between controllers and processors" set out in Article 28.

### The AI Act role: provider or deployer

Article 3(3) of the AI Act defines the provider as a body "that has an AI system or a general-purpose AI model developed" and places it on the market or puts it into service "under its own name or trademark". Putting into service covers supplying a system for its own use in the Union, and the deployer is the body that uses an AI system under its own authority.

A company that has an AI tool developed and puts it into service under its name, for its own use, can therefore be a provider, and not only a deployer (to be checked by a lawyer). The contract assigns documentation.

### The stop point and reversibility

The stop point is a contract clause: once written, it lets either side stop without penalty after the prototype if the result isn't there. Reversibility puts the accounts with model and hosting providers, and the keys, in the client's name, with a transfer date for the code and documentation. It also carries over GDPR Article 28(3)(g) for personal data.

### The block to copy

This block lists what each clause must cover. Your lawyer drafts the contract.

```markdown
**Clauses to cover with the AI agency**

- Ownership: written assignment of each right (extent, purpose, place, duration) to the code, prompts, test sets, and documentation (CPI L131-3).
- Data: processing contract (GDPR Art. 28(3)), written authorization of other processors, including the model provider or providers and their processing region (Art. 28(2)), audits (Art. 28(3)(h)). Template: standard clauses of Decision 2021/915.
- AI Act role: who is the provider, who is the deployer, who prepares the documentation (Art. 3).
- Stop point: a date after the prototype, with either side able to stop without penalty.
- Reversibility: accounts and keys in the client's name, transfer date for the code, accounts, and documentation, deletion or return of data (Art. 28(3)(g)).
```

## Skills and handover: training is part of the deliverable

Team training and handover documentation are part of an AI agency's deliverable, and the AI Act gives a reason to write that down. According to the [European Commission](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers), Article 4 on AI literacy has applied since February 2, 2025, and supervision and enforcement follow from August 2, 2026. Since the Digital Omnibus on AI, Regulation (EU) 2026/1744 in force since mid-July 2026, AI literacy remains an obligation for providers and deployers, with no "sufficient" level mandated. The Commission states that, in general, people working for a service provider or contractor need the AI skills appropriate to the task, same as employees. Measuring that level isn't mandatory.

The contract can ask the agency for training for your teams and handover documentation, dated in the last stage.

## AI agency and client: who does what

The client brings the problem, the data, and the decisions, and the agency brings the method, the code, and production.

| Topic | Client side | Agency side |
| --- | --- | --- |
| Problem and metric | The problem and the baseline number | A testable scope |
| Data and access | Opens access, approves usage | Asks for the minimum, documents |
| Business decisions | One person who decides fast | The options and their consequences |
| Testing | The real users | Testable versions, on a regular basis |
| Security and compliance | The constraints (GDPR, health, internal) | A tool designed to meet them |
| After production | The person who takes over the tool | Documentation, transfer, training |

## Warning signs of drift in a project with an AI agency

- Nobody on the client side settles a business question in under a week.
- The agency shows the prototype only on examples it picked.
- Production, hosting, and access rights are missing from the plan.
- Nobody took a baseline measurement, and nobody will be able to say whether the tool works.
- The code, accounts, or documentation stay with the agency, with no transfer date.

One sign alone dooms nothing. Two or three at once justify a frank check-in with the agency.

Further reading: [funding options for an AI project](/en/resources/articles/fund-ai-project-france-cir-cii).

## FAQ

**How does a project with an AI development agency work?**
In five stages: scoping that fixes the problem, the metric, and the scope, a prototype on your real data, short iterations tested by your teams, production inside your systems, then measurement and handover. If the contract provides for a stop point after the prototype, either side can then stop without penalty.

**What should I prepare before contacting an AI agency?**
Four short answers: the problem in one sentence, the volume and today's baseline, the data and tools involved with their constraints, and the person who will settle business questions. They let the agency judge, on the first call, whether AI fits or an existing tool will do.

**Do I need a detailed specification?**
No. One page describing the problem, the data, and the number you want to move is enough to start. The detailed scope then takes shape during scoping, which also lists what the project won't do and the known risks, such as data access or legal review.

**Who owns the code at the end of the project?**
Article L111-1 of the French CPI gives the rights to the author, and Article L113-9 gives them to the employer only for its employees. Without a written assignment clause, don't assume you own an agency's code (to be checked by a lawyer). Have the contract list the rights assigned to the code, prompts, tests, and documentation.

**Does the AI model provider need to appear in the contract?**
Yes, if it receives personal data. GDPR Article 28(2) bars the processor from engaging another processor without prior written authorization. The model provider the agency calls is therefore one of them, which needs written authorization (to be checked by a lawyer). Have it named, region included.

## An AI project to scope

You have a project to scope, or an AI project that is stalling. Bring the problem, the volume, and what's blocking.

[Book a call](https://cal.com/stangirard/thevibecompany)
