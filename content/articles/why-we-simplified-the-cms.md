---
title: Why we simplified the CMS
slug: why-we-simplified-the-cms
summary: A short explanation of why the old setup had too much surface area.
publishedAt: 2026-02-20
---

We removed the publishing complexity that had started to dominate the actual writing workflow.

The old setup mixed content editing, ingestion, admin tooling, and deployment concerns in one place. That increased failure modes without making the writing better.

Markdown in the repo is simpler. It keeps the source of truth close to the code, makes review obvious in pull requests, and guarantees the deployed site is exactly what was committed.
