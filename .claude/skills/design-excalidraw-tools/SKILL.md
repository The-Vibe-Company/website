---
name: design-excalidraw-tools
description: Design beautiful, art-directed Excalidraw diagrams that explain
  anything — flows, architectures, timelines, before/after, concept maps, loops,
  posters, illustrated explainers, agent and system maps, flashcards, LinkedIn
  or slide visuals — with taste by default (a claim title with a highlighter,
  one hero, grey context, hand margin notes, fixed formats like 16:9 or 4:5) in
  eight styles (signature house look by default, corporate, editorial, sketch,
  playful, whiteboard, dark, mono), from a Python script, linted for layout and
  taste, rendered, judged and delivered with alt text. Use it whenever someone
  asks for an Excalidraw diagram, a schéma, a whiteboard drawing, a visual
  explanation or a visual for a post or slide, or wants a diagram prettier or
  more striking, even without saying "Excalidraw". Prefer it over hand-writing
  Excalidraw JSON. Not for slide decks, Mermaid, numeric charts or UI mockups.
metadata: {}
---

<!-- skillpack:usage:start -->
## Skillpack runtime

Usage is observed locally by skillpack-runtime when installed through Skillpack. Package: f1567982-638a-46c1-9ab1-4379fa8eed44@0.7.0, origin: https://skillpack.app.
Do not send activation reports, run tracking commands, or install hooks during this skill's execution. Setup and updates belong to Skillpack. Continue the task when collection is unavailable. SKILLPACK_TELEMETRY=0 disables collection for this session.
<!-- skillpack:usage:end -->

# Design beautiful Excalidraw diagrams

A beautiful diagram is understood in three seconds and rewards three minutes: a claim, one hero that carries it, a calm path through the rest, a person's voice pointing at what matters, and nothing that fights for attention. Agents already know how to draw boxes; this skill brings the taste — decisions taken before any coordinate and held to the end. By default it imposes them; the user can always ask for something else.

Work in a short loop: **brief → compose → generate → lint → render → look → judge → refine.** Every diagram goes through a real render before you call it done.

## 1. Write the brief

Before any coordinate, write the art-direction brief in the generator's docstring (template and examples in `references/art-direction.md`):

```
Claim · Hero · Device · Voice · Format and plan · Depths (3 s / 30 s / 3 min) · Colour (what each hue means)
```

- **Who looks at it, where, for how long** decides the format: `slide` 16:9 by default, `social` 4:5 for LinkedIn and phones (text 30 px and up, few words), `square`, `doc` portrait, `wide` for a README.
- **The claim** is the one thing they must remember, as a sentence that says something ("Failed jobs never disappear"), not a topic ("Job architecture"). It becomes the title, with the highlighter on its key words.
- **The hero** is the one block that carries the claim: the goal, the key figure, the moment that matters. It is 3-4x bigger than anything else and sits on a third of the frame.
- **The words to keep.** Use the user's own terms for steps, systems and roles, verbatim. Explain an obscure term once on the canvas; never rename.
- If the user gave numbers, keep their unit and statistic attached. Never invent figures; an empty space is better than a made-up metric. A hero that would need an invented number is the wrong hero.

If you cannot name a hero, the content probably holds two messages: make two diagrams, or draw a calm catalogue and say so.

## 2. Compose from the content's shape

Name the shape of the content (a sequence, a split, a loop, a centre with parts, a hierarchy, a comparison, two axes, time, a journey, a system of actors, key figures, a catalogue), then pick a page plan (`hero-right`, `hero-left`, `hero-top`, `path`, `split`, `ring`, `zoom`, `stack`, in `references/art-direction.md`) and the devices that make the shape visible (`references/composition.md`: lines merging, a numbered path, twin panels, a zoom inset, over-and-under links, fan-out, mock-ups, icons on actors, pictograms...). At most three devices.

You have freedom here. The plans are starting grids, the examples and `assets/gallery/` are the bar for finish, not templates: compose for your content, and copy a layout only when the content has exactly its shape. `references/recipes.md` holds validated rules for recurring types (flow, tracks, architecture, stack, timeline, before / after, hub, poster, explainer, flashcards, process map, agent system, cycle). `references/design-principles.md` holds grid, spacing, type, colour and arrow rules.

## 3. Keep the house look unless asked otherwise

The default is the **signature** style: warm paper, a hand-lettered claim with a yellow highlighter, sans body text, grey context, one yellow hero, a burnt-orange voice for notes and the reading path. It is the skill's taste; use it whenever the request names no style and gives no strong signal.

Switch only on a signal (`references/styles.md`): **corporate** for a client or management deck that must look formal, **editorial** for posters and reports, **sketch** for workshops and informal internal drawings, **playful** for a general audience with a warm tone, **whiteboard** for agent and system maps in the classic Excalidraw look, **night** for dark slides, **mono** for print or "no colour". A named style always wins. Brand colours recolour the style's roles (`excalikit.set_palette`). The signature blocks work in every style, so changing style never means losing the composition.

## 4. Generate with the signature layer

```python
import signature as G                       # scripts/signature.py (put scripts/ and assets/ on sys.path)
S, F, pal = G.setup("slide")                 # style="signature" by default; any style works
Z = G.plan(F, "hero-right")                  # zones: title, main, hero, notes, footer
G.claim_title(S, F, "A new hire ships in week two, never alone", mark="week two", sub="...")
G.hero(S, *Z["hero"], "Week 2", kicker="the goal", body="a first real change", drawing=...)
G.line_of_stops(...); G.merge(...); G.step_card(...); G.path_badge(...); G.zoom_inset(...); G.twins(...)
G.margin_note(S, x, y, "the first small win, on day one", tx, ty)     # one or two, never more
G.whisper(S, F, "Illustrative example"); G.finish(S, F, out, alt="...", long="...")
```

Start from the closest signature example — `example_signature_hub.py` (convergence into a goal), `example_signature_path.py` (numbered explainer with a hero step), `example_signature_split.py` (before / after twins), `example_signature_social.py` (LinkedIn 4:5), `example_signature_zoom.py` (overview + zoom inset) — then change the layout to fit your content. Everything in `scripts/excalikit.py` remains available (cards, icon cards, window mock-ups, rings, cycles, matrices, timelines, lanes, legends), with `scripts/icons.py` (52 line icons for actors and checks), `scripts/doodles.py` (pictograms to draw what a step talks about) and `scripts/cards.py` (flashcard decks). The older examples in `assets/` (`example_agent_system.py`, `example_process_map.py`, `example_explainer.py`, `example_flow_tracks.py`, `example_cycle.py`, `example_timeline.py`, `example_architecture.py`...) show those components; each runs with `--out` and `--style`. The kit prints `OVERFLOW` warnings to stderr; fix each one. Keep every content change in the generator so the diagram can be regenerated after feedback.

## 5. Lint, render, look

```bash
python scripts/lint_scene.py diagram.excalidraw --taste        # add --strict for the final pass
node scripts/render_scene.mjs --in diagram.excalidraw --out diagram.png --padding 0
```

Lint catches overflow, overlaps, poking corners, arrows in labels, low contrast and colour sprawl; `--taste` adds the art-direction checks (hero 2.5x the next block, type scale, claim size, text under the format's minimum, margins, dead bands, hue budget); `--strict` adds near-misses, rhythm and padding. Render locally (headless Excalidraw export; setup in `references/validation.md`) or through Excalidraw+ (`references/excalidraw-plus.md`).

Look at the render as a stranger would, at the size it will be seen (a phone for `social`): does the eye land on the hero, then the claim? Is anything touching, cramped or floating? Is a fifth of the frame empty? Fix, regenerate, look again.

## 6. Judge, then refine with a cold eye

For anything that will be presented or published, run the **taste judge** (`references/art-direction.md`): a subagent scores the PNG on focal point, claim, calm, colour, voice and depth, /10; ship at 8 or more, otherwise apply its three changes. For a hero piece, build two compositions with different plans and keep the better one. Add cold critiques when it matters (`references/review-loop.md`: a 30-second reader, a demanding designer, a fact-checker when there are numbers), giving them the render and the texts, never your opinion. When the diagram leaves the team, read `references/audience-rules.md`.

## Output

Deliver the `.excalidraw` file, the generator script beside it, the render (scene URL and/or PNG) and the alt text file (`<name>.alt.md` from `finish()`: alt text and long description, to paste as the image description). Close with one or two sentences on what the diagram says and what you changed after looking at it.

## Protected invariants

- The render is checked before delivery; lint alone is not enough.
- One colour, one meaning, stated on the canvas (a direct label, or a legend when direct labels do not fit).
- The user's words for things are kept verbatim on the canvas.
- No invented numbers; every number carries its unit.
- Publishing goes to a new scene per version; deleting or sharing scenes only on explicit request (share links are public).

## References

- `references/art-direction.md` — the brief, ten moves, formats, page plans, three reading depths, accessibility pass, the taste judge.
- `references/composition.md` — compose from the content's shape: layouts, devices, combining, inventing safely; `assets/gallery/` as the bar.
- `references/styles.md` — the eight styles, how to choose, colour moods, brand colours.
- `references/design-principles.md` — grid, spacing, hierarchy, typography, colour, arrows, density, the beauty checklist.
- `references/recipes.md` — rules for recurring diagram types and the kit calls that build them.
- `references/review-loop.md` — cold critique briefs and how to sort feedback.
- `references/validation.md` — order of checks, lint findings and fixes, local renderer setup, where to zoom.
- `references/audience-rules.md` — when the diagram leaves the team: cartouche, numbers, provenance, tone.
- `references/excalidraw-plus.md` — publishing, screenshots, HTTP fallback, pitfalls.
- `scripts/signature.py` (frames, plans, signature blocks, alt text), `scripts/excalikit.py`, `scripts/icons.py`, `scripts/doodles.py`, `scripts/cards.py`, `scripts/lint_scene.py`, `scripts/render_scene.mjs`, `scripts/excalidraw_plus.py`; `assets/palettes.py`; `assets/example_*.py`.
