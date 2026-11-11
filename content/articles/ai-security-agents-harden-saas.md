---
title: "AI security agents to harden a SaaS beyond CI"
seoTitle: "AI security agents to harden a SaaS | The Vibe Company"
slug: ai-security-agents-harden-saas
translationKey: ai-agents-harden-saas
language: en
summary: "AI security agents: what Codex Security, CodeMender, GitHub and DARPA have published, and the parts of a SaaS your CI can't see, such as OAuth tokens."
publishedAt: 2026-10-26
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
coverAlt: "The Vibe Company mascot inspecting code crates with a magnifying glass on a CI conveyor, between scanning arches and a key vault"
ogImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
---

To harden a SaaS with AI security agents, start from what their vendors have published: vulnerabilities found and fixed at volume, over precise scopes, and sometimes limits spelled out in writing. The second gain lies outside CI. In August 2025, an attacker used compromised OAuth tokens from the Salesloft Drift integration to export data from numerous Salesforce instances, far from any Git repository.

This article covers agents that secure your product. Securing the agent itself, its keys, its permissions and what it runs, is the subject of [Black October: PHP flaws, stolen secrets, and what it means for AI agents](/en/resources/articles/black-october-ai-agent-security). The per-pull-request pipeline, rules written as versioned skills and the headline GitGuardian figures live in [the CI security agent article](/en/resources/articles/ci-security-agent).

## Public AI security agents, their figures and scopes

Four tools and one competition document what they do and where they stop. The figures come from vendors or from a competition, over different scopes. They aren't comparable with each other, and nobody tested them for this article.

| Tool (vendor, date) | What it does | Published figure | Published scope and limit | Status as of the date cited |
| --- | --- | --- | --- | --- |
| [Codex Security](https://openai.com/index/codex-security-now-in-research-preview/) (OpenAI, March 6, 2026) | Scans commits and surfaces findings ranked by severity | More than 1.2 million commits scanned over 30 days of beta, 792 critical findings and 10,561 high-severity ones, critical issues in under 0.1% of commits; formerly [Aardvark](https://openai.com/index/introducing-aardvark/), October 30, 2025: 92% of known and synthetic vulnerabilities identified on “golden” test repositories, 10 open source vulnerabilities with a CVE | No limit written in the announcement; scope: beta cohort, external repositories | Research preview for ChatGPT Pro, Enterprise, Business and Edu, via Codex web, free usage for the first month |
| [CodeMender](https://deepmind.google/blog/introducing-codemender-an-ai-agent-for-code-security/) (Google DeepMind, October 6, 2025) | Fixes vulnerabilities in open source projects | 72 security fixes upstreamed in six months, in projects of up to 4.5 million lines | Human researchers on every fix; per the [Google Cloud page](https://cloud.google.com/security/codemender), commit only after manual approval | Google Cloud page read on November 11, 2026 |
| [GitHub agentic autofix](https://docs.github.com/en/code-security/concepts/code-scanning/autofix-for-code-scanning) (docs read on November 11, 2026) | Explores the code, generates a fix, validates it by rerunning CodeQL, opens a draft PR | No figure on the page read | “best-effort”; no confirmation for custom CodeQL queries, the security-extended suite or third-party alerts | Alerts assigned to Copilot |
| [Claude Code security review](https://github.com/anthropics/claude-code-security-review) (Anthropic, GitHub README) | Reviews pull requests from a security angle | No figure in the README | “not hardened against prompt injection attacks and should only be used to review trusted PRs” | Public README on GitHub |
| [AIxCC systems](https://www.darpa.mil/news/2025/aixcc-results) (DARPA, final on August 8, 2025) | Find and fix vulnerabilities in a competition | 86% of synthetic vulnerabilities identified, 68% of them patched (54 found, 43 patched), 18 real vulnerabilities, about $152 per task, 45 min per patch on average | No limit written in the announcement; scope: competition over 63 challenges and 54 million lines | 4 of the 7 systems released as open source |

DARPA notes clear progress since the August 2024 semifinal, where the rates were 37% and 25%.

The published limits all point the same way. GitHub asks you to review and test before merging: “Always review and test the generated changes before you merge.” Google has human researchers review every CodeMender fix before submission. Anthropic restricts its action to trusted PRs. Anthropic also recommends requiring approval for all external contributors: a review agent run on PRs coming from forks faces prompt injection.

## OAuth tokens slip past CI: the Salesloft Drift case

According to the [Google Threat Intelligence Group](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift), the actor UNC6395 used compromised Salesloft Drift OAuth tokens from August 8, 2025 until at least August 18. With them, it exported data from numerous Salesforce instances. It was mainly hunting for credentials: AWS keys (AKIA), passwords, Snowflake tokens.

On August 20, 2025, Salesloft and Salesforce revoked all Drift access and refresh tokens. Drift left the AppExchange. GTIG asks organizations that used Drift to treat their data as compromised, review their third-party integrations, then revoke and rotate their credentials. The scope goes beyond the Salesforce integration, since it also covers Drift Email.

Verizon's [2026 DBIR](https://www.verizon.com/business/resources/Te26/reports/2026-dbir-data-breach-investigations-report.pdf) lists this case among its examples of third-party involvement. Those tokens lived in the integration. No repository scanner could see them.

## The 2026 DBIR puts numbers on third-party risk and slow patching

The 2026 DBIR ranks vulnerability exploitation as the top initial access vector, at 31% of the breaches studied, up from 20% the previous year. Patching is slowing down too. Organizations fully remediated only 26% of the vulnerabilities in CISA's KEV catalog, down from 38% the year before. The median time goes from 32 to 43 days.

Third parties matter too. They appear in 48% of breaches, up from 30% the previous year, an increase of 60%. Only 23% of those third parties fully fixed missing or weak MFA on their cloud accounts.

Credential abuse drops from 22% to 13% as an initial access vector. The DBIR, however, adds pretexting as a category. On a comparable scope, the figure would be 16%. Counted at every stage of a breach, credential abuse still sits on top, at 39%.

## SaaS secrets also leak outside repositories

GitGuardian's [State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026), published on March 17, 2026, holds figures that go beyond its headline. Internal repositories are 6 times more likely than public ones to contain hardcoded secrets. In self-hosted GitLab and Docker registries, secrets are 3 to 4 times more often valid.

Leaks outside the code weigh heavily. 28% of incidents originate entirely outside repositories, in Slack, Jira or Confluence, and GitGuardian rates those leaks critical 13% more often. Leaked AI service secrets reached 1,275,105 in 2025, 81% more than the year before. MCP servers exposed more than 24,000 secrets in their first year.

On the commit side, 1.5% of the 1.94 billion public commits in 2025 contained an exposed credential. The rate rises to 3.2% for commits co-authored by Claude Code. The previous year, GitGuardian measured a 40% higher leak rate for repositories that used AI assistants.

## Four AI agents harden a SaaS, mostly outside CI

Four agents cover the areas described above, and their most useful part plays out outside CI.

### The secrets agent looks beyond the repository

It starts from the alerts of your detection tools, for example [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) with push protection, then goes further than the repository. It also rereads Slack, Jira and Confluence, where 28% of secrets incidents originate according to GitGuardian. The human triggers the rotation in production.

Its own vault access key never enters its context, since the server injects it per call.

### The dependency agent triages version bumps

[Dependabot](https://docs.github.com/en/code-security/dependabot) or Renovate already open version bump PRs. The agent then triages them. With a median of 43 days to fix a KEV vulnerability, that is where this triage can save time.

### The IAM and config agent reads OAuth integrations

It reads the OAuth scopes of your SaaS tools and the list of connected apps, where the Drift case played out. GTIG draws two instructions from it: restrict connected app scopes to the minimum, and search Salesforce data for secrets to revoke and rotate them. The IAM agent can prepare both inventories. Revocation stays human.

Third parties' cloud accounts also belong in its inventory. Their MFA remains the weak spot noted above: only 23% of third parties fully fixed it, according to the 2026 DBIR.

### The security PR review agent stays on trusted PRs

The Claude Code security review README limits this kind of tool to trusted PRs. To set guardrails for Claude Code itself, read [Rolling out Claude Code in the enterprise](/en/resources/articles/claude-code-enterprise-rollout). Inside CI, alert triage happens on every pull request.

## Bound AI security agents with ANSSI and vendor rules

The vendors cited all keep a human before any irreversible action. Your agents follow the same rule. The article [The real risk of AI agents is authority](/fr/resources/articles/agents-ia-formation-autorite) (in French) details the read, propose, prepare and execute levels.

The guide from [ANSSI on agentic AI](https://messervices.cyber.gouv.fr/guides/en-essentiels-ia-agentique), published in October 2026 (version 1.0), points the same way. It asks you to “Keep secrets out of the model context, memories, and logs.” It recommends delegating their management to a vault or proxy, and granting the agent only short-lived, least-privilege tokens scoped to operational needs. Finally, it asks you to “Provide an emergency stop that revokes access and can be triggered by a monitoring mechanism when processing is abnormal.” In degraded mode, the agent runs “without weakening controls or expanding permissions”.

Each agent has its own technical account, minimal permissions and logs. If you connect it to your tools through MCP, define the allowed tools first, keep secrets server-side and isolate execution, as described in [MCP server for business](/en/resources/articles/what-is-an-mcp-server).

If your product handles health data, the agent runs inside the client's compliant environment. The article [AI and health data: what HDS really requires](/en/resources/articles/ai-health-data-hds-france) details that framework.

## FAQ

### What should you do if a SaaS integration is compromised?

GTIG asks you to treat the data as compromised, review third-party integrations, then revoke and rotate credentials. It also advises searching the exposed data for secrets and restricting connected app scopes. An agent can prepare those inventories. A human triggers the revocation.

### Do the figures published by vendors compare?

No. Codex Security, CodeMender and AIxCC measure different things, on a beta cohort, open source projects or a competition of 63 challenges. Each figure holds within its scope.

### How is this different from securing AI agents?

Securing an agent means limiting what it can do and protecting its secrets. Here, the agent is the tool that hardens your product. Both go together, because a poorly bounded security agent becomes a risk itself, hence the emergency stop ANSSI asks for.

### Does your code go to a model provider?

That depends on the model and contract you choose. Before connecting an agent to your repositories, check retention, no-training and hosting in the contract, as you would for any subprocessor.

## Harden your SaaS with AI security agents

Want to know what your security agents need to see, inside CI and beyond?

[Book a call about hardening your SaaS →](https://cal.com/stangirard/thevibecompany)
