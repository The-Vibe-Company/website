---
title: "AI security agent in CI/CD: a tested workflow, PR by PR"
seoTitle: "AI security agent in CI/CD: a tested workflow"
slug: ci-security-agent
translationKey: ci-security-agent
language: en
summary: "AI security agent in CI/CD: two workflows run through gitleaks and zizmor on November 11, 2026, three CI traps, and what GitHub changes on December 2, 2026."
publishedAt: 2026-11-05
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agent-securite-ci/cover-mascotte.webp
coverAlt: "The Vibe Company mascot inspecting a CI pipeline with secret, package and config scanners in front of a security gate"
ogImage: /images/resources/agent-securite-ci/cover-mascotte.webp
---

On November 11, 2026, two review agent workflows went through zizmor: 6 findings on the risky one, none on the hardened one in default mode, even though the hardened agent still reads the PR text. On December 2, 2026, GitHub will also block `pull_request_target` by default in public repositories.

An AI security agent in CI/CD doesn't merge on its own. Its rule fits in one line: the agent proposes and prepares, a human approves anything irreversible, such as rotating a production secret, widening permissions, or merging an auth diff. This guide walks through both workflows, the three ways CI traps such an agent, and GitHub's policy. Securing the agent itself belongs to [Black October](/en/resources/articles/black-october-ai-agent-security). What CI doesn't see has its own article: [AI security agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas).

## The November 11, 2026 test: two AI security agent workflows in CI/CD

The November 11, 2026 test, on a demo repository, gave three results: gitleaks 8.30.1 flagged 2 leaks in a fake AWS key pair (exit code 1, 1 commit scanned in 125 ms), and zizmor 1.32.0 showed 6 findings on the risky workflow and none on the hardened one in the default persona (3 minor findings, 2 low and 1 info, in auditor mode).

The risky workflow triggers the agent on `pull_request_target`, with `permissions: write-all`, actions pinned by tag, and the PR title and body pasted into the prompt:

```yaml
name: ai-review-risky
on:
  pull_request_target:
    types: [opened, synchronize]
permissions: write-all
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - uses: tj-actions/changed-files@v45
        id: changed
      - name: AI security review
        run: |
          echo "Review this PR: ${{ github.event.pull_request.title }} ${{ github.event.pull_request.body }}" > prompt.txt
          ./ai-agent --prompt prompt.txt --tools "bash,gh"
        env:
          AI_API_KEY: ${{ secrets.AI_API_KEY }}
          GH_TOKEN: ${{ secrets.ADMIN_PAT }}
```

The hardened workflow keeps the same agent, but uses `pull_request`, reads the repository with `contents: read`, pins checkout to a SHA and passes the PR body through an environment variable, in comment mode:

```yaml
name: ai-review-hardened
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  contents: read
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          persist-credentials: false
      - name: AI security review (comment only)
        run: ./ai-agent --prompt-file .github/review-prompt.md --body-from-env --mode comment-only
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
          GH_TOKEN: ${{ github.token }}
```

On a PR from a fork, GitHub drops this token to read-only, so the agent's comment will only go through on PRs from the repository itself.

The zizmor output, trimmed to the result lines:

```text
$ zizmor --offline .github/workflows/ai-review-risky.yml
warning[artipacked]: credential persistence through GitHub Actions artifacts
error[dangerous-triggers]: use of fundamentally insecure workflow trigger
error[template-injection]: code injection via template expansion
error[template-injection]: code injection via template expansion
error[unpinned-uses]: unpinned action reference
error[unpinned-uses]: unpinned action reference
11 findings (5 suppressed, 3 unsafe fixes): 0 informational, 0 low, 1 medium, 5 high

$ zizmor --offline .github/workflows/ai-review-hardened.yml
No findings to report. Good job! (3 suppressed)
```

The risky workflow's `write-all` doesn't show up in this mode. With `--persona=auditor`, zizmor shows 11 findings on the risky workflow, including `excessive-permissions` and 2 `secrets-outside-env`. On the hardened one, this mode reports the 3 minor findings: `undocumented-permissions`, `anonymous-definition`, and `concurrency-limits`.

This test has limits. They matter as much as the result: 2 workflows written for the occasion, 1 run, a static analysis of a fictional agent, nothing executed on GitHub. It isn't a benchmark.

The most useful result lies in what zizmor doesn't see. The tool flags template injection, a shell injection, and doesn't judge prompt injection: the hardened workflow passes while the agent still reads the PR body, a text written by the PR's author. Which means a green zizmor doesn't exempt you from comment mode, a minimal token or the trusted-PR rule.

## CI becomes the bottleneck when agents write the PRs

According to [Octoverse 2026](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/), more than 40% of pull requests on GitHub started with an agent's first draft in September 2026, up from 17% in March. For September alone, that comes to 110 million PRs. Detection keeps pace. Octoverse counts 5.8 billion push protection scans this year, nearly four times 2025's pace, and more than 30 million merged Dependabot PRs, about double.

Secrets show the scale. GitGuardian's [State of Secrets Sprawl 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) counts 28.65 million new hardcoded secrets in public GitHub commits in 2025, up 34% in a year. Claude Code-assisted commits leak at 3.2%, versus 1.5% across all public commits, a gap that matters without reading as a simple tool failure, GitGuardian notes. More than 64% of the credentials valid in 2022 were still valid at the January 2026 retest.

OWASP files this problem under [CICD-SEC-6, Insufficient Credential Hygiene](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-06-Insufficient-Credential-Hygiene): credentials printed to pipeline console output, and often left unrotated for years. Its fix prefers temporary credentials over static ones. Runners count too. In GitGuardian's Shai-Hulud 2 analysis, 59% of compromised machines were CI/CD runners.

## CI scanners: the agent adds triage

Scanners detect, and the agent handles what comes after the alert on the current PR:

| On every PR | Classic scanner | AI security agent in CI/CD |
| --- | --- | --- |
| Secrets | Blocks or alerts on a pattern | Links the key to the service and to the risk if it is still valid, prepares removal and rotation |
| Dependencies | Opens or flags a version bump | Checks whether the vulnerable function is called, reads the changelog, groups minor bumps |
| Configs and IaC | Flags a generic drift | Explains the drift on this PR and proposes least privilege |
| Follow-up | Red check, forgotten ticket | Sums up what blocks the merge, what can wait, what needs a human decision |

GitHub's remote MCP server lets an agent run secret scanning, but its results stay ephemeral and aren't recorded as alerts. This on-demand scan therefore complements the CI scan without replacing it.

## Three CI traps for a security agent

### An action moved under a tag: tj-actions/changed-files

In March 2025, the [tj-actions/changed-files](https://github.com/advisories/GHSA-mrrh-fwg8-r2c3) action was hit by a supply chain attack that reached more than 23,000 repositories. The attackers moved existing version tags to a malicious commit, active from March 14 to 15, 2025. The script read the Runner Worker process memory and printed secrets in the workflow logs. For repositories with public logs, anyone could read those secrets. [CISA](https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction) asked teams to rotate every identified secret immediately and to treat it as compromised. The GitHub advisory lists a fix in v46.0.1.

The fix starts with pinning. [GitHub's docs](https://docs.github.com/en/actions/reference/security/secure-use) ask you to pin every action to a full commit SHA, and to keep a tag only if you trust its author. The same docs rank the [workflow dependency lockfile](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles) higher, as it supersedes SHA pinning for repositories that adopt it. This `.github/workflows/actions.lock` file is generated by the GitHub CLI extension `gh actions-lock`. The docs say never to edit it by hand. It also pins transitive dependencies, but not reusable workflows. It controls neither secrets nor the runner image. Add the `permissions` key, which limits the [GITHUB_TOKEN](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token) to what a workflow or job strictly needs.

### `pull_request_target`: blocked by default on December 2, 2026

A GitHub default policy blocks the `pull_request_target` event in public repositories. It currently runs in "evaluate" mode. On December 2, 2026, GitHub will enforce it for affected repositories, and it won't apply to private or internal repositories, according to [GitHub's docs](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target).

The choice of event matters. With `pull_request`, GitHub restricts the GITHUB_TOKEN to read-only and withholds other secrets for PRs from forks. With `pull_request_target`, the docs require that the PR's code only ever be inspected as data, never executed. GitHub names the actions/checkout flag `allow-unsafe-pr-checkout` so that it stands out in review. If your agent doesn't need extra secrets, the docs advise `pull_request`.

### A prompt built from the PR text: PromptPwnd

Aikido Security described the pattern in [PromptPwnd](https://www.aikido.dev/blog/promptpwnd-github-actions-ai-agents), published on December 4, 2025 and updated on March 17, 2026. Untrusted user input enters the prompt, the AI agent runs privileged tools, and secrets leak or workflows change. Aikido names Gemini CLI, Claude Code, OpenAI Codex and GitHub AI Inference. Google's Gemini CLI repository was affected, and Google patched it within four days of Aikido's disclosure. Aikido also claims that at least 5 Fortune 500 companies are impacted, a vendor figure. Its recommendation: avoid injecting untrusted user input into an AI prompt, or else sanitize and validate it.

AI action vendors give the same advice. The [claude-code-action security doc](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md) limits triggering to users with write access. It marks the `allowed_non_write_users` parameter, which bypasses that check, as "RISKY". It advises against a personal access token, which prompt injection can recover, and asks for the GITHUB_TOKEN, scoped to the job and expired at its end. Its content sanitizing lowers the risk without removing it. The [claude-code-security-review](https://github.com/anthropics/claude-code-security-review) README limits the action to trusted PRs, since it isn't hardened against prompt injection.

## The agent's pipeline, from local hook to review

The pipeline starts before the push. It goes through a local hook for secrets, then push protection on the forge side. On every PR, the agent then does three reads of the same diff: secrets, dependencies and configs. It comments on the diff. It blocks only on written rules: a hardcoded secret, a removed access control, a CI permission widened without justification.

Review follows risk. A PR that touches `auth/`, crypto, cloud policies or workflows goes through mandatory human review, even with a favorable opinion from the agent. Octoverse puts it its own way: "Review is where developers shape what comes back". Every night and every week, the agent picks up what remains open outside the day's diff.

## AI security agent in CI/CD: where to start

1. Take inventory of repositories, CI workflows, secret vaults and the scanners already in place.
2. Turn on push protection and secret scanning, then measure the alert volume.
3. Plug the agent in read and comment mode into one or two critical repositories, with no autonomous merge.
4. Write 5 to 10 rules as versioned skills.
5. Expand next, keeping a human on auth, production secrets and IAM.

To go further: [Claude Code enterprise rollout](/en/resources/articles/claude-code-enterprise-rollout) to frame the tool, [Enterprise agent harness](/en/resources/articles/enterprise-agent-harness) for the sandbox and permissions, and [AI agent from POC to production](/en/resources/articles/ai-agent-poc-to-production) if your agent is coming out of a POC.

## FAQ

### Does an AI security agent in CI/CD replace Dependabot or secret scanning?

No, it builds on them. Scanners detect, the agent triages, explains and prepares the fix on the PR. Even secret scanning run by an agent through GitHub's MCP server isn't recorded as an alert. So keep the CI scanners as the base, and the agent as a second read of the diff.

### Can it merge on its own when checks are green?

Not on sensitive changes. Rotating a production secret, widening permissions or merging an auth diff need a human decision. The claude-code-action doc already limits triggering to users with write access. Start in read and comment mode, with no autonomous merge.

### Should it run on every PR?

Yes for the three base reads: secrets, dependencies and configs. Depth follows risk. PRs on `auth/`, crypto, cloud policies or workflows keep their human reviewer. For PRs from forks, prefer `pull_request`, which restricts the GITHUB_TOKEN to read-only and withholds other secrets.

### How is this different from the "harden a SaaS" article?

This article covers the CI link, on every pull request: the agent's workflow, its traps and their fixes. [AI security agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas) covers what CI doesn't see. Black October is about securing the agent itself. The three articles read together, in the order of your main risk.

## Put an AI security agent in your CI/CD

You want to plug a security review agent into your repositories, in comment mode, with minimal permissions and a human on anything irreversible. Bring your workflows and your current scanners.

[Book a call about your CI security](https://cal.com/stangirard/thevibecompany)
