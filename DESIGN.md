---
version: alpha
name: The Vibe Company
description: "An ink-and-warm-paper AI-native agency design system: ink heroes with the mascot in its orange light, warm paper bands for the work, giant tight display type, hairline rules, mono metadata, paper slab calls to action and one orange signal."
colors:
  primary: "#F4F3EF"
  on-primary: "#0C0C0D"
  secondary: "#9C9A94"
  tertiary: "#F27313"
  neutral: "#0C0C0D"
  background: "#0C0C0D"
  foreground: "#F4F3EF"
  soft-foreground: "#C9C7C1"
  surface: "#141415"
  surface-muted: "#1A1A1B"
  border: "#2C2C2D"
  border-strong: "#4A4946"
  muted: "#807E7A"
  muted-foreground: "#9C9A94"
  accent: "#1A1A1B"
  accent-foreground: "#E9E7E1"
  popover: "#161617"
  inverse-surface: "#141415"
  inverse-surface-raised: "#1A1A1B"
  inverse-border: "#2C2C2D"
  inverse-on-surface: "#F4F3EF"
  inverse-muted: "#9C9A94"
  accent-orange: "#F27313"
  accent-green: "#10B981"
  accent-green-soft: "#62D1AF"
  accent-yellow: "#FACC15"
  domain-dev: "#6EA8FE"
  domain-design: "#F472B6"
  domain-ops: "#34D399"
  domain-business: "#FBBF24"
  domain-ai: "#A78BFA"
  domain-marketing: "#FB7185"
  paper: "#F4F2EC"
  paper-surface: "#FBFAF7"
  paper-accent: "#EBE7DE"
  paper-ink: "#0C0C0D"
  paper-soft: "#34322E"
  paper-muted: "#5D5A54"
  paper-border: "#DCD7CC"
  paper-border-strong: "#B8B1A4"
  lit-glow: "#FFC488"
  lit-ember: "#8A3A06"
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 196px
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: -0.055em
  display-lg:
    fontFamily: Geist
    fontSize: 144px
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: -0.05em
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
  subhead-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: -0.03em
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
    lineHeight: 1.6
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
  cta-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  wordmark:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.2em
  label-md:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 400
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
  status-square: 8px
  page-x-sm: 24px
  page-x-md: 40px
  page-x-lg: 64px
  nav-height: 84px
  section-y-sm: 56px
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
  max-width-wide: 90rem
  max-width-copy: 640px
borders:
  hairline: "1px solid #2C2C2D"
  strong: "1px solid #4A4946"
  inverse-hairline: "1px solid #2C2C2D"
  dashed-muted: "1px dashed #2C2C2D"
shadows:
  none: "none"
  stage-sm: "6px 6px 0px #4A4946"
  stage-md: "8px 8px 0px #2C2C2D"
  popover: "0 24px 60px -12px rgba(0, 0, 0, 0.7)"
  card-hover: "0 18px 50px -12px rgba(0, 0, 0, 0.6)"
glows:
  hero-bloom: "radial-gradient(closest-side, rgba(242, 115, 19, 0.16), rgba(242, 115, 19, 0.05) 55%, transparent)"
  closing-bloom: "radial-gradient(closest-side, rgba(242, 115, 19, 0.13), rgba(242, 115, 19, 0.04) 55%, transparent)"
elevation:
  flat: "No shadow; use contrast, bands, rules, and borders for hierarchy."
  hover-step: "The border steps up to border-strong and the surface lifts to surface; nothing moves."
  raised-band: "An inverse band is a raised ink panel (surface), never a paper slab."
  overlay: "Use a translucent ink surface with backdrop blur."
motion:
  fast: "0.3s"
  normal: "0.7s"
  slow: "1.1s"
  smooth-ease: "cubic-bezier(0.16, 1, 0.3, 1)"
  exit-ease: "cubic-bezier(0.4, 0, 1, 1)"
  page-exit: "0.18s"
  page-enter: "0.42s"
  page-enter-delay: "0.08s"
  marquee: "20s linear infinite"
components:
  page-background:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.page-x-sm}"
  hero-display:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
  hero-subhead:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.subhead-lg}"
  hero-lede:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-lg}"
  status-kicker:
    backgroundColor: "{colors.background}"
    textColor: "{colors.soft-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 0px
  status-square:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    size: "{spacing.status-square}"
  secret-level:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.page-x-lg}"
  paper-band:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.section-y-xl}"
  lamp-card:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  lamp-card-copy:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.paper-soft}"
    typography: "{typography.body-sm}"
  lit-figure:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.lit-ember}"
    typography: "{typography.headline-lg}"
  lit-figure-on-ink:
    backgroundColor: "{colors.background}"
    textColor: "{colors.lit-glow}"
    typography: "{typography.headline-lg}"
  paper-muted-copy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-muted}"
    typography: "{typography.body-sm}"
  paper-rule:
    backgroundColor: "{colors.paper-border}"
    size: 1px
  paper-strong-rule:
    backgroundColor: "{colors.paper-border-strong}"
    size: 1px
  paper-raised:
    backgroundColor: "{colors.paper-accent}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.body-sm}"
  closing-scene:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: "{spacing.section-y-lg}"
  runner-reward-cta:
    backgroundColor: "{colors.inverse-on-surface}"
    textColor: "{colors.inverse-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.gap-md}"
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
  hairline-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  hairline-card-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-md}"
  tag-chip:
    backgroundColor: "{colors.background}"
    textColor: "{colors.soft-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-xs}"
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
    typography: "{typography.cta-md}"
    rounded: "{rounded.sm}"
    height: 52px
    padding: "{spacing.gap-lg}"
  primary-cta-hover:
    backgroundColor: "{colors.soft-foreground}"
    textColor: "{colors.on-primary}"
    typography: "{typography.cta-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.gap-lg}"
  nav-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: "{spacing.gap-md}"
  nav-link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.soft-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 0px
  nav-wordmark:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.wordmark}"
    rounded: "{rounded.none}"
    padding: 0px
  outline-cta:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.cta-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.gap-lg}"
  text-cta:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.cta-md}"
    rounded: "{rounded.none}"
    padding: 0px
  secondary-link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  mono-label:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-xs}"
  popover-menu:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  fact-table-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  muted-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  strong-rule:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.foreground}"
    height: 1px
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
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  status-yellow:
    backgroundColor: "{colors.accent-yellow}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  status-mint:
    backgroundColor: "{colors.accent-green-soft}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "{spacing.gap-sm}"
  domain-dev-badge:
    backgroundColor: "{colors.domain-dev}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-design-badge:
    backgroundColor: "{colors.domain-design}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-ops-badge:
    backgroundColor: "{colors.domain-ops}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-business-badge:
    backgroundColor: "{colors.domain-business}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-ai-badge:
    backgroundColor: "{colors.domain-ai}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
  domain-marketing-badge:
    backgroundColor: "{colors.domain-marketing}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.gap-sm}"
---

## Overview

The Vibe Company design system is an ink-black editorial system for an AI-native agency. It should feel direct, engineered, fast, and transparent: a product team showing the work instead of wrapping it in glossy marketing ornament.

The dominant impression is a page that opens at night and works by day: every page starts on near-black ink, with warm paper type and the mascot or a headline in an orange light, then turns to warm paper for the work itself, comes back to ink for a moment of emphasis (a client's words, how we work), and ends on a rendered scene. Layouts are spacious but not soft. Giant tightly tracked type, hairline rules, uppercase mono labels, a single orange square as the status mark, and paper slab calls to action create the feeling of a shipping console crossed with an independent studio's workbench. The interface should feel confident and calm, never decorative.

The homepage is the core expression. Its hero opens on ink with a mono kicker led by a small orange square ("open to projects"), then the display headline ("Agence IA-First.") set on one line that fills the whole content width. Beneath it, on the left, a medium-weight paper subheading, a muted one-paragraph lede, a paper booking slab with an arrow (lit from below by a soft orange shadow) beside an underlined text link, a hairline, and a credential row: the Y Combinator square and name, the France 2030 roundel drawn in paper, and the response time in mono. On the right stands the mascot alone, glossy black and white with an orange rim light, floating a few pixels and leaning with the pointer, in a low orange bloom; it is the hero's only picture. The paper band that follows is its floor: the mascot is cut at the chest exactly where the paper starts, as if it stood behind the edge of the sheet. Then, on paper, the client logos run in a slow loop with no heading, the three offers stand as lamp cards, and the client cases follow as lamp cards whose headline figure always fits on one line. The client quote is an ink band in the orange light, our products come back on paper as a ruled list, and the page ends on the closing scene: the mascot at the start of a road at sunset, map in hand, pointing at where it leads, with the call to action set over the landscape. Every other page follows the same arc: ink hero, paper for the work, ink for emphasis, the same closing scene.

The homepage also hides its runner game. On a desktop with a hovering pointer, the space bar (or a click on the mascot) makes the mascot crouch and leap out of the hero, and a full-screen "secret level" opens out of it as a growing circle lit orange at its centre; the run starts on its own, with the mascot as the runner. Escape closes it back into the mascot, which drops back in. Nothing on the page announces it beyond a small mono "[ space ] play" that appears when the mascot is hovered.

An experimental preview of an older homepage lives at `/v2`. It keeps the full site chrome and swaps the hero for a playable canvas runner whose worlds each carry their own art direction. It is superseded by the homepage and its secret level, and shares no code with them.

## Colors

The palette is intentionally restrained. Ink and warm paper carry almost everything; colour appears as a precise signal rather than a fill.

- **Ink (#0C0C0D):** Where every page starts and ends: the hero, the bands of emphasis, the closing scene, the nav and the footer. It is a hair warmer than pure black, so the mascot's own black backdrop dissolves into it. The site never flips with the system theme.
- **Warm Paper band (#F4F2EC):** The light the work is shown in. A paper band turns the whole token set over: ink text (#0C0C0D), soft ink (#34322E) for copy that must stay strong, muted ink (#5D5A54) for ledes and metadata, card surfaces a step lighter (#FBFAF7), hairlines (#DCD7CC) and strong rules (#B8B1A4) in warm greys. Everything inside a band is written against the same tokens as on ink, so a section moves between the two without a single change.
- **Warm Paper (#F4F3EF):** Headlines, body emphasis, primary slab buttons, and the strokes of outlined display type. It is warmer than white and keeps the giant type from glaring.
- **Soft Paper (#C9C7C1):** Navigation links, the hero kicker, tag chips: text that must stay readable without competing with the headline.
- **Muted (#9C9A94 / #807E7A):** Ledes, captions, mono metadata and secondary labels. Both stay above 4.5:1 on ink.
- **Raised Ink (#141415 / #1A1A1B):** Inverse bands, the footer, popovers, card hover states and reading panels. A raised surface is how this system says "inverted"; it never turns a band into a paper slab.
- **Hairline (#2C2C2D):** Every routine rule: under the nav, around cards, between rows, at the hero floor. **Strong Rule (#4A4946)** is the one step up, for tag chips, outline buttons and hovered cards.
- **Signal Orange (#F27313):** The status square, the active nav underline, the lamp bar over a card, the blooms, and the end of the lit gradient.
- **Lit gradient:** A word or a figure lit from below. On ink it runs from paper through a pale glow (#FFC488) into the orange; on paper from ink through an ember (#8A3A06) into the orange. It is reserved for the second line of a section headline, the numerals of an offer or a step, and a case's headline figure. Y Combinator's square keeps YC's own orange (#F26522) because it is their mark. Green, yellow and mint identify product status or portfolio accents. Domain colours, lifted to stay legible on ink, are reserved for resource taxonomy and stay small.
- **Per-world art direction (game canvas only):** Inside a runner, each world repaints the canvas with its own tint. These palettes are scoped to the game canvas and never change the chrome around it.

Avoid large coloured areas. The site should remain ink, paper, and linework, with orange as light rather than paint. Client logos are drawn in the band's own ink: paper on ink, ink on paper (their own colours would vanish or clash); product icons keep their colours because they are app icons.

## Typography

Typography is the strongest identity element. Use Geist for all display, heading, and body text. Use Geist Mono for operational metadata, labels, dates, statuses, the wordmark, counters, and marquee text.

Display typography is oversized, bold, and tightly tracked. The homepage headline is set to fill the content width exactly on one line (about 196px at a 1440px window, tracked -0.055em, leading 0.86), so its size follows the copy rather than a fixed scale: a longer English line simply sets smaller. Section headings keep the blunt poster voice at 56-144px with leading below 1.0, and may draw their second line as a paper outline for short emphasis. The homepage hero itself never uses outlines or highlighter strokes: its headline is one solid slab of paper, and its subheading is a calmer medium weight beneath it.

Body copy is plain and readable. Keep it compact, usually 14-19px with 1.5-1.6 line height, and muted rather than full paper for ledes. The body voice should feel explanatory and pragmatic, not poetic.

Mono labels are uppercase with generous letter spacing. They behave like interface instrumentation: section kickers, numbers, dates, build status, small navigation hints, and marquee text. Every section kicker opens with the orange square, never with a typed prefix like `//`.

## Layout

Pages are a sequence of full-width bands that alternate ink and warm paper, with clean cuts between them and no fades: an ink hero, paper bands for the content, an ink band for emphasis, more paper, and the closing scene on ink. Use one shared inner container: 90rem wide, with gutters of 24px on phones, 40px from 768px, and 64px from 1024px. The nav, the hero, every section and the footer start on the same line. Smaller prose areas stay near 640px; detail pages may use a narrower 80rem rail with the same gutters.

Rules stop at the gutters. The hairline under the nav and the hero's floor run between the page margins rather than edge to edge, so the page reads as a framed sheet. Full-bleed rules are kept for bands that are themselves full-bleed, such as the client logo marquee.

Sections use large vertical spacing, typically 80px on phones and 112-128px on desktop; sections inside one band are separated by a hairline rather than by a change of colour. Layouts should feel roomy at the band level but dense inside components. Cards and rows use strong alignment and predictable columns. Lists (questions and answers, steps, bullet points) separate their rows with space, not rules: a hairline closes a band or a section, frames a card, or rules a real table (key facts, contact details), and never sits under every row of a list.

A faint 40px technical grid may sit behind reading-light pages as a fixed overlay, drawn in the hairline colour at low opacity; it is never placed behind the hero.

Resources and portfolio screens are more utilitarian. They keep the same mono metadata, tight headings and hairlines, but reduce spectacle in favour of scanability.

## Elevation & Depth

Depth is mostly flat. Hierarchy comes from contrast, raised bands, hairlines, whitespace, and typography.

Interactive cards do not lift or throw offset shadows. On hover their hairline steps up to the strong rule and their surface steps up one shade; nothing moves. A product card hovers to its own accent colour instead. Primary slabs dim slightly from paper to soft paper, and their arrow nudges right. The one static exception is a product shot drawn in code, whose window may keep a fixed offset shadow in hairline grey to read as an object set on the stage; it never lifts on hover.

Light, not shadow, makes depth, and it is always orange and always comes from somewhere: a low bloom behind the hero mascot or headline, a soft radial glow in an ink band of emphasis, and the lamp over a card, a short orange bar on the card's top edge throwing a warm cone down onto it that brightens on hover. Blooms and glows stay wide and dim (around 20% orange at their centre). A lit word or figure is the only light that touches type, and the hero's booking slab the only button lit from below. Never add glows anywhere else.

Navigation and overlays use translucent ink with backdrop blur and stay crisp. Popovers sit on raised ink with a strong rule and a deep, soft black shadow, the only ambient shadow in the system, because a menu must separate from ink.

Inverse bands are raised ink panels (#141415) set between hairlines. In code they swap the page's two main tokens, so everything inside written as "ink on paper" draws as paper on raised ink. Keyboard focus rings follow the surface: two pixels of paper on the page, and paper again inside an inverse band, so focus never disappears.

Moving between pages is the one place depth moves. The page being left lifts off by 12px and fades out in 0.18s on a sharp ease-in; a beat later (0.08s) the next page rises 24px into place and fades in over 0.42s on the smooth ease-out. The nav bar never takes part: it stays exactly where it is, already showing the new active link, so only the page under it changes, over the ink background. A change inside a page (a search query, a filter) does not animate, the browser's back button swaps pages instantly, and with reduced motion requested the pages simply cross-fade in a fraction of that time without moving.

## Shapes

The shape language is sharp. Containers, cards, inputs, labels, and tags use square corners. Slab calls to action round their corners by just 2px, enough to read as a pressable object without softening the system.

Use full pills only for tiny status dots and small rounded badges where the shape communicates status rather than content grouping. The status mark that opens a kicker is a square, not a dot.

Do not mix many radii in one view. If a surface is a card, square is the default; if it is a button, 2px.

## Components

Primary CTAs are paper slabs on ink: dark Geist text at medium weight, 52px tall in content (44px in the nav), 2px corners, and a right arrow when action-oriented that nudges right on hover while the slab dims to soft paper. A secondary action next to one is an underlined paper text link, never a second slab. Outline buttons, where a page needs one, are ink with a strong rule that turns paper on hover.

Cards are hairline rectangles, not soft containers. Service cards, case cards and project cards use the hairline, square corners, tight internal hierarchy, mono metadata in strong-ruled tag chips, and the hover step described above. On the homepage, our own products sit in a single-row loop carousel with the same orange arrows as the case studies; each product card borrows that product's own accent as a quiet signature: a 3px rule across the top, a small dot beside the mono category, the product logo next to its name, and on hover its border turns the accent. The accent never fills the card or colours its text. Resource cards use the same hairlines on a slightly raised surface.

A lamp card is the house card on paper: a hairline rectangle on the slightly lighter card surface, a short orange bar centred on its top edge with its glow, and a warm cone of light thrown down from it that brightens on hover or focus. Offers, cases and the main steps of a service use it; secondary cards stay plain hairline rectangles on the card surface. A lamp card's numeral (01, 02, 03) or headline figure is set in the lit gradient; a case's figure is fitted to the card's width so it always sits on one line, whatever its length.

The client logos run as one slow loop across a paper band, drawn in ink, with no heading: the names speak for themselves. The row fades in and out at the band's edges, stops while hovered, and never moves when reduced motion is requested.

An ink band of emphasis (the homepage's client quote, a service's way of working) sits between two paper bands with a soft orange glow rising from one corner. A quote hangs a giant orange quotation mark off its first line and picks out the phrase that sums the work up in orange.

The closing scene ends every page that ends on a call to action. A rendered scene runs full width and most of the screen's height: the mascot at the start of a road at sunset, a map in hand, pointing at where it leads. It slowly settles from a slight zoom as it scrolls in. Ink gradients darken its top, bottom and right edge, and the copy stands on the right over the landscape: the mono kicker, the question set large in paper, the booking slab lit from below, and the response time and email in mono. On a phone the copy sits at the bottom over the scene.

The homepage's secret level is a full-screen ink overlay with a low orange glow, a mono "secret level" kicker and a close control ("Esc ×"), one short line ("Beat your record, the audit is on us.") and the runner panel. The runner is the game described above, with the mascot as the player: drawn in profile, it runs with knees bending and a bounce on every step, pumping arms and dust left behind; it tucks its legs on the way up and flips forward on a double jump; it slides feet first to duck, staying under the ceiling bars; and when it crashes it tips over onto its back, legs in the air, with a crossed eye, drawn over the veil so it stays in view. Obstacles state the move, not the object: paper to jump, orange to double jump, yellow to duck. Each world belongs to one real client, project or backer, announced as a giant hollow name across the sky. Beating an existing personal best opens a row under the canvas offering the free audit. Sound exists only while a run does. The level exists only on a desktop with a hovering pointer; elsewhere the mascot is just a picture and the game's code is never fetched.

On a phone the homepage keeps the same sequence in one column: the hero's text, then the mascot beneath it cut by the paper floor, the logo loop, the offers and cases stacked as lamp cards, the quote band, the products list and the closing scene. Once the hero has scrolled away, a slim bar fixed under the thumb, on translucent ink with a hairline above it, carries the response time and a compact booking button, and steps aside when the closing scene comes into view. Every phone tap target is at least 44px tall.

A service landing (the agency in Paris, agents in production, hardening, media, custom apps, healthcare) opens exactly like the homepage: the mono kicker, a short headline of a few words set to fill the content width ("Agence IA Paris."), the page's full title beneath it in the hero's medium weight as its promise (the two together are the page's heading, the short one hidden from screen readers so the name is read once), the pitch, the booking slab and the credentials on the left, and the mascot on the right in its orange light, cut at the chest by the paper band. The paper opens on the client logo loop (except where a page deliberately names one client only, as the healthcare page does) and a short strip of sourced facts in three or four columns, then the page's own sections.

A page that cannot be found keeps the ink and the mascot: a giant lit "404", the headline, one line of explanation and a slab back home, with the mascot standing in its light on the right.

The mark itself is published once, under `public/brand`, so anything outside the site (an email signature, a deck, a partner page) links to the same file instead of carrying its own copy. Three variants, each as a transparent PNG at 192px and 512px wide: the rounded black square with white arcs for light backgrounds, the arcs alone in black for light backgrounds without the square, and the arcs alone in white for ink backgrounds. `public/favicon.svg` stays the in-product mark and the vector source both derive from; the site draws the arcs alone, in the colour of the text beside them, from that same path. When the logo changes, they all move together. These URLs are linked to, never surfaced by the site, and are served `noindex, noimageindex`.

Navigation is sticky, translucent ink, and understated, 84px tall on desktop with a hairline beneath it that stops at the gutters. The wordmark is the paper arcs beside "THE VIBE CO." in wide-tracked mono. Links are soft paper at 14px, brighten to paper on hover, and the current section gains a thin orange underline. Then the language switch (`FR | EN` in mono, the current one in paper, the other muted, split by a strong hairline), an envelope icon that opens an email to the founders, and the booking slab. The mobile menu is an opaque ink sheet, never a translucent one, that keeps the wordmark exactly where the bar had it, lists the links in large bold type, and leads with the booking slab, with a quiet underlined contact link beneath it that opens a two-row panel in place (book a call, email us, split by a hairline, each inverting on hover and keyboard focus), pushing the language switch down rather than floating over it. In the footer, the link lists sit two by two under the wordmark on a phone rather than stacking.

An article that exists in both languages is published once in the resources list, in the language being browsed, and carries its own language switch rather than appearing twice. The switch reuses the flag already used as a language marker and borrows the `FR / EN` idiom from the global nav: the version on screen at full strength, a hairline slash, then the other language dimmed until hover, linking to that version's own URL. An article published in a single language keeps showing its lone flag, with nothing added. The switch sits in the card's mono metadata row and, on the article itself, under the sidebar's language label, so the affordance reads as metadata rather than as a second call to action.

The open-source project grid uses the canonical five-product catalogue. Its organization-level GitHub action is an underlined mono text link, never an orange slab or filled button.

Case-study product imagery keeps the product UI legible instead of treating screenshots as decoration. Portrait mobile captures may sit beside the overview at no more than 360px wide; wide desktop captures span the case-study content section. Preserve each image's intrinsic ratio, localized alternative text, hairline frame, and responsive dimensions. A product page may show its main UI capture inside a browser window drawn in the house style: a hairline frame, a thin ruled title bar with outlined window dots (the last one the orange status signal) and a mono label. The capture keeps its ratio and is never cropped to fit the frame.

A product with no screenshot to show is drawn in code as a product shot instead: the app's window in the house style (hairline frame, the product's accent as a 3px top rule, a static offset shadow in hairline grey) set on a framed stage of raised ink ruled with a faint 32px grid, inset top and left and running off the right and bottom edges, so it reads as a product rather than a screenshot in a box. Real words appear only where the story is; the rest of the screen is quiet placeholder bars. One satellite card, framed by a hairline with a strong-rule offset shadow, straddles the window's left edge over filler and carries the result. Its features follow as a ruled bento grid: one frame, hairlines between cells, a run-in title (bold lead, muted continuation) at the top of every tile, and a different kind of picture in each neighbour (one component, a large-type statement, a collection, a diagram), with exactly one raised tile as punctuation. Every picture plays one short beat, once, as it scrolls in, eased on two curves (travel and arrival); nothing loops, and with reduced motion each picture simply shows its final frame.

The footer is a raised ink panel under a hairline, on a four-column desktop grid: a wide identity and contact column followed by site navigation, the service offerings (short labels, one per commercial landing), and external links. On small screens the identity column spans the width and the link lists pair up two per row. The lower status line remains visible below the divider and carries the privacy policy link, set in the same mono caps as the status items with a thin underline. The footer closes every listed page, Resources included, with the same tokens everywhere.

The contact and privacy pages are text-first trust pages on ink, rendered as plain HTML with no reveal motion. Contact opens like About (mono kicker with the orange square, large paper headline, lede hung off a strong left rule) with a single booking slab, then a large underlined email address beside a ruled list of company details. The privacy policy reads as a ledger: a numbered table of contents pinned on the left on wide screens, numbered sections, hairline cards for each data source, and ruled tables (mono first column) that stack into labelled cards on a phone.

Reference tables state facts rather than decorate them. A key-facts table sits inside a single hairline block with square corners, a hairline under its header row and between rows. The left column is a mono, uppercase, wide-tracked label in muted paper, holding a fixed share of the width so every value starts on the same line; the right column is plain body copy, with links underlined rather than coloured. A fact we have not confirmed leaves its cell empty: a visible gap is honest, an invented value is not.

An article that compares several providers is laid out as a dossier, not as a wall of prose. It opens with an "in short" card on raised ink holding a mono kicker, one or two sentences and a row of chips, each a hairline-bordered rectangle with a small square tile carrying the provider's mark, jumping to that provider's card. The tile shows the provider's own square logo (its official favicon-style mark, centred on white inside a hairline) when the article supplies one, and the provider's initial when it does not. A "which one for your case" picker follows as a raised ink panel: one row per situation, a muted arrow, and a paper-outlined target with the same mark tile (a logo tile stays white; an initial tile inverts to paper). The comparison table is a spec sheet inside a hairline frame: mono header row on raised ink above a hairline, a row header per provider with its mark tile, faint zebra rows, and marks rather than words, a small filled paper square with a check for what a provider puts forward and a faint hollow ring for what its cited pages do not, with a mono legend underneath saying exactly that. On wide screens the header row sticks under the navigation; below 720px the table scrolls sideways inside its own frame, never the page, with the provider column pinned and the right edge fading out. Each provider then gets a card: a large mark tile (logo or initial) and its name, a muted tagline, a ruled list of facts with mono labels on a fixed column, and a two-panel verdict at the foot, "choose if" with a check and "skip if" with a cross. Every provider gets the same treatment, ours included: every logo sits in the same white square at the same size, never in colour bands or accents, so no provider is favoured. The tiles have a fixed size and the logo images carry their dimensions, so nothing shifts while they load. Asides such as an editorial rule or a disclosure are quiet callouts: raised ink, hairline frame, a 3px paper rule on the left and a mono kicker with a line icon. All of it is server-rendered HTML with inline line icons and no script.

Labels, tags, counters, and status chips use Geist Mono, uppercase text, wide tracking, and small scale. They should feel like technical readouts. The status mark is a still 8px orange square; it does not pulse.

Rules and dividers are part of the visual language. Use the hairline for routine separation and the strong rule for anything that must read as an edge (a tag chip, an outline button, a hovered card, a lede's left rule).

## Do's and Don'ts

- Do use ink, warm paper type, hairlines, and exact alignment as the default visual foundation.
- Do open every page on ink and show the work on warm paper bands, switching with a clean cut, never a fade.
- Do let the homepage headline fill the content width on one line, and keep every rule inside the gutters.
- Do make section hierarchy with raised bands, rules, scale, and contrast before adding effects.
- Do keep orange small and meaningful: the status square, an active underline, the lamp bar, the blooms, and the lit gradient on a few chosen words and figures.
- Do reserve Geist Mono for metadata and operational UI, not long-form prose.
- Do use square corners for content surfaces and 2px corners for slab CTAs.
- Do keep page changes short and vertical: the old page lifts away, the new one rises, the nav stays put.
- Do draw client logos in the band's own ink (paper on ink, ink on paper), and preserve partner-logo and product-screenshot aspect ratios at every breakpoint.
- Don't turn an inverse band into a paper slab; inverse means raised ink. Don't nest a raised-ink panel inside a paper band: emphasis on paper is a lamp card, and emphasis between paper bands is an ink band.
- Don't bring back offset "brutal" hover shadows or hover translations on cards and buttons.
- Don't add glows, gradients or colour washes beyond the blooms, the ink bands' glow, the lamps and the lit gradient.
- Don't put more than one rendered scene on a page: the hero has the mascot alone, and the closing scene is the only illustration.
- Don't turn pages into nested card layouts. Use full-width bands and unframed layouts first.
- Don't over-round cards, inputs, or buttons. Pills are for status only.
- Don't turn the GitHub catalogue link into a filled promotional CTA.
- Don't let resource/domain colours overpower the monochrome brand system.
