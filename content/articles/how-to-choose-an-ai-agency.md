---
title: "How to choose an AI agency: 10 questions before you sign"
slug: how-to-choose-an-ai-agency
language: en
translationKey: choose-ai-agency
summary: "AI agency, IT services firm, freelancer or in-house team? Decision criteria, fixed price vs time and materials, what a proposal should contain, and how to judge a POC and references."
publishedAt: 2026-10-13
complexity: beginner
topics: AI Adoption, AI Agents, Strategy
coverImage: /images/resources/choisir-agence-ia-esn-freelance/cover-mascotte.webp
coverAlt: "Four paths lead from one AI project: in-house team, freelancer, IT services firm and AI agency"
ogImage: /images/resources/choisir-agence-ia-esn-freelance/cover-mascotte.webp
---

Anyone can build an AI demo. A tool your teams still use six months later is much rarer.

In August 2025, [Fortune covered an MIT report](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) (*The GenAI Divide*, Project NANDA): 95% of the generative AI pilots studied delivered no measurable P&L return. The methodology has been debated. But the authors' diagnosis holds up: the projects that work are built into a specific business process. Generic tools sitting on the side aren't.

So choosing a partner really means choosing who can get your project there. Here are the criteria, the questions and the documents to ask for. We're an AI agency, so we're not neutral. We'll also tell you when an agency is the wrong choice.

## Three questions before comparing partners

1. **What costs more: failing or waiting?** A nice-to-have internal tool can wait for a hire. A project that touches revenue or customers needs a team that has shipped before.
2. **Is the need defined or still to invent?** "Connect our CRM to a model to summarize calls" can be priced. "Use AI in support" needs scoping first.
3. **Who will own the system in a year?** An AI agent is never "done": models change every few months, and so do your data and processes. If nobody in-house can take it over, plan maintenance or handover in the contract.

## The four options at a glance

| | In-house team | Freelancer | IT services firm | AI agency |
|---|---|---|---|---|
| Time to start | slow (hiring) | fast | medium | fast |
| AI specialization | depends on hires | strong on one topic | varies by profile | core business |
| Full product (front, back, infra) | if the team is complete | rarely alone | yes | yes, if the team is cross-functional |
| Scaling headcount | slow | limited | strong | medium |
| Knowledge of your business | best | to build | to build | to build |
| Usual contract | employment | time and materials (day rate) | time and materials, sometimes fixed price | fixed price or time and materials |
| Main risk | delays, retention | single-person dependency | interchangeable profiles | dependency if nothing is handed over |

In short:

- **In-house team**: the goal if AI is your competitive edge. Trap: hiring before validating a first use case.
- **Freelancer**: unbeatable on a precise task (a connector, an automation, an audit). Struggles when you need interface, backend, infrastructure and security at once, or continuity if that person leaves.
- **IT services firm**: staffs people at scale and passes procurement and security easily. Good to reinforce a team on a known scope.
- **AI agency**: a small team covering the whole path from idea to production. Good to ship fast or validate a use case before bringing it in-house.

You can also mix: an agency that builds and trains while you hire, a freelancer who takes over maintenance of a system an agency delivered.

## Fixed price or time and materials: the choice that changes everything

Time and materials (you pay for days): it's flexible when the need changes, but the overrun risk is yours. Someone in-house has to steer.

Fixed price: one price for a scope and a deliverable. The overrun risk is the partner's, but every scope change gets renegotiated.

For AI, a pure fixed price on a whole product is rarely honest. Nobody knows up front how many iterations it'll take to get quality right. At Monka, the clinical reference went through 12 versions in two months. No specification would have predicted that.

What works in practice:

- **a short fixed-price scoping phase** with a precise deliverable: use case, data, success criteria, architecture, estimate;
- **then short cycles** (fixed price per batch or capped time and materials), each ending with something usable;
- **an explicit stop point** after the first batch: if criteria aren't met, stop or change approach.

Compare total cost, not day rates: the engagement, your team's time to steer and test, running costs (model calls, hosting), maintenance.

## What a good proposal contains

A serious AI proposal fits in a few pages and covers these points. If something is missing, ask for it.

- **The business problem** in your words, and the metric that says it works (time saved, usage rate, errors avoided).
- **The scope**, and above all what is out of scope.
- **The data** needed, where it lives, who grants access, and what happens if quality is poor.
- **The architecture** on one page: which models, hosted where, which third-party tools, estimated recurring costs.
- **Batches**, with a first usable deliverable within weeks.
- **How quality is measured**: test set, real cases, acceptance thresholds.
- **The named team**: who does what, and for how long.
- **Security and compliance**: hosting, access, logs, test environments, subprocessors.
- **Ownership** of code, prompts, test sets and documentation.
- **What comes next**: maintenance, handover, reversibility.

## How to evaluate a POC

A POC is there to help you decide, not to demo. Before starting, write down:

- **the question** it answers ("does the model classify our tickets correctly?");
- **the data**: real data or a representative sample, never three hand-picked examples;
- **the users** who will test it, and for how long;
- **the success criterion**, as a number, set before seeing results;
- **what will be reused** in production and what will be thrown away.

Be wary of a POC that only runs on the partner's laptop, without your data or users. The good sign: a POC that already looks like a first production batch, in your environment.

## Reading references: the signals that matter

A logo on a website proves nothing. What counts:

- **How long the tool has been in production**, and how many people use it.
- **A usage number, not a demo number.** "Drafts used on 87% of tickets" says more than "90% accuracy on a test set".
- **A client contact you can call.** Ask what went wrong and how the partner reacted.
- **A case comparable to yours**: same company size, same constraints (sensitive data, integration with existing systems).
- **Public traces of skill**: open-source code, technical articles, talks. They show how the team works.

## Data, security, hosting: the questions to ask

This is where a lot of projects get stuck, and late. Ask these in the first meeting:

1. Where will the data be hosted, and by whom?
2. Does data sent to models leave that environment? Does the model provider retain it?
3. Where do prompt and response logs go?
4. Do test environments use real data?
5. Who has production access, with what rights?
6. What rights will the AI have: read, propose, prepare or execute?

**Example: healthcare.** In France, health data must be hosted by a provider certified HDS for the relevant activities. At Monka, the HDS environment already existed when we arrived. Our job was to build fast without leaving it. No data outside the environment, logs and test environments inside it. The result: the caregiver app, the nurses' CRM and the clinical engine (a 165-question assessment, 12 versions of the clinical reference) in production in two months. The regulatory detail is in our guide [AI and health data in France: what HDS really means](/en/resources/articles/ai-health-data-hds-france).

If a partner highlights certifications, ask for the certificate, its scope and its date.

## Red flags

- Guaranteed results before seeing your data.
- No production projects, only demos.
- Months of scoping with nothing to test.
- Talk focused on tools rather than your process.
- Certifications or labels you cannot verify.
- No clear answer on code ownership or exit.

## 10 questions to ask before you sign

1. What have you put into production, and how long has it been running?
2. Who, by name, will work on my project?
3. What first usable result, and when?
4. How do you measure AI quality, and who signs off?
5. What happens to our data (hosting, models, logs, tests)?
6. What rights will the AI have in our tools?
7. What recurring costs should we plan for?
8. Who owns the code, prompts, tests and documentation?
9. How do handover and exit work?
10. What happens if the criteria aren't met after the first batch?

## Our position, honestly

We're not the right choice for everything. For a small isolated connector, a freelancer will do just as well. For a hundred contractors, go with an IT services firm. That's what they're built for.

Where we help: an AI product or agent that must reach production fast, in a mid-size or large company, with security requirements. Before the agency, Stan Girard and Antoine Dewez built Quivr, an open-source AI project (over 39,000 GitHub stars) that went through Y Combinator (W24), with a team that grew to 9 people. Since 2024, The Vibe Company has delivered dozens of projects. Three examples:

- **Monka (healthcare)**: in production in two months inside the client's existing HDS environment, 165 questions, 12 versions of the clinical reference. [Read the case](/en/case-studies/monka)
- **LocService (property rental)**: several hundred support tickets a day. An assistant reads past tickets and documentation, then drafts each reply based on the customer's profile. Drafts are used on 87% of tickets; the team decides what gets sent. [Read the case](/en/case-studies/locservice)
- **AFP (news media)**: generative AI tools for newsrooms within MediaGen, a €4M France 2030 project backed by Bpifrance, alongside Kairntech and Dawex, always under journalists' control. [Read the case](/en/case-studies/afp)

## FAQ

### AI agency or IT services firm: what's the difference?

An IT services firm mostly supplies people to reinforce your teams, usually on time and materials. An AI agency takes a project end to end with its own team. The line is blurry: judge on delivered projects, not labels.

### Should we start with a proof of concept?

Yes, if it answers a decision question with real data, real users and a success criterion set in advance.

### Fixed price or time and materials for an AI project?

A short fixed-price scoping phase, then short batches with an explicit stop point. A pure fixed price on a whole product assumes you know the number of iterations in advance, which is rarely true in AI.

### Can we bring it in-house after working with an agency?

Yes, it's a good path. Plan documentation, code ownership and handover sessions in the contract.

## Not sure which option fits your project?

The Vibe Company is an AI agency in Paris, founded in 2024 by Stan Girard and Antoine Dewez, formerly at Theodo and Stockly. In 30 minutes, we'll look at your case and tell you honestly whether an agency is the right fit, even if the answer is no.

[Book 30 minutes to talk it through →](https://cal.com/stangirard/30min)
