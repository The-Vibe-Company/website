---
version: alpha
name: The Vibe Company
description: "A warm-paper, high-contrast AI-native agency design system with editorial density, brutalist borders, mono metadata, and fast shipping energy."
colors:
  primary: "#0A0A0A"
  on-primary: "#FDFBF7"
  secondary: "#525252"
  tertiary: "#F97316"
  neutral: "#FDFBF7"
  background: "#FDFBF7"
  foreground: "#0A0A0A"
  surface: "#FFFFFF"
  surface-muted: "#F3F0EA"
  border: "#DCD7CE"
  border-strong: "#0A0A0A"
  muted: "#737373"
  muted-foreground: "#525252"
  accent: "#F3F0EA"
  accent-foreground: "#171717"
  inverse-surface: "#030303"
  inverse-surface-raised: "#121212"
  inverse-border: "#262626"
  inverse-on-surface: "#EDEDED"
  inverse-muted: "#A3A3A3"
  accent-orange: "#F97316"
  accent-green: "#10B981"
  accent-green-soft: "#62D1AF"
  accent-yellow: "#FACC15"
  domain-dev: "#2563EB"
  domain-design: "#DB2777"
  domain-ops: "#059669"
  domain-business: "#D97706"
  domain-ai: "#7C3AED"
  domain-marketing: "#E11D48"
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 124px
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: -0.05em
  display-lg:
    fontFamily: Geist
    fontSize: 88px
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: -0.045em
  headline-lg:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.035em
  title-lg:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Geist Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.2em
  label-sm:
    fontFamily: Geist Mono
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.2em
rounded:
  none: 0px
  sm: 2px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  grid-cell: 40px
  page-x-sm: 24px
  page-x-md: 48px
  page-x-lg: 96px
  section-y-md: 96px
  section-y-lg: 112px
  section-y-xl: 128px
  card-padding-md: 28px
  card-padding-lg: 48px
  gap-xs: 4px
  gap-sm: 8px
  gap-md: 16px
  gap-lg: 24px
  gap-xl: 48px
  max-width-wide: 100rem
  max-width-copy: 640px
borders:
  hairline: "1px solid #DCD7CE"
  strong: "2px solid #0A0A0A"
  inverse-hairline: "1px solid #262626"
  dashed-muted: "1px dashed rgba(10, 10, 10, 0.3)"
shadows:
  none: "none"
  brutal-sm: "6px 6px 0px #0A0A0A"
  brutal-md: "8px 8px 0px #0A0A0A"
  nav: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  subtle: "0 1px 2px rgba(0, 0, 0, 0.05)"
elevation:
  flat: "No shadow; use contrast, bands, rules, and borders for hierarchy."
  hover-lift: "Translate -2px on both axes and add the brutal-md offset shadow."
  overlay: "Use a translucent warm or black surface with backdrop blur."
motion:
  fast: "0.3s"
  normal: "0.6s"
  slow: "0.8s"
  smooth-ease: "cubic-bezier(0.16, 1, 0.3, 1)"
  marquee: "20s linear infinite"
components:
  page-background:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.page-x-sm}"
  warm-grid-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    size: "{spacing.grid-cell}"
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  muted-panel:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  accent-panel:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-lg}"
  brutal-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  inverse-section:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.section-y-md}"
  inverse-card:
    backgroundColor: "{colors.inverse-surface-raised}"
    textColor: "{colors.inverse-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  primary-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 56px
    padding: "{spacing.gap-lg}"
  primary-cta-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-lg}"
  nav-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 40px
    padding: "{spacing.gap-md}"
  secondary-link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.gap-sm}"
  mono-label:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-xs}"
  muted-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  top-strip-dot:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-xs}"
  hard-rule:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.on-primary}"
    height: 2px
  subtle-rule:
    backgroundColor: "{colors.border}"
    textColor: "{colors.foreground}"
    height: 1px
  inverse-rule:
    backgroundColor: "{colors.inverse-border}"
    textColor: "{colors.inverse-on-surface}"
    height: 1px
  inverse-muted-copy:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-muted}"
    typography: "{typography.body-sm}"
  status-green:
    backgroundColor: "{colors.accent-green}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  status-orange:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  status-yellow:
    backgroundColor: "{colors.accent-yellow}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  status-mint:
    backgroundColor: "{colors.accent-green-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  domain-dev-badge:
    backgroundColor: "{colors.domain-dev}"
    textColor: "#FFFFFF"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-design-badge:
    backgroundColor: "{colors.domain-design}"
    textColor: "#FFFFFF"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-ops-badge:
    backgroundColor: "{colors.domain-ops}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-business-badge:
    backgroundColor: "{colors.domain-business}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-ai-badge:
    backgroundColor: "{colors.domain-ai}"
    textColor: "#FFFFFF"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-marketing-badge:
    backgroundColor: "{colors.domain-marketing}"
    textColor: "#FFFFFF"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
---

## Overview

The Vibe Company design system is a warm-paper brutalist editorial system for an AI-native agency. It should feel direct, engineered, fast, and transparent: a product team showing the work instead of wrapping it in glossy marketing ornament.

The dominant impression is deep black ink on a slightly warm paper canvas. Layouts are spacious but not soft. Large type, thin technical grid lines, monochrome rules, uppercase mono labels, and blunt black calls to action create the feeling of a shipping console crossed with an independent studio site. The interface should feel confident and operational, not decorative.

The homepage is the core expression: warm paper, giant tight typography, outlined headline words, black slab buttons, bordered cards, and horizontal bands. Portfolio and resources screens use the same vocabulary in quieter modes: dark production surfaces for project work and calm paper surfaces for reading.

## Colors

The palette is intentionally restrained. Warm paper and deep ink carry most of the product; color appears as a precise signal rather than a decorative fill.

- **Warm Paper (#FDFBF7):** The primary canvas. It is warmer than white and keeps the stark black typography from feeling sterile.
- **Deep Ink (#0A0A0A):** The core brand color for headlines, rules, buttons, dark bands, and footer surfaces.
- **Studio White (#FFFFFF):** Used for resource cards and raised surfaces that need a cleaner reading plane.
- **Muted Paper (#F3F0EA):** A secondary surface for subtle panels, hover states, and calm-studio areas.
- **Constructed Border (#DCD7CE):** The warm gray line used for grids, dividers, inputs, and low-emphasis structure.
- **Inverse Black (#030303/#121212):** Used for process, portfolio, and footer sections. These should feel matte and production-grade, not glossy.
- **Signal Accents:** Orange marks YC and occasional attention points. Green, yellow, and mint identify product status or portfolio accents. Domain colors are reserved for resource taxonomy and should stay small.

Avoid large colorful areas. The site should remain primarily black, warm paper, and linework.

## Typography

Typography is the strongest identity element. Use Geist for all display, heading, and body text. Use Geist Mono for operational metadata, labels, dates, statuses, nav breadcrumbs, counters, and marquee text.

Display typography is oversized, bold, and tightly tracked. Headlines should use heavy weight with very compressed line height, often below 1.0. This creates the blunt, poster-like agency voice visible on the homepage. Use outline text sparingly as a second-line emphasis in hero and major proof sections.

Body copy is plain and readable. Keep it compact, usually 14-19px with 1.5-1.55 line height. The body voice should feel explanatory and pragmatic, not poetic.

Mono labels are uppercase with generous letter spacing. They behave like interface instrumentation: section numbers, dates, build status, small navigation hints, and marquee text.

## Layout

Use full-width bands and wide inner containers. The primary desktop container can stretch up to 100rem; smaller prose areas should stay near 640px. Page gutters start at 24px, move to 48px on medium screens, and can reach 96px on large screens.

The homepage grid is a key brand asset. Use a 40px square technical grid on warm-paper sections where the page needs energy or a sense of construction. Keep the grid subtle and masked so it supports the composition without competing with text.

Sections use large vertical spacing, typically 96-128px. Layouts should feel roomy at the band level but dense inside components. Cards and rows use strong alignment, visible dividers, and predictable columns.

Resources and portfolio screens are more utilitarian. They should keep the same mono metadata, tight headings, thin dividers, and warm borders, but reduce spectacle in favor of scanability.

## Elevation & Depth

Depth is mostly flat. Hierarchy comes from contrast, bands, borders, whitespace, and typography rather than soft drop shadows.

Use the brutal offset shadow only for interactive lift on important cards and primary CTAs. The pattern is a slight up-left translation paired with a hard black shadow, usually 6px or 8px. This should feel mechanical and tactile.

Navigation and overlays may use translucent surfaces with backdrop blur, but they should remain crisp. Avoid frosted-glass aesthetics, colored glows, floating blobs, and ambient shadows.

Dark sections should feel like solid matte slabs. Separate content inside them with low-opacity rules and muted inverse text.

## Shapes

The shape language is sharp. Most containers, cards, inputs, labels, and CTAs use square corners. This reinforces the studio's engineered, no-nonsense tone.

Use full pills only for global navigation CTAs, compact nav hover states, tiny status dots, and small rounded badges where the shape communicates status rather than content grouping.

Do not mix many radii in one view. If a surface is a card or a major action, square is the default. If it is a navigation or status affordance, a pill is acceptable.

## Components

Primary CTAs are black slabs on warm paper. They use bold Geist text, clear padding, square corners, and a right arrow when action-oriented. Hover states should lift slightly and gain a hard offset black shadow.

Cards are bordered rectangles, not soft containers. Service cards and product cards use black or warm-gray borders, square corners, tight internal hierarchy, mono metadata, and optional hard hover shadows. Resource cards use calmer warm borders and may sit on white surfaces.

Navigation is sticky, translucent, and understated. The wordmark is mono, compact, and paired with a small black logo. Desktop links are quiet until hover. The contact CTA is a black pill in the global nav, distinct from the square slab CTAs used in content.

Labels, tags, counters, and status chips use Geist Mono, uppercase text, wide tracking, and small scale. They should feel like technical readouts. Status dots can pulse, but they should remain tiny.

Rules and dividers are part of the visual language. Use thin warm-gray rules for routine separation and 2px deep-ink rules for major structural breaks.

## Do's and Don'ts

- Do use warm paper, deep ink, strong typography, and exact alignment as the default visual foundation.
- Do make section hierarchy with bands, rules, scale, and contrast before adding decorative effects.
- Do keep accents small and meaningful: status, taxonomy, product identity, or one key attention marker.
- Do reserve Geist Mono for metadata and operational UI, not long-form prose.
- Do use square corners for content surfaces and slab CTAs.
- Don't introduce marketing-style gradients, decorative orbs, soft bokeh, or colorful background washes.
- Don't turn pages into nested card layouts. Use full-width bands and unframed layouts first.
- Don't over-round cards, inputs, or buttons. Pills are for nav and status.
- Don't use soft ambient shadows as the main hierarchy tool.
- Don't let resource/domain colors overpower the monochrome brand system.
