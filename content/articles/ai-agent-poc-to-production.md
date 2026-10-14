---
title: "From AI agent POC to production: the checklist that holds up"
slug: ai-agent-poc-to-production
translationKey: ai-agent-poc-to-production
language: en
summary: "An AI agent POC that shines in a demo often dies in production. Here is a concrete checklist to move from pilot to an agent your teams actually use — with Monka and LocService as proof."
publishedAt: 2026-10-14
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/poc-agent-ia-production/cover-mascotte.webp
coverAlt: "A checklist connects an AI agent POC to a controlled production rollout"
ogImage: /images/resources/poc-agent-ia-production/cover-mascotte.webp
---

At [The Vibe Company](https://www.thevibecompany.co/en), an AI-native agency backed by Y Combinator (W24), we see the same pattern again and again. An AI agent that looks great in a demo. Then stalls the moment it meets real tickets, real data, and real teams.

The model is rarely the problem. Getting from POC to production is. In August 2025, [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) covered a MIT report (NANDA project): 95% of the generative AI pilots studied showed no measurable P&L impact. The methodology is debated. The pattern is familiar to anyone who has watched a pilot die in a drawer.

Here is a concrete checklist for deploying an AI agent without kidding yourself. It is grounded in what we actually ship: [Monka](https://www.thevibecompany.co/en/case-studies/monka) in healthcare, and [LocService](https://www.thevibecompany.co/fr/case-studies/locservice) in customer support.

## What a POC actually proves (and what it does not)

A useful POC answers one question: *on this task type, with these sample inputs, does the model produce something usable?*

It does not prove the rest.

- That the agent will handle rare, ambiguous, or conflicting cases.
- That your teams will use it every day.
- That cost per task will stay acceptable at scale.
- That human escalation will work when the agent is wrong.
- That you can take the system over without the team that built it.

Many generic checklists stop at “pick a model” and “secure the data.” For an agent, that is not enough. An agent calls tools, reads context, and proposes actions. In production, every tool is a door. You need to know which doors are open, who watches them, and who takes back control.

## Checklist before you call it production

Before you label an agent “in prod,” clear every row. If a cell is empty, you still have an extended POC — not production.

<table>
<thead>
<tr>
<th>Criterion</th>
<th>Decision to make</th>
<th>Ready when</th>
</tr>
</thead>
<tbody>
<tr>
<td>Bounded use case</td>
<td>Which exact task does the agent do — and which does it refuse?</td>
<td>Scope written down; out-of-scope cases listed</td>
</tr>
<tr>
<td>Real data</td>
<td>Has the agent been tested on real tickets / files / messages (anonymized if needed)?</td>
<td>Eval set drawn from production, not only from the demo</td>
</tr>
<tr>
<td>Measurable success</td>
<td>Which metric decides Go / No-Go?</td>
<td>Usage rate, time saved, or quality signed off by a business owner</td>
</tr>
<tr>
<td>Business owner</td>
<td>Who decides whether an answer is acceptable?</td>
<td>A named person, not a committee</td>
</tr>
<tr>
<td>Human escalation plan</td>
<td>What happens when the agent is unsure or wrong?</td>
<td>Queue, thresholds, on-call owner</td>
</tr>
<tr>
<td>Observability</td>
<td>Can you replay a tool call, a prompt, and a decision?</td>
<td>Traces, logs, and failure examples you can inspect</td>
</tr>
<tr>
<td>Progressive permissions</td>
<td>Can the agent write, send, or change anything without approval?</td>
<td>Read first; write under control; send only after human validation</td>
</tr>
<tr>
<td>Cost per task</td>
<td>What does a successful run cost at the expected volume?</td>
<td>Known budget; alerts if it drifts</td>
</tr>
<tr>
<td>Internal handover</td>
<td>Can your team evolve the system without us?</td>
<td>Docs, access, runbook, and training delivered</td>
</tr>
</tbody>
</table>

Three principles show up on every serious project.

1. **Evaluate on real cases**, not on cherry-picked demo examples.
2. **Observe tool calls** — what the agent reads, calls, and proposes must be auditable.
3. **Keep a human in the loop** as long as the risk warrants it — and often long after go-live.

## How we do it at The Vibe Company

The Vibe Company was founded in 2024 in Paris by Stan Girard and Antoine Dewez (ex-Theodo, ex-Stockly). We went through Y Combinator (W24), raised $1.7M, and are backed by France 2030 via MediaGen. We have delivered dozens of projects. Here are two concrete ways to move from POC to an agent that holds up.

### Monka: shipping fast inside an already strict frame

[Monka](https://www.thevibecompany.co/en/case-studies/monka) supports caregivers, with coordinating nurses and partner insurers. Their environment was already HDS-certified. The challenge was not to obtain a certification. It was to build fast *inside* that frame, without stepping outside it.

In two months, we put into production the caregiver app, Lifeline (the nurses’ CRM), and the clinical engine that turns each assessment into an action plan. The assessment has 165 questions. The clinical framework has gone through 12 versions. Since then, we ship a new app version roughly every two days — about 90 versions in six months. Health data is encrypted and handled under GDPR.

What that says about production readiness:

- “Go” is not a big bang — it is a first usable version, then short iterations;
- the domain (clinical framework) evolves with the product, versioned, without breaking the app;
- the regulatory constraint (HDS, health data) is the playing field, not a surprise after the demo.

### LocService: useful because a human still validates

[LocService](https://www.thevibecompany.co/fr/case-studies/locservice) is a peer-to-peer rental platform. Several hundred support tickets a day. We built an assistant that reads past tickets and internal docs, then drafts a reply tailored to the customer’s profile and history.

AI drafts are used on **87%** of tickets. A human still decides what goes out. That is the production pattern we recommend for a first business agent: AI accelerates, the team decides.

What that proves better than a demo:

- a bounded use case (draft ticket replies — not “automate support”);
- real data (internal APIs, customer history);
- a measurable usage metric (87% of drafts used);
- natural escalation (human validation before send).

## FAQ

**How long does it take to go from POC to production?**
It depends on scope and constraints (data, security, integrations). At Monka, the first useful production release took two months inside an existing HDS environment. At LocService, success shows up in daily draft usage, not in the date of the first demo. What matters: agree on a success metric before you start.

**Do you always need a human in the loop?**
For a first business deployment, almost always yes. Start in read-only or draft-under-validation mode. Widen permissions when metrics and the business owner say so. Not before.

**Is a good lab accuracy score enough?**
No. A lab number with no real usage says almost nothing. “87% of drafts used” beats “90% accuracy on a hand-picked set.” Measure what your teams actually accept.

**Who maintains the agent after go-live?**
Decide before you ship. Either your team takes over (docs, runbook, training), or a maintenance engagement is planned. An agent with no business owner and no observability is just a POC on a longer leash.

## Move from POC to an agent that holds up

You have a pilot that works in a demo. You want to know whether it is ready for production — or how to build it so that it will be. Bring your use case, your constraints, and what “success” means for you.

[Book 30 minutes with Stan](https://cal.com/stangirard/30min).
