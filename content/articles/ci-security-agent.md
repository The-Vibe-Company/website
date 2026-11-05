---
title: "CI security agent: scan secrets, deps and configs on every PR"
seoTitle: "CI security agent: secrets, deps, configs on PRs"
slug: ci-security-agent
translationKey: ci-security-agent
language: en
summary: "CI security agent: scan secrets, dependencies and configs on every PR, triage alerts, prepare fixes, and keep a human on irreversible changes."
publishedAt: 2026-11-05
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agent-securite-ci/cover-mascotte.webp
coverAlt: "The Vibe Company mascot inspecting a CI pipeline with secret, package and config scanners in front of a security gate"
ogImage: /images/resources/agent-securite-ci/cover-mascotte.webp
---

We have already covered two sides of the topic. [Black October](/en/resources/articles/black-october-ai-agent-security) is about **securing AI agents** themselves. [AI security agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas) presents a **fleet** (secrets, dependencies, IAM, review). Here we zoom into one link: **the security agent that runs in your CI on every pull request**. It reads secret, dependency and config scanners, triages what actually touches the diff, prepares the fix, and leaves irreversible calls to a human.

## Why CI became the real bottleneck

According to [Octoverse 2026](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/), more than **40%** of pull requests started in September 2026 began with an agent draft (17% in March). Agents push, fix the red checks, push again. The loop does not get tired.

Owen Gretzinger (Boardy) described it in [How I made our CI 20x faster](https://x.com/owengretzinger/article/2116291924219060319): a PR that waited up to **40 minutes** for CI now waits **2 minutes**, because "every PR we ship is written with coding agents" and agents "don't get tired of pushing." When writing speeds up and verification stalls, **verification becomes the bottleneck**. That is true for tests. It is also true for security: if secret/deps/config scanning stays a queue of unread alerts, agents mostly accelerate risk.

GitHub scaled detection: [push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection) ran **5.8 billion** scans in the Octoverse window, nearly four times 2025's pace. Developers merged more than **30 million** Dependabot PRs. Detection scales. Triage and remediation do not.

## What the agent adds on top of CI scanners

The tools already exist. [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) with push protection, [Dependabot](https://docs.github.com/en/code-security/dependabot) or Renovate, SAST, infrastructure-as-code checks. The drag starts after the alert.

GitGuardian's [State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) counted **28.65 million** new hardcoded secrets in public GitHub commits in 2025 (+34%). AI-assisted commits leaked secrets at roughly **twice** the baseline rate. **64%** of valid secrets detected in 2022 were still exploitable in January 2026. Detected, not rotated. OWASP files this under [CICD-SEC-6: Insufficient Credential Hygiene](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-06-Insufficient-Credential-Hygiene): secrets pushed to SCM, over-broad pipeline credentials, secrets printed in logs, keys that never rotate.

| On every PR | Classic scanner | CI security agent |
| --- | --- | --- |
| Secrets | Blocks or alerts on a pattern | Ties the key to the service, owner and residual risk if still valid; prepares the removal PR and rotation |
| Dependencies | Opens or flags a version bump | Checks whether the vulnerable function is reachable in the diff / call graph; reads the changelog; fixes broken code; groups minor bumps |
| Configs / IaC | Flags a generic drift | Explains the drift on *this* PR (public bucket, widened role, hardcoded secret in a workflow); proposes least privilege |
| Follow-up | Red check, forgotten ticket | Summarises what blocks merge, what can wait, what needs a human decision |

Our rule stays the same: **the agent proposes and prepares; a human approves anything irreversible**. Rotating a production secret, widening permissions, merging an auth diff: human decisions.

## A typical pipeline, from local hook to risk-based review

### 1. Before push

A local hook (secrets plus fast lint/typecheck) and forge-side push protection. The agent does not need to block an obvious hardcoded AWS token. It steps in when the signal is ambiguous or the follow-up work needs preparing.

### 2. On every PR: three reads of the same diff

1. **Secrets**: scanner findings plus nearby history. The agent drops obvious noise (clear false positives, documented fixtures) and prioritises keys that still look usable.
2. **Dependencies**: CVEs or bumps tied to touched files. Not twenty Dependabot PRs: one useful explanation on *this* PR.
3. **Configs**: CI workflows, Terraform/Pulumi, Docker, declared environment variables. This is where CICD-SEC-6 often shows up: over-broad secret injection, dangerous `pull_request_target`, `write-all` on a job.

Then the agent comments on the diff. It only blocks on written rules (hardcoded secret, removed access check, CI permission widened without justification). Everything else helps the human reviewer.

### 3. Review by risk level

Not every wait has the same cost. A PR that touches `auth/`, crypto, cloud policies or GitHub Actions workflows still needs a mandatory human review, even if the agent left a favourable note. A copy change or a minor transitive dependency can move faster, with the agent as the first filter. Octoverse puts it another way: review is where developers shape what comes back. Agents write more. Humans choose where to spend attention.

### 4. Nightly and weekly

At night: the deps agent handles new CVEs outside the day's diffs. Weekly: a readable summary for the CTO or CISO (fixed / waiting / blocked on a decision). Without that thread, CI only produces red checks.

## What CI does not see (and why it matters)

On **29 October 2026**, [Cursor reported](https://cursor.com/blog/claude-code-extension-security-notice) malicious versions of the `Anthropic.claude-code` extension (**2.1.312** and **2.1.313**) on its marketplace for a few hours. [Microsoft Threat Intelligence](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/) confirmed a persistent SSH backdoor attempt, limited to that marketplace (not Microsoft's VS Code Marketplace, not Anthropic's official npm package).

That is not a pipeline finding. It is the **developer workstation** and its tool chain. GitGuardian also notes that in the Shai-Hulud 2 analysis, **59%** of compromised machines were **CI/CD runners**, not only laptops. The CI security agent remains necessary. It is not enough: skills that review extension configs, an inventory of allowed tools, rotation if a laptop or runner is exposed. For framing Claude Code in the enterprise, see [Rolling Out Claude Code in the Enterprise](/en/resources/articles/claude-code-enterprise-rollout). The harness (sandbox, permissions, loops) is covered in [Enterprise agent harness](/en/resources/articles/enterprise-agent-harness).

## Versioned skills beat throwaway prompts

"Hardcoded secret", "over-permissive workflow" and "reachable dependency" have in-house definitions: your frameworks, exceptions and repos. We write them as **versioned skills**, reviewed in PRs like code. Every repository shares the same base. An improved rule lands everywhere the same day.

That is the approach we use with [Theodo](/en/case-studies/theodo): Software Factories for hundreds of developers, with standardised tools, agents and skills, plus the training teams need to adopt them. The Vibe Company can reinforce Theodo on this kind of work (experts, agile delivery, team embedding). Security in CI is one of the places where that standardisation pays off fastest: one forgotten rule in a single workflow is enough.

## Where to start

1. Inventory: repositories, CI workflows, secret vaults, scanners already wired in.
2. Turn on push protection and secret scanning where you can. Measure alert volume before adding an agent.
3. Wire the agent in **read / comment** mode on one or two critical repos. No autonomous merges.
4. Write 5 to 10 in-house rules as skills (secrets, Actions permissions, reachable deps).
5. Expand to deps and configs. Keep humans on auth, production secrets and IAM.

If you are moving an agent out of a POC, the same "least privilege + human approval" discipline applies: [From AI agent POC to production](/en/resources/articles/ai-agent-poc-to-production).

For the full offer (mapping, deployment, CI integration), see [AI agents to harden your product and stack](/en/ai-agents-product-hardening).

## FAQ

### Does a CI security agent replace Dependabot or secret scanning?

No. It sits on top of them. Without a reliable scanner, the agent has nothing solid to read. It triages, explains and prepares.

### Can it merge on its own when checks are green?

We do not recommend that for sensitive changes. The agent can group minor bumps and prepare the PR. Auth, secrets and IAM merges stay human.

### Should it run on every PR?

Yes for the base scan (secrets / touched deps / CI configs). Comment depth and mandatory human review should follow the risk of the diff.

### How is this different from Black October and the "harden a SaaS" article?

Black October = protect the agent. "Harden a SaaS" = the fleet. This article = the **CI link on every PR**, in depth.

## Put a security agent in your CI

The Vibe Company is an AI agency in Paris. We deploy agents and skills in your CI to scan secrets, dependencies and configs on every PR, with least privilege and a human approving.

[Book a call about your security CI →](https://cal.com/stangirard/thevibecompany)
