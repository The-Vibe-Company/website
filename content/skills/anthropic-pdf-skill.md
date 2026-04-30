---
title: Anthropic PDF Skill
slug: anthropic-pdf-skill
language: en
publishedAt: 2026-04-22
summary: The official Anthropic Claude Skill for working with PDFs — extract text, summarize, fill forms, and answer questions over multi-page documents.
complexity: beginner
topics: Documents, PDF, Anthropic Skills
kind: external
author: Anthropic
authorUrl: https://github.com/anthropics
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/pdf
sourcePath: skills/pdf
allowedTools: [Read, Bash]
trigger: extract text from this PDF / summarize the attached document / fill out this PDF form
installCommands: [{"label":"Claude Code","command":"/plugin marketplace add anthropics/skills && /plugin install document-skills@anthropic-agent-skills"},{"label":"git clone","command":"git clone https://github.com/anthropics/skills anthropic-skills && cp -r anthropic-skills/skills/pdf ~/.claude/skills/"}]
---

The official Anthropic PDF skill. Use this when an agent needs to read, query, or modify a PDF that's been shared with the user.

## What it does

- **Extract text** from any PDF, preserving page boundaries and approximate layout.
- **Summarize** long documents into structured outlines.
- **Answer questions** grounded in the document's contents (with page citations).
- **Fill forms** — fill in form fields and re-export.

## Why it's worth installing

Most "ask the LLM about a PDF" workflows lose page numbers, mangle tables, and hallucinate when the document is long. This skill uses Anthropic's tested document pipeline so you get reliable extraction with citations.

## After installation

The skill is invoked automatically when the user attaches a PDF or asks an explicit question about a document. No manual trigger needed — just upload the PDF and ask your question.

For full docs, see the [Anthropic Skills repository](https://github.com/anthropics/skills).
