---
version: alpha
name: The Vibe Company
description: "An ink-black, warm-paper-type AI-native agency design system: giant tight display type, hairline rules, mono metadata, paper slab calls to action and one orange signal."
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
  runner-band:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.page-x-sm}"
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

The dominant impression is warm paper type on near-black ink. Layouts are spacious but not soft. Giant tightly tracked type, hairline rules, uppercase mono labels, a single orange square as the status mark, and paper slab calls to action create the feeling of a shipping console at night crossed with an independent studio site. The interface should feel confident and calm, never decorative.

The homepage hero is the core expression. It opens with a mono kicker led by a small orange square ("open to projects"), then the display headline ("Agence IA-First.") set on one line that fills the whole content width. Beneath it, on the left, a medium-weight paper subheading on two lines, a muted one-paragraph lede, a paper booking slab with an arrow beside an underlined text link, a hairline, and a credential row: the Y Combinator square and name, the France 2030 roundel drawn in paper, and the response time in mono on the right. On the right stands the mascot, glossy black and white with an orange rim light, cut at the chest by a hairline floor that runs between the page gutters, with a low orange bloom behind it in the corner. That mascot and its bloom are the only warm light on the page, apart from the mirrored bloom behind the closing call. Portfolio and resources screens use the same vocabulary in quieter modes: the same ink, hairline cards for project work, and calm raised ink surfaces for reading.

An experimental preview of the homepage lives at `/v2`. It keeps the full site chrome (the same top nav, sections, footer, ink and Geist type) and only swaps the static hero for a playable, Chrome-dino-style runner on a canvas. Inside that canvas the game travels through a sequence of "worlds", each a product, a service, or the YC backing, and each world carries its own art direction (paper, ink, accent, and player colour) with a presentation panel that stays for the whole world. It is a preview, and it is now superseded: the canonical homepage carries its own, separate runner band described under Components below. The two share no code. Which one survives is an open decision: `/v2` and `src/components/home/runner/` are still in the tree.

## Colors

The palette is intentionally restrained. Ink and warm paper carry almost everything; colour appears as a precise signal rather than a fill.

- **Ink (#0C0C0D):** The canvas of every page, nav and footer included. It is a hair warmer than pure black, so the mascot's own black backdrop dissolves into it. The site never flips with the system theme: it is always ink.
- **Warm Paper (#F4F3EF):** Headlines, body emphasis, primary slab buttons, and the strokes of outlined display type. It is warmer than white and keeps the giant type from glaring.
- **Soft Paper (#C9C7C1):** Navigation links, the hero kicker, tag chips: text that must stay readable without competing with the headline.
- **Muted (#9C9A94 / #807E7A):** Ledes, captions, mono metadata and secondary labels. Both stay above 4.5:1 on ink.
- **Raised Ink (#141415 / #1A1A1B):** Inverse bands, the footer, popovers, card hover states and reading panels. A raised surface is how this system says "inverted"; it never turns a band into a paper slab.
- **Hairline (#2C2C2D):** Every routine rule: under the nav, around cards, between rows, at the hero floor. **Strong Rule (#4A4946)** is the one step up, for tag chips, outline buttons and hovered cards.
- **Signal Orange (#F27313):** The status square, the active nav underline, carousel arrows, numerals in process lists, and the two blooms. Y Combinator's square keeps YC's own orange (#F26522) because it is their mark. Green, yellow and mint identify product status or portfolio accents. Domain colours, lifted to stay legible on ink, are reserved for resource taxonomy and stay small.
- **Per-world art direction (preview hero only):** Inside the `/v2` runner hero, each world repaints the canvas with its own palette, including the player colour. These palettes are scoped to the game canvas and never change the chrome around it.

Avoid large coloured areas. The site should remain ink, paper, and linework. Client logos are drawn in paper on ink (their own colours would vanish or clash); product icons keep their colours because they are app icons.

## Typography

Typography is the strongest identity element. Use Geist for all display, heading, and body text. Use Geist Mono for operational metadata, labels, dates, statuses, the wordmark, counters, and marquee text.

Display typography is oversized, bold, and tightly tracked. The homepage headline is set to fill the content width exactly on one line (about 196px at a 1440px window, tracked -0.055em, leading 0.86), so its size follows the copy rather than a fixed scale: a longer English line simply sets smaller. Section headings keep the blunt poster voice at 56-144px with leading below 1.0, and may draw their second line as a paper outline for short emphasis. The homepage hero itself never uses outlines or highlighter strokes: its headline is one solid slab of paper, and its subheading is a calmer medium weight beneath it.

Body copy is plain and readable. Keep it compact, usually 14-19px with 1.5-1.6 line height, and muted rather than full paper for ledes. The body voice should feel explanatory and pragmatic, not poetic.

Mono labels are uppercase with generous letter spacing. They behave like interface instrumentation: section kickers, numbers, dates, build status, small navigation hints, and marquee text. Every section kicker opens with the orange square, never with a typed prefix like `//`.

## Layout

Use full-width bands and one shared inner container: 90rem wide, with gutters of 24px on phones, 40px from 768px, and 64px from 1024px. The nav, the hero, every section and the footer start on the same line. Smaller prose areas stay near 640px; detail pages may use a narrower 80rem rail with the same gutters.

Rules stop at the gutters. The hairline under the nav and the hero's floor run between the page margins rather than edge to edge, so the page reads as a framed sheet. Full-bleed rules are kept for bands that are themselves full-bleed, such as the client logo marquee.

Sections use large vertical spacing, typically 96-128px; on the phone homepage they open on 56px instead, because each section there starts with a compact ruled header rather than a giant headline. Layouts should feel roomy at the band level but dense inside components. Cards and rows use strong alignment, hairline dividers, and predictable columns.

A faint 40px technical grid may sit behind reading-light pages as a fixed overlay, drawn in the hairline colour at low opacity; it is never placed behind the hero.

Resources and portfolio screens are more utilitarian. They keep the same mono metadata, tight headings and hairlines, but reduce spectacle in favour of scanability.

## Elevation & Depth

Depth is mostly flat. Hierarchy comes from contrast, raised bands, hairlines, whitespace, and typography.

Interactive cards do not lift or throw offset shadows. On hover their hairline steps up to the strong rule and their surface rises to raised ink; nothing moves. A product card hovers to its own accent colour instead. Primary slabs dim slightly from paper to soft paper, and their arrow nudges right. The one static exception is a product shot drawn in code, whose window may keep a fixed offset shadow in hairline grey to read as an object set on the stage; it never lifts on hover.

Light is used exactly twice: a low orange bloom behind the hero mascot, and its mirror behind the closing call to action. Both are radial, wide, and dim (no more than 16% orange at their centre). Never add glows to cards, buttons or text.

Navigation and overlays use translucent ink with backdrop blur and stay crisp. Popovers sit on raised ink with a strong rule and a deep, soft black shadow, the only ambient shadow in the system, because a menu must separate from ink.

Inverse bands are raised ink panels (#141415) set between hairlines. In code they swap the page's two main tokens, so everything inside written as "ink on paper" draws as paper on raised ink. Keyboard focus rings follow the surface: two pixels of paper on the page, and paper again inside an inverse band, so focus never disappears.

## Shapes

The shape language is sharp. Containers, cards, inputs, labels, and tags use square corners. Slab calls to action round their corners by just 2px, enough to read as a pressable object without softening the system.

Use full pills only for tiny status dots and small rounded badges where the shape communicates status rather than content grouping. The status mark that opens a kicker is a square, not a dot.

Do not mix many radii in one view. If a surface is a card, square is the default; if it is a button, 2px.

## Components

Primary CTAs are paper slabs on ink: dark Geist text at medium weight, 52px tall in content (44px in the nav), 2px corners, and a right arrow when action-oriented that nudges right on hover while the slab dims to soft paper. A secondary action next to one is an underlined paper text link, never a second slab. Outline buttons, where a page needs one, are ink with a strong rule that turns paper on hover.

Cards are hairline rectangles, not soft containers. Service cards, case cards and project cards use the hairline, square corners, tight internal hierarchy, mono metadata in strong-ruled tag chips, and the hover step described above. On the homepage, our own products sit in a single-row loop carousel with the same orange arrows as the case studies; each product card borrows that product's own accent as a quiet signature: a 3px rule across the top, a small dot beside the mono category, the product logo next to its name, and on hover its border turns the accent. The accent never fills the card or colours its text. Resource cards use the same hairlines on a slightly raised surface.

The homepage runner band sits directly under the hero, inside the page container, as a raised ink panel framed by a hairline, with paper drawn on it. The player is a small paper bird whose wing beats as it runs and stays raised in the air. Obstacles state the move, not the object: paper to jump, orange to double jump, yellow to duck. Shape says what a thing is, colour says what to do about it. Slabs are slim, round their corners only on the edges facing the bird so each points the way it hangs, and wear black diagonal hazard stripes when they need more than a plain jump. A ceiling bar's length is measured in how long it keeps you down, a quarter second to nearly a full one, so it stays a long duck at speed rather than flicking past; only its lower lip is solid, the same 12px the standing slabs are wide, so every obstacle is the same bar just hung differently, with the rest hanging as threads from the roof; flying predators are drawn as creatures with a beating wing that sweeps outside their hit box, which only ever works in the player's favour. Orange means "this one needs something other than a jump", alongside its other uses on the crashed bird and a new best score. Behind them, one of six tinted scenes (city, desert, forest, sea, mountains, night) scrolls at a third of the world speed, swapping every ten seconds with a cross-fade. The tint is the only colour in the panel besides the accent, and it carries the world's identity. Each world belongs to one real client, project or backer, and their name is set as a giant hollow word across the sky, outlined rather than filled, in the world's tint, so obstacles and decor stay readable straight through it, and sized to the panel so a long name shrinks instead of running off a phone. It is painted last, over the obstacles: an obstacle drifting past must never cut through the middle of a client's name. A single letterspaced mono kicker sits above it: the kind and the sector, nothing else. The name is an announcement rather than a permanent label: it rises in, holds about four seconds, then drifts up and out, leaving the sky clear for the rest of the world's ten seconds. This is the reason the game is on the page at all: it tours the roster one world at a time, in a random order on each visit, drawn from the case-study and project catalogues so it grows with the site rather than with the game. The scenes are never named on screen; the visitor is meant to notice the client, not the hills. Whenever a run is not in progress, before the first press as much as after a loss, a near-solid veil drops over the whole world, leaving only the score line above the canvas and the replay message on top of it to read. Beating an existing personal best (passing it outright, never merely matching it) opens one extra row under the canvas, hairlined off from it: the congratulations set in accent mono on the left, and a paper slab on the right that books the same thirty-minute call as the hero, turning to an outline on hover; it deliberately sits outside the canvas, because the canvas restarts the run on any press and a link inside it could never be clicked. The very first run of a visit sets the record rather than beating one, so it turns the score accent on and nothing else. Sound follows the same rule as the veil: it exists only while a run does. The bed is a looping ambient track, streamed rather than synthesised, fetched only when someone actually plays; a visitor who never presses space never downloads it, and never opens an audio context at all. It leans in slightly as the run speeds up and sits under the effects, which stay synthesised: a soft filtered breath upward on a jump, higher on the second; a short swish overhead when ducking; a dull thud under muffled noise on a crash. Every synthesised voice goes through a low-pass, which is what keeps them from turning metallic. A speaker toggle sits at the end of the score line and the choice is remembered; muting ramps the master to exactly zero, so it means silent rather than quiet. The panel never animates on load (the run starts only on a deliberate key press or click and freezes when scrolled out of view), and it does not exist below 1024px, and only then on a device with a hovering pointer: the game needs a keyboard, and a tablet that can only tap cannot duck under a ceiling bar, so on anything else the hero runs straight into the client logos and the game's code is never even fetched. Below 1024px the hero also drops the mascot and keeps its single text column. Phones never see either: below 768px the homepage swaps the hero for the poster layout described next.

Below 768px the homepage is laid out as a poster, not as the desktop page shrunk to fit. The first screen is one composition: a mono status line (the orange square and "open to projects" on the left, the city on the right), then the headline set as two solid paper lines that each fill the full content width, so the pair reads as one block of type. The claim follows in a medium weight, then the one-line pitch, a compact paper booking slab the same size as on desktop (a full-width bar read as a shove on a phone) with the response time in mono beside or under it, the Y Combinator and France 2030 credentials set in type exactly as on desktop, and, after a fixed 40px gap, the client logos in paper as a three-by-two grid of hairlined cells, replacing the logo marquee. The hero is never stretched to the height of the screen: pinned there, the logos left a hole of several hundred pixels on any phone taller than the content. Every section after it opens on the same compact header: a short bold title, sometimes with a mono label on the right, and a hairline beneath, so the poster moments (the hero, the case numbers, the closing call) carry the scale and the headers do not compete with them. Case studies play as stories. Under a bare ruled header, a row of thin 3px segments, one per case in 45% paper (each segment is a button), sits above a carousel of square-cornered hairline cards; the track runs edge to edge, each card takes the full content width, and the gap between cards equals the page gutter, so at rest exactly one card is on screen and nothing of the next peeks in. The carousel moves on by itself every four and a half seconds while the current segment fills with paper from the left, and segments already seen stay full: the movement is what shows the row can be swiped, the bar shows how many cases there are and how long until the next one. Each segment jumps to its case, a small pause control sits before the bar, and the timer holds while a finger rests on the cards, while the row is off screen or the tab is hidden; with reduced motion requested it never starts, the pause control disappears, and the bar simply marks the current case. There are no arrows and no numeric counter. A card carries the logo, the sector in mono on two reserved lines, the headline number, its caption, and a "read the case" line ending in a square hairline arrow. Every card's number is set at one shared size, derived from the card's width so the longest word still fits the narrowest phone, and a long figure wraps onto a second balanced line rather than shrinking on its own; with the sector's two lines reserved, the numbers sit at the same height on every card. A client quote then runs as a raised ink band, with a giant orange quotation mark hanging off its top corner and the phrase that sums the work up picked out in orange. Services become three ruled rows led by large outlined numerals, title and pitch only. Our products become a ruled list, logo, mono name, category, and an arrow, so all of them are visible without a swipe. The closing call to action turns to raised ink and runs straight into the footer as one slab: the question set as two width-filling lines like the hero (with looser leading, because its accents would otherwise cut into the line above), a compact paper slab, the response time and the email address. Once the hero has scrolled away, a slim bar fixed under the thumb, on translucent ink with a hairline above it, carries the response time on the left and a compact booking button on the right, and steps aside again as soon as the closing call to action comes into view, so two booking calls are never on screen at once. Every phone tap target is at least 44px tall, however small its mono label.

The mark itself is published once, under `public/brand`, so anything outside the site (an email signature, a deck, a partner page) links to the same file instead of carrying its own copy. Three variants, each as a transparent PNG at 192px and 512px wide: the rounded black square with white arcs for light backgrounds, the arcs alone in black for light backgrounds without the square, and the arcs alone in white for ink backgrounds. `public/favicon.svg` stays the in-product mark and the vector source both derive from; the site draws the arcs alone, in the colour of the text beside them, from that same path. When the logo changes, they all move together. These URLs are linked to, never surfaced by the site, and are served `noindex, noimageindex`.

Navigation is sticky, translucent ink, and understated, 84px tall on desktop with a hairline beneath it that stops at the gutters. The wordmark is the paper arcs beside "THE VIBE CO." in wide-tracked mono. Links are soft paper at 14px, brighten to paper on hover, and the current section gains a thin orange underline. Then the language switch (`FR | EN` in mono, the current one in paper, the other muted, split by a strong hairline), an envelope icon that opens an email to the founders, and the booking slab. The mobile menu is an opaque ink sheet, never a translucent one, that keeps the wordmark exactly where the bar had it, lists the links in large bold type, and leads with the booking slab, with a quiet underlined contact link beneath it that opens a two-row panel in place (book a call, email us, split by a hairline, each inverting on hover and keyboard focus), pushing the language switch down rather than floating over it. In the footer, the link lists sit two by two under the wordmark on a phone rather than stacking.

An article that exists in both languages is published once in the resources list, in the language being browsed, and carries its own language switch rather than appearing twice. The switch reuses the flag already used as a language marker and borrows the `FR / EN` idiom from the global nav: the version on screen at full strength, a hairline slash, then the other language dimmed until hover, linking to that version's own URL. An article published in a single language keeps showing its lone flag, with nothing added. The switch sits in the card's mono metadata row and, on the article itself, under the sidebar's language label, so the affordance reads as metadata rather than as a second call to action.

The open-source project grid uses the canonical five-product catalogue. Its organization-level GitHub action is an underlined mono text link, never an orange slab or filled button.

Case-study product imagery keeps the product UI legible instead of treating screenshots as decoration. Portrait mobile captures may sit beside the overview at no more than 360px wide; wide desktop captures span the case-study content section. Preserve each image's intrinsic ratio, localized alternative text, hairline frame, and responsive dimensions. A product page may show its main UI capture inside a browser window drawn in the house style: a hairline frame, a thin ruled title bar with outlined window dots (the last one the orange status signal) and a mono label. The capture keeps its ratio and is never cropped to fit the frame.

A product with no screenshot to show is drawn in code as a product shot instead: the app's window in the house style (hairline frame, the product's accent as a 3px top rule, a static offset shadow in hairline grey) set on a framed stage of raised ink ruled with a faint 32px grid, inset top and left and running off the right and bottom edges, so it reads as a product rather than a screenshot in a box. Real words appear only where the story is; the rest of the screen is quiet placeholder bars. One satellite card, framed by a hairline with a strong-rule offset shadow, straddles the window's left edge over filler and carries the result. Its features follow as a ruled bento grid: one frame, hairlines between cells, a run-in title (bold lead, muted continuation) at the top of every tile, and a different kind of picture in each neighbour (one component, a large-type statement, a collection, a diagram), with exactly one raised tile as punctuation. Every picture plays one short beat, once, as it scrolls in, eased on two curves (travel and arrival); nothing loops, and with reduced motion each picture simply shows its final frame.

The footer is a raised ink panel under a hairline, on a four-column desktop grid: a wide identity and contact column followed by site navigation, the service offerings (short labels, one per commercial landing), and external links. On small screens the identity column spans the width and the link lists pair up two per row. The lower status line remains visible below the divider and carries the privacy policy link, set in the same mono caps as the status items with a thin underline. The footer closes every listed page, Resources included, with the same tokens everywhere.

The contact and privacy pages are text-first trust pages on ink, rendered as plain HTML with no reveal motion. Contact opens like About (mono kicker with the orange square, large paper headline, lede hung off a strong left rule) with a single booking slab, then a large underlined email address beside a ruled list of company details. The privacy policy reads as a ledger: a numbered table of contents pinned on the left on wide screens, numbered sections, hairline cards for each data source, and ruled tables (mono first column) that stack into labelled cards on a phone.

The `/v2` preview swaps the static hero for a playable canvas runner that reuses the standard top nav, sections, and footer. Its score readout and the per-world presentation panel are diegetic game UI; the surrounding page keeps the normal components. This belongs to the preview surface only, and predates the runner band now on the canonical homepage; treat the homepage band as the current design and `/v2` as a superseded experiment.

Reference tables state facts rather than decorate them. A key-facts table sits inside a single hairline block with square corners, a hairline under its header row and between rows. The left column is a mono, uppercase, wide-tracked label in muted paper, holding a fixed share of the width so every value starts on the same line; the right column is plain body copy, with links underlined rather than coloured. A fact we have not confirmed leaves its cell empty: a visible gap is honest, an invented value is not.

An article that compares several providers is laid out as a dossier, not as a wall of prose. It opens with an "in short" card on raised ink holding a mono kicker, one or two sentences and a row of chips, each a hairline-bordered rectangle with a small square tile carrying the provider's initial, jumping to that provider's card. A "which one for your case" picker follows as a raised ink panel: one row per situation, a muted arrow, and a paper-outlined target with the same initial tile, inverted to paper. The comparison table is a spec sheet inside a hairline frame: mono header row on raised ink above a hairline, a row header per provider with its initial tile, faint zebra rows, and marks rather than words, a small filled paper square with a check for what a provider puts forward and a faint hollow ring for what its cited pages do not, with a mono legend underneath saying exactly that. On wide screens the header row sticks under the navigation; below 720px the table scrolls sideways inside its own frame, never the page, with the provider column pinned and the right edge fading out. Each provider then gets a card: a large initial tile and its name, a muted tagline, a ruled list of facts with mono labels on a fixed column, and a two-panel verdict at the foot, "choose if" with a check and "skip if" with a cross. Every provider gets the same treatment, ours included, and no logo, colour or accent is used to favour one; the initial tiles are text, so nothing loads or shifts. Asides such as an editorial rule or a disclosure are quiet callouts: raised ink, hairline frame, a 3px paper rule on the left and a mono kicker with a line icon. All of it is server-rendered HTML with inline line icons and no script.

Labels, tags, counters, and status chips use Geist Mono, uppercase text, wide tracking, and small scale. They should feel like technical readouts. The status mark is a still 8px orange square; it does not pulse.

Rules and dividers are part of the visual language. Use the hairline for routine separation and the strong rule for anything that must read as an edge (a tag chip, an outline button, a hovered card, a lede's left rule).

## Do's and Don'ts

- Do use ink, warm paper type, hairlines, and exact alignment as the default visual foundation.
- Do let the homepage headline fill the content width on one line, and keep every rule inside the gutters.
- Do make section hierarchy with raised bands, rules, scale, and contrast before adding effects.
- Do keep orange small and meaningful: the status square, an active underline, arrows, numerals, and the two blooms.
- Do reserve Geist Mono for metadata and operational UI, not long-form prose.
- Do use square corners for content surfaces and 2px corners for slab CTAs.
- Do draw client logos in paper on ink, and preserve partner-logo and product-screenshot aspect ratios at every breakpoint.
- Don't turn an inverse band into a paper slab; inverse means raised ink.
- Don't bring back offset "brutal" hover shadows or hover translations on cards and buttons.
- Don't add glows, gradients or colour washes beyond the two orange blooms.
- Don't turn pages into nested card layouts. Use full-width bands and unframed layouts first.
- Don't over-round cards, inputs, or buttons. Pills are for status only.
- Don't turn the GitHub catalogue link into a filled promotional CTA.
- Don't let resource/domain colours overpower the monochrome brand system.
