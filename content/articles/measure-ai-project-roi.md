---
title: "Measure the ROI of an AI project: 5 metrics and a calculation template"
seoTitle: "AI ROI: measure an AI project with 5 metrics"
seoDescription: "AI ROI made measurable: a 5-metric method to track an AI project before and after launch (usage, quality, full cost, business outcome), with real cases."
slug: measure-ai-project-roi
translationKey: measure-ai-project-roi
language: en
summary: "How to measure the ROI of an AI project: a baseline before launch, 5 metrics tracked every week, a simple formula and a decision rule written in advance."
publishedAt: 2026-11-10
complexity: intermediate
topics: Strategy, AI Adoption
coverImage: /images/resources/roi-ia/cover-mascotte.webp
coverAlt: "The Vibe Company mascot watches a scale weighing an AI gear against a stack of coins, notebook in hand"
ogImage: /images/resources/roi-ia/cover-mascotte.webp
---

Only 8% of organizations in KPMG's survey can show established ROI on AI. Yet you calculate the ROI of an AI project like any other investment: measured gains, minus the full cost, divided by the full cost. What is almost always missing is the baseline, recorded before launch. This guide gives five metrics to track every week and a calculation template to fill in.

:::summary{title="In short"}
Track five metrics, defined before launch and recorded every week.
- **Time per case**: how many minutes the work takes, before and after.
- **Usage rate**: the share of the AI's output that actually gets used.
- **Correction rate**: the share a human rewrites or rejects.
- **Full cost per case**: model, infrastructure and review time included.
- **Business outcome**: the lead time, revenue or risk the process is meant to move.
ROI and payback period are calculated from these five numbers.
:::

## Few companies measure their AI ROI

[KPMG's Global AI Pulse](https://assets.kpmg.com/content/dam/kpmgsites/xx/pdf/2026/04/global-ai-pulse.pdf), Q1 2026 edition, was fielded from February 19 to March 17, 2026, among 2,110 senior executives in 20 countries. Just 8% of the organizations surveyed report established return on investment. Yet 95% of them have an AI strategy, and 64% report meaningful business value.

Other surveys point the same way. In [IBM's 2025 CEO Study](https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles) of 2,000 CEOs, only 25% of AI initiatives delivered the expected ROI, and 16% scaled enterprise-wide. In [McKinsey's State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025), 39% of respondents attribute any EBIT impact to AI. For most of them, that impact stays under 5% of EBIT.

France measures even less well. [KPMG](https://kpmg.com/fr/fr/media/press-releases/2026/05/ai-pulse-survey-2026.html) found that 50% of French companies struggle to measure the indirect benefits of AI, against 44% worldwide.

These numbers point to a method problem. Most projects start without a starting number. They count licenses without looking at results. And they forget the time humans spend reviewing.

Another figure travels a lot, often summed up as "95% of AI projects fail". It comes from an MIT report (NANDA initiative) covered by [The Register](https://www.theregister.com/software/2025/08/18/generative-ai-does-nothing-for-95-percent-of-companies/1118115): 95% of enterprise organizations got zero return from their AI efforts. The report draws on 52 structured interviews with enterprise leaders, a survey of 153 business professionals and an analysis of more than 300 public AI initiatives. It describes zero return, not a failure rate.

## The baseline gets recorded before launch

Record the baseline on the current process, before the AI touches it. Three numbers are enough to start:

1. **Volume**: how many cases per week (tickets, files, documents, quotes).
2. **Time per case**: how many minutes a person spends on one, start to finish.
3. **Error rate**: the share of cases reworked, corrected or disputed afterwards.

Record them over a few representative weeks, with the people who do the work. Write down, at the same time, the number that triggers what comes next: the level above which to widen the scope, and the one below which to stop.

This step fits on one page. It carries a lot of weight when you defend the budget for the second project.

## Five metrics are enough to measure the ROI of an AI project

![A baseline, then 5 metrics recorded every week, give the ROI and the payback period. Detailed below.](/images/resources/roi-ia/ai-roi-5-metrics.png)

The diagram follows the order of measurement: the baseline (volume, time per case, error rate) recorded before launch, the five metrics recorded every week, then the ROI and the payback period.

### 1. Time per case

Time per case measures how many minutes the work takes with AI, compared with the baseline. Record it on the same scope, with the same people. The gross time saved is: (time before − time after) × volume.

Count end to end. If the AI drafts in ten seconds and someone then spends several minutes checking, the total is what counts.

### 2. Usage rate

Usage rate counts what the AI produces that really gets put to work: drafts sent, alerts handled, documents kept. It's the most honest metric. It doesn't depend on anyone's opinion.

At [LocService](/en/case-studies/locservice), a peer-to-peer rental platform that gets several hundred tickets a day, the measure tracked day to day comes down to one question: is the draft used? On real usage, Quivr autodraft drafts are used on 87% of tickets. A human reviews and sends every reply.

A low usage rate often signals missing context. The article on [AI agents for customer support](/en/resources/articles/ai-customer-support-agent) covers this in detail.

### 3. Correction rate

Correction rate measures the share of the AI's work that a human rewrites, corrects or rejects. It completes the usage rate. A draft that gets used, then half rewritten, saves little time.

For document checks, quality also shows in what the AI finds. At [Coup de Pates](/en/case-studies/coup-de-pates), three skills compare, check and cross-check product documents. Across two versions of one specification, the AI flagged 72 changes. The quality team decides on each one.

### 4. Full cost per case

Full cost per case adds up everything it costs to handle one case with AI:

- model calls (tokens or subscription, brought down to one case);
- infrastructure and hosting;
- human review time;
- maintenance: prompt or skill updates, monitoring, incidents.

Review time is the line people forget most. On its own, it can wipe out the time saved in metric 1. Log the upfront investment (scoping, development, integration) separately. It feeds the payback period.

### 5. Business outcome

Business outcome measures what the process should change for the company: a shorter response time, more files handled with the same team, fewer costly errors, a risk better covered. One project, one main outcome. Pick the one leadership already tracks.

This metric ties the project to the P&L. [McKinsey](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025) notes that the companies getting the most value from AI redesign their workflows far more often than others. Time saved that changes nothing in the process often stays invisible in the accounts.

## Two formulas and a template give ROI and the payback period

The five numbers are enough to calculate ROI and the payback period:

- **ROI** = (measured gains − full cost) / full cost, over a given period (often 12 months).
- **Payback period** = upfront investment / net monthly gain.
- **Net monthly gain** = (A + B + C − D) brought down to one month, using the line letters of the template below.

Measured gains combine time saved (metric 1, valued at the real hourly cost), errors avoided and the business outcome when it can be priced. Full cost takes metric 4, plus the upfront investment spread over the period.

The template takes these formulas. Fill in the last column, or download it as [XLSX](/downloads/ai-roi-template.xlsx) or [CSV](/downloads/ai-roi-template.csv).

| Line | Formula | Source | Your number |
| --- | --- | --- | --- |
| A. Time saved | (time before − time after) × volume × hourly cost | Metric 1 and baseline | to fill in |
| B. Errors avoided | drop in error rate × volume × cost of one error | Metric 3 and baseline | to fill in |
| C. Business outcome | priced gain on the main outcome, if measurable | Metric 5 | to fill in |
| D. Running cost | full cost per case × volume | Metric 4 | to fill in |
| E. Upfront investment | scoping, development, integration | Project budget | to fill in |
| Measured gains | A + B + C | Lines A to C | to fill in |
| Full cost | D + E spread over the period | Lines D and E | to fill in |
| ROI | (measured gains − full cost) / full cost | Lines above | to fill in |
| Net monthly gain | (A + B + C − D) brought down to one month | Lines A to D | to fill in |
| Payback period (months) | E / net monthly gain | Lines A to E | to fill in |

Keep the assumptions visible. Anyone who disputes them should be able to change one number and watch the result move. If the budget goes through a French public scheme, the guide on [how to fund an AI project in France (CIR, CII, France 2030)](/en/resources/articles/fund-ai-project-france-cir-cii) helps you factor the aid into the calculation.

## Five traps skew the measurement of ROI

Each of these traps skews the comparison with the baseline.

- **Measuring adoption instead of results.** A tool the whole team opens every day can leave the process unchanged.
- **Forgetting review time.** It's often the first real cost line.
- **Measuring too early.** The first weeks mix learning and tuning. Compare stable weeks.
- **Crediting AI with the whole gain.** If the process changed at the same time, say so. When possible, compare with a team or a period that stayed without AI. That control group isolates the share of the gain due to AI.
- **Changing scope along the way.** Compare the same volume, the same kind of case, the same teams.

## A rule written in advance decides whether to stop, continue or widen

According to [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), over 40% of agentic AI projects will be canceled by the end of 2027, because of rising costs, unclear business value or inadequate risk controls. A rule written before launch keeps you out of that scenario.

- **Stop** if the usage rate stays below the threshold you set after the run-in period, or if full cost exceeds the gain.
- **Continue as is** if ROI is positive but the correction rate stays high: improve the context given to the AI first.
- **Widen** (more volume, more autonomy) when all five metrics hold for several weeks in a row.

Moving from pilot to production is where most projects break. The [AI agent POC to production checklist](/en/resources/articles/ai-agent-poc-to-production) covers what to plan. The guide to [AI agents for business](/en/resources/articles/ai-agents-for-business) shows how to connect one to real tools.

## FAQ

### How do you calculate the ROI of an AI project?

Divide the net gain (measured gains minus full cost) by the full cost, over a given period. Gains come from time saved, errors avoided and the business outcome, compared with a baseline recorded before launch. Full cost includes the model, infrastructure, maintenance and human review time.

### Which KPIs should you track for an AI project?

Five are enough to start: time per case, usage rate, correction rate, full cost per case and one main business outcome. Record them every week, on the same scope as the baseline.

### How long does it take to measure AI ROI?

Long enough to record a baseline over a few representative weeks, then to compare stable weeks after the run-in period. Measuring during tuning gives misleading numbers, in both directions.

### Why do so few companies report measurable AI ROI?

According to KPMG, only 8% of organizations surveyed in 2026 report established ROI. The usual causes: no baseline, adoption metrics mistaken for results, and hidden costs such as human review.

### Does the first AI project need a positive ROI?

It needs reliable numbers at least. A first project that is well measured, even a modest one, tells you what to do next. A project without measurement lets you neither stop nor widen.

## Measuring ROI on the first project starts before deployment

An AI project in mind and a pilot nobody can say is paying off start at the same step: the baseline. Bring the process, the volume and what you measure today. During the call, The Vibe Company looks at these three elements with you. The baseline and the five metrics get set next, before writing a line of code.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
