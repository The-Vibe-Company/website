---
title: "I don't read my emails anymore. My agent classifies, archives, and briefs me."
slug: i-dont-read-my-emails-anymore
summary: "A 650-line SKILL.md file replaced my inbox zero ritual. Here is exactly how it works, and how you can build one yourself."
publishedAt: 2026-04-16
complexity: advanced
topics: Personal OS, AI Agents, Automation, Claude Code
coverImage: /images/resources/i-dont-read-my-emails-anymore/cover-inbox-zero-agent.png
coverAlt: "A pile of chaotic envelopes on the left dissolving into a clean desk with a single card on the right"
---

Wednesday morning. I opened my terminal, typed `/inbox-zero`, and went to make coffee. When I came back, a page was open in my browser. Two threads needed a decision. Fourteen had already been archived. I clicked Approve on a client reply the agent had drafted using context from a call three weeks ago, kept a prospect thread visible for a follow-up on Friday, and closed the tab.

Total time in email that day: under two minutes.

I run three mailboxes. On a normal morning they collect 15-25 threads overnight. Before this system, I spent 20 to 40 minutes sorting them. Not because the important ones were hard to answer. Because the mental cost of distinguishing a client follow-up from an SEO pitch from a Stripe receipt from a bookkeeping request consumed all the attention before I even started writing.

The system that replaced that ritual is a Claude Code skill. A 650-line `SKILL.md` file, a JSON config, a Python micro-server, and an HTML template. No app. No SaaS. No API key beyond Claude itself. This article explains the architecture, then walks you through building your own.

## How it works

The skill does four things in sequence.

**1. Pull and classify.** The agent connects to Gmail via MCP, pulls every thread in the inbox, and classifies each one into a use case. Mine has nine: `trash`, `cold_outbound_spam`, `finance`, `admin_security`, `reply`, `follow_up`, `waiting_or_follow_up`, `knowledge`, `fyi_relationship`. Every thread gets locked into exactly one before anything happens.

**2. Apply rules.** Spam and cold outbound go straight to archive. Finance threads get forwarded to my accountant and archived. Vendor notices I have already delegated (Stripe receipts, Zendesk reminders, Attio digests) get auto-archived via rules stored in a `state.json` file. The rules grow over time. Every time I tell the agent "always archive those," it becomes a rule I never see again.

**3. Research and draft.** For threads that need a reply, the agent searches my knowledge vault for context: who this person is, what we discussed, open items from prior calls. Then it writes a draft that sounds like I did the homework. This is the part that turns email from a 30-minute chore into a 2-minute review.

**4. Generate the brief.** Instead of dumping results into the terminal, the agent fills an HTML template and opens it locally. A scoreboard at the top. Action cards for threads that need a click. Signal cards for things worth knowing. An automatic journal listing everything handled without my input. Four buttons per card: Approve, Keep visible, Archive, Comment.

The click is the approval. A Python micro-server on `localhost:8765` persists each decision to a JSON file. The agent reads that file and executes. No copy-paste. No chat confirmation.

That is the system. Now let me show you how to build one.

## Step 1: create the skill folder

A Claude Code skill is a folder with a `SKILL.md` file. That file is both the documentation and the instruction set. When you invoke the skill, Claude reads it and follows it.

```
skills/inbox-zero/
  SKILL.md
  state.json
  scripts/review_bridge.py
  templates/morning-brief.html
  runtime/briefs/
  runtime/review-state/
```

The `SKILL.md` is the brain. `state.json` remembers your preferences. `review_bridge.py` handles click persistence. The template is the UI. The `runtime/` folders hold generated outputs.

Create the folder and start with a minimal `SKILL.md`:

```yaml
---
name: inbox-zero
description: "Process all inbox mail, classify threads, archive noise, draft replies, and generate a morning brief."
user-invocable: true
argument-hint: [mailbox or inbox-zero request]
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Agent
  - AskUserQuestion
---
```

The YAML frontmatter tells Claude when to trigger the skill. The `description` matters. Claude uses it to decide whether your skill matches a request. Be explicit about what it does.

## Step 2: define your use cases

Below the frontmatter, write the classification rules in plain English. This is the core of the skill. Claude reads these rules and applies them to every thread.

Start with the use cases that cover 90% of your inbox:

```markdown
## Use case classification

Classify each thread into exactly one use case:

### `trash`
Mass spam, stale reminders, zero-value noise.
Action: archive directly.

### `cold_outbound_spam`
Automated agency outreach, generic lead gen, recruiter spam.
Action: archive directly.

### `finance`
Supplier invoices with attachments.
Action: forward to accounting@yourcompany.com, then archive.

### `reply`
Someone is waiting for an answer.
Action: read the full thread, search for context, draft a reply.

### `follow_up`
I was the last sender, no reply arrived.
Action: keep visible, propose a follow-up draft in 3-4 days.

### `fyi`
Relationship signal, no action needed.
Action: summarize, leave visible for manual archive.
```

The key insight: you are not writing code. You are writing judgment. Each use case describes the decision boundary the agent should apply. The more specific you are about edge cases, the better the classification gets.

My production skill has paragraphs under each use case explaining when to pick it over a neighboring one. For example, when a thread looks like `finance` but the attachment is a contract, not an invoice, it should go to `knowledge` instead. Those distinctions are what make the system accurate.

## Step 3: add approval gates

You do not want the agent silently archiving ambiguous threads. Write the rules for what requires human approval:

```markdown
## Approval gates

Before archiving:
- `trash` and `cold_outbound_spam` can be archived directly.
- Everything else: classify first, explain the action, wait for approval.
- Never silently archive a thread where someone might be waiting on a reply.

Before sending:
- Always show the draft. Never send without approval unless I explicitly say "send now."

Before forwarding:
- Check whether the document was already forwarded. Avoid duplicates.
```

This is the difference between a useful system and a dangerous one. The gates ensure the agent is aggressive on obvious noise and conservative on everything else.

## Step 4: write the delegated rules

`state.json` is where the system learns. Every time you tell the agent "always archive those," the rule goes here:

```json
{
  "version": 1,
  "archive": {
    "auto_archive_classes": ["trash", "cold_outbound_spam"]
  },
  "delegated_thread_rules": [
    {
      "id": "stripe-receipts",
      "action": "auto_archive",
      "match": {
        "from_contains": ["notifications@stripe.com"],
        "subject_contains": ["Payment of"]
      }
    },
    {
      "id": "vendor-notices",
      "action": "auto_archive",
      "match": {
        "from_contains": ["workspace-noreply@google.com"]
      }
    }
  ]
}
```

Add a section in your `SKILL.md` telling the agent to read this file:

```markdown
## Delegated rules

Read `state.json` at the start of every pass. If a thread matches a delegated rule,
apply the action without asking. These are standing decisions I have already made.

If I say "always archive those" or "auto-archive this kind of mail," add a new rule
to `state.json` so I never see it again.
```

My production config has a dozen rules. Each started as a question the agent asked me, then became a line in the JSON. The system gets quieter every day.

Some rules are not simple archive-or-skip. My accountant's bookkeeping requests get forwarded to my associate, but only when the request lists documents he actually owns. The rule checks substance before forwarding:

```json
{
  "id": "bookkeeping-request",
  "action": "keep_visible_and_substance_check",
  "forward_candidate": "associate@yourcompany.com",
  "forward_when": "the request lists documents the associate owns; skip when informational"
}
```

That distinction is judgment a Gmail filter cannot express.

## Step 5: build the review bridge

When you click a button in the morning brief, the decision needs to go somewhere the agent can read it. A 120-line Python server handles this:

```python
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path

HOST = "127.0.0.1"
PORT = 8765
STORAGE = Path("runtime/review-state")

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        payload = json.loads(self.rfile.read(length))

        key = payload.get("key")
        STORAGE.mkdir(parents=True, exist_ok=True)
        path = STORAGE / f"{key}.json"
        path.write_text(json.dumps(payload, indent=2))

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode())

    def do_GET(self):
        # health check and state retrieval
        self.send_response(200)
        self.end_headers()

ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
```

The morning brief's JavaScript calls `fetch("http://127.0.0.1:8765/state", ...)` on every button click. The agent reads the resulting JSON file to know what you approved. The loop is: open the brief, click, close the tab, let the agent apply.

## Step 6: design the morning brief

The morning brief is an HTML file the agent generates by filling a template. The structure matters more than the design:

**Scoreboard.** One line. "2 to handle, 3 signals, 14 auto, 4 done." In ten seconds, I know where I stand.

**Handle now.** Cards for threads that need a decision. Each card shows the subject, the proposed action, and context chips ("known client", "meeting Friday", "attachment: scope doc"). Below each card: Approve, Keep visible, Archive, Comment.

**Good to know.** Signals that matter but don't need action. A payment confirmation. A domain renewal in 30 days. A thank-you from a workshop participant.

**Automatic journal.** Collapsed by default. Lists everything handled without my input. Each rule has a toggle: keep it automatic, ask me next time, or pause it. And a comment field that persists across mornings.

Tell the agent to use the template in your `SKILL.md`:

```markdown
## Output format

Default output is a local HTML brief, not chat text.

Copy `templates/morning-brief.html` into `runtime/briefs/brief-YYYY-MM-DD.html`.
Fill the data block at the top of the script with the classified threads.
Open the file locally.
Read approvals from the review bridge JSON after the user clicks.
```

The template is the most labor-intensive part to build the first time. But once it exists, the agent just fills the data and opens it. I iterated on mine over a week. Start ugly, improve daily.

## Step 7: connect a knowledge vault (optional but transformative)

Gmail filters match a sender or a keyword. They cannot know that the person emailing you is a client you have been working with for six months, that you discussed pricing in a call three weeks ago, or that the answer to their question is in a note from a technical constraint their CTO flagged.

I use [Granite](https://github.com/The-Vibe-Company/granite), the MCP server I built for [my personal OS](/resources/articles/my-personal-os-lives-in-a-folder). Before classifying a thread, the skill searches the vault for the sender, the company, and the project. If they exist, the thread is never silently archived. If someone is waiting on me and the answer depends on context scattered across meetings and contracts, the skill pulls that context and writes a draft that sounds informed.

You do not need my vault. Any structured knowledge source works. A folder of markdown notes. A Notion database via MCP. A local SQLite store with client and project data. The point is: give the agent memory beyond the inbox. The classification jumps from "sender matching" to "relationship-aware triage" the moment the agent can look up who someone is.

Add it to your `SKILL.md`:

```markdown
## Context research

Before classifying a thread, check whether the sender, company, or project
exists in the knowledge vault.

Use that as a signal for:
- importance (known contact vs. cold sender)
- whether the thread deserves a draft reply
- what context to include in the draft

If a thread is classified as `reply`, search the vault for prior decisions,
open items, and relationship context before drafting.
```

## What this teaches about skills

The inbox-zero skill is 650 lines of markdown. No compiled code. No deployed service. A file that encodes business rules, a JSON that remembers preferences, a template that the agent fills with data each morning, and a bridge that persists clicks to disk.

It runs identically on Claude Code and Codex because the logic is in the file, not in the runtime. That is [what MCP servers are actually for](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done): encoding methodology, not just exposing endpoints. A skill is the same idea applied to workflows instead of tools.

The system is not finished. It will never be finished. Every morning that forces me to explain something twice is a morning where the skill failed. The bar is simple: if I made the same classification call yesterday and today, that call should already be a rule by tomorrow.

650 lines got me to inbox zero in two minutes. The next 650 will get me there in zero.
