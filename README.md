# The Vibe Company

This repo publishes content directly from Markdown files in the codebase.

There are two public entry types:
- `learnings`
- `articles`

## Local Setup

1. Install dependencies:

```bash
bun install
```

2. Copy envs and fill them in:

```bash
cp .env.example .env.local
```

No CMS-specific environment variables are required for content publishing.

3. Start the app:

```bash
bun dev
```

Main URLs:
- Site: `http://localhost:3000`

## Content

Content lives in:

- `content/articles/*.md`
- `content/learnings/*.md`

Each file uses simple frontmatter:

```md
---
title: Why we simplified the CMS
slug: why-we-simplified-the-cms
summary: A short explanation of why the old setup had too much surface area.
publishedAt: 2026-02-20
---

Markdown body here.
```

Adding or editing an article is now a normal code change. The site rebuilds from those files on deploy.

## Build

```bash
bun run build
```
