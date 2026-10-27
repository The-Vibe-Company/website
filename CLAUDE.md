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

## Layout Architecture (CRITICAL)

**NEVER create `src/app/layout.tsx`** (root layout). The frontend route group already owns its own `<html>`:

- `src/app/(frontend)/layout.tsx` — frontend root layout (fonts, metadata, globals.css)

A root layout at `src/app/layout.tsx` would wrap the route group, creating duplicate `<html>` elements that cause React hydration error #418 (blank page).

## Design Architecture: unified light identity

The site shares **one visual identity** across Homepage, Portfolio, and Resources: warm-paper background (`#fdfbf7`), deep ink text (`#0a0a0a`), brutalist cards. All three are pinned to `color-scheme: light` and never flip with the system dark mode.

Tactical orange accents (`text-orange-500` / `bg-orange-500`) are reserved for highlight signals: the "YC W24" badge, status dots, the Skillpack project accent, and the "Browse all on GitHub" CTA. Use sparingly.

An **experimental homepage preview** lives at `/v2` — the existing warm-paper homepage (same `TopNav`, `Services`/`Process`/`Proof`/`FinalCTA`, `Footer`, `[data-variant="hybrid"]`) with the static `home/Hero` swapped for a playable canvas runner (`src/components/home/runner/VibeRunner.tsx`). Inside the canvas each "world" (a product, service, or the YC backing) has its own art direction (paper/ink/accent/player colour) and a persistent presentation panel; difficulty mirrors the Chrome/Firefox dino algorithm. It is a preview, not yet the canonical `/` homepage; when it replaces `/`, swap `Hero` for `VibeRunner` in `HomeLaunchpad` and promote the DESIGN.md prose.

### Token surfaces

| Surface                           | Light tokens                            |
| --------------------------------- | --------------------------------------- |
| **Homepage** (`[data-variant="hybrid"]`) | `--background: #fdfbf7`, `--foreground: #0a0a0a`, `--border: #dcd7ce`, `--muted-foreground: #525252` |
| **Resources / Portfolio** (`.resources-theme`) | `--res-bg: #fdfbf7`, `--res-text: #0a0a0a`, `--res-border: #dcd7ce`, `--res-text-muted: #525252` (mirrors hybrid) |
| **Runner preview** (`/v2`) | Reuses the **Homepage** `[data-variant="hybrid"]` tokens; per-world palettes are scoped to the game canvas only |

Both blocks live in `src/app/globals.css`. No dark-mode override on either — both wrappers force `color-scheme: light`.

### Resources-specific layer

- **Theme file**: `src/lib/resources-theme.ts` — card, badge, nav, filter, search, section, daily, and stats helpers built on the `--res-*` tokens.
- **Domain accents**: `--domain-dev`, `--domain-design`, `--domain-ops`, `--domain-business`, `--domain-ai`, `--domain-marketing` — used for content categorization on resource cards. Tailwind classes registered in `@theme inline` as `text-domain-dev`, etc.
- **Custom cursor + grid overlay** are still suppressed on `/resources` (see `ClientProviders.tsx` and `ConditionalGridOverlay.tsx`) to keep those pages reading-friendly.

## DESIGN.md Maintenance

Keep the root `DESIGN.md` in sync whenever a change affects the public visual identity: colors, typography, spacing rhythm, radii, shadows, motion, grids, navigation treatments, card styles, CTAs, or the Homepage/Resources/Portfolio design split.

`DESIGN.md` must stay fully self-contained:

- Start with YAML frontmatter containing all structured design tokens.
- Keep primitive token values concrete, and only use valid `design.md` token references that resolve inside the same file. Do not reference code variables, Tailwind classes, CSS custom properties, file paths, or component names as dependencies.
- Preserve the Markdown section order: `Overview`, `Colors`, `Typography`, `Layout`, `Elevation & Depth`, `Shapes`, `Components`, `Do's and Don'ts`.
- Capture design intent in prose after the YAML, especially details token values cannot express: warm-paper brutalism, deep-ink contrast, mono metadata, grid overlays, black slab CTAs, flat banded hierarchy, dark inverse sections, and restrained accent usage.
- If the rendered product changes, compare `DESIGN.md` against local UI screenshots or browser testing and revise the tokens/prose until they match.

Validate after every edit:

```bash
bunx @google/design.md lint --format json DESIGN.md
```

The expected result is 0 errors and 0 avoidable warnings.

## Planning

When planning, always create a graph of tasks and dependencies between them.

## SEO changes

Before any SEO PR or SEO fix, run `bun run seo:check` (fast smoke check of locale redirects, sitemap, cards, titles, plus the content gates) and do not open the PR if it fails. Details in `AGENTS.md`.

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

**Dev server port**: The dev server runs on `http://localhost:$CONDUCTOR_PORT` when `CONDUCTOR_PORT` is set (Conductor workspaces always set it). Otherwise it falls back to `$PORT`, then to `4200`. Never hard-code `localhost:3000`.

Before any task, run `./scripts/dev-start.sh` to ensure the dev environment is ready.

If you had to use the same command multiple times in the same session, please create a script to do it in the `scripts` folder and add a one line description of what it does in CLAUDE.md

If you have questions about the product vision, please look at https://www.notion.so/Site-Web-Architecture-2ff324e51ac2806cb38bc195bb808578?source=copy_link and related notion pages. If you can't read the notion pages, please ask the user to share the pages with you.

- Only use BUN for the project. Never use npm or yarn or pnpm for this project

## Publishing an article

An article is a Markdown file in `content/articles/<slug>.md`. Its frontmatter drives the whole pipeline, and four gates run on every pull request (`bun run content:victor-check`, `content:focus-check`, `content:translations-check`, `content:covers-check`) plus the image gates in `prebuild`.

### Bilingual articles

An article published in both languages links its two files with a shared `translationKey`:

```yaml
# content/articles/ia-donnees-de-sante-hds.md
language: fr
translationKey: hds-health-data

# content/articles/ai-health-data-hds-france.md
language: en
translationKey: hds-health-data
```

The key is language-neutral kebab-case and never appears on screen. With it, `/resources` shows one card per article — the version in the locale being browsed, falling back to whichever version exists — with an FR/EN switch on the card, each version is canonical on its own URL and declares the other through `hreflang` (plus `x-default` on the French one), and the sitemap carries the same alternates.

One article means one URL per language, so reaching a translated article under the other language's prefix (`/en/resources/articles/ia-donnees-de-sante-hds`) **308-redirects** to that language's own version (`/en/resources/articles/ai-health-data-hds-france`). That is what makes the global FR/EN switch in the header work on an article: it only swaps the prefix, and the redirect carries it the rest of the way.

An article with no translation simply omits `translationKey`. It lives under its own language's prefix only: the other prefix **308-redirects** there (`/en/resources/articles/je-mappelle-victor` → `/fr/resources/articles/je-mappelle-victor`) instead of serving a `noindex` duplicate, and listing cards link straight to that URL whatever language the list is browsed in. Skills follow the same rule. Every article must therefore declare an explicit `language: fr` or `language: en` — without it the article would default to `en`. Validation (`bun run content:translations-check`) rejects an article or skill without an explicit `language`, a key that is not shared by a second article, two versions in the same language, a mis-cased `translationKey`, and a pair whose `series` values disagree.

### Generating the cover

Covers are generated in the house art direction (one mascot, stylized 3D clay, warm palette, no text) with:

```bash
bun run cover:generate --slug <article-slug> --scene "<the one metaphor to draw>"
bun run cover:generate --slug <article-slug> --prompt-only   # review the prompt first, costs nothing
```

Without `--scene` the prompt falls back to the article's own title and summary, but choosing the metaphor yourself gives a far better cover. The script calls the Azure OpenAI image *edit* endpoint with the mascot reference attached, which is what keeps the character identical across covers, and writes `public/images/resources/<slug>/cover-mascotte.webp` at 1536x1024, webp quality 80. It refuses to overwrite an existing cover unless you pass `--force`.

**The mascot reference PNG is committed at `public/brand/mascot-reference.png`** and is the default, so nothing to pass. It is the canonical `assets/avatar-tvc-mascotte.png` from the `generate-brand-image-marketing` skill (1024x1024). Override it with `--mascot <path>` or `TVC_MASCOT_REFERENCE` only to try a different character.

**Mandatory visual check before committing a cover.** Open the generated file and compare it to the reference:

- a glossy black swept-back pattern painted on top of the head, with a central point on the forehead;
- a black V on the chest, with black shoulders;
- **no golden badge** and nothing attached to the forehead — describing the head as a "winged emblem" is what makes the model add one.

If the mascot drifted, regenerate with a corrected `--scene`. Never ship a cover that failed this check.

**Every article has its own cover, there is no placeholder.** If the cover cannot be generated (no API key, API down), stop and ask; never copy another article's cover in as a "temporary" one. `bun run content:covers-check` (`scripts/validate-unique-covers.ts`) hashes every `coverImage` and `ogImage` and fails when a cover is missing, or when two articles share byte-identical covers (even under different file names). The FR and EN versions of one article (same `translationKey`) count as one article and should reference the same file. A missing image referenced in Markdown also fails `bun run images:optimize` / `images:check` instead of being skipped.

Then run `bun run images:optimize` and `bun run content:check`.

Configuration, all overridable by environment variable:

| Variable | Default |
| --- | --- |
| `AZURE_OPENAI_API_KEY` (fallback `OPENAI_API_KEY`) | none — required |
| `AZURE_OPENAI_IMAGE_ENDPOINT` | `https://quivr-sweden-central-resource.openai.azure.com/openai/v1` |
| `AZURE_OPENAI_IMAGE_DEPLOYMENT` | `gpt-image-2-1` |
| `TVC_MASCOT_REFERENCE` | `public/brand/mascot-reference.png` |

The key lives in `.env.local` (bun loads it automatically, and `.gitignore` already covers `.env*`) or in a CI secret. **Never commit a key.** CI never calls the image API: cover generation is a human step, because the mascot check needs eyes on the result.

## Image Optimization

For same-repo PRs that touch `content/**`, `public/images/**`, or `scripts/optimize-images.ts`, GitHub Actions runs:

```bash
bun run images:optimize
```

If optimization creates or updates generated files, the workflow commits them back as `chore(images): compress article images`. Fork PRs cannot receive write-token commits, so contributors from forks still need to run the optimizer locally before opening or updating the PR.

Before opening a PR that adds or changes Markdown-referenced images, you can run:

```bash
bun run images:optimize
```

The image optimization system must stay lossless, source-preserving, and idempotent:

- keep original files and canonical Markdown/frontmatter image references unchanged;
- write generated variants only under `public/images/_optimized/`;
- serve optimized images through `src/generated/image-variants.json`;
- do not use a generated variant when it is not smaller than the source;
- repeated `bun run images:optimize` runs must produce no diff after the first successful run.

The optimizer memoizes encoder results in `src/generated/image-optimize-cache.json`. The cache is committed, but must never be imported by app code because it contains source and target hashes that are only useful to the script. Cache keys use `${kind}:${sourceUrl}`. A cache entry with `targetUrl: null` means the generated variant was not smaller than the source, so the manifest should not point to a variant. If Sharp encoding settings change, bump `ENCODER_VERSION` in `scripts/optimize-images.ts` to invalidate old cache entries. Deleting the cache is safe; it only forces a full re-encode that should converge back to the same generated variants.

The Quivr project page draws its web app in code (`src/components/quivr/QuivrFeedMock.tsx`, sample articles only). Its 1200x630 OG cards `public/projects/quivr-og-{fr,en}.jpg` are captures of that mock: re-run `./scripts/capture-quivr-og.sh` (needs the dev server) whenever the mock or its copy changes, and commit both images.

To verify image budgets without rewriting files, run:

```bash
bun run images:check
```
