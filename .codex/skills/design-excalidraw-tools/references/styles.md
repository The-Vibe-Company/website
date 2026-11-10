# Styles

A style is the whole look of a diagram, a grammar rather than a palette: fonts (body, titles, small labels), header
(sizes, alignment, rule), corner radius, stroke weights (quiet / key), outline colour, zone fills (solid or hachure),
arrows (straight or arched), the loud element (ink block, raised neutral, yellow sticker with shadow) and how colour
is spent (its mood). The eight styles live in `assets/palettes.py` (`STYLES`); every example takes `--style <name>`,
and your own generator calls `palettes.setup(style="<name>")` before drawing and `S.header(title, message)` for the
title block, so the kit applies the grammar everywhere (`excalikit.STYLE`, `font_for`, `Scene._finish`).

Contents: choosing a style · signature (and its six moods) · corporate · editorial · sketch · playful · whiteboard · night · mono · colour moods · brand colours ·
make it superb in any style.

Pick the style from the request and the audience, before any coordinate. One style per diagram: never mix fonts,
roughness, radii or moods on one canvas. Colour is not the default: sober is. Most diagrams read better with
neutrals and one accent than with a rainbow, and a user who did not ask for colour should not get it.

## Choosing a style

| Signal in the request or audience | Style |
|---|---|
| No signal: the default for anything new (explainers, posts, slides, docs) | **signature** |
| A formal client or management deck, documentation that must look institutional | **corporate** |
| Poster, report, article, one-pager, "summary on one page" | **editorial** |
| Workshop, brainstorm, internal explainer, "sketch", "whiteboard", informal | **sketch** |
| General or non-technical audience (blog, public, onboarding) with a warm tone: "friendly", "warm", "fun", "not corporate", "colourful", "for kids" | **playful** |
| Agent or system map, product or tech post, team talk, "the Excalidraw look" with icons | **whiteboard** |
| "Dark", slides in dark mode, developer talk, dark-mode documentation | **night** |
| "Print", "black and white", "sober", "minimal", "no colour", photocopied handout | **mono** |

- **Audience first, then tone.** A general or non-technical audience (blog readers, the public, new customers,
  kids) *plus* a warm tone in the request ("friendly", "warm", "fun", "not corporate", "playful", "colourful") means
  **playful**, even when the request also says "hand-drawn": playful is hand-drawn too. Sketch is for informal
  *internal* use (workshop, team channel, brainstorm) or when "hand-drawn" comes with no audience or tone.
- **Only when the signals really tie, pick the soberer one** (mono > editorial > corporate > signature > sketch > night >
  playful in colour spent) and offer the other in one line: "Made in corporate; say if you want the hand-drawn
  sketch version." Do not use this rule to override an explicit warm tone for a general audience.
- **A named style wins** over every signal.
- **Brand palette**: keep the style's structure (rendering, radius, mood) and swap palette roles; see
  "Brand colours" below. Never invent a ninth style for a brand.

## signature

The house look and the default. Warm paper (`#fbf8f1`), near-black ink, warm greys for everything that is context.
Titles, the hero word and the voice are hand-lettered (Excalifont); labels and body are Nunito, so it reads like a
person explaining over a clean document. Crisp lines (roughness 0), radius 14, strokes 2 / 3.
Signature devices (`scripts/signature.py`, `references/art-direction.md`): the claim title with a highlighter
swipe on its key words; one hero 3-4x bigger than the rest; families as coloured lines with white stations;
numbered badges for the path; one or two hand notes with curved arrows, in the voice colour; a grey whisper footer.
Colour: the mood's hero colour = the hero and the highlighter, the mood's voice colour = the notes and the path, at
most two meaning colours (cat1, cat2) for families, everything else grey.
Use it for: anything without a strong style signal. Avoid it when the user wants something institutional
(corporate) or printed in black and white (mono).

### Signature moods

The grammar stays; the pair of colours changes. Six moods, each checked for contrast (voice text, badges, greys,
hero text all 4.5:1 or more): `G.setup(fmt, mood="coral")`.

| Mood | Hero and highlighter | Voice and path | Fits |
|---|---|---|---|
| `sun` | yellow | burnt orange | the original; energy, launches, anything upbeat |
| `coral` | coral | navy | people, teams, onboarding, customers, care |
| `mint` | mint | fir green | growth, improvement, health, before / after that got better |
| `sky` | pale blue | cobalt | systems, architecture, data, infrastructure |
| `lavender` | lavender | deep violet | ideas, AI, product, strategy |
| `red-pen` | an ink block (no hue) | red pen | reviews, rules, corrections, "what to fix"; not when red would read as danger on a good change |

Pick the mood from the content with this table. When nothing points to one, call `G.mood_for(claim)`: it picks a
mood from the claim, the same one every time for the same diagram and a different one for the next, so a series of
diagrams does not all wear yellow. Keep one mood across a series that belongs together (one deck, one post
carousel) and say which one you used. A colour meaning still has to be stated on the canvas; a mood changes which
colour, never the rule.

## corporate

**When**: the default. Clients, management, steering committees, slides on a white background, documentation.
**Signature**: Nunito everywhere, `roughness 0`, radius 12, white canvas, cool grey lanes and hairlines, quiet
strokes 1.5 and key strokes 2.5. Reads as finished and neutral. Title 36 left-aligned, message 20, no rule.
**Colour**: mood sober. One violet accent (`#6741d9`) for the thing that matters: the new track, the enforced zone,
the hero figure, the takeaway line. The loud element is an ink-black block (`node(strong=True)`), so accent and ink
share the attention: use the accent for "what changes", ink for "the one gate". Semantic red / green only where
something fails or improves; the two category families (blue, teal) only to separate two kinds of node, as in a hub.
**Avoid**: a second accent zone; tinting every box "to make it lively"; violet as a category colour.

```bash
python assets/example_flow_tracks.py --style corporate   # any example; corporate is the default without --style
```

## editorial

**When**: posters, one-page summaries, reports, articles, anything that will be read like a printed page.
**Signature**: **Liberation Sans** (a grotesk), **square corners** (radius 0), hairline **ink outlines** (1 px) on
every box, a **44 px title** and a full-width rule under the header, off-white paper canvas (`#f7f4ec`), deep navy
ink. Category families are ink and grey, open questions ink dashed. Reads as typeset rather than drawn.
**Colour**: mood sober. One cobalt pen (`#1d4ed8`) for the hero figure, the key zone and the takeaway; navy ink
block for the loud element. Keep semantic red / green to failure and target paths only. Let typography and
alignment carry the hierarchy: a 56 px hero figure and a strict column grid do more here than any fill.
**Avoid**: rounded "app" cards (keep the radius the style sets); bright category fills; anything decorative.
Call `S.canvas(pal["canvas"])` (the examples do) so the paper colour survives Excalidraw+ screenshots.

```bash
python assets/example_poster.py --style editorial
```

## sketch

**When**: workshops, brainstorms, internal explainers, a drawing for the team channel, anything that should feel
unfinished and open to change.
**Signature**: a page from a notebook. Excalifont, `roughness 1`, radius 16, cool off-white paper (`#f5f5f1`),
a **graphite pen line** (`mid`) on every solid box instead of pale grey, **hachure** in tinted zones and lanes,
**arched** step-to-step arrows, graphite ink. "Bad" is plum, so it never reads as the accent.
**Colour**: mood sober. One **blue ballpoint** accent (`#2449a8`) for the key step, the enforced zone, the hero
figure, the notes and the takeaway; a **lime highlighter** (`#c0eb75`) for the highlighted words and a pale lime
hero in signature blocks; graphite block for the loud element. Cards stay white; in an explainer only the key card
takes the accent tint (`tints(..., mood="sober", key=K)`). Category families are teal and raspberry. Its colours are
deliberately not the signature's: a sketch must not look like the house look with a wobble.
**Avoid**: pastels on every card (that is playful); hachure behind a block of text (the kit hatches only zones that
hold boxes); using sketch for a client deliverable because it "looks nicer".

```bash
python assets/example_explainer.py --style sketch        # the explainer's default style
```

## playful

**When**: a general audience: blog posts, onboarding, explainers for non-technical readers, anything asked to be
friendly, fun, colourful or for kids.
**Signature**: Excalifont body with **Lilita One** titles (a chunky display face), centred header, `roughness 1`,
**radius 20**, cream canvas (`#fffcf5`), soft ink outlines on every box, **the loud element is a sunflower sticker**
(`#ffd43b`, ink outline, solid offset shadow), arched arrows, pictograms from `scripts/doodles.py` in explainers.
**Colour**: mood pastel. Explainer cards get one tint each from `palettes.tints(n, "playful")` (yellow, green,
violet, pink, blue, mint, peach) with ink numbers; zones and lanes drawn without an explicit fill take the next
pastel automatically (`lane()`, `group()`); hub families are blue and pink. The orange pen (`#c2410c`) is kept for
the accent: the takeaway, the key zone, the underline. Open questions are violet dashed (yellow belongs to the
sticker).
**Avoid**: pastels on a diagram where colour must mean something (status, ownership); more than seven tints; a
legend for the tints; dense technical content (move to sketch or corporate).

```bash
python assets/example_explainer.py --style playful
```

## whiteboard

**When**: agent and system maps, product or tech posts, a team talk, "the Excalidraw look": diagrams that should feel
hand-made but tidy, with icons that name the kinds of things (people, roles, checks, queues).
**Signature**: Excalifont lettering on **crisp lines** (roughness 0), radius 14, white board, soft ink (`#2b2f36`),
line icons from `scripts/icons.py` before labels, straight connectors plus smooth `curve()` links over and under
the row.
**Colour**: mood pastel. Each role or actor card takes the next pastel with a border of the same hue
(`palettes.tints(n, "whiteboard")`: lavender, blue, green, yellow, pink, teal, peach); the person who decides is the
loud card (pale blue, heavy outline); outcomes in the good tint; a learning or idea component in the violet accent
tint. Status dots in a queue only when their colours mean something.
**Avoid**: roughness on the shapes (that is sketch); a pastel on every box including neutral steps; icons as decoration.

```bash
python assets/example_agent_system.py --style whiteboard
```

## night

**When**: dark slides, developer talks, conference screens, dark-mode documentation. Only when the destination is
dark: a night diagram pasted into a white document looks like a hole.
**Signature**: Nunito body with **Cascadia** (monospace) for small labels and chips, `roughness 0`, radius 12, an
elevation ladder (canvas `#0e1016` < lanes < paper < cards `#212739`), light ink (`#eef1f7`). The loud element is a
**raised neutral** block (`#2b3350`) with a heavy light outline, never a white slab.
**Colour**: mood sober. One cyan accent (`#67e8f9`) for the key zone, the new track, the hero figure and the
takeaway; accent zones get a dark teal tint. Semantic colours are brightened for dark (rose, green, amber) and hub
families are violet and blue on dark tints. Text colours were chosen for contrast on the dark surfaces; do not
dim them further.
**Avoid**: pure black canvas or pure white text everywhere (glare); a second light block; mixing a night diagram
with light ones in the same deck. Always call `S.canvas(pal["canvas"])`, or the dark page vanishes in screenshots.

```bash
python assets/example_architecture.py --style night
```

## mono

**When**: print, black-and-white handouts, faxes and photocopies, and any request for "sober", "minimal" or
"no colour". Also a good second version of any diagram to test that the hierarchy holds without hue.
**Signature**: Liberation Sans, `roughness 0`, radius 2, white canvas, black ink outlines, four print-safe tones
(`#ffffff`, `#e0e0e0`, `#8f8f8f`, `#111111`), a rule under the header. Pictogram markers turn grey
(`doodles.set_mood("mono")`). Reads as a technical drawing.
**Colour**: mood mono, no hue at all. The accent is the ink itself: the key zone gets a black header and a heavy
outline on a light grey fill, the loud element is a black block, the hero figure sits on grey. "Bad" paths become
grey dashed outlines (quiet: what disappears should not shout), "new" steps a grey fill with a heavy border, open
questions a dashed box on white.
**Avoid**: relying on two greys that a printer will merge (keep fills to paper / lane grey vs white); any
legend entry that only differs by shade; reintroducing one colour "just for the accent".

```bash
python assets/example_before_after.py --style mono
```

## Colour moods

Each style carries a `mood` that says how colour is spent. Read it in a generator from `pal["_style"]["mood"]` and
pass it to `palettes.tints(...)` and `doodles.set_mood(...)`.

**sober** (corporate, editorial, sketch, night). Neutrals for all structure; one accent for the single thing that
matters; at most two semantic hues more (bad, good, wait, open), each with one meaning, named in the legend or a
coloured header. Category families (cat1, cat2) only when the diagram really has two kinds of thing. Rule: if you
cannot say what a colour means in three words, it is grey.

**pastel** (playful). One tint per step or per family, from `palettes.tints()`, cycling in a fixed order. Here
colour paces the reading and codes nothing, so there is **no legend** for the tints and no tint is "better" than
another. The accent stays reserved for one element (the takeaway line, the underline). Rule: pastel only where the
order of steps is the structure (explainers, a row of cards, a hub's families); never on statuses or owners.

**mono** (mono). No hue. Emphasis comes only from **weight** (stroke 3 for the loud element, 1 for quiet zones),
**fill** (black, grey, white) and **dashes** (not there yet, removed, open). Rule: every distinction in the legend
must survive a black-and-white photocopy; if two items differ only by a light grey shade, add a dash or a weight.

## Brand colours

When the user names a brand palette, keep the style (rendering, radius, mood) and recolour its roles before drawing:

```python
S, pal = palettes.setup(style="corporate")
excalikit.set_palette({"accent": "#e4002b", "accent_bg": "#fdecef", "accent_soft": "#f5a3b1", "ink": "#1a1a2e"})
```

`set_palette` takes role names (`accent`, `bad`, `good_bg`, `cat1_soft`, `canvas`, `on_dark`...) or kit attribute
names (`INK`, `ACCENT_BG`...). Map the brand's main colour to `accent` (with a pale `accent_bg` and a mid
`accent_soft`), its dark to `ink`, and leave the neutrals alone unless the brand defines them. If you change the
canvas, pass the same colour to `S.canvas(...)` and `S.dump(..., background=...)`. Re-run lint: `contrast` catches a
brand accent too light for text.

## Make it superb in any style

- **One message, one loud element.** The subtitle states it; the eye lands on one block, zone or figure. A style
  changes what the loud element looks like, never how many there are.
- **The grid does the work.** Same-role boxes share a size, gaps are equal and bigger than paddings, every value
  comes from `palettes.SPACE` and `TYPE`. A misaligned diagram looks cheap in every style.
- **Spend colour last.** Build the diagram in neutrals first, then add the accent to the one thing that matters,
  then semantic hues only where a reader needs them. If it already works in mono, it will work in any style.
- **Few words, the user's words.** Two-line titles, short example lines, no paragraphs; keep their terms verbatim.
- **Draw the thing** in explainers: one pictogram per step from `doodles.py` beats a sentence in every style.
- **Render and look**, then compare against the style's signature above: right font, right radius, right canvas,
  one accent, nothing that belongs to another style.
- **Offer the alternative in one line** when another style fits too; never deliver two styles unasked.
