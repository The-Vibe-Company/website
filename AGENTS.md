## Cursor Cloud specific instructions

### Services overview

This is a **Next.js 16 + Payload CMS v3** monolith. The single dev server (port 4200) serves both the frontend site and the `/admin` CMS panel, backed by a cloud-hosted PostgreSQL database.

### Required secrets

The following secrets must be injected as environment variables (they are NOT committed to the repo):

| Secret | Required | Purpose |
|--------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Payload CMS |
| `PAYLOAD_SECRET` | Yes | Encryption secret for Payload auth/sessions |
| `BLOB_READ_WRITE_TOKEN` | Optional | Vercel Blob media storage (no-ops if missing) |

### Running the dev server

Use **only** `./scripts/dev-start.sh` (see `CLAUDE.md` for details). The server runs on **port 4200**.

A `.env.local` with `NODE_ENV=development` must exist. Do NOT set `DATABASE_URL` or `PAYLOAD_SECRET` in `.env.local` if they are already injected as environment secrets — Next.js/dotenv won't override existing env vars, and the injected secrets take precedence.

### Gotchas

- **Bun is mandatory.** Never use npm/yarn/pnpm. Bun must be installed (`~/.bun/bin/bun`); the update script handles this.
- **Drizzle schema push** happens automatically on first `/admin` page load in dev mode (`push: true` in the Postgres adapter config). No manual migration step is needed.
- **`agent-browser`** must be used for localhost browser testing per `CLAUDE.md`. Install it globally with `npm install -g agent-browser@latest` if not already available.
- **Lint:** `bun run lint` (runs ESLint).
- **Build:** `bun run build` (runs `next build`).
