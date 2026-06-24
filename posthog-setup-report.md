<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into The Vibe Company website. PostHog was already partially wired up (the `PostHogProvider` existed), so the wizard upgraded the setup to the recommended Next.js 16 pattern using `instrumentation-client.ts` for initialization, added a reverse proxy via `/ingest` rewrites in `next.config.ts`, and instrumented 10 business-critical events across 7 files covering contact conversions, resource engagement, and navigation behavior.

| Event Name | Description | File |
|---|---|---|
| `discovery_call_clicked` | User clicks the primary 'Book a discovery call' CTA in the Hero section. | `src/components/home/Hero.tsx` |
| `see_what_we_do_clicked` | User clicks the 'See what we do' anchor scroll link in the Hero section. | `src/components/home/Hero.tsx` |
| `contact_cta_clicked` | User clicks the 'Book a discovery call' CTA in the final contact section. | `src/components/home/FinalCTA.tsx` |
| `get_in_touch_clicked` | User clicks the 'Get in touch' button in the top navigation bar. | `src/components/TopNav.tsx` |
| `nav_link_clicked` | User clicks a main navigation link (Portfolio or Resources) in the top nav. | `src/components/TopNav.tsx` |
| `mobile_menu_opened` | User opens the mobile hamburger navigation menu. | `src/components/TopNav.tsx` |
| `resources_searched` | User submits a search query on the resources home page. | `src/components/resources/ResourcesHomeSearch.tsx` |
| `skill_install_prompt_copied` | User copies the AI install prompt from a skill's detail page. | `src/components/resources/SkillAIInstaller.tsx` |
| `skill_prompt_copied` | User copies the raw skill prompt text from a skill's detail page. | `src/components/resources/SkillPromptBlock.tsx` |
| `skill_prompt_expanded` | User expands the full skill prompt to view the complete text. | `src/components/resources/SkillPromptBlock.tsx` |

## Next steps

We've built a dashboard and 5 insights to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/484274/dashboard/1755117)
- **Contact CTA Clicks Over Time**: [View insight](https://us.posthog.com/project/484274/insights/dhSCsB1t) — tracks all 3 contact CTA variants daily
- **Skill Engagement Over Time**: [View insight](https://us.posthog.com/project/484274/insights/TBKisqp8) — install prompt copies, skill prompt copies, expansions
- **Resource Search Activity**: [View insight](https://us.posthog.com/project/484274/insights/pBep3NSP) — search volume in the resources section
- **Contact Conversion Funnel**: [View insight](https://us.posthog.com/project/484274/insights/5sX0eeel) — pageview → discovery call CTA click rate
- **Navigation Behavior**: [View insight](https://us.posthog.com/project/484274/insights/6NYQ1C4k) — nav links, mobile menu, hero scroll anchor

## Verify before merging

- [ ] Run a full production build (`bun run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
