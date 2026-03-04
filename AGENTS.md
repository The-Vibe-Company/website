## Cursor Cloud specific instructions

### Overview

This is a Next.js 16 + Payload CMS 3 application ("The Vibe Company" agency site with a resources platform). The database is a cloud-hosted Neon PostgreSQL instance. All required secrets (`DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`) are injected as environment variables.

### Environment

- **Package manager**: Bun (never use npm/yarn/pnpm). Lockfile: `bun.lock`.
- **Dev server port**: 4200
- **Database**: Cloud Neon PostgreSQL — no local PostgreSQL needed. The `DATABASE_URL` env var is injected and points to the cloud DB. Drizzle push mode auto-syncs schema on dev server startup.
- **`.env.local`**: Only needs `NODE_ENV=development`. Do not override `DATABASE_URL`, `PAYLOAD_SECRET`, or `BLOB_READ_WRITE_TOKEN` — they are injected as system environment variables and take precedence over `.env.local` in Next.js.

### Starting the dev server

Use `./scripts/dev-start.sh` exclusively (see `CLAUDE.md` for full usage). The script handles dependency installation, env validation, process management, and health checks.

### Lint / Build / Test

- **Lint**: `bun run lint`
- **Build**: `bun run build`
- No automated test suite exists in this codebase currently.

### Gotchas discovered during setup

1. **System env vars override `.env.local`**: Next.js prioritizes system environment variables over `.env.local`. Since `DATABASE_URL` is injected at the system level, any local override in `.env.local` is silently ignored by the dev server. Only `bun run` scripts that use `dotenv/config` directly will respect `.env` file ordering differently.
2. **Drizzle schema push is lazy**: The Payload CMS database schema push happens only when the `/admin` route is first accessed (not at dev server startup). If you restart the dev server and immediately try API endpoints, the push may not have completed yet.
3. **No local PostgreSQL required**: The cloud Neon database is shared. Avoid destructive operations (DROP TABLE, TRUNCATE) in development scripts.
4. **`agent-browser` for testing**: Per `CLAUDE.md`, always use `agent-browser` (not Playwright or other libraries) for browser-based testing of `localhost`.
