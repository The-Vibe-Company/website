---
title: "What an AI agency does: 3 steps of an engagement"
seoTitle: "AI agency: 3 steps from audit to production"
slug: what-an-ai-agency-does
translationKey: what-an-ai-agency-does
language: en
summary: "AI agency: audit, prototype, production. Roles, deliverables (code, prompts, evals), and the Monka case on when to slow down."
publishedAt: 2026-11-06
dateModified: 2026-11-10
complexity: beginner
topics: AI Adoption, Strategy, AI Agents
coverImage: /images/resources/agence-intelligence-artificielle/cover-mascotte.webp
coverAlt: "The Vibe Company mascot unfolding an AI engagement plan: audit, prototype, then production"
ogImage: /images/resources/agence-intelligence-artificielle/cover-mascotte.webp
---

In France, 15% of companies with 10 to 49 employees used at least one AI technology in 2025, per [Insee](https://www.insee.fr/fr/statistiques/9025878), France's national statistics office, versus 31% at 50 to 249 employees and 58% above. Of non-users, 54% cite a lack of expertise (scope: companies with 10 or more employees). That gap is what an agency fills.

An artificial intelligence agency (or AI agency) designs, builds, and puts AI tools into production for a company. It identifies use cases, prototypes, integrates the tool into the existing system, then measures its quality over time.

At [Monka](/en/case-studies/monka), the caregiver app went into production on May 10, two months after kickoff. Even so, The Vibe Company had to slow down, because it was moving too fast for them. That is the whole job of an AI agency: knowing how to ship fast, and knowing when to brake.

:::summary{title="In short"}
- Three steps, in order: audit and scoping, prototype, production.
- Get it in writing: the code, the prompts, the evaluation sets, the documentation, and the access.
- The prototype is there to test the idea with the business.
- The bottleneck often sits with the client, on the business owner's side.
:::

## What is an AI agency: it designs, builds, and deploys for other companies

An **artificial intelligence agency** (or AI agency) is a team that takes a business need and turns it into a usable AI system: an agent, RAG over documents, automation wired into your tools, a full product. It works for other companies.

| | What it does |
|---|---|
| AI agency | Designs, builds, and deploys for other companies |
| IT services firm | Mostly staff on time and materials to reinforce your teams |
| Consulting firm | Strategy, governance, multi-country, rarely production code |
| Freelancer | Strong on one precise task, limited when you need front end, back end, infra, and security together |
| "AI automation agency" (Make/Zapier) | No-code scenarios. Useful for simple flows. Not the same job as an agency that integrates LLMs, agents, and your IT systems |

In 2026, enterprise AI relies mostly on existing models: per [Menlo Ventures](https://menlovc.com/perspective/2026-the-state-of-enterprise-ai/), only 10% of teams building AI products in American companies post-train their own models. So an AI agency usually integrates off-the-shelf LLMs (API, open source) rather than training its own. It wires them (RAG, agents, tools) into your data and processes.

For Paris and the local angle, see also [AI agency in Paris](/en/ai-agency-paris).

An AI agency engagement runs in three steps. Knowing when to slow down matters too.

![AI agency engagement in 3 steps: audit and scoping, prototype, production, and when to slow down. Detailed below.](/images/resources/what-an-ai-agency-does/ai-agency-mission-3-steps.png){.diagram}

1. Audit and scoping: prioritized use cases, success criteria.
2. Prototype: tested with the business, on your real data. If the business is not ready, slow down (Monka case).
3. Production: systems integration, evaluation, monitoring. Without that, you have a demo, not a tool.

## Audit and scoping: step 1 clarifies the problem before the code

First, clarify the problem. In the 65 interviews [RAND](https://www.rand.org/pubs/research_reports/RRA2680-1.html) conducted with experienced AI engineers, the most common cause of failure is a problem that is misunderstood or miscommunicated between the business and the technical team. So scoping asks these typical questions:

1. Which business process, concretely (beyond a vague "add AI")?
2. Which data exists, where, and with which access rights?
3. Who decides whether the output is good (business, support, legal)?
4. Should the AI read, propose, prepare, or execute?
5. Which measurable success criterion after the first batch?

Scoping usually delivers prioritized use cases, an in-scope and out-of-scope list, an architecture sketch, an estimate, and success criteria. Public playbooks often follow the same logic (audit, prioritization, prototype, build), for example [the one summarized by Jayd](https://www.jayd.ai/meilleures-agences-ia-france-2026).

Bpifrance, the French public investment bank, subsidizes an 8-day [Diag Data IA](https://www.bpifrance.fr/catalogue-offres/diag-data-ia) with an approved expert. The quote is capped at €10,000 excl. VAT, with a 40% subsidy, leaving €6,000 excl. VAT to pay, for SMEs and mid-market companies with 10 to 2,000 FTEs, at least €1M in revenue, and over a year in business. Spread over the 8 days, that cap comes to 10,000 / 8 = €1,250 excl. VAT per day (a calculation done by TVC, not published by Bpifrance). It's a useful benchmark for pricing a scoping phase.

If scoping produces nothing testable, you're paying for procrastination.

## Prototype: step 2 tests the idea with the business, on your data

Show the business a clickable path or an agent limited to a real scope. It runs on real data (or a representative sample), with real users and a success criterion written upfront.

What gets validated:

- does the business understand and use the flow?
- does model quality, measured on a public benchmark, also hold on your cases?
- what must stay human (approval, sending, irreversible decisions)?

Load, full IT systems integration, and long-term monitoring wait for the next step. When it helps, **prototype before coding everything**, so a bad process doesn't get set in stone.

Failure figures in circulation don't measure the same thing. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025) predicted in 2024 that at least 30% of generative AI projects would be abandoned after POC by the end of 2025. In January 2026, [it found](https://www.gartner.com/en/articles/genai-project-failure) "at least 50%". [RAND](https://www.rand.org/pubs/research_reports/RRA2680-1.html), often cited for "80%", only repeats an estimate. Its own material is the 65 interviews cited above.

:::callout{title="What TVC learned at Monka"}
At [Monka](/en/case-studies/monka) (caregiver support), work started on March 9. The caregiver app went into production on May 10, with the nurses' CRM alongside it. One lesson: **TVC was moving too fast for them**. TVC had to slow down to give their team time to work through the business side. A prototype helped test the idea before everything was locked in.

Adoption follows its own pace. A good partner knows how to speed up commits, and also knows when to brake if the business isn't ready.
:::

## Production: step 3 plugs the tool into your IT systems

In production, the tool connects to your CRM, your ticketing, SSO, and your internal APIs, with real permissions. On the data side, hosting, logs, test environments, and model subprocessors need to be settled. The tool runs against a versioned test set, with thresholds and someone who signs off on acceptance. Monitoring tracks quality drift and model-call costs, with alerts.

Then come the AI's rights. For each action, choose between read, propose, prepare, and execute. The irreversible stays with a human.

On the legal side, the AI literacy obligation (article 4 of the AI Act) has applied since February 2, 2025 to any company that deploys an AI tool. Per the [Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers), amended article 4 asks companies to take measures, without setting a level. National authorities have been enforcing it since August 2, 2026. Ask the agency how it plans to train your users. This is not legal advice.

## Typical team: without a business owner, the prototype dies in adoption

On the client side, you need an available **business owner**. Without one, the prototype "works" in the lab and dies in adoption.

On the agency side, a serious engagement usually brings together a **product profile**, an **AI engineer**, and **developers**. The product profile owns scoping, prioritization, and the success criterion. The AI engineer handles RAG, agents, evaluations, and prompts. The developers cover front end, back end, infra, and security. A designer sometimes joins, when the interface matters.

## AI agency for SMEs or large groups: the team and governance change

Insee's scope covers companies with 10 or more employees in mainly market sectors, excluding agriculture, finance, and insurance.

- **SMEs / mid-market**: one clear use case, a small team that delivers end to end, few committees. That's where The Vibe Company helps most.
- **Large group**: often several teams, governance, security, sometimes several countries. Firms like Theodo or Artefact are built for that. The Vibe Company also steps in as **technical reinforcement** or advisor (architecture, RAG, agents, evaluation), without replacing a multi-team program.

Nobody gets bashed here. A bad match wastes both sides' time. Who fits which project is in the [honest AI agency comparison](/en/resources/articles/best-ai-consulting-firms-france). Locally, see [AI agency in Paris](/en/ai-agency-paris).

## Choosing your AI agency: 6 questions

To choose the partner, ask these 6 questions, taken from the guide [AI agency, IT services firm, or freelancer: how to choose](/en/resources/articles/how-to-choose-an-ai-agency).

1. Which projects have you put into production, and how long have they been running?
2. Who, by name, will work on my project?
3. What first usable result, and when?
4. What happens to the data (hosting, models, logs, tests)?
5. Who owns the code, the prompts, the tests, and the documentation?
6. What explicit stop point after the first batch, if the criteria aren't met?

Be wary of rankings where the author is #1. They are only good for discovering names.

Be wary, too, of rebranded "agents". [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) calls it "agent washing": chatbots or automations renamed without real agentic capability. It estimates that about 130 vendors out of thousands offer real agents. Ask to see the agent act inside one of your tools.

## Deliverables to demand: code, prompts, and evals belong to the client

Demand these deliverables in black and white:

1. **The code** (repo, access, ownership);
2. **Versioned prompts and skills**;
3. **Evaluation sets** (anonymized real cases, thresholds);
4. **Documentation** (architecture, runbook, who does what);
5. **Access** (hosting, keys, logs) and **reversibility**.

Whatever the agency, the code, the prompts, and the evaluation sets belong to the client. If you hear "the prompts stay with the agency," look elsewhere. That's lock-in.

## FAQ

### What is an AI agency?

An AI agency is an external team. It turns a business need into a usable AI system, like an agent, RAG over documents, automation wired into your tools, or a full product. It designs, builds, and deploys for other companies, and takes a use case to a tool in production, with integration into the existing system and quality tracking.

### Does an AI agency train models?

Most of the time, no: it integrates existing models (RAG, agents, tools). Training or heavy fine-tuning is the exception, often at the model vendor or a dedicated lab.

### How long does scoping take?

It depends on the need. What matters is having a testable deliverable at the end, whatever the number of weeks.

### How is this different from a no-code automation agency?

An automation agency mostly chains no-code tools (Make, Zapier…). An engineering AI agency builds systems wired into your data and your IT systems (agents, RAG, evaluations). The two can coexist. Risk and ownership differ.

## Talk through your use case

The Vibe Company is an AI agency in Paris. It mostly works with SMEs and mid-market companies that want a tool in production, and as technical reinforcement for large groups. In 30 minutes, you'll find out whether an agency is the right format, even if the answer is no.

[Book 30 minutes →](https://cal.com/stangirard/thevibecompany)
