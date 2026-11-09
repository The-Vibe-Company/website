# Composition: references, not templates

The examples in `assets/` and the pictures in `assets/gallery/` show a level of finish and a set of devices. They are
not templates. Every diagram starts from its own message and content, and its layout is composed for them: borrow
the devices that serve the message, invent the arrangement. Copy an example's layout only when the content has
exactly that shape (a fifth "two tracks, one gate" process is a flow-tracks diagram; a story about a loop is not).

Contents: how to compose · layout shapes · devices · combining · inventing safely · what "clean" means.

## How to compose (five minutes before any code)

1. **Say the message in one sentence.** It becomes the subtitle.
2. **Name the shape of the content.** Is it a sequence, a split, a loop, a hierarchy, a comparison, a set of
   parts around a centre, a position on two axes, a journey with a person, a map of zones? Content often has one
   main shape and one secondary shape (a sequence with a feedback loop; a hub with one highlighted spoke).
3. **Pick a layout for the main shape** from the list below, or invent one (see "Inventing safely"); place it in
   a page plan of the frame (`signature.plan()`, `references/art-direction.md`) so the hero lands on a third.
4. **Pick at most three devices** for the secondary shape and the emphasis. More devices make noise.
5. **Sketch the grid in constants** (columns, rows, radius, gaps), then build. Look at the render, then at one or
   two pictures in `assets/gallery/` at the same zoom: is yours as calm, aligned and readable? Fix what is not.

## Layout shapes

| Content shape | Layouts that carry it | Kit |
|---|---|---|
| Convergence | lines with stations merging into the hero (`hero-right`) | `line_of_stops`, `merge`, `hero` |
| Sequence | one row; a column (top to bottom, good for phones and docs); two rows that read like text; a staircase for progress | `card`, `node`, `icon_card`, `connect`, `arrow` |
| Split and merge | lanes (tracks); a fork into a column of branches; a fan-out bracket | `lane`, `fan_out`, `connect` |
| Loop / cycle | boxes on a circle with arc arrows; a row with a return loop under it; a figure-eight for two coupled loops | `ring`, `cycle`, `arc_arrow`, `return_loop`, `curve` |
| Centre and parts | hub with spokes (columns or a ring); a core block with satellites around it | `node(strong=True)`, `ring`, `line`, `curve` |
| Hierarchy | layered stack; a tree top-down or left-right; nested containers | `rect`, `group`, `section_block`, `fan_out` |
| Comparison | side-by-side panels on one grid; a table of rows; before / after | `rect`, `rows`, `legend` |
| Two axes | 2 x 2 matrix; a scatter of labelled dots on axes | `matrix`, `dot`, `callout` |
| Time | an axis with milestones; phases as bands; a calendar strip | `timeline`, `line`, `rect` |
| Journey with a person | a row of moments with the person's icon, notes under each moment, a mood or pain line above | `icon_card`, `icon_list`, `curve` |
| System of actors | actors as cards, a queue or store in the middle, the human as the loud card, links over and under | `icon_card`, `window_card`, `list_card`, `feature_box` |
| Key figures | a poster: hero figure, supporting tiles, the "how" underneath | `stat`, `rect`, `card` |
| Catalogue | a grid of equal cards, one icon and two lines each | `grid`, `icon_card` |

## Devices (borrow freely, at most three per diagram)

- **The signature blocks** (`scripts/signature.py`): claim title with highlighter, hero, lines of stations,
  numbered step cards, margin notes (the voice), zoom inset, twin panels, takeaway, whisper.

- **The loud element**: one block, card or figure carries the weight (`node(strong=True)`, the loud fill, a key
  card with a heavy outline). Never two.
- **Over-and-under links**: things that are not steps (an idea source, a learning loop, a risk) join the main
  shape with `curve()` above or below it instead of crossing it.
- **Fan-out**: one to many with a bracket (`fan_out`), with "· · ·" when the list goes on.
- **Mock-ups**: a window (`window_card`) for a queue, inbox, dashboard or app; it says "a tool" faster than a box.
- **Icons on actors**: a line icon (`icons.py`) on people, roles, checks, stores and outcomes; never on every word.
- **Pictograms**: a drawing per step for a general audience (`doodles.py`).
- **Notes**: a small icon list under a node (`icon_list`) instead of a paragraph inside it.
- **Badges**: numbers or letters straddling a corner (`badge`, `badges`) to cross-reference a legend or a step.
- **Chips**: outputs (`out_chip`), statuses (`status_chip`), tags straddling an edge.
- **Callouts**: a leader line from a short annotation to the exact point (`callout`).
- **Bands**: a tinted zone or lane that groups (`group`, `lane`), a "today / goal" banner (`banner`).
- **Checklists**: filled vs hollow bullets for live vs to build (`checklist`), ticks in a capability box.

## Combining

- One main layout, one secondary device, one emphasis. A cycle with a loud step and one callout reads; a cycle
  with lanes, badges, chips and a window does not.
- Devices inherit the style: the same `icon_card` is a pastel sticker in playful, a hairline box in editorial, a
  raised block in night. Choose the style from the request (`references/styles.md`), not from the example you
  started from.
- Keep the user's words. A clean layout never justifies renaming their steps.

## Inventing safely

When no layout above fits, invent one, then hold it to the same bar:

- Build it on a grid of named constants; same-role boxes share a size.
- Prefer kit components over raw shapes, so styles, fonts and lint keep working; add raw `rect` / `line` / `curve`
  only for what is genuinely new.
- Lint `--strict`, render, look at the thumbnail and at 100 %, compare with two gallery pictures. If the new shape
  needs an explanation, it is not working yet: simplify or fall back to a known layout.
- A new layout that worked well is worth keeping: note it in the generator's docstring (message, shape, devices)
  so it can be reused as a reference later.

## What "clean" means here

Calm alignment on a grid; gaps bigger than paddings; one loud thing; colour that means something or stays neutral;
short labels in the user's words; links that never cross a label or a box; nothing touching, nothing floating; a
footer that says what is illustrative; text readable at the size the picture will be shown (labels 14+, body 16+
when the canvas is wider than about 1600 px, since it will be scaled down). The gallery pictures are the bar.

## Gallery (`assets/gallery/`)

Look at two of these at the size yours will be shown. They are the bar for calm and finish, not layouts to copy.

| Picture | Shape | What to notice |
|---|---|---|
| `signature_hub.png` | convergence (signature) | claim with highlighter, two lines of stations merging into a yellow hero on the right third, one hand note |
| `signature_path.png` | sequence (signature) | numbered step cards, the answer as the hero, a bracket naming three steps, takeaway with highlighter |
| `signature_split.png` | before / after (signature) | twin columns at identical positions, ghosts for what is gone, the payoff as a huge hero |
| `signature_social.png` | loop, 4:5 for a phone (signature) | 30 px+ text, the closing moment as the hero on top, the loop as a track under it |
| `signature_zoom.png` | architecture with one part that matters (signature) | overview small and grey, dashed ring, the inset as the hero, colour only on the failure path |
| `agent_system-whiteboard.png` | system of actors | pastel per role, fan-out, queue mock-up, curves over and under the row |
| `ring-loop-whiteboard.png` | loop that closes on the same actor | numbered markers on a circle, the closing arc in the accent |
| `permissions-map-corporate.png` | centre with parts and a boundary | read on the left, write on the right, the forbidden zone as a dashed band |
| `grid-3x3-corporate.png` | two axes, three levels | zones named in their own empty cells, one loud card |
| `process_map-corporate.png` | dense process | lifecycle frame, two tracks, gate checklist, bottom band of who / what / questions |
| `flow_tracks-sketch.png` | split and merge | lanes as tracks, one gate, rework loop under the lanes |
| `explainer-playful.png` | sequence for a general audience | one pictogram per step, pastel per card, takeaway in the accent |
| `architecture-night.png` | what talks to what | zones by role, the key zone in the accent, labelled transports |
| `poster-editorial.png` | key figures | hero figure twice the size of the others, the "how" underneath |

