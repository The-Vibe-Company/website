# IndexNow

Public key: `d0665c0d926365762e882af2ac4e79a0`, shared in
`src/lib/indexnow.ts` and served verbatim at
`https://www.thevibecompany.co/d0665c0d926365762e882af2ac4e79a0.txt`.
The existing middleware matcher excludes files with extensions; Next explicitly
serves the proof as `text/plain; charset=utf-8` without a locale redirect.

## Automatic notifications

The GitHub Action listens to Vercel's `deployment_status` event, only for
`success` in `Production` from `vercel[bot]`. It checks out the deployed SHA and
proves that it is an ancestor of `origin/main` (Vercel's `ref` is a SHA here).
Only then does it set the equivalent `VERCEL_ENV=production` and
`VERCEL_GIT_COMMIT_REF=main` guard. Preview and local runs cannot submit.

After production is live, it diffs against the previous successful Production
deployment, including inactive deployments. This covers multiple commits shipped
together. Article/skill edits resolve frontmatter slugs (falling back to filenames)
and select their live canonical URLs, their listed
translations and both resource hubs. No other-language URLs are invented.
Shared page, data, copy or image changes select all live canonical URLs;
docs/tests/tooling-only changes select none. Without a baseline, all URLs are
selected. Removed URLs are excluded from this new/modified URL notifier.

The live sitemap (including nested indexes) is the URL authority. Only HTTPS
URLs on `www.thevibecompany.co` enter deterministic, deduplicated batches of at
most 10,000. A live key check precedes POST. Requests time out after 8 seconds,
redirects are rejected, and errors log and exit 0. The separate, best-effort
workflow never blocks the build. Repeated notifications are safe. The only
token is GitHub's built-in read-only `GITHUB_TOKEN`; no custom secret is needed.

## Manual submission

Inspect the production sitemap and every payload without POST:

```sh
npm run indexnow:submit-all -- --dry-run
```

The repository uses Bun: the equivalent is
`bun run indexnow:submit-all --dry-run`. Actual submission requires both
`VERCEL_ENV=production` and `VERCEL_GIT_COMMIT_REF=main`; otherwise it logs
`IndexNow: skipped (not production)`. Dry-run bypasses that guard and performs
only sitemap GETs. No submission is coupled to `build` or `postbuild`.

Protocol: https://www.indexnow.org/documentation
Event: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#deployment_status
