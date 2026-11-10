# Design principles

A design system for Excalidraw diagrams: tokens first (space, type, colour, strokes, corners), then composition, then
the checklist every render must pass. The palettes and scales are importable from `assets/palettes.py`; every example
in `assets/` is built with them.

Contents: the five rules · spacing scale · type scale · palettes · strokes and corners · hierarchy and accent ·
composition · arrows · density · styles · beauty checklist.

## The five rules that matter most

1. **One message, one loud element.** The subtitle states the message; exactly one element carries the visual weight
   (an ink-filled block, an accent zone, or a hero figure). Everything else is quiet.
2. **Everything on a grid built from constants.** Column x's, row y's, widths and gaps live in named constants in the
   generator (`CW`, `GAP`, `TOP`); same-role boxes are the same size; gaps are equal.
3. **Gaps outside are bigger than padding inside.** Inner padding 16–24, gaps between siblings 24–72, gaps between
   sections 32–64, header to content 64+. Proximity, not borders, says what belongs together.
4. **Colour means something or it is grey.** Neutrals for structure; one accent for the thing that matters; at most
   two semantic hues more. Each colour has a single meaning, named in the legend or in a coloured header.
   Exception: an illustrated explainer may give each step its own pastel (`palettes.tints`), because there colour
   paces the reading and codes nothing; the accent still belongs to one element.
5. **Look at the render.** Lint is necessary, not sufficient: hierarchy, empty bands and balance only show on the
   picture.

## Spacing scale

Use only these values (from `palettes.SPACE`) for paddings, gaps and offsets. The kit's own tokens sit on the same
scale (`PAD` 16, `GAP` 8, `ARROW_GAP` 6, `RADIUS` 12).

| Token | px | Use |
|---|---|---|
| xs | 4 | chip text inset vertically, hairline nudges |
| s | 8 | arrow end to box edge, label to the line it annotates, stacked lines in a box |
| m | 16 | inner padding of cards and tiles, gap between chips |
| l | 24 | inner padding of zones and bands, gap between rows of a list, gap between equal tiles |
| xl | 32 | gap between two sections stacked closely (zones → strip), lane padding |
| 2xl | 48 | gap between columns without labels on the arrows, footer above the last block |
| 3xl | 64 | gap between major sections, gap after the header block |
| 4xl | 96 | gap between columns whose arrows carry two-line labels; centre gap of a before / after |

Fixed header block, validated on every example: title at `y = 0`, subtitle at `y = 56`, first content at `y ≈ 148`;
footer line `40` below the last block. Canvas width 1200–1600: an Excalidraw screenshot scales to 1920 px wide, so a
wider canvas shrinks the 13–14 px text below legibility.

## Type scale

One family per diagram: Nunito (clean) or Excalifont (hand-drawn). The sizes deliberately reuse Excalidraw's own
presets (S 16, M 20, L 28, XL 36) so a human editing the scene stays on the scale.

| Role | Size | Colour | Notes |
|---|---|---|---|
| Display (hero figure only) | 56 | accent | one per canvas, twice the other figures |
| Title | 36 | ink | states the topic and the claim: "Data platform: one road from source to screen" |
| Subtitle = the message | 20 | mid | one sentence, ends with a full stop |
| Figure in a tile | 28 | mid or ink | |
| Zone / layer name, big node | 20–24 | ink or accent | |
| Box title | 17–19 | ink (accent when the box is the accent) | |
| Label, list row | 16 | ink | |
| Body | 14 | mid | never a paragraph; two short lines at most |
| Caption, section header, footer, arrow label | 13 | grey; section headers in UPPERCASE | |
| Chip, actor line, tag | 12 | as the chip | the floor: nothing below 12 |

Line height 1.25. Left-align text in cards and zones; centre only short labels in nodes, tiles and hub satellites.
Section headers (`1 · TRIAGE`, `HOW IT WAS OBTAINED`) are 13 px uppercase grey, placed 30–36 px above their block,
all on one baseline even when a card in that column starts lower.

## Palettes

Three curated palettes, same roles, importable: `from palettes import use; pal = use("warm")` recolours the kit
(including its colour defaults) and `S.dump(out, background=pal["canvas"])` sets the page colour. Every text colour
passes WCAG AA (4.5:1) on canvas, white, paper, lane and its own tint — the greys were darkened for that, so do not
"lighten for elegance" below these values.

| Role | Kit name | clean | warm | ink | Meaning |
|---|---|---|---|---|---|
| canvas | (background) | `#ffffff` | `#fdf8f1` | `#f7f4ec` | page |
| white | `WHITE` | `#ffffff` | `#fffdf9` | `#fcfaf5` | card and node surface |
| paper | `PAPER` | `#f8f9fa` | `#f6efe5` | `#efebe0` | quiet zone, unchanged or out-of-scope box |
| lane | `LANE` | `#f1f3f5` | `#f3ebdf` | `#ece7da` | lane and container tint |
| line | `LINE` | `#dee2e6` | `#e6dccd` | `#dbd5c7` | hairline borders of quiet boxes |
| stone | `STONE` | `#adb5bd` | `#c4b6a4` | `#aaa69b` | component borders, dashed outlines, stems |
| grey | `GREY` | `#646c74` | `#70675d` | `#62666d` | captions, section headers, footers |
| mid | `MID` | `#495057` | `#5c544b` | `#454b58` | body text, secondary arrows |
| ink | `INK` | `#212529` | `#2d2926` | `#1b2030` | titles, main arrows, the one loud fill |
| on_dark | `ON_DARK` | `#ced4da` | `#d8cfc3` | `#c9cdd8` | secondary text on an ink fill |
| accent | `ACCENT` | `#6741d9` violet | `#bb3f0d` terracotta | `#1d4ed8` cobalt | the thing that matters |
| bad | `RED` | `#c92a2a` | `#a3213f` crimson | `#b83729` | problems, failure paths, what disappears |
| good | `GREEN` | `#287d39` | `#3a7535` | `#2b7349` | targets, improvements |
| wait | `ORANGE` | `#b8470a` | `#8c6017` ochre | `#955400` | waiting, in progress |
| open | `YELLOW` / `YELLOW_TXT` | `#fab005` / `#806600` | `#e0a800` / `#7a5a00` | `#d4a106` / `#6f5400` | open questions (always dashed) |
| cat1 | `BLUE` | `#1864ab` | `#3c6c96` | `#4a5d82` | first category family |
| cat2 | `TEAL` | `#087c59` | `#47725f` | `#5c6b4f` | second category family |

Each hue also has a `_bg` tint (fills) and a `_soft` tint (borders of tinted boxes); exact values in
`assets/palettes.py`.

- **clean** — default; slides, documentation, anything shared outside the team.
- **warm** — default with `--hand`; workshops, explainers, posts. The accent is warm, so its "bad" is crimson, not red,
  to stay distinguishable from it.
- **ink** — posters and one-page summaries; near-monochrome navy ink with a single cobalt pen.

The Excalidraw+ screenshot renders the scene on white whatever the file's background; every palette is tuned to read
on white too. Excalidraw's own picker uses shade 4 (strokes) and shade 1 (fills) of open-color; the clean palette
stays close to those so manual edits from the picker blend in.

## Strokes and corners

| Width | Use |
|---|---|
| 1 | zones, lanes, bands, chips, hub connectors, hairlines, ticks |
| 2 | components, cards, tiles, normal arrows, dashed outlines |
| 3 | the one loud element's border and the single main arrow out of it; never two paths at 3 |

- Every box is rounded with the same radius (kit `RADIUS`); never mix square and rounded boxes. A coloured edge or a
  header band must follow the corner (`edge_rect`, `group(header=...)`), never a square patch laid on a round corner.
- Solid fills only (`fillStyle: solid`), in both styles: hachure behind text hurts reading.
- Dashed means "not there yet": not decided, not measured, external, removed, or an open question.

## Hierarchy and accent

- Decide the reading order: message → the loud element → the structure → details → footer. Make each step visibly
  lighter than the one before.
- **The loud element** is one of: an ink-filled block (`node(strong=True)`), an accent zone with a coloured header, or
  a 56 px hero figure on an accent tint. One per canvas. A second ink block or a second accent zone halves both.
- **How much accent**: one hue, on one family of things (the new track, the layer we change, the decision), roughly
  10–15 % of the coloured area. Accent strokes on that family's cards, accent title text, accent tint for its zone.
  Never accent for decoration, never for a whole canvas.
- To mark what changes inside a group, add a small accent tag straddling the top edge of the boxes concerned
  (example: layered stack) rather than recolouring the group.
- Secondary information (legend, sources, notes) is 13 px grey at the edges and never outweighs the content.

## Composition

- **Header block top-left, footer line at the bottom**: legend on the left, provenance right-aligned to the content's
  right edge, on the same baseline. No legend floating top-right on its own.
- **Fill the rectangle**: the bottom row spans the full content width (thirds, two-thirds + one-third, or a
  full-width strip). A half-width box under a full-width diagram leaves a dead corner.
- **No empty bands inside boxes**: a tall shared card must hold something at the height of each track (a fork chip,
  a note); a card that only receives one line shrinks to normal size on that line (example: flow with tracks).
- **Same thing, same place**: column headers on one baseline; nodes of every layer on one column grid; before / after
  panels on the same row grid so a step sits at the same height on both sides.
- **Symmetry for concepts, direction for processes**: hubs and comparisons are mirrored around the centre; flows,
  architectures and timelines read left to right with the loud element right of centre or at the end.
- **Where the eye lands**: the loud element first, the title second. If a legend, a yellow questions box or a
  coloured header grabs the eye before the message, tone it down.

## Arrows

- Straight or square-elbowed (`via=`), never curved. Edge to edge, 6–8 px of air at both ends; parallel flows at the
  same height; `connect(a, b)` computes this for two boxes.
- An arrow entering a container (lane, zone) must end at least 30 px inside it, or the head sits on the border: give
  lanes 36 px of side padding and 40 px above and below their cards.
- Two in, one out: when tracks merge, draw one arrow per track into the merging box and a single, heavier arrow out.
- Labels 13 px above the line with 8 px of air, two to five words; a transport between zones (`CDC + files`) rather
  than a sentence.
- Colour an arrow only when it belongs to a coloured track; failure and rework paths are dashed `bad`, routed under
  the lanes, with their label beneath them.
- Hub connectors are 1 px lines in the family colour, no heads, fanned into evenly spaced points of the centre's
  edge so they never meet before arriving.
- No arrows between layers of a stack: stacking already says "built on".

## Density

- One title and one or two short lines per box; about 40 words is the ceiling for any box (lint warns).
- Nouns and numbers over sentences; no adjectives. A paragraph means a side note or a second diagram.
- Show what a step produces with a dashed `→ artefact` chip rather than a label on the arrow.
- 3–7 steps per row, 4–8 satellites per hub, 5–8 milestones per timeline, 3–4 key figures per poster.
- Counts on the canvas are read from the drawing itself (four people touch it → four actor labels) or come from the
  user with their unit and base; example figures are marked "illustrative" in the footer.

## Styles

**Clean**: Nunito (`fontFamily` 6), `roughness` 0, the clean palette. Reads as finished.

**Hand-drawn**: Excalifont (`fontFamily` 5), `roughness` 1, the warm palette, identical layout. Reads as a sketch;
loved for explainers and posts. Generate with `--hand` (calls `excalikit.hand_drawn`); never mix the two in one
canvas. Fills stay solid; the roughness is in the strokes.

## Beauty checklist

Run it on the render, not on the code. Every box must be ticked before delivery.

- [ ] A stranger can say the message back after 30 seconds; it is in the subtitle.
- [ ] Exactly one loud element, and the eye lands on it (then on the title).
- [ ] Header block at 0 / 56 / ~148; footer line 40 below the last block, legend left, provenance right.
- [ ] Every edge sits on the grid; same-role boxes share a size; gaps are equal and bigger than paddings.
- [ ] No box is more than half empty; no connector runs across the canvas where it could be read as a divider.
- [ ] Only scale values for sizes (36 / 20 / 18 / 16 / 14 / 13 / 12, 56 for one hero figure), nothing under 12.
- [ ] Neutrals + one accent + at most two semantic hues; each colour named once (legend or coloured header).
- [ ] Text contrast passes (lint `contrast`); no grey lighter than the palette's `grey`.
- [ ] Strokes 1 / 2 / 3 used as specified; one radius; solid fills.
- [ ] Arrows straight or square, 6–8 px from edges, heads clear of container borders, labels off the line.
- [ ] No empty band inside a box, no dead corner, no half-width bottom row, no orphan element.
- [ ] No box above ~40 words; no paragraph; numbers carry unit and base.
- [ ] `lint_scene.py` reports 0 errors; `--strict` findings are read and either fixed or deliberate.
