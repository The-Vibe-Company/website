# Recipes by diagram type

These are validated rules for recurring types, not templates: read `composition.md` first, compose for your content,
and use a recipe's rules when your diagram is of that type. Every example takes `--out` and `--style corporate|editorial|sketch|playful|night|mono` (see `references/styles.md`), and
uses the tokens of `references/design-principles.md` through `assets/palettes.py`.

Contents: flow · swimlanes and tracks · architecture · layered stack · timeline / roadmap · before / after · hub
(concept map) · poster with key figures · illustrated explainer · dense process map · lifecycle around a core.

| Recipe | Example | Width |
|---|---|---|
| Flow, swimlanes and tracks | `assets/example_flow_tracks.py` | 1588 |
| Architecture | `assets/example_architecture.py` | 1512 |
| Layered stack | `assets/example_stack.py` | 1224 |
| Timeline / roadmap | `assets/example_timeline.py` | 1520 |
| Before / after | `assets/example_before_after.py` | 1432 |
| Hub (concept map) | `assets/example_hub.py` | 1216 |
| Poster with key figures | `assets/example_poster.py` | 1440 |
| Illustrated explainer | `assets/example_explainer.py` | 1600 |
| Flashcards (deck of study cards) | `assets/example_flashcards.py` | 600 per card |
| Agent / system map | `assets/example_agent_system.py` | 1850 |
| Cycle around a core | `assets/example_cycle.py` | 1100 |
| Dense process map (lifecycle, tracks, gate) | `assets/example_process_map.py` | 2856 |

All share the header block (title 36 at y 0, message 20 at y 56, content from y ≈ 148) and the footer line (legend
left, provenance right-aligned, 40 below the last block).

## Flow (process, pipeline, user journey)

**Shape**: steps as equal cards in one row left to right, numbered column headers `1 · STEP` above on one baseline,
arrows at mid-height between card edges.
**Kit**: `card(...)` per step with `out="artefact"` for what each step produces; `arrow(...)` or `connect(a, b)`
between edges; `hero_bar(...)` above when the headline is about time.
**Validated rules**: columns 260 wide with 56–72 gaps; 3–7 steps per row (wrap into two rows or group into phases
beyond); a card that only receives one line is normal-size and centred on that line, never stretched.
**Wrapping beyond 7 steps**: prefer grouping steps into 3–4 phases (one header band per phase) over a second row. If
a second row is unavoidable, end row 1 and start row 2 on the left, mark the continuation with a small `→` chip or the
step number, and do not draw a long return line across the canvas: it reads as a divider.
**Card height follows content**: a card holding one line is `chip_height`-like (about 56–64 px), not the height of its
neighbours with two lines; half-empty cards look unfinished at thumbnail size.
**Traps**: waiting times as floating labels (put them inside the box, or in the hero bar); units invented for the
user's figures (if they said "1.5 days", do not write "working days" — keep "days" and ask).

## Swimlanes and tracks

**Example**: `example_flow_tracks.py` — triage splits tickets into an automated and a team track that meet at one
merge gate.
**Shape**: lanes are pale bands for *tracks* (alternative paths) when the message is a split; for *actors* only when
hand-offs between people are the message. Shared steps are tall cards spanning all lanes.
**Kit**: `lane(...)` per track, `card(...)` inside; the fork as chips inside the splitting card, one coloured arrow per
track leaving its chip; the merge as one `node(..., strong=True)` spanning the lanes.
**Validated rules**:
- Lane padding 36 px on the sides and 40 px above (label) and below the cards: arrowheads then end inside the lane,
  clear of its border, and a rework path can enter from below.
- The accent lane (the new track) gets the accent tint and accent card strokes; the other lane stays neutral.
- Two arrows in, one heavier arrow out of the merge block.
- A tall card holds something at each track's height (fork chips) and a short grey note between them.
- The rework path is dashed `bad`, routed under the lanes, its label centred beneath it.
**Traps**: a lane label crossed by an arrow; a white-on-white lane (use the lane tint and a 1 px border).

## Architecture (systems and data)

**Example**: `example_architecture.py` — four zones from sources to consumers, the warehouse in accent.
**Shape**: columns by role (sources → ingestion → processing / storage → consumers), each a zone with a header band,
components as nodes inside, arrows from zone edge to zone edge labelled with the transport.
**Kit**: `group(..., header=...)` per zone, `node(...)` per component, `labelled_arrow(...)` between zones; chips in a
full-width strip for shared concerns (access control, monitoring) instead of extra boxes.
**Validated rules**:
- Every zone has the same header structure; neutral zones use a `LINE` band with ink text, the one zone the message
  is about uses the accent band with white text. Colour by importance, not by category.
- Same number of nodes per zone (rebalance the content) so no zone is half empty; zones 300 wide, gaps 104 to hold a
  two-line transport label.
- Component borders `STONE` (accent in the accent zone): black outlines everywhere make the picture heavy.
- Brand and product names stay off generic diagrams; name the role (`Change capture`), not the vendor.
**Traps**: drawing every connection (show the main data path; mention the rest in a footnote); mixing deployment
boxes and logical components in one row.

## Layered stack

**Example**: `example_stack.py` — four layers, services in accent, tags on the two components that change.
**Shape**: full-width bands stacked from foundation (bottom) to users (top); a fixed label column on the left (name
20 + one grey line); components on a column grid shared by every band.
**Kit**: `rect(...)` per band, `node(...)` per component, `chip(...)` straddling a node's top edge for "what changes".
**Validated rules**: equal bands (node height + 48), 16 px between bands; nodes 220 wide with 24 gaps so their edges
line up vertically across layers; a layer with fewer components leaves its last cells empty rather than stretching.
**Traps**: arrows between layers (the stacking already says "built on"); an annotation chip placed in the band next
to the one it describes.

## Timeline / roadmap

**Example**: `example_timeline.py` — four quarters, five milestones, the go / no-go in ink.
**Shape**: an axis with boundary ticks; period names centred in their span (not on the ticks); milestones as equal
cards in one row above the axis, each on a dashed stem to a dot; phases as tinted spans right under the period
labels; "today" as a dashed line with a chip at its top.
**Kit**: `line(...)` for the axis and ticks, `node(...)` for milestones (`strong=True` for the decision), `rect(...)`
for phases, `chip(...)` for the today marker. (`timeline(...)` draws a simpler axis with labels on the ticks.)
**Validated rules**: cards 200 wide, at least 40 px apart; position milestones so that "today" runs through a gap
between two cards; the phase boundary falls on the decision milestone; 5–8 milestones.
**Traps**: proportional time when labels collide (switch to equal spacing and say so in the footer); milestones
alternating above and below the axis with phases further down (the eye zigzags and stems cross the phases).

## Before / after (current vs target)

**Example**: `example_before_after.py` — the same five rows on both sides, two steps gone, two steps new.
**Shape**: two equal panels on one canvas with an identical row grid, the headline figure of each side in its
header, a single arrow in the centre gap.
**Kit**: `rect(...)` panels, `rect(...)` + `text(...)` rows, numbered discs (`step(...)` or `ellipse` + text) on a
1 px spine instead of arrows between rows; `legend(...)` in the footer.
**Validated rules**:
- The same step sits at the same height on both sides; a removed step leaves a dashed ghost row on the target side.
- Removed = dashed `bad` on the left; new = accent on the right; unchanged = neutral on both. Nothing else coloured.
- The headline figure ("4 people" → "2 people") is counted from the drawing itself, so it needs no source.
**Traps**: different box sizes on the two sides; recolouring unchanged parts; two separate canvases with drifting
grids (if they must be separate, share the constants).

## Hub (concept map, ecosystem, stakeholders)

**Example**: `example_hub.py` — one goal in ink, three people on the left, three knowledge supports on the right.
**Shape**: the concept in a central strong box; satellites in the side columns of a 3 × 3 grid; one colour family per
column, named by a coloured column header instead of a legend.
**Kit**: `node(..., strong=True)` for the centre, `node(..., fill=X_BG, stroke=X)` for satellites, `line(...)` for
connectors (no arrowheads).
**Validated rules**: connectors 1 px in the family colour, fanned into points 44 px apart on the centre's facing edge;
satellites 280 × 92 with 36 px row gaps; 168 px between a column and the centre. Excellent in the hand-drawn style.
**Traps**: more than eight satellites (make a second level or a list); pale `_soft` connectors (invisible on white);
crossing connectors.

## Poster with key figures

**Example**: `example_poster.py` — one hero figure, three supporting figures, three steps, two open questions.
**Shape**: headline sentence; a row of tiles where the hero is wider and tinted; below, two thirds for "how it was
obtained" and one third for open questions, both starting on the same line with the same height.
**Kit**: `rect(...)` + `text(..., 56)` for the hero tile, plain `rect(...)` + `text(..., 28)` tiles (or `stat(...)`
when each figure belongs to a colour category); `card(...)` steps; `questions_box(...)`.
**Validated rules**: the hero number is twice the size of the others (56 vs 28); every tile has the same height and
top; every figure states unit and base ("24 h → 6 h", "1 400 requests, 8 weeks"); figures that are not the user's
are marked illustrative in the footer.
**Traps**: all figures the same size (no hierarchy); coloured edges on every tile (they compete with the hero); a
yellow questions box larger than the "how" block.

## Illustrated explainer (how something works, for a general audience)

**Example**: `example_explainer.py` — five cards explain how an assistant answers from company documents; run it
with any `--style` (default sketch). Colour follows the style's mood: sober styles keep neutral cards and put the
accent on the step that matters; playful gives one pastel per step; mono uses weight and grey fill only.
**When**: blog posts, onboarding, a README for newcomers, any "how does X work?" for people who will not read a
legend. The drawing carries the meaning; the words only name the step.
**Shape**: centred title with a hand underline (`doodles.underline`), one sentence under it; a row of 3–6 equal cards,
each with a number badge straddling its top-left corner (`doodles.badge`), a pictogram in an icon zone of about
130 px, a title of two short lines (22) and one example line (16, mid); arched arrows between cards
(`doodles.curvy_arrow`); the takeaway in the accent colour under the row; a quiet note when the example is made up.
**Kit**: `scripts/doodles.py` — bubble, page (with highlighted lines), page_stack, magnifier, check, cross, robot,
person, database, bulb, clock, envelope, cloud, bars, answer (reply with source tags). Each takes a bounding box and
scales into it. `palettes.tints(n, name)` gives one (card fill, badge fill) pair per step.
**Validated rules**:
- In the playful style only, one pastel per step: colour paces the reading, it codes nothing, so there is no
  legend. In every style the accent is kept for one thing (the key step or the takeaway line, and small marks).
- Every card shows the thing its step talks about: a question is a bubble, documents are pages, "picks" is
  highlighted lines with ticks, the model is a robot, the answer is a reply with source tags. One running example
  ("Can I work from home on Fridays?") threads through all cards and is marked as made up.
- Numbers on badges are ink on a mid-tone fill (white on yellow is unreadable). Pictograms stay inside the icon zone,
  32 px or more from the card sides; titles centred, at the same height in every card.
- Cards 256 wide with 80 px gaps (room for the arched arrow), corner radius 20, ink outline 2 px.
**Traps**: decorative doodles that say nothing (a rocket for "deploy" is fine, a random star is not); more than one
pictogram scene per card; jargon in titles ("embedding", "vector store") when the reader asked for plain words;
invented specifics (page numbers, figures) without the made-up note.

## Flashcards (deck of study cards, one idea per card)

**Example**: `example_flashcards.py` — a cover and three concept cards on clear diagrams; run it with any `--style`
(default playful). **When**: a course, an onboarding, a team wiki, a "pocket guide" people swipe on a phone or
print: each card teaches one idea and stands alone. Not for one big picture (use a flow, a map or a poster).
**Shape**: portrait cards of 600 x 750 scene units (4:5), side by side with 80 px gaps (`cards.card_xy(i)`), each
exported alone at scale 2 to 1200 x 1500 px (`render_scene.mjs --crop <x>,0,600,750 --scale 2 --padding 0`;
`cards.export_commands(n, path)` prints the lines).
- Cover: handwritten kicker ("Pocket guide to"), poster title on two lines, a one-line subtitle over an accent rule,
  a numbered table of contents (`cards.toc`), a call to swipe at the bottom (`cards.cta`).
- Concept card, top to bottom: kicker (`cards.kicker`: "How to", "Before you draw"), poster title (`cards.poster_title`,
  display face with an ink offset shadow, shrunk to fit; `cards.title_with_tag` adds a handwritten aside on its right),
  one or two short paragraphs (`cards.paragraph`) or a numbered list whose lead word reads bold (`cards.numbered`),
  one small diagram drawn with the style's own rendering (`cards.box`, `S.arrow`, `doodles.check / cross`), a
  "Don't do this!" note in the warning pen when the card warns against something (`cards.note`), and a pale yellow
  rule-of-thumb box with a bulb anchored on the footer band (`cards.tip(..., bottom=ymax)`).
- Footer on every card: deck name left, page "2 / 3" (or the source) right, 13 px grey (`cards.card`).
**Type**: three faces on purpose, tagged `customData.card` so the lint accepts them: display for titles and lead
words (Lilita One; Liberation Sans in editorial and mono, where the shadow is dropped), a clean body face for reading
(Nunito; Liberation Sans in editorial and mono), the hand face for kickers, asides and notes (Excalifont).
**Colour**: the style accent for titles, kicker and rule; the warning pen (dark orange `#c4510b`, contrast 4.6:1) for
"Don't do this!"; green check and red cross; yellow only for the tip box. In-card diagrams may use the category
colours when the card is about colour; otherwise keep them neutral with one accent box.
**Validated rules**:
- One idea per card; the title says it in two to four words, in capitals.
- Body 17-18 px at card scale (34-36 px exported), 90 words at most per card; cut words, never shrink the font.
- The tip box ends on the footer band, so free space falls between the diagram and the tip, not under the tip.
- `cards.check_fit(y, ymax)` after each card: content must end above the footer band.
**Traps**: a whole article on one card; two diagrams on one card; a side tag placed by hand over the title (use
`title_with_tag`); a coloured tip box from a palette that has no true yellow (the module fixes the tip colours);
an ink shadow on a dark page (the module drops it).

## Dense process map (lifecycle, tracks, gate)

**Example**: `example_process_map.py` — a target delivery process: two entrances, two tracks, one evidence gate,
the lifecycle around it, who does what, what disappears, open questions.
**When**: a steering committee or a client workshop that will read the map for minutes, on a wall screen or an A3
print; the current-state map and the target map are drawn on the same grid so the delta reads side by side. Width
about 2 800: zooming is expected, so the thumbnail must still show the shape (entry lane, block, gate, loops).
**Shape**: header (title + version chip, two message lines, a `TODAY:` banner in the bad tint and a `GOAL:` banner in
the good tint that says how the goal is measured); top right a cartouche with the status chips and the colour legend
under it; a dashed lifecycle frame holding an entry lane on top (the second entrance), a greyed column of unchanged
upstream steps on the left (the first entrance), the owned scope as a section block with numbered column headers
and two track lanes, the gate as the one loud card, a tools strip and a skills legend inside the block, a
continuous-improvement loop under it and a greyed out-of-scope card on its right; a bottom band of three equal
blocks; a sources footer.
**Kit**: `banner(...)` for TODAY / GOAL; `cartouche`, `status_chip` colours from `STATUS`, `legend`; `rect(...,
style="dashed")` for the frame; `lane(...)` for the entry lane and the two tracks; `section_block(...)`; `card(...,
skills=, proposed_skills=, out=, status=)` for every step; chips inside the splitting card for the fork; a
`rect(..., sw=3)` + `chip("GATE")` + `checklist(..., key=("live", "to build"))` for the gate; `return_loop(...)`
for the failure path (bad) and the improvement loop (good); `divider` + `chip_stack(..., max_w=column width)` per
column for tools; `badge_legend(...)` for the lettered skills; `rows(...)` once per actor (own edge colour) and once
for what disappears (bad tint, no border); `questions_box(...)`.
**Validated rules**:
- Every coordinate derives from a few constants: column widths, one column gap (56), block padding (40), lane
  height (256, cards 80 shorter), lane gap (24). Shared steps are tall cards spanning both lanes; the gate sits on
  top of the lanes.
- Colour has two meanings only: accent = proposed (cards, badges, the agent track, the entry lane), ink = the
  current process. Status chips stay neutral (orange only for "in progress"); tool kinds use the two category
  colours plus a neutral chip with a shared stone border, so the map stays at 12 stroke colours or fewer.
- The gate is the only heavy outline (`sw=3`) and the only card with a tag; its checklist uses filled bullets for
  what is live and hollow ones for what is to build, with the mini key under it; keep it under 40 words.
- Each track has its own arrow line at its lane's mid-height from the fork chip to the merge card; one line leaves
  the merge card; the out-of-scope arrow is stone. An express path from the entry lane drops into its lane card
  left of the card's badges and right of the lane label (the example checks it).
- Loops never cross the block: the failure loop runs under the lanes between card centres, the improvement loop
  under the block from the last column to the first, both with their label centred beneath.
- Bottom band: three thirds, titles on one baseline, contents starting on one line with one height (`rows` and
  `questions_box` take the same total height).
- Widths come from `S.text_size` (styles change fonts); the header is drawn left-aligned in every style because the
  cartouche holds the top right and the version chip follows the title.
**Traps**: a status colour that reuses the accent (two meanings); badges on the corner where an express arrow
lands; a tall card with nothing at a track's height (put the fork chip, a note or an inner box there); figures in
the GOAL banner without "illustrative" in the footer; client names, product names or tool brands left on a generic
map.

## Agent / system map (who does what, where work waits, where a human decides)

**Example**: `example_agent_system.py` — a coordinator fans out to four lead agents, their helpers write code and run
tests, everything lands in one prioritised queue, one person reviews it, a gate checks, the change ships; an idea
arcs over the row into the queue and the reviewer's feedback feeds a team memory that loops back to the leads.
Default style **whiteboard**; every style works.
**Shape**: one main row left to right, actors as cards, the human as the single loud card; things that are not steps
(an idea source, notes on how the human works, a learning component) sit above or below the row and join it with
smooth `curve()` links, never with straight arrows crossing the row.
**Kit**: `icon_card(..., layout="row")` for roles (icon before the label: `layers`, `robot`, `database`),
`icon_card(..., layout="stack")` for people, gates and outcomes (`user`, `shield_check`, `check`), `fan_out()` for one
to many (with `more=` for "· · ·"), `list_card()` for what a role does (icon bullets), `window_card()` for a queue,
inbox or dashboard, `icon_list()` for notes under a node, `feature_box()` for a capability with ticks, `curve()` for
over and under links; icons from `scripts/icons.py`.
**Validated rules**:
- Role cards share one size and one icon; in the pastel mood each takes the next tint (fill + same-hue border), in
  sober styles they stay white with ink borders and only the human card is loud.
- Icons sit 12 px before their label, at 1.3–1.4x the text size; stack icons at about 1.9x above the label.
- The fan-out spine sits 25–30 px left of the targets with rounded ends; the "· · ·" stub says the list goes on.
- Curves leave a box vertically and arrive horizontally (or the reverse), ARROW_GAP from both boxes; the feedback
  curve runs under the row, the idea curve over it.
- Window rows carry status dots only when the colours mean something (priority, state); keep three to five rows.
**Traps**: an icon on every word (only on actors, checks and outcomes); arrows criss-crossing the row instead of
curves around it; more than one loud card; a queue window with real-looking content that nobody asked for.

## Lifecycle around a core

No dedicated example; start from `example_flow_tracks.py`.
**Shape**: an outer dashed frame for the whole lifecycle, the owned core as a section block with a dark header bar,
the phases outside it greyed or dashed when out of scope or not measured, a return loop under everything.
**Kit**: `rect(..., style="dashed")` for the frame, `section_block(...)` for the core, `card(...)` for phases, an
elbowed `arrow(..., via=...)` for the loop with its label beneath.
**Traps**: the frame and the loop competing (loop below the frame's content, frame lighter than the core).
