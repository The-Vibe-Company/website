---
title: "I don’t have a productivity stack anymore. I have an agent OS."
slug: i-dont-have-a-productivity-stack-anymore-i-have-an-agent-os
language: en
summary: "Productivity stacks help humans jump between apps. An agent OS gives agents memory, workflows, tools, permissions, and review gates so they can operate work with you."
publishedAt: 2026-05-03
complexity: advanced
topics: Agent Design, Personal OS, AI Operations
coverImage: /images/resources/i-dont-have-a-productivity-stack-anymore-i-have-an-agent-os/cover.png
coverAlt: "A warm editorial operating board shows an Agent OS connecting Inbox, Publish, Sources, Vault, Meetings, and Skills around work operated by agents"
ogImage: /images/resources/i-dont-have-a-productivity-stack-anymore-i-have-an-agent-os/cover-og.png
---

This week, I asked an agent to improve a published article.

It read the site repo, pulled context from my memory system, rewrote the piece, created a run folder, opened a GitHub pull request, waited for build and Vercel checks, gave me the preview link, and merged only after I said “go.”

That is not a productivity stack.

A productivity stack would have stored the draft, the notes, the task, the pull request, and the preview in five different places for me to operate manually.

This was different. The work moved through a system.

I do not mean “OS” literally. I mean an operating layer: memory, workflows, tools, agents, permissions, and review gates arranged so repeated work can be operated by agents without me re-explaining everything from scratch.

The shortest version is this:

Apps store work.

Skills operate work.

That is the shift.

## The productivity stack was built for humans

Most productivity tools assume a human is the operator.

The human decides where to look. The human remembers the workflow. The human knows which app contains the client history, which folder has the draft, which thread contains the decision, which task is still active, and which rule should override the default.

That works until you invite agents into the loop.

An agent can search email, write files, open GitHub, inspect a repo, draft a recap, or call an MCP server. But if every tool is just another separate interface, the agent still depends on you to explain the operating model every time.

That is why prompt libraries always felt wrong to me. The prompt kept getting longer because the work was not actually captured anywhere else.

I wrote about the first version of this system in [My personal OS lives in a folder](/resources/articles/my-personal-os-lives-in-a-folder). That article was mostly about memory: markdown files, Granite, links, source notes, no vector-store-first architecture.

This article is about the next layer.

Memory is not enough. Agents also need workflows.

## An agent OS has five layers

My personal OS has five layers.

First, a memory layer. That is Granite: my local knowledge vault of typed markdown notes, sources, syntheses, outputs, people, organizations, meetings, links, and graph context. By memory, I mean explicit external memory the agent can read and update, not hidden model memory.

Second, a workflow layer. These are skills. In this article, a skill means a packaged workflow with triggers, instructions, tools, checks, boundaries, and expected artifacts. Not a prompt snippet. Anthropic now describes [skills](https://docs.anthropic.com/en/docs/claude-code/skills) as a first-class way to extend Claude Code. For me, they became the workflow layer of the OS.

Third, a tool layer. This is where MCP servers, APIs, browser automation, GitHub, Superhuman, files, terminal, and the website repo live. [MCP](https://modelcontextprotocol.io/introduction) matters because it standardizes tool access, but tool access is only the beginning. A tool gives an agent verbs. The OS gives those verbs grammar.

Fourth, an agent layer. Different models and agent clients can enter the same system. Claude, Codex, Hermes, and subagents can all work from the same memory and workflow rules. The model can change. The OS should still hold.

Fifth, a governance layer. Permissions, review gates, pull requests, previews, logs, run reports, and explicit “do not send / delete / merge without approval” rules. OpenAI's own [agent guide](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) frames agents as systems made of instructions, tools, and guardrails. The guardrails are not decoration. They are what let the system touch real work.

An operating surface is any bounded place where an agent can act safely enough to be useful: a run directory, a draft email, a reviewed note, a pull request, a preview link, a report, a branch, a checklist.

A productivity stack stores work across apps.

An agent OS turns repeated work into operating surfaces.

In my system, the workflow layer currently shows up through six owner skills.

## 1. Inbox Zero: my inbox is an operating queue

I do not want an agent to “manage my email.”

That sentence is too vague. It gives the agent a tool and no policy.

What I want is narrower: triage the inbox according to my rules, archive narrowly defined low-risk categories, preserve anything ambiguous or sensitive, never send, never delete, never mark spam, never unsubscribe, and write a report of what happened.

That is what the Inbox Zero skill owns.

It knows the difference between current business threads, legacy context, personal mail, notifications, billing, security alerts, and client conversations that should be handled conservatively.

The important part is not that the agent can call Superhuman. The important part is that the agent knows the triage policy around Superhuman.

A good run does not end with “I read your emails.” It ends with a cleaned queue, preserved actionables, and a report: what was archived, what was left alone, and which categories need my decision.

Safer does not mean safe by default. It means the authority boundary is explicit. Reading, archiving, drafting, sending, deleting, and unsubscribing are not the same permission.

That is an OS behavior.

## 2. Publishing: a blog post is an output, not the workflow

A weak publishing prompt says: write a blog post.

A real publishing workflow is longer.

Brief. Internal research. External research. Outline. Draft. Critique. Revision. Internal-linking plan. Asset decisions. Repo packaging. Build checks. Local preview. GitHub pull request. Vercel preview. Merge only when approved.

That is why publishing is a skill in my system.

The skill does not just write. It carries the whole chain. It creates a run directory. It writes artifacts. It checks the website repo. It adds internal links. It records which sources were used and which were rejected. It opens a PR instead of pretending a draft is published.

A typical run leaves behind `brief.md`, `research.md`, `outline.md`, `draft.md`, `review.md`, `assets.json`, `semantic-cocoon.md`, and `publish-report.md`. The external artifact is not a chat response. It is a branch, a PR, a preview URL, and a build result.

We used exactly that workflow to improve the article on agent security and authority. The agent researched the angle, rewrote the article, opened a PR, waited for checks, gave me the preview, and merged only when I asked.

A productivity app would have stored the draft.

The agent OS moved the draft through the publishing system.

That distinction matters because content quality is not only prose. It is provenance, positioning, internal links, metadata, visuals, preview validation, and a safe production gate.

## 3. Source ingest: bookmarks do not compound

Most of my saved links used to die quietly.

They sat in a browser, a read-later app, a Slack DM to myself, or a note called “interesting.” They might be useful later, but only if I remembered they existed and remembered why they mattered.

An agent OS cannot treat sources like that.

When something external matters, it needs to enter memory with provenance. Who wrote it? What is the claim? What does it add? Is it a raw source, a working note, or a synthesis? Which existing ideas should it connect to? Is it durable or just noise?

That is the job of source ingest.

The goal is not to summarize the internet. The goal is to keep the few external things that should change how the system thinks.

This is also why I care about typed memory. A source should preserve what was actually said. A synthesis should connect and interpret. An output should stay visibly derived. If those collapse into one bucket, agents start treating every note as equally trustworthy.

A bookmark saves a URL.

Source ingest turns a source into usable memory.

## 4. Vault gardening: memory rots unless someone maintains it

A personal OS can still become a junk drawer.

In my experience, it will become one by default.

Notes get duplicated. Drafts become stale. Useful ideas stay orphaned. Old outputs look canonical. Temporary captures pretend to be durable knowledge. Links break. The graph becomes less useful every week.

That is why vault gardening is a workflow, not a mood.

The first pass is mostly deterministic: orphan notes, stale drafts, duplicate titles, missing backlinks, overgrown clusters, archived outputs still linked as canonical. Then the agent proposes what to connect, promote, merge, archive, or rewrite.

The gardening skill does not just add more memory. It improves the shape of the memory that already exists.

This is the unsexy part of the system, but it is the part that keeps everything else from degrading.

A notes app lets me write notes.

A personal OS needs maintenance loops.

## 5. Meeting digest: meetings are where companies leak memory

Meetings are risky for memory because they feel productive while scattering context.

A decision gets made. A blocker gets mentioned. A client constraint appears. Someone says “let's do that next week.” Then the recording, transcript, and notes drift into separate tools. Two weeks later, the agent can technically search everything, but it does not know what mattered.

The meeting digest skill exists to stop that leak.

It classifies the meeting. Prospect call, client meeting, internal discussion, daily learning. It extracts decisions, blockers, action items, and reusable insights. It updates existing Granite notes instead of creating duplicates. It drafts the recap email, but does not send without approval.

This only works with clear consent, retention rules, and a policy for what should not enter durable memory. Ambiguous identity matches or sensitive content should stay in the report for review.

Again, the point is not transcription.

The point is continuity.

A meeting should update the OS. If it does not, the company has to remember the meeting manually.

## 6. Skill system: the OS has a way to improve itself

The most important skill is the one that improves the other skills.

The rule I use now is simple:

If I explain the same workflow twice, the system is incomplete.

The first time is discovery. A prompt is fine.

The second time is evidence. Something is recurring.

The third time should not happen as another pasted instruction. It should become a skill, or belong inside an existing owner skill.

This changes how the system learns.

When a prompt fails, you usually make it louder. Add another warning. Add another “do not forget.” Hope the next conversation remembers.

When a skill fails, you can patch the workflow. Tighten the trigger. Add a verification step. Move brittle shell into a script. Add an approval gate. Preserve artifacts. Compare the new behavior to the old one.

That is closer to software than prompt engineering.

I wrote the broader argument in [Why I replaced prompts with skills](/resources/articles/why-i-replaced-prompts-with-skills). The short version is this: prompts are where I discover workflows. Skills are where I put them once I understand them.

## What changed

The biggest change is not speed.

Speed is nice, but speed is not the point.

The point is that I spend less time re-explaining how work should happen.

Before, every recurring workflow started with me reconstructing context: what to read, what not to touch, where to write the output, which checks mattered, when to ask me, and what “done” meant.

Now the agent starts from the skill, writes to a run directory, checks the relevant systems, produces artifacts, and stops at the right gate.

That makes delegation cleaner.

I do not want subagents inventing the operating system. I want them working inside it.

It also makes the system safer in the only way that matters: by making authority explicit. The security boundary is not just which vendor I use. It is what authority the agent has: can it read, propose, prepare, or execute? That is the frame we use in [the agent authority article](/resources/articles/agents-ia-formation-autorite).

And it makes company memory more useful. Agents do not need another random integration if they still do not understand the company. They need maintained memory and methods. That is the broader point in [Agents don't lack tools. They lack company memory](/resources/articles/agents-dont-lack-tools-they-lack-company-memory).

## This is not a magic assistant

This is not fully autonomous.

It is not a replacement for judgment.

It is not safe without permissions, logs, review gates, and good taste.

It still fails when memory is stale, when a source is weak, when permissions are too broad, when an artifact is mislabeled, or when the workflow itself is underspecified.

That is why I do not want one giant assistant with access to everything.

I want bounded workflows with explicit authority.

## Apps store work. Skills operate work.

This is the simplest way I can explain the shift.

Apps store work.

Skills operate work.

A notes app stores notes. A memory skill decides what should become durable knowledge.

An email app stores messages. An inbox skill applies a triage policy.

A CMS stores articles. A publishing skill moves an idea through research, draft, review, preview, and release.

A meeting tool stores transcripts. A meeting skill updates the company memory and prepares the follow-up.

A prompt library stores instructions. A skill system turns repeated instructions into infrastructure.

Once you see the difference, the old productivity stack starts to look upside down. It was optimized for a human clicking through apps. But the next layer of work is not humans clicking faster. It is humans designing better operating surfaces for agents.

That is what I mean by agent OS.

Not a single product. Not one interface to rule them all. Not a magical assistant that knows everything.

A memory layer. A workflow layer. A tool layer. An agent layer. A governance layer.

And a simple rule underneath all of it:

If I have to explain the same workflow twice, it belongs in the OS.
