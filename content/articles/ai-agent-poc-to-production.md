---
title: "AI agent from POC to production: a go/no-go checklist"
seoTitle: "AI agent POC to production checklist | The Vibe Company"
slug: ai-agent-poc-to-production
translationKey: ai-agent-poc-to-production
language: en
summary: "A 12-row go/no-go checklist to move an AI agent from POC to production: for each row, the proof to produce and the text behind it."
publishedAt: 2026-10-14
dateModified: 2026-11-11
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
coverAlt: "A paper airship prototype in the foreground, the real airship behind it, and the mascot ticking off a checklist"
ogImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
---

To move an AI agent from POC to production, you need one proof per risk, written down before the go. This checklist has 12 rows, plus a row 0. Each one says which proof to produce and which text it rests on: the [ANSSI](https://messervices.cyber.gouv.fr/guides/en-essentiels-ia-agentique) guide published in October 2026 (version 1.0), OWASP, Anthropic and Article 50 of the AI Act. If a cell stays empty, the agent is still a POC.

The failure figures going around need sorting. MIT's “95%” describes a specific method, with a limit its authors state themselves. Gartner's “40%” is a forecast. The next sections detail both, with their sources.

## An AI agent POC answers a single question

A useful POC checks one thing: on this type of task and with this sample data, does the model produce something usable? Everything else remains unproven.

- How the agent holds up on rare, ambiguous or conflicting cases.
- Daily use by your teams.
- An acceptable cost per task at scale.
- A human escalation path that works when the agent gets it wrong.
- Handing the system over without the team that built it.

An agent calls tools, reads context and proposes an action. In production, every tool becomes a door. You need to know which doors are open, who watches them and who takes back control.

ANSSI, the French cybersecurity agency, sets the rule in its guide “Securing an agentic AI system”: “Appoint a designated person to be responsible for each measure. Block the deployment of the system if there remain any unacceptable risks.” The guide targets organizations that deploy, configure or integrate an agentic system, off-the-shelf products included. These recommendations carry no legal obligation.

One question comes before all the others. Do you really need an agent? Gartner notes that “Many use cases positioned as agentic today don't require agentic implementations”, and recommends pursuing agentic AI only where the value or ROI is clear. That is row 0 of the checklist.

## AI agent failure figures come from very different methods

The “95%” comes from an MIT report, project NANDA: [”The GenAI Divide: State of AI in Business 2025”](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf), version 0.1 from July 2025, covering January to June 2025. The link leads to a copy of the PDF hosted by mlq.ai. [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) summarized it on August 18, 2025: 95% of the generative AI pilots studied showed no measurable impact on the P&L.

The method rests on three sources. The report draws on more than 300 publicly disclosed initiatives, interviews with 52 organizations and 153 responses from senior leaders gathered at four conferences. Its authors say so themselves: these figures rest on individual interviews, not on company accounts, and the definition of success varies from one organization to another. They therefore call their figures “directionally accurate”. For task-specific tools, it counts 60% of organizations evaluating, 20% piloting and 5% implementing them with a lasting impact. Success there means deployment beyond the pilot, with measurable KPIs, and ROI measured six months after the pilot.

Gartner forecasts, in a [press release of June 25, 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), the cancellation of over 40% of agentic AI projects by the end of 2027. The stated causes are escalating costs, unclear business value and inadequate risk controls. It is a forecast. The investment figures in the same release come from a January 2025 poll of 3,412 webinar attendees. Gartner also estimates that only about 130 of the thousands of agentic AI vendors are real.

A survey says something else. In LangChain's [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering), 57.3% of respondents have agents running in production. The survey is public, ran from November 18 to December 2, 2025 and gathered 1,340 responses from LangChain's audience. One third of respondents cite quality as their primary blocker. 89% have some form of observability and 62% detailed tracing, but only 52.4% run offline evaluations on test sets. The gap between those two figures has a consequence: traces without evaluation tell you what happened, without saying whether it was good.

## The AI agent go/no-go checklist fits in 12 rows

Each row of the checklist asks for a written proof before the go, and points to the text that justifies it. It takes the nine criteria of the original checklist (scope, real data, success criterion, owner, escalation, observability, permissions, cost, handover) and extends them.

| # | Row | Proof to produce before the go | Basis |
|---|---|---|---|
| 0 | Do you really need an agent? | One sentence: why a workflow or an assistant is not enough | Gartner, 06/25/2025 |
| 1 | Written mission, out-of-scope cases listed | Mission document and refused cases | ANSSI; “Bounded use case” criterion |
| 2 | Eval set drawn from real failures | 20 to 50 real cases, anonymized if needed | Anthropic, 01/09/2026; “Real data” criterion |
| 3 | Go/no-go criterion written before the test | Numeric threshold and the name of who signs it off | “Measurable success” criterion; MIT: success = measurable KPIs |
| 4 | Consistency measured | Each case replayed several times, “all trials succeed” rate | Anthropic, pass^k |
| 5 | One human owner per measure, and an escalation path that works | Names (not a committee); queue, doubt thresholds, on-call person | ANSSI; “Business owner” and “Human escalation plan” criteria |
| 6 | Actions classified: autonomous, human approval, forbidden | Table of the agent's actions | ANSSI; “Progressive permissions” criterion |
| 7 | Authorization outside the model, deny by default | Check on the called system's side | ANSSI; OWASP, authorization in downstream systems |
| 8 | Functions, permissions and autonomy kept minimal | List of tools and scopes, each justified | OWASP LLM06; ANSSI |
| 9 | Replayable traces, logs out of the agent's reach | One request → authorization → action → result trace, replayed | ANSSI; LangChain; “Observability” criterion |
| 10 | Call caps and emergency stop | Limit and a tested shutdown procedure | ANSSI; OWASP, rate limiting |
| 11 | Transparency if the agent talks directly to people | “You are talking to an AI” message from the first exchange, or a “non-direct interaction” analysis | AI Act, Art. 50(1); Commission FAQ |
| 12 | Cost per successful task and internal handover | Budget at the expected volume, runbook, access, docs | “Cost per task” and “Internal handover” criteria |

Copy-ready version of the checklist:

```markdown
# AI agent go/no-go checklist
0. Do you really need an agent? Proof: why a workflow or an assistant is not enough.
1. Written mission, out-of-scope cases listed. Proof: mission document and refused cases.
2. Eval set drawn from real failures. Proof: 20 to 50 real cases, anonymized if needed.
3. Go/no-go criterion written before the test. Proof: numeric threshold and the name of who signs it off.
4. Consistency measured. Proof: each case replayed several times, "all trials succeed" rate.
5. One human owner per measure, and an escalation path that works. Proof: names (not a committee); queue, doubt thresholds, on-call person.
6. Actions classified: autonomous, human approval, forbidden. Proof: table of the agent's actions.
7. Authorization outside the model, deny by default. Proof: check on the called system's side.
8. Functions, permissions and autonomy kept minimal. Proof: list of tools and scopes, each justified.
9. Replayable traces, logs out of the agent's reach. Proof: one request → authorization → action → result trace, replayed.
10. Call caps and emergency stop. Proof: limit and a tested shutdown procedure.
11. Transparency if the agent talks directly to people. Proof: "you are talking to an AI" message from the first exchange, or a "non-direct interaction" analysis.
12. Cost per successful task and internal handover. Proof: budget at the expected volume, runbook, access, docs.
```

## Fill in the go/no-go checklist row by row

### Rows 0 to 4: the mission and the evaluation

The written mission states which task the agent does and which it refuses, with out-of-scope cases listed. The eval set comes from production tickets, files or messages. It doesn't need to be huge. For [Anthropic](https://www.anthropic.com/research/demystifying-evals-for-ai-agents), “20-50 simple tasks drawn from real failures is a great start”. If the agent already runs, Anthropic suggests starting from your bug tracker and support queue.

You write the go/no-go criterion before the test. It can rest on usage rate, time saved or quality signed off by a business owner. Consistency still needs measuring. Anthropic's pass^k metric gives the probability that all k trials of the same case succeed. According to Anthropic, an agent with a 75% per-trial success rate passes all three trials of a case only 42% of the time, that is (0.75)³. The same calculation at 90% per trial gives 0.9³ = 0.729: three successful trials on the same case only 73% of the time. Anthropic considers this metric especially important for customer-facing agents.

### Rows 5 to 8: owners, actions and permissions

Each measure has its own human owner. The business owner, the one who decides whether an answer is acceptable, is a named person. Escalation completes row 5. When the agent hesitates or gets it wrong, the case goes to a queue, based on written doubt thresholds, to an on-call person. ANSSI then asks you to classify possible actions into three categories: autonomous execution, mandatory human approval, forbidden action. For an action that needs approval, the approver sees the exact action, its goal and its expected effects. Only the approved action runs, and the approval mechanism stays out of the agentic system's reach.

Authorization checks happen outside the model. ANSSI asks you to authenticate the requester and check their rights against a policy the model cannot change: “Deny the action by default.” [OWASP](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) files this risk under LLM06:2025, “Excessive Agency”, with three causes: excessive functionality, excessive permissions, excessive autonomy. Its main fix is to implement authorization in downstream systems, without letting the LLM decide whether the action is allowed. OWASP also recommends a human in the loop to approve high-impact actions.

The progression stays the one from the original checklist: read first, write under control, send only after human validation. ANSSI adds a condition. Autonomy widens only after you have verified that the security measures and incident procedures work.

### Rows 9 and 10: traces and the emergency stop

A useful trace lets you replay a tool call, a prompt and a decision. ANSSI asks for logs out of reach of the agent's changes, to rebuild the request → authorization → action → result sequence. The simplest proof is to replay one of those sequences in front of the owner.

Caps limit the damage. ANSSI recommends limiting the number of successive calls between agents, planning an emergency stop with access revocation and keeping secrets out of the model's context. OWASP asks for logging and rate limiting.

### Row 11: Article 50 of the AI Act

Article 50 of the AI Act has applied since August 2, 2026, according to the [European Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act), last updated on July 24, 2026. A provider of an AI system that interacts directly with people must inform them that they are interacting with an AI, unless this is obvious, from the first interaction. The FAQ sets four cumulative criteria. One of them requires a direct interaction: the AI itself communicates with the person, with no human intermediary. The grace period until December 2, 2026 covers only the marking set out in Article 50(2), for systems placed on the market before August 2, 2026.

A draft reviewed and sent by a human is therefore not, a priori, a direct interaction under these criteria. This is a reading-based deduction, to be confirmed by your lawyer.

### Row 12: cost and handover

Two proofs close the checklist. You measure cost per successful run, at the expected volume, with a known budget and an alert if it drifts. Internal handover is proven by deliverables: docs, access, runbook and training. Your team must be able to evolve the system without the vendor.

## Fictional example: the checklist filled in for a support draft agent

The fictional example below describes an agent that writes support reply drafts, reviewed by a member of the support team. No figure in it is real, and thresholds stay in the form [x]%.

| # | Row | Fictional filled-in example |
|---|---|---|
| 0 | Do you really need an agent? | The agent reads the customer history and picks the documents to cite; a fixed reply template can't do that |
| 1 | Mission | Draft replies for billing tickets; refuse legal disputes and account deletion requests |
| 2 | Eval set | [x] real anonymized tickets, taken from replies the support team corrected |
| 3 | Go/no-go criterion | Draft accepted without rewriting on [x]% of cases, signed off by the support lead |
| 4 | Consistency | Each case replayed 3 times; “all trials succeed” threshold set at [x]% |
| 5 | Owners and escalation | One name for evaluation, one name for access, one name for the emergency stop; doubt or dispute: ticket sent back to queue [x], on-call person named |
| 6 | Classified actions | Read a ticket: autonomous; save a draft: autonomous; send: human approval; refund: forbidden |
| 7 | Authorization | The ticketing service checks the agent's rights on every call; deny by default |
| 8 | Minimal permissions | Read access to tickets and docs, write access to drafts only |
| 9 | Traces | One request → authorization → action → result sequence replayed in front of the support lead |
| 10 | Caps | [x] calls per ticket; access shutdown tested once before the go |
| 11 | Article 50 | Draft reviewed and sent by a support agent: “non-direct interaction” analysis sent to the lawyer |
| 12 | Cost and handover | Cost per accepted draft tracked weekly; runbook and access handed to the internal team |

## Three mistakes keep coming back before the production go

The first mistake is evaluating on examples picked for the demo. The eval set has to come from real cases, and a lab number without real usage says almost nothing.

The second mistake leaves tool calls in the dark. What the agent reads, calls and proposes must stay auditable.

The third removes the human too early. Keep a human in the loop as long as the risk justifies it, and widen autonomy only after checking your security measures and incident procedures.

For the big picture (tools, memory, authority, measurement), read the [guide to AI agents for business](https://www.thevibecompany.co/en/resources/articles/ai-agents-for-business). The checklist also serves as the basis for the [AI agents in production](/en/ai-agents-in-production) offer. Once you have picked a vendor, here is [how a project with an AI development agency runs, from the first call to production](https://www.thevibecompany.co/en/resources/articles/working-with-an-ai-development-agency).

## FAQ

**How long does it take to go from POC to production?**
It depends on scope and constraints: data, security, integrations. The fixed point comes before the start. Write the success criterion, then fill in the checklist.

**Do you always need a human in the loop?**
For a first business deployment, almost always. Start in read-only or draft mode under validation, and widen permissions when the metrics and the business allow it. If the agent answers people on its own, Article 50 of the AI Act requires telling them they are talking to an AI from the first exchange.

**Is a good lab accuracy score enough?**
No. A lab number without real usage says almost nothing, and an average rate hides inconsistency. Replay each case several times: according to Anthropic, a 75% per-trial success rate gives about 42% of cases passing three times out of three. Measure what your teams actually accept.

**Who maintains the agent after go-live?**
Decide before the go. Either your team takes the system over with docs, a runbook and training, or you plan a maintenance engagement. An agent with no business owner and no observability stays a POC.

## Move from POC to an agent that holds up

You have a pilot that works in a demo and you want to know whether it is ready for production. Bring your use case, your constraints and what “success” means for you.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
