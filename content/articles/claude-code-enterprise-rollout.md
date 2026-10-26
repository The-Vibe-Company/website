---
title: "Rolling Out Claude Code in the Enterprise: Security, Settings and Method"
seoTitle: "Claude Code enterprise rollout guide | The Vibe Company"
slug: claude-code-enterprise-rollout
translationKey: claude-code-enterprise
language: en
summary: "How to roll out Claude Code across a mid-size or large company: managed settings, permissions, data, pilot and measurement. A practical guide backed by official docs."
publishedAt: 2026-10-13
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/deployer-claude-code-entreprise/cover-mascotte-v3.webp
coverAlt: "The mascot hands keys to developers at the gate of a citadel protected by a shield dome"
ogImage: /images/resources/deployer-claude-code-entreprise/cover-mascotte-v3.webp
---

Installing Claude Code on one laptop is quick. Rolling it out to 50 or 500 developers, under rules your security team accepts, is a different project.

Here's what to decide before rollout: where settings live, what the agent can do, which data it sees, and how to tell if it's worth it. Everything about the product comes from the [official Claude Code documentation](https://code.claude.com/docs/en/settings). It changes fast, so check it again when you deploy.

## Four decisions before you hand out access

1. **Plan and authentication.** Server-managed settings are limited to [Claude for Teams and Claude for Enterprise](https://code.claude.com/docs/en/server-managed-settings). With individual API keys, you lose central control.
2. **Who owns the rules.** On Anthropic's side, only Owner or Primary Owner roles can edit managed settings. Decide who holds them internally (usually platform or security, not each team).
3. **What the agent runs without asking.** This is the most sensitive call. Shell commands, network access, off-limits files.
4. **How you measure.** If you don't set metrics upfront, the pilot ends on a gut feeling.

## Managed settings: server or endpoint?

Claude Code reads settings from several files, from personal to global, and an organization can enforce its own on top ([Settings docs](https://code.claude.com/docs/en/settings)). There are two ways to enforce them:

| Approach | Best for | How it works |
| --- | --- | --- |
| Server-managed settings | Companies without MDM, unmanaged devices | Configured in the claude.ai console, fetched at startup and refreshed hourly |
| Endpoint-managed settings | Companies with MDM or endpoint management | Deployed through OS policies (macOS managed preferences, Windows registry) or managed settings files |

Source: [Server-managed settings](https://code.claude.com/docs/en/server-managed-settings). Devices need to reach `api.anthropic.com` for the server option.

Our advice: if you already run MDM, use it. Your rules then follow the same path as the rest of your security policy.

## Permissions: allow, ask, deny

Claude Code separates what it can do alone (`allow`), what needs confirmation (`ask`) and what is blocked (`deny`) ([Permissions docs](https://code.claude.com/docs/en/permissions)). A sensible baseline:

| Category | Starting rule | Why |
| --- | --- | --- |
| Reading repository code | allow | That's the core use |
| Tests, lint, build | allow | Known commands, no external effect |
| Writing files | ask at first, allow later | Teams build trust during the pilot |
| `.env` files, secrets, keys | deny | The agent doesn't need them to code |
| `git push`, deploys, production commands | deny or ask | Keep a human on anything leaving the laptop |
| Network to unknown domains | ask | Limit leaks and surprise dependencies |

Put these rules in managed settings. Developers can tighten them, not loosen them.

## Data: what the agent actually sees

The agent sends the model the context it needs: code snippets, command output, files it reads. Before the pilot, ask your DPO and CISO three questions:

- **Which repositories are in scope?** Start with ones holding no personal data and no plaintext secrets.
- **Which retention terms apply?** They depend on your contract. Read them in your Anthropic commercial terms, not in a blog post (this one included).
- **What about sensitive data?** For health data in France, HDS rules apply on top. See [our article on AI and health data](/en/resources/articles/ai-health-data-hds-france).

## The pilot: one or two teams

Don't switch everyone on the same day. A pilot that holds up:

1. **Pick one or two volunteer teams**, on representative but non-critical repos.
2. **Write a `CLAUDE.md` per repo**: conventions, test commands, known pitfalls. Claude Code reads it at startup ([Memory docs](https://code.claude.com/docs/en/memory)). It's often what separates a useful agent from one that improvises.
3. **Set two or three metrics before starting**: ticket-to-PR time, share of PRs passing review without major rework, time spent on repetitive tasks (migrations, tests).
4. **Review weekly** what got in the way: permissions too strict, missing context, poorly chosen tasks.
5. **Decide at the end**: expand, adjust, or stop.

## Claude Code, Codex, or both?

Many companies also trial [OpenAI's Codex](https://developers.openai.com/codex), which has its own sandbox and approval modes. The choice mostly depends on your existing contracts and data policy. The method stays the same: central settings, explicit permissions, a measured pilot. If teams use several agents, keep equivalent rules everywhere. Otherwise usage drifts toward the least governed tool.

## What we do at The Vibe Company

The Vibe Company is an AI agency in Paris, founded in 2024 by Stan Girard and Antoine Dewez (ex-Theodo, ex-Stockly), backed by Y Combinator (W24). We've run dozens of projects, with three specialties: HDS and security, frontend, DevOps.

We use these coding agents every day to ship. On a rollout, we set up managed settings and permissions, write `CLAUDE.md` files with your teams and train people during the pilot. Useful for procurement: we don't claim any security certification.

## FAQ

**Do I need an Enterprise plan to roll out Claude Code?**
Not to use it, but server-managed settings require Claude for Teams or Enterprise. Without them, use your MDM or managed settings files.

**Can a developer bypass the rules?**
Managed settings take precedence over user and project settings, per the [documentation](https://code.claude.com/docs/en/settings). That doesn't replace the usual controls: repo access rights, branch protection, code review.

**How long does a rollout take?**
Setup first, then a pilot before you expand. How long it takes mostly depends on your security sign-off process.

## Let's talk about your rollout

Want to scope a Claude Code or Codex pilot for your teams? [Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).
