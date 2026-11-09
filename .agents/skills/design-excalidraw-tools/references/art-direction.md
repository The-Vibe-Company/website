# Art direction: taste by default

Agents already know how to draw boxes and arrows. What makes a reader say "that's beautiful" is a handful of
decisions taken before any coordinate, then held all the way: what the claim is, what the hero is, where it sits,
what is grey, what the voice says, which frame it lives in. This file is those decisions. The layer that applies
them is `scripts/signature.py`; the house look that comes with it is the **signature** style.

Contents: the brief · ten moves · formats · page plans · three reading depths · accessibility pass · the taste
judge · keep it from becoming a template · when to step back.

## The brief (write it before any code, in the generator's docstring)

```
Claim     <a sentence that says something, not a topic>        (highlighter on "<1-3 words>")
Hero      <the one thing that carries the message>, <where: right third / top / centre of the loop>
Device    <the one idea that makes the shape visible: lines merging, a numbered path, twin panels, a zoom, a loop>
Voice     <the one or two things a person would point at and say out loud>
Format    <slide | social | square | doc | wide> · plan <hero-right | hero-left | hero-top | path | split | ring | zoom | stack>
Depths    3 s: <title + hero> · 30 s: <the main path> · 3 min: <subs, notes, numbers, sources>
Colour    <hero colour = ...>; <each other hue = its meaning>; everything else grey
```

If a line is hard to write, the diagram is not ready: "Hero: everything is equally important" means two diagrams
or a list, not a picture. The claim is the user's message in their words; never invent a claim the content does not
support, and keep their terms verbatim.

## Ten moves (the signature layer does each by default)

1. **A claim, not a topic.** "A new hire ships in week two, never alone", not "Onboarding overview". Hand-lettered,
   48-60 px on a slide, top-left, one line; a one-line sans subtitle at 20+ px or none. `claim_title()`.
2. **The highlighter.** One swipe of yellow behind the 1-3 words that carry the claim, under the text, slightly
   tilted, overshooting by a few pixels. Once per diagram (title or takeaway). `claim_title(mark=)`, `takeaway()`.
3. **One hero, 3-4x bigger.** One block carries the message: a number, a word, the goal, the moment that matters,
   set huge (80-110 px) in the hero colour, on a third of the frame, never dead centre. Nothing else comes close in
   size. `hero()`; in a loop or a path, the key step is the hero (bigger card, its own drawing).
4. **Grey context, colour with a meaning.** Everything that is context is ink, grey and white. Colour goes on the
   hero and on what the reader must tell apart (two families, the path, the danger). At most four hues, each named
   on the canvas (a line label, a word), not in a legend.
5. **Lines instead of boxes in boxes.** Families, tracks and flows are coloured lines with stations on them
   (`line_of_stops`, `merge`), or tinted zones without borders; never three levels of nested rectangles.
6. **A numbered path when there is an order.** Filled accent discs on the steps' corners (`path_badge`,
   `step_card`) so even a non-linear layout reads in order.
7. **The voice.** One or two hand notes in the accent, in the margin, each with a curved arrow to one exact point:
   the surprise, the trade-off, the "this is where a person decides". Never a label, never a third note.
   `margin_note()`.
8. **A frame with a format.** The canvas has a size chosen for where it will be seen, margins of about 7.5 % of
   the short side, and no dead band: if a fifth of the frame is empty, grow the hero, move a note there, or change
   the format. `setup(fmt)`, `plan()`.
9. **Micro and macro.** When one part needs detail, keep the overview small and grey and open a zoom inset beside
   it (`zoom_inset`); when two states are compared, use twin panels of identical layout where only the change is
   coloured (`twins`).
10. **A quiet footer.** Provenance and "illustrative" go bottom-right, small, grey, readable (`whisper`). Nothing
    else lives in the margins.

Small touches, at most one: sparks on the hero's corner (`sparks`), a drawing inside the hero (a shipped change, a
person, a document: `doodles.py`), a takeaway line with the highlighter under the main zone.

## Formats

| Format | Size | Smallest text | Use | Density |
|---|---|---|---|---|
| `slide` | 1600 x 900 | 16 px | decks, blog figures, docs (default) | 5-7 main elements, notes allowed |
| `social` | 1080 x 1350 | 30 px | LinkedIn, Instagram, anything read on a phone | 3-5 elements, 2-3 words each, one note |
| `square` | 1080 x 1080 | 28 px | square posts, thumbnails | 3-5 elements |
| `doc` | 1240 x 1600 | 14 px | Notion, Confluence, PDF pages, printed handouts | densest; all three depths |
| `wide` | 1600 x 760 | 18 px | README, banners (GitHub shows ~830 px wide) | one row of up to 6 |

Pick the format from where the picture will be seen; when nothing says, `slide`. A dense process map or a workshop
wall can outgrow every format: then use the free canvas (`palettes.setup` and `S.canvas()`) and apply the moves.

## Page plans

`plan(F, name)` returns zones `(x, y, w, h)`: always `title`, `footer`, and the ones below. They place the hero
on a third and leave room for the voice; they are starting grids, not templates: move a zone when the content asks
for it, keep the margins.

| Plan | Zones | For |
|---|---|---|
| `hero-right` | main (left 2/3), hero (right third), notes (under main) | convergence, many-to-one, supports of a goal, inputs to a result |
| `hero-left` | hero (left third), main (right 2/3), notes | one-to-many, a source feeding parts, a decision and its effects |
| `hero-top` | hero (band under the title), main (grid below), notes | key figure and how it is reached, a poster |
| `path` | main (a row of steps), notes (band below: takeaway, voice) | sequences, explainers, how something works |
| `split` | left, right (twin panels), notes | before / after, two options, today / target |
| `ring` | main (a square for the loop), notes (right column: claim detail, voice) | loops, cycles, flywheels |
| `zoom` | main (overview, left), inset (the detail, right), notes | architectures with one part that matters, a step with internals |
| `stack` | hero (top), main (below), notes | social and portrait formats, read top to bottom |

## Three reading depths

| Depth | What | How it is encoded |
|---|---|---|
| 3 seconds | the claim and the hero | the two biggest things on the canvas, the only highlighter, the hero colour |
| 30 seconds | the main path: 3-6 named steps, families or parts and how they connect | 18-22 px labels, full-contrast strokes, numbered badges, lines in their meaning colour |
| 3 minutes | subs, numbers with units, notes, sources, edge cases | 14-16 px (never under the format's minimum), grey, at the periphery or under the element they belong to; the voice notes |

Nothing from depth 3 sits inside the main path; nothing from depth 1 is repeated in depth 2.

## Accessibility pass (before delivery)

- Text contrast 4.5:1 (3:1 for 24 px and up); strokes that carry meaning 3:1 and at least 2 px. `lint_scene` checks.
- Never colour alone: each colour family also has a word on the canvas (a line label), a shape, a dash or an icon.
- No text under the format's minimum (`lint_scene --taste`); body in the sans font, hand lettering only for the
  title, the hero word and the voice; left-aligned multi-line text; no all-caps sentences.
- Five items or fewer per group; split into overview + inset or two diagrams beyond that.
- Alt text and a long description, written with `finish(alt=, long=)`: the alt says the diagram type and the claim
  in 125 characters or less; the long description says what leads to what, in reading order, each branch and merge
  explicitly, then the notes and numbers, then what colour means (only if it carries meaning). Deliver it with the
  render; paste it as the image description when the picture goes into a doc or a post.

## The taste judge

For anything that will be presented or published, after lint and your own look: give a subagent the PNG and only
this rubric (not your opinion), and ask for a score per line and the three changes that would most raise the total.

| /2 each | Question |
|---|---|
| Focal point | Does the eye land on the hero first, and is the hero the message? |
| Claim | Does the title say something, and does the highlighter sit on the right words? |
| Calm | Aligned on a grid, even gaps, margins kept, no dead band, nothing touching or floating? |
| Colour | Grey context, each hue with a meaning, nothing loud that does not matter? |
| Voice and depth | Do the notes point at the interesting thing, and does the picture reward a second look? |

Ship at 8/10 or more. Below, apply the three changes and judge again (at most twice). For a hero piece (a launch
post, a client deck's key slide), build two compositions with different plans, judge both, keep the better one.

## Keep it from becoming a template

The moves are a vocabulary, not a checklist. A blind review of the first signature diagrams found them better than
the earlier ones every time, and then warned that side by side they all looked alike. So:

- **Use the moves the content needs.** No surprise in the content, no voice note. A claim that reads well alone
  needs no highlighter. A hero can be a word, a number, a band, a drawing, a zone or the last step of a path; it
  does not have to be a yellow card.
- **The voice never adds facts.** A margin note points at what the user's content already says, or asks the
  question the audience will ask ("how is it enforced?"). It never introduces a claim, a statistic or a habit
  ("most teams stop at shipping") the user did not give; if you want one, ask, or phrase it as a question.
- **The hero is full of meaning, not of colour.** A large block that is mostly empty fill (a black slab with one
  icon) is weight without content: make it smaller, or put the message inside it (the word, the number, the
  drawing).
- **Reading order beats drama.** In a loop or a path, number from where the reader starts; the hero can be the
  last step, but the badges still run 1 to n in reading order.
- **Yellow is spent once or twice.** The highlighter and the hero share it; never a third yellow thing, and a hero
  that is a wide band takes a paler tint so the highlighter still pops.
- **Secondary text is still text.** Kickers, cell captions and footers keep the format's minimum and 4.5:1
  contrast on whatever they sit on (grey on yellow is the usual trap).

## When to step back

- The user named a style: keep it; the moves still apply (`signature.setup(fmt, style="corporate")` gives the same
  composition in corporate, night, mono...).
- Dense working documents (process maps, swimlanes with many steps): legibility first; keep the claim title, the
  grey context and the voice, skip the hero.
- The content has no message yet (a raw inventory): say so, and draw a calm catalogue (`grid`) with the claim
  "What we have today" rather than inventing a hero.
