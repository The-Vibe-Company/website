---
title: "ChatGPT Enterprise vs Business vs custom agents: how to choose and roll out ChatGPT at work"
seoTitle: "ChatGPT Enterprise vs Business vs custom | The Vibe Company"
slug: chatgpt-enterprise-rollout
translationKey: chatgpt-business-rollout-guide
language: en
summary: "What ChatGPT Business and Enterprise actually change for a company, what they don't do, and when a custom agent wired into your own tools is the better call. Plus a four-step rollout plan."
publishedAt: 2026-10-22
complexity: intermediate
topics: AI Agents, AI Operations, Security
coverImage: /images/resources/chatgpt-entreprise/cover-mascotte.webp
coverAlt: "The mascot reads a map at a crossroads, with a general-purpose toolbox on one side and a custom-built machine connected to a database on the other"
ogImage: /images/resources/chatgpt-entreprise/cover-mascotte.webp
---

Your teams already use ChatGPT. Often on personal accounts, sometimes pasting internal documents into the chat box. So the real question isn't "should we use ChatGPT at work?" It's "which plan, for whom, under which rules."

Here we compare OpenAI's business plans: what they cover, what they don't, and how to roll them out.

## The two business plans, plainly

OpenAI sells two plans to organizations ([Business pricing page](https://openai.com/business/pricing/)):

| | ChatGPT Business | ChatGPT Enterprise |
| --- | --- | --- |
| For whom | Teams of 2 to 200, self-serve | Large organizations, through sales |
| Sign-in | SAML SSO, MFA | SSO plus SCIM provisioning and role-based access (RBAC) |
| Connectors | Google Workspace, Slack, GitHub, Microsoft 365 and more | Same, with finer control per group |
| Data | No training on your business data by default | Same, plus custom retention and enterprise key management (EKM) |
| Data residency | No, Enterprise only ([OpenAI pricing](https://openai.com/business/pricing/)) | Available in ten regions |
| Support | Standard, no enhanced support | 24/7, SLAs, custom legal terms |

On data, OpenAI is explicit: by default, ChatGPT Business and Enterprise data isn't used to train its models unless you explicitly opt in ([Enterprise privacy](https://openai.com/enterprise-privacy/)).

One point people often miss: a Business subscription doesn't include the API. API usage is billed separately ([OpenAI Help Center](https://help.openai.com/en/articles/8792828-chatgpt-business-overview)). If you want AI inside your own applications, that's a different budget and a different project.

## What ChatGPT solves, and what it doesn't

A business plan solves three problems well:

1. **Shadow AI.** Personal accounts give way to a managed workspace with sign-in through your company directory.
2. **The training-data question.** It's settled in the contract.
3. **Individual productivity.** Drafting, summarizing, analyzing a file, preparing a meeting.

It doesn't solve:

- **Business processes.** A general assistant doesn't know how your support team handles a complaint, or which steps are mandatory before a quote goes out.
- **Internal tools.** Connectors cover the big off-the-shelf software. Your in-house database, custom ERP or scheduling tool isn't on the list unless you build a connector, for example an [MCP server](/en/resources/articles/what-is-an-mcp-server).
- **Authority.** Who may do what, and when a human has to approve. We cover this in [the real risk of AI agents: authority](/fr/resources/articles/agents-ia-formation-autorite) (in French).
- **Measurement.** Knowing whether the tool saves time on a given task means defining that task and measuring it before and after.

## ChatGPT, Copilot or custom?

| Situation | Sensible choice |
| --- | --- |
| Everyone needs an assistant to draft, summarize, search | ChatGPT Business or Enterprise (or Microsoft Copilot if you live in Microsoft 365) |
| One specific, repetitive task inside an internal tool | A custom agent wired into that tool |
| Sensitive, regulated data (health, finance) | Check the legal framework first; for health data in France, see our article on [AI and HDS hosting](/en/resources/articles/ai-health-data-hds-france) |
| A customer-facing product that embeds AI | The API, not a ChatGPT subscription |

The two approaches combine well. The general assistant serves everyone day to day, and custom agents take on the two or three processes where the stakes are real. That's the kind of custom tooling we build at The Vibe Company: for [Monka](/en/case-studies/monka), the caregivers' app, the coordination nurses' CRM and the API that ties them together; for [AFP](/en/case-studies/afp), generative AI tools for newsrooms, kept under journalists' control, as part of the MediaGen project.

## Rolling out in four steps

**1. Take inventory.** Who already uses what, on which accounts, with which data? A ten-minute internal survey is often enough to see how far shadow AI has spread.

**2. Set the rules before inviting people.** OpenAI recommends configuring SSO and SCIM before broad onboarding, and turning off automatic account creation if you manage access through your directory ([Enterprise admin quickstart](https://help.openai.com/en/articles/20001264-chatgpt-enterprise-admin-quickstart)). Write a short usage policy too: what can go in, what never does.

**3. Turn connectors on one at a time.** Every connector gives the assistant access to a data source. Enable the ones a team actually needs, and check that the assistant only sees what the user can already see.

**4. Spot the processes that deserve an agent.** After a few weeks, usage shows where the general assistant hits its ceiling: the same task again and again, the same copy-paste between two tools. That's where a dedicated agent pays off. Our [POC-to-production checklist](/en/resources/articles/ai-agent-poc-to-production) explains how to scope one.

## Summary

- ChatGPT Business fits teams of up to 200. Enterprise fits large organizations that need SCIM, roles, custom retention or data residency.
- By default, OpenAI doesn't train on data from these plans.
- The subscription doesn't include the API and doesn't know your processes or internal tools.
- The right setup is often mixed: one assistant for everyone, custom agents where the gain is measurable.

Rolling out ChatGPT and wondering where a custom agent would make the difference? [Book a call with us](https://cal.com/stangirard/thevibecompany).
