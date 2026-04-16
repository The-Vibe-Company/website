---
title: "I don't read my emails anymore. My agent classifies, archives, and briefs me."
slug: i-dont-read-my-emails-anymore
summary: "A 650-line SKILL.md file replaced my inbox zero ritual. The agent classifies every thread, archives noise, drafts replies from my knowledge vault, and generates a morning brief I review with two clicks. The system gets quieter every day."
publishedAt: 2026-04-16
complexity: advanced
topics: Personal OS, AI Agents, Automation, Claude Code
coverImage: /images/resources/i-dont-read-my-emails-anymore/cover-inbox-zero-agent.png
coverAlt: "A pile of chaotic envelopes on the left dissolving into a clean desk with a single card on the right"
---

Wednesday morning. I opened my terminal, typed `/inbox-zero`, and went to make coffee. When I came back, a page was open in my browser. Two threads needed a decision. Fourteen had already been archived. I clicked Approve on a client reply the agent had drafted using context from a call three weeks ago, kept a prospect thread visible for a follow-up on Friday, and closed the tab.

Total time in email that day: under two minutes.

I run three mailboxes. On a normal morning they collect 15-25 threads overnight. Before this skill, I spent 20 to 40 minutes sorting them. Not because the important ones were hard to answer. Because the mental cost of distinguishing a client follow-up from an SEO agency pitch from a Stripe receipt from a bookkeeping request consumed all the attention before I even started writing.

The skill that replaced that ritual is a folder in my repo. The brain is a 650-line `SKILL.md` file. No app. No SaaS. No API. A markdown file that tells Claude Code what to do with my mail.

## Classification, not discipline

Most inbox zero advice is about willpower. Process everything, touch it once, archive aggressively. That framing is wrong. The bottleneck is not discipline. It is classification.

Each thread has exactly one correct next action: archive, reply, forward to accounting, follow up in three days, capture the context for later, or leave it visible because I need to see it again. A human can make that call in five seconds per thread. But doing it 20 times in a row, mixed with spam and noise, turns a five-minute task into a 30-minute drain.

The skill encodes nine use cases. Every thread gets locked into one before anything happens:

`trash`. `cold_outbound_spam`. `finance`. `admin_security`. `reply`. `follow_up`. `waiting_or_follow_up`. `knowledge`. `fyi_relationship`.

Spam and cold outbound go straight to archive. Finance threads get forwarded to `fournisseurs.keobiz.fr` and archived. Security alerts get a risk summary and a Garden follow-up if the issue stays open. Everything else passes through a decision grid that checks who sent it, whether they exist in my [knowledge vault](https://github.com/The-Vibe-Company/granite), and whether I was the last person to write.

## The morning brief

The agent does not dump results into the terminal. It generates an HTML page and opens it locally.

The page has four zones. At the top, a scoreboard: 2 to handle, 3 signals, 14 auto, 4 done. Below that, "Handle now" shows only the threads that need a human click. Each card has the subject, the proposed action, and context chips the agent pulled from the vault: "known client", "meeting confirmed Friday", "attachment: scope doc". Below each card, four buttons: Approve, Keep visible, Archive, Comment.

Then "Good to know" for signals that matter but don't require action. A payment confirmation. A domain renewal in 30 days. A thank-you email from someone I ran a workshop with last week.

The automatic journal is collapsed by default. It lists what happened without my input. Eight cold outreach threads archived. Three vendor notices filed. Two Stripe receipts gone. Each rule has a toggle: keep it automatic, ask me next time, or pause it. And a comment field that persists across mornings, so I can annotate why a rule exists.

## The vault changes everything

Gmail filters can match a sender or a keyword. They cannot know that the person emailing me is a client I've been working with for six months, that I already discussed pricing in a call they don't have access to, or that the real answer to their question is in a Granite note about a technical constraint their CTO flagged.

Before classifying a thread, the skill calls `granite_research_topic` on the sender, the company, and the project. If they exist in the vault, the thread is never silently archived. If I was the last sender on a prospect thread and nobody replied, the skill proposes a follow-up draft. If someone is waiting on me and the answer depends on context scattered across three meetings and a contract, the skill pulls that context and writes a draft that sounds like I did the homework.

I wrote about how this vault works in [the personal OS article](/resources/articles/my-personal-os-lives-in-a-folder). The short version: 188 markdown notes, no embeddings, no vector store, a SQLite index and wikilinks. [Granite](https://github.com/The-Vibe-Company/granite) is the MCP server that teaches agents how to work with it. The inbox zero skill is the first real workflow that proved the architecture carries weight.

## Delegated rules

The system learns.

The first time I saw an Attio overdue digest, the skill asked me what to do. I said archive it. The second time, it asked again. I said always archive those. Now there is a rule in `state.json`:

```json
{
  "id": "attio-overdue-digests",
  "action": "auto_archive",
  "match": {
    "from_contains": ["team@mail.attio.com"],
    "subject_contains": ["tasks overdue"]
  }
}
```

Same for Zendesk article reminders. Squarespace domain renewals. Stripe payment receipts. Keobiz billing notices. Claude and Google Workspace vendor emails. Each one started as a question, became a rule, and now runs silently in the automatic journal.

The bookkeeping requests from my accountant are different. Those get forwarded to my associate Antoine, but only when the request actually lists documents he owns. The rule checks substance before forwarding. That distinction — forward when actionable, skip when informational — is the kind of judgment a Gmail filter cannot express.

## The bridge

When I click a button in the morning brief, the decision is saved to a local JSON file through a Python micro-server running on port 8765. The agent reads that file and executes the approved actions without a new chat message.

The loop is: open the brief, click, close the tab, let the agent apply. No copy-paste. No "yes, do it." The click is the approval.

## Under the hood

```
skills/vibe_inbox-zero/
  SKILL.md                    # 650 lines — classification, rules, approval gates
  state.json                  # delegated rules, archive posture, output config
  scripts/state.py            # CLI to inspect or update rules
  scripts/review_bridge.py    # micro-server for click persistence
  templates/morning-brief-template.html
  runtime/briefs/             # one HTML per pass
  runtime/review-state/       # JSON snapshots of decisions
```

No database. No backend. The whole thing is a SKILL.md that encodes business rules, a JSON that remembers preferences, and a template that the agent fills with data each morning. It runs identically on Claude Code and Codex because the logic is in the file, not in the runtime. That is [what MCP is actually for](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done) — encoding methodology, not exposing endpoints.

---

The system is not finished. It will never be finished. Every morning that forces me to explain something twice is a morning where the skill failed. The bar is simple: if I had to make the same classification call yesterday and today, that call should already be a rule by tomorrow.

650 lines got me to inbox zero in two minutes. The next 650 will get me there in zero.
