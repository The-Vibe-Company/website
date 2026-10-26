---
title: "AI security agents to harden a SaaS: secrets, deps and CI"
slug: ai-security-agents-harden-saas
translationKey: ai-agents-harden-saas
language: en
summary: "How a fleet of AI security agents hardens a SaaS inside its CI: secrets, dependencies, IAM and config, security PR review, with humans approving."
publishedAt: 2026-10-26
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
coverAlt: "The Vibe Company mascot inspecting code crates with a magnifying glass on a CI conveyor, between scanning arches and a key vault"
ogImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
---

When people talk about AI agents and security, they usually mean protecting the agent: its keys, its permissions, what it is allowed to run. We covered that in [Black October: PHP flaws, stolen secrets, and what it means for AI agents](/en/resources/articles/black-october-ai-agent-security). Here we take the topic the other way round: AI agents that harden your own SaaS product. They find leaked secrets, triage vulnerable dependencies, review configs and permissions, and comment on sensitive pull requests. They run in your CI, and a human keeps control of the decisions that matter.

## Why scanners alone are no longer enough

GitGuardian's [State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) counted 28.65 million new hardcoded secrets in public GitHub commits in 2025, 34% more than in 2024. Commits co-written with an AI coding assistant leaked secrets at roughly twice the baseline rate. The same report found that 64% of valid secrets detected in 2022 were still exploitable in January 2026. They had been detected, but nobody rotated them.

On the vulnerability side, the [Verizon 2026 DBIR](https://www.verizon.com/business/resources/Te26/reports/2026-dbir-data-breach-investigations-report.pdf) ranks vulnerability exploitation as the top initial access vector, in 31% of the breaches studied (up from 20% the year before). Only 26% of the critical vulnerabilities in CISA's KEV catalog were fully remediated in 2025, with a median time of 43 days.

Detection tools have been around for years. The delay happens after the alert: triaging hundreds of findings, working out which ones touch your code, preparing the fix, chasing the right owner. That reading-and-context work is something an AI agent does well.

## What the agent adds to your security tools

The agent plugs into your existing scanners and picks up their findings.

| Step | Classic scanner | AI agent on top of the scanner |
| --- | --- | --- |
| Detect | Lists secrets, CVEs, config drift | Reads the same list |
| Triage | Generic score (CVSS, secret type) | Checks whether the vulnerable code is called, who owns the service, whether the key is still in use |
| Fix | Sometimes a version bump PR | Prepares the PR, reads the changelog, adapts broken code, runs the tests |
| Follow up | Ticket opened, often forgotten | Nudges owners, groups items, sums up the status every week |

Our rule: the agent proposes and prepares, a human approves anything irreversible. Rotating a production secret, changing permissions, merging a sensitive diff all stay human decisions. The levels (read, propose, prepare, execute) are the same ones we use to secure agents, described in the Black October article linked above.

## The four agents of a SaaS hardening fleet

### 1. The secrets agent

It starts from the alerts raised by your detection tools (for example [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) with push protection) and looks beyond the repository. GitGuardian notes that 28% of secret incidents happen only outside code, in Slack, Jira or Confluence. The agent:

- reads Git history and the channels where keys actually leak;
- identifies the service and the owner of each key;
- prepares the rotation (new key in the vault, a PR that removes the hardcoded value);
- leaves the production rotation to a human.

Its own vault credential never enters its context: it is injected server-side at call time.

### 2. The dependencies agent

[Dependabot](https://docs.github.com/en/code-security/dependabot) or Renovate already open version bump PRs. The trouble is the pile of PRs nobody reads. The dependencies agent:

- checks whether the vulnerable function is actually called in your code;
- reads the changelog and flags breaking changes;
- fixes code broken by the upgrade and gets the tests passing;
- groups minor updates so you don't get twenty PRs a week.

You get fewer PRs, better explained, and reachable vulnerabilities go first.

### 3. The IAM and configuration agent

It reads your infrastructure as code (Terraform, Pulumi), cloud policies and the OAuth scopes of your SaaS tools. It looks for drift: a role widened "for a test", a public bucket, a dormant service account with admin rights. It opens a PR that brings things back to least privilege, or a ticket if the change touches production. In production it stays read-only.

### 4. The security PR review agent

Developers see this one every day. On each pull request that touches authentication, crypto, input validation or permissions, it comments on the diff before merge. It only blocks on clear, written rules (a hardcoded secret, a removed access check). Everything else is a remark that the human reviewer decides on.

This matters more as coding assistants write a growing share of PRs. If you already run a tool like Claude Code, we explain how to frame it in [Rolling Out Claude Code in the Enterprise](/en/resources/articles/claude-code-enterprise-rollout).

## The typical pipeline, from commit to weekly report

In a standard CI, we chain them like this:

1. Before push: local hook and push protection against secrets.
2. On every PR: scanners (secrets, dependencies, SAST), then the security review agent comments with context.
3. Every night: the dependencies agent handles new CVEs, the IAM agent compares declared infra with what is running.
4. Every week: a readable summary for the CTO or CISO, with what was fixed, what awaits a decision and what is lagging.

Each agent has its own technical account, minimal permissions and logs. If you connect these agents to your tools through MCP, define the perimeter first: allowed tools, server-side secrets, isolated execution. See [What is an MCP server?](/en/resources/articles/what-is-an-mcp-server).

## Why versioned skills beat prompts

A security agent is only as good as its rules. In your company, "a hardcoded secret" or "a route without access control" has a precise definition: your frameworks, your conventions, your exceptions. We write those rules once, as skills versioned in a repository and reviewed in PRs like code. Every team starts from the same base, and an improved rule reaches every repository the same day.

It is the approach we use with [Theodo](/en/case-studies/theodo): Software Factories for hundreds of developers, with standardised tools, agents and skills, plus the training each team needs to adopt them. Security is one of the areas where this standardisation pays off fastest, because a rule forgotten in a single repository is enough to open a door.

## Where to start

There is no need to deploy all four agents at once. We recommend this order:

1. Inventory: repositories, CI, cloud, critical SaaS tools and known secrets.
2. Secrets agent in read-only mode: it triages and prepares, you measure the real volume.
3. Dependencies agent on one or two critical repositories, with human merge.
4. Security PR review once your in-house rules are written as skills.
5. IAM and config last, because that is where the agent's permissions must be the tightest.

If your product handles health data, the agent runs inside the client's compliant environment, not next to it. We explain that framework in [AI and health data in France: what HDS really means](/en/resources/articles/ai-health-data-hds-france).

For the full offer (mapping, deployment, integration into your CI), see [AI agents to harden your product and stack](/en/ai-agents-product-hardening).

## FAQ

### Does an AI security agent replace a scanner or SAST?

No. The scanner detects; the agent triages, explains and prepares the fix. Without a reliable scanner underneath, the agent has nothing solid to read.

### Can the agent merge or rotate secrets on its own?

We don't recommend it. The agent prepares the PR or the rotation, a human approves. Automatic execution is limited to reversible, well-bounded cases, such as grouping minor updates into one PR.

### How is this different from securing AI agents?

Securing an agent means limiting what it can do and protecting its secrets. Here, the agent is the tool that hardens your product. Both go together: a poorly bounded security agent becomes a risk itself.

### Does our code go to a model provider?

That depends on the model and contract you choose. Before connecting an agent to your repositories, check retention, no-training and hosting terms in the applicable contract, as you would for any subprocessor.

## Harden your SaaS with agents

The Vibe Company is an AI agency in Paris. We deploy agents and skills in your CI to harden your product, with minimal permissions and a human approving.

[Book a call about hardening your SaaS →](https://cal.com/stangirard/thevibecompany)
