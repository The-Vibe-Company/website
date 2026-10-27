# AGENTS.md

Instructions for any coding agent working in this repository. The full project guide is `CLAUDE.md` (dev server, bun only, PR rules, articles, images); it applies to every agent, not only Claude.

## SEO changes: run the smoke check before the PR

Before opening any SEO PR, or any fix that touches SEO (titles, `seoTitle`, meta descriptions, OG images, sitemap, hreflang, canonicals, locale redirects, `noindex`, resource cards and internal links, article or skill `language`):

```bash
bun run seo:check
```

**If it fails, do not open the PR.** Fix the cause, then run it again until every line is `[ok]`, and paste the green output in the PR description.

`seo:check` (`scripts/seo-smoke-check.ts`) runs in about 5 seconds, without a build, a dev server or a deploy. It checks the invariants the site's SEO relies on:

- every article and skill declares an explicit `language` (`content:translations-check`);
- the sitemap lists every article and skill once, under its own language prefix only, with hreflang alternates that point to listed, same-language URLs;
- under the other language's prefix, every article and skill answers a permanent redirect (308) straight to its canonical URL: its translation when it has one, otherwise itself in its own language. Never a `noindex` page served with a 200;
- listing cards and "keep reading" links point to the entry's own language prefix, and a translated article shows up as one card;
- hard-coded article links in `src/lib` exist, and a path declared for `fr` or `en` points to an article in that language;
- every rendered `<title>` fits in 60 characters and is unique, every entry has a summary, and every article has an OG or cover image (`content:covers-check` also runs);
- the SEO unit tests pass (`content-source`, `article-links`, `site`, `seo-titles`, `structured-data`).

When a change touches article content, also run the gates listed in `CLAUDE.md` ("Publishing an article"): `bun run content:victor-check`, `content:focus-check`, `content:translations-check`, `content:covers-check`, and `bun run images:check`.

If an intentional change to the redirect or link rules makes a check obsolete, update `scripts/seo-smoke-check.ts` in the same PR and say why in the description. Never weaken a check just to get a green run.
