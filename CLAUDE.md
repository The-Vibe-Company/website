
## Browser Automation

Use `agent-browser` for testing the localhost website. 
Never use playwright or any other library to test the localhost website. 
Never use claude chrome mcp to test the localhost website. 

ALWAYS USE THE BROWSER AUTOMATION TO TEST THE LOCALHOST WEBSITE. 


## PR Creation

When creating a PR, always upload a screenshot of all the things that you did in the PR description.

The Screenshot should be in the folder `screenshots/pr-<pr-number>/<screenshot-name>.png`

**Image URLs in PR descriptions**: Use the raw GitHub URL format, not relative paths:
```
https://raw.githubusercontent.com/The-Vibe-Company/vibe-tuto/<branch-name>/screenshots/pr-<number>/<image>.png
```

Always add the link to the issue in the PR description. 

## Git

- Always use `--base main` when creating PRs with `gh pr create`
- Use conventional commits for the commits and PR



### Designing Pages and Components

Always use frontend-design skill and ui-ux-pro-max skill for designing pages and components or when the user asks you to design something.

## Design Architecture: Homepage vs Resources

The site has **two distinct design identities** sharing the same codebase:

| Aspect | Homepage / Agency | Resources (`/resources/*`) |
|---|---|---|
| **Personality** | Bold, brutalist | Calm, warm "knowledge platform" |
| **Background** | Pure white `#fff` / black `#030303` | Warm off-white `#faf9f7` / charcoal `#0f0e0d` |
| **Effects** | Custom cursor circle, grid overlay, brutal shadows | None — clean and functional |
| **Cards** | Sharp borders, `shadow-[12px_12px_0px_0px]` on hover | Rounded-xl/2xl, soft `shadow-lg` + `-translate-y` on hover |
| **Colors** | Monochrome (B&W only) | Domain accent colors (indigo, violet, emerald, cyan, amber, rose) |
| **Nav** | `TopNav` with Framer Motion | `ResourcesNav` with breadcrumbs + search |
| **CSS tokens** | `--background`, `--foreground`, etc. | `--res-bg`, `--res-surface`, `--domain-*`, etc. (scoped to `.resources-theme`) |

### How the isolation works

1. **`ClientProviders.tsx`** suppresses `CustomCursor` and `SmoothScroller` when `pathname.startsWith('/resources')`
2. **`ConditionalGridOverlay.tsx`** hides the grid background on `/resources` routes
3. **`src/app/(frontend)/resources/layout.tsx`** wraps children in `.resources-theme` div, renders `ResourcesNav` instead of `TopNav`
4. All resources CSS variables are scoped under `.resources-theme` in `globals.css` — they never leak to the homepage

### Resources design tokens

- **Theme file**: `src/lib/resources-theme.ts` — all card, badge, nav, filter, search, section, daily, and stats tokens
- **CSS variables**: `.resources-theme` block in `globals.css` with `--res-*` and `--domain-*` vars (light + dark mode)
- **Tailwind classes**: Registered in `@theme inline` as `bg-res-bg`, `text-res-text-muted`, `text-domain-dev`, etc.
- **Domain accent map**: `domainAccentMap` in `resources-theme.ts` maps domain slugs to CSS color var names

## Planning 

When planning, always create a graph of tasks and dependencies between them. 

## Vercel

never deploy to vercel manually, let the CI/CD do it. 


## Running the front

**MANDATORY**: Use `./scripts/dev-start.sh` to start the dev server. This is the ONLY authorized way to start, check, or stop the frontend. Never run `pnpm dev`, `turbo dev`, or `next dev` directly.

```bash
./scripts/dev-start.sh          # Start (or do nothing if already running)
./scripts/dev-start.sh --status # Check if running
./scripts/dev-start.sh --stop   # Stop the server
```

The script is idempotent: run it as many times as needed, it only acts when necessary. It handles dependency installation, env validation, process management, and health checks automatically.

Before any task, run `./scripts/dev-start.sh` to ensure the dev environment is ready.