# PR performance guardrails

`.github/workflows/performance.yml` follows the existing IndexNow `deployment_status` pattern: only a **successful Vercel Preview** created by `vercel[bot]` is eligible. The deployment SHA must match the current head of an open PR. Production deployments, old SHAs and unrelated deployments are ignored. No manual Vercel deployment is needed.

PR opened/synchronize/reopened events also discover that SHA's successful Preview (bounded polling, up to five minutes). This lets a new workflow run on its own PR before merging it. Title/body/label edits rerun the checks with the current PR metadata and discover an already available Preview without waiting. Deployment events run tooling from the default branch, and inspect PR blobs as data; they never execute deployed PR scripts with the bypass secret. PR bootstrap runs never receive the secret. Fork PRs get static checks and public-preview measurement when available; protected/fork deployment runs remain neutral.

Measurement jobs serialize under `perf-pr-<PR number>`, and sticky publishers under `perf-report-pr-<PR number>`. A late run cannot publish against a newer PR SHA. The bot creates/updates one comment marked `<!-- tvc-performance-guardrails -->`, and creates a `Performance budgets` check on the actual PR head SHA. Reporting failures (permissions, API quota or network) emit warnings. The publishing job still fails for confirmed budget violations. Configure branch protection to require **Performance budgets** if this should prevent merging; adding the workflow does not edit repository protection rules.

## Budgets

| Check | Blocking | Warning / neutral |
| --- | --- | --- |
| Added/modified raster (PNG/JPEG/WebP/AVIF/GIF/ICO/BMP/TIFF) | >200 KiB per Git blob | PNG/JPEG >100 KiB: recommend WebP/AVIF |
| Added/modified SVG | >50 KiB per Git blob | — |
| Preview CLS | Median >0.05, from ≥3 valid preview runs | <3 valid preview runs: neutral; production failure does not hide measured CLS |
| LCP vs production | Only with `PERF_REGRESSION_BLOCKING=true` | Median regression **>20% AND >300 ms** |
| TBT vs production | Only with `PERF_REGRESSION_BLOCKING=true` | Median regression >100 ms |
| Source priority lint | — | >2 eager/priority images per affected page; eager/priority images inside lists or mobile-hidden ancestors |
| Rendered head image preloads | — | Lists `<link rel="preload" as="image">` found in the preview head, including React 19 generated hints |
| Leftover screenshots | Added/modified files anywhere under root `screenshots/` | Deletion is allowed to clean up old files; save captures in `.context/` |
| PR metadata | `DO NOT MERGE` (case insensitive) in title, body or any label | Draft alone is allowed |
| Preview missing/protected, timeout, Chrome failure, network, quota | Never a budget failure by itself | Warning and neutral unavailable metrics |

**KiB = 1024 bytes.** Strict thresholds mean exactly 200 KiB raster, 50 KiB SVG, CLS 0.05, +300 ms LCP, +20% LCP and +100 ms TBT pass. Assets already on main are grandfathered until modified; a rename checks the destination blob. No large binary fixtures are committed.

The image diff gate extends `bun run images:check`, sharing the exact implementation used by the workflow:

```bash
bun run images:check --diff "$(git rev-parse origin/main)" "$(git rev-parse HEAD)"
bun run perf:test
bun run perf:typecheck
```

The existing full `images:check` (content/optimizer invariants) and `seo:check` are unchanged and are not duplicated by Lighthouse. SEO/article changes still require the gates in `AGENTS.md` and `CLAUDE.md`.

## Lighthouse methodology

Pinned Lighthouse 13.0.3, Chrome on the same Ubuntu runner, mobile emulation, simulated mobile throttling, fresh Chrome profile for every run. The worker accepts only the production origin or a validated HTTPS `*.vercel.app` origin. Production starts at `https://thevibecompany.co` and may follow its canonical `www` redirect. A navigation/auth/error page never counts as a valid sample.

Pages are fixed in `scripts/perf/checks.ts`:

- `/fr`
- `/en`
- `/fr/resources/articles/ia-donnees-de-sante-hds`
- `/fr/case-studies/monka`

For each page, run **prod → preview → prod → preview → prod → preview** serially in the same job. A fourth alternating pair retries missing samples; only the first three successful samples per side enter the median. Each metric (score, LCP, TBT, CLS) has its own median. The sticky table shows both medians and absolute deltas (score points, milliseconds, CLS). Synthetic measurements remain variable; only CLS blocks by default.

Every sample has a 15-second HTTP preflight, 30/45-second Lighthouse FCP/load limits, a 95-second worker deadline and a 110-second parent deadline. The measurement step has a 35-minute limit. Static findings are uploaded before Chrome runs so a measurement timeout cannot erase an asset/leftover blocker. If a rerun on the same SHA cannot reproduce complete measurements, the sticky comment preserves prior measured performance blockers/warnings, and retains the earlier table when it was complete or the new run has no medians, with a warning. Previously confirmed asset/screenshot blockers also survive a same-SHA static infrastructure failure; current PR metadata is always recomputed. A new SHA starts fresh.

Only selected numeric metrics and sanitized head image paths are stored as short-lived GitHub artifacts; no raw Lighthouse report, request headers, HTML, browser console or exception details are uploaded. Network errors do not fabricate zero-valued samples. PR publication rereads title/body/labels, so edits update the metadata blocker without needing a new commit.

## Configuration

- GitHub Actions secret **`VERCEL_AUTOMATION_BYPASS_SECRET`**: Vercel's automation bypass secret for protected previews. Set it at repository/environment level through GitHub settings. Missing secret produces a warning: public previews can still be measured; protected previews are neutral. No secret value belongs in code, PRs, logs or artifacts.
- GitHub Actions repository variable **`PERF_REGRESSION_BLOCKING`**: set to the literal `true` to make the LCP/TBT regressions blocking. Default: warning. This is a variable, not a secret.
- `GITHUB_TOKEN`: supplied automatically. Discovery needs contents/deployments/PR read; publishing needs PR/check write and artifact read. Fork token restrictions may prevent posting a comment; that is reported as neutral.

The bypass header is injected through browser request interception **only for requests to the validated preview origin**. It is removed for all other origins, including redirects, and is never passed as a CLI argument or Lighthouse `extraHeaders` (which could forward it to third parties). Production never receives it.

Source lint uses the TypeScript AST and follows local runtime imports and ancestor layouts for affected routes. It counts each flagged image once even if it has multiple hints, ignores comments and explicit false priority/preload, and reports `.map()`, `.flatMap()`, JSX arrays, `hidden`, responsive hidden classes, `sr-only`, and inline `display:none`. It is a warning heuristic: mutually exclusive branches may overcount; opaque wrappers, computed classes, dynamic imports and runtime component repetition may undercount. Inspect the preview head/Lighthouse report when deciding whether a hint is intentional. The existing client marquee's `loading="eager" fetchPriority="low"` is intentionally still reported for human review; this CI PR does not change frontend or PostHog code.
