---
title: "Working with an AI development agency: project stages"
slug: working-with-an-ai-development-agency
translationKey: working-with-ai-agency-project-steps
language: en
summary: "Working with an AI development agency: what to prepare, the five stages to production, who does what, and the warning signs that a project is drifting."
publishedAt: 2026-10-23
complexity: beginner
topics: AI Adoption, Strategy, AI Operations
coverImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
coverAlt: "The Vibe Company mascot and three client team members assembling a mechanical assistant together on a workbench, with a city at dusk behind them"
ogImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
---

Working with an AI development agency means handing an outside team the job of building an AI tool (an agent, an assistant, an automation) that has to run on your data and inside your systems. It works when both sides know what they bring: you bring the problem, the data and the decisions; the agency brings the method, the code and the path to production.

Picking the right partner is covered in another guide: [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency). This one starts the moment after. You have an agency in mind, or you're about to sign. What do the next weeks look like?

## Why bring in a partner, and why projects still fail

MIT NANDA's August 2025 report on generative AI in business is best known for its headline that 95% of pilots showed no measurable impact. It has a second, less quoted finding. As reported by [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/), buying tools from specialized vendors and building through partnerships succeeds about 67% of the time, while internal builds succeed only one third as often. The study's methodology has been debated, so treat these numbers as an order of magnitude.

A partner guarantees nothing on its own. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) predicts that over 40% of agentic AI projects will be canceled by the end of 2027, because of escalating costs, unclear business value or inadequate risk controls. Almost all three are settled by how the project is run, not by which model you pick.

## Before the first call: four things to prepare

You don't need a thirty-page spec. You need four short answers.

1. **The problem, in one sentence.** "Our agents spend too long writing replies to repetitive tickets" beats "we want AI in support".
2. **The volume and today's baseline.** How many tickets, documents or files per day, and how long each one takes today. Without a starting point, nobody can tell later whether the project worked.
3. **The data and the tools.** Where the useful information lives (CRM, ticketing, shared drive, business database), who can access it, and any special constraints: personal data, health data, trade secrets.
4. **The person who decides.** AI projects rarely stall on technology. They stall when nobody can settle a business question within a week.

With those four answers, a good agency can tell you on the first call whether the problem suits AI at all, and whether an off-the-shelf tool would already do the job.

## The five stages of a project that reaches production

### 1. Scoping: one problem, one metric, one perimeter

Scoping turns your opening sentence into a precise perimeter: which process, which users, which data, which success metric. It also decides what you won't build. Good scoping fits on one page and ends with a list of known risks (data access, legal sign-off, team adoption).

By the end you should be able to answer one question: if this works, which number will have moved?

### 2. A first prototype, on your real data

The prototype tests the most uncertain part, on a real sample. Not on made-up data: an assistant that works on three clean examples often fails on the hundredth badly written ticket. If the prototype doesn't hold up, that's the best moment to stop, before spending the budget for what comes next. We go deeper in [our checklist for taking an AI agent from POC to production](/en/resources/articles/ai-agent-poc-to-production).

### 3. Short iterations, shown to your teams

Then the agency ships small versions and your users test them. This is where the product takes shape. At [Monka](/en/case-studies/monka), which supports family caregivers through coordination nurses, the clinical framework is on its 12th version, and the engine was designed to evolve without breaking the app. Cadence matters less than regularity: every version gets shown, discussed and fixed.

### 4. Going to production: the part quotes tend to forget

An AI tool in production is plugged into your systems, with access rights, hosting, logging and someone watching it. At [LocService](/en/case-studies/locservice), the support assistant connects to internal APIs to pull each customer's real context, and classification rules make sure the same question gets the right answer for each type of customer. The published result: across several hundred tickets a day, the AI drafts are used on 87% of them. The support team still owns every reply that goes out.

When the data is sensitive, production starts at scoping. At Monka, the health data hosting environment was already in place: within two months, the caregiver app, the nurses' CRM and the API connecting them went to production without leaving it. We cover those constraints in our guide to [AI and health data hosting (HDS) in France](/en/resources/articles/ai-health-data-hds-france).

### 5. After launch: measure, hand over, keep improving

Once the tool is live, you compare against the baseline. Then comes autonomy: who will evolve the tool six months from now? A good agency documents, hands over the code and trains your teams. That's how we work with [Theodo](/en/case-studies/theodo), where coaching and training their teams is part of the job, so they adopt AI-assisted development practices and move faster.

## Who does what: client and agency

| Topic | Client side | Agency side |
| --- | --- | --- |
| Problem and success metric | Brings the problem and the baseline | Turns it into a testable scope |
| Data and access | Opens access, approves what can be used | Asks for the minimum, documents usage |
| Business decisions | Decides fast, one named person | Prepares options and their consequences |
| Testing | Has real users test each version | Ships testable versions regularly |
| Security and compliance | States the constraints (GDPR, health, internal) | Designs the tool to meet them from day one |
| After launch | Names who takes over the tool | Documents, hands over and trains |

## Contract, data and ownership: settle these before you start

- **Personal data.** If the agency processes personal data on your behalf, GDPR requires a contract governing that processing: subject matter, duration, purpose, security measures, and what happens to the data at the end ([GDPR Article 28](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)).
- **Ownership of code and prompts.** Spell out who owns the code, prompts, test sets and documentation when the project ends.
- **Accounts and keys.** Model provider and hosting accounts should ideally be in your name. Otherwise the handover becomes a project of its own.
- **An exit point.** Plan a moment, after the prototype, where either side can stop without penalty if the results aren't there.

## Warning signs that a project is drifting

- Nobody on the client side can settle a business question within a week.
- The prototype has only been shown on examples the agency picked.
- Production, hosting and access rights appear nowhere in the plan.
- No baseline was measured, so nobody will be able to say whether it works.
- Code, accounts or documentation stay with the agency with no transfer date.

One of these signs doesn't doom a project. Two or three at once means it's time for a frank conversation with your agency.

## Who wrote this guide

[The Vibe Company](/en) is an [AI-native agency](/en/resources/articles/ai-native-agency) founded in Paris in 2024 by Stan Girard and Antoine Dewez. Before the agency, they built Quivr, an open-source AI project that went through Y Combinator (W24). We take AI projects all the way to production for companies such as Monka, LocService, Coup de Pates and AFP, with whom we're building generative AI tools for newsrooms in the France 2030 MediaGen project. If you're looking at funding, our guide to [French AI funding schemes (CIR, CII, France 2030)](/en/resources/articles/fund-ai-project-france-cir-cii) covers the options.

## FAQ

**How does a project with an AI development agency work?**
In five stages: scoping that fixes the problem and the success metric, a prototype on your real data, short iterations tested by your teams, production inside your systems, then measurement and handover.

**What should I prepare before contacting an AI agency?**
The problem in one sentence, the volume and today's baseline, the data and tools involved, and the person who will make business decisions.

**Do I need a detailed specification?**
No. One page describing the problem, the data and the number you want to move is enough to start. The detailed scope gets built during scoping.

**Who owns the code at the end of the project?**
That belongs in the contract. Ask for the code, prompts, tests and documentation to come back to you, and for provider accounts to be in your name.

**How do I know the project is on track?**
You regularly see a new testable version, your users comment on it, and production has been in the plan since scoping.

## Let's talk about your project

Have a problem in mind, or an AI project stuck with another vendor? Bring the problem, the volume and what's blocking. We'll tell you honestly how we'd run it, and whether an existing tool would do.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
