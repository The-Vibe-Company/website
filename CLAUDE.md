
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