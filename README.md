# The Vibe Company

This repo now uses a deliberately minimal CMS.

There is one content collection with two public entry types:
- `learning`
- `article`

The admin UI is for writing and editing those entries. The write API is for pushing them in programmatically.

## Local Setup

1. Install dependencies:

```bash
bun install
```

2. Copy envs and fill them in:

```bash
cp .env.example .env.local
```

Required values:
- `PAYLOAD_SECRET`
- `DATABASE_URL`
- `CONTENT_WRITE_TOKEN`

3. Start the app:

```bash
bun dev
```

Main URLs:
- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Write API docs: `http://localhost:3000/api/write`

## Write API

Use this endpoint when you want the simplest possible programmatic way to create content.

- Method: `POST`
- URL: `/api/write`
- Auth: `Authorization: Bearer <CONTENT_WRITE_TOKEN>`
- Content-Type: `application/json`

Request body:

```json
{
  "title": "string, required",
  "body": "string, required",
  "type": "article or learning, required",
  "summary": "string, optional",
  "status": "draft or published, optional",
  "slug": "string, optional",
  "publishedAt": "ISO date string, optional"
}
```

Notes:
- `type: "learning"` is stored internally as the existing `daily` type so deployed `/resources/learnings/...` URLs keep working.
- If `summary` is omitted, the API generates a short one from `body`.
- If `slug` is omitted, the API generates one from `title`.
- If `status` is omitted, it defaults to `draft`.

### Example: Create A Learning

```bash
curl -X POST http://localhost:3000/api/write \
  -H "Authorization: Bearer $CONTENT_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "CSS polish matters more than people think",
    "type": "learning",
    "body": "Tiny visual inconsistencies compound fast. Fixing spacing, contrast, and typography often changes how competent the whole product feels.",
    "status": "published"
  }'
```

### Example: Create An Article

```bash
curl -X POST http://localhost:3000/api/write \
  -H "Authorization: Bearer $CONTENT_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Why we simplified the CMS",
    "type": "article",
    "summary": "A short explanation of why the old setup had too much surface area.",
    "body": "The old CMS mixed publishing, tooling, ingestion, and AI workflows into one admin. We cut it back to writing and publishing.",
    "status": "published"
  }'
```

Successful response:

```json
{
  "ok": true,
  "entry": {
    "id": 123,
    "title": "Why we simplified the CMS",
    "slug": "why-we-simplified-the-cms",
    "type": "article",
    "status": "published",
    "url": "/resources/articles/why-we-simplified-the-cms",
    "adminUrl": "/admin/collections/content/123"
  }
}
```

### Self-Describing API

You can inspect the endpoint contract directly:

```bash
curl http://localhost:3000/api/write
```

## Build

```bash
bun run build
```
