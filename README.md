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

## Vercel CI/CD

Production deploys are handled by GitHub Actions on `main`.

PR previews are also deployed through GitHub Actions to Vercel preview environments. To make them work, configure these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Each PR from this repository gets a fresh preview deployment and the workflow updates a comment on the PR with the Vercel URL.

For security, previews are skipped for PRs opened from forks because GitHub does not expose repository secrets to those runs.
