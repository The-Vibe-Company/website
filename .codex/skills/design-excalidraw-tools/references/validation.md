# Validation

A diagram is done when it has passed, in this order: the generator's own warnings, the lint, a real render looked at whole and then zoomed in on the places where defects hide. Each step is cheaper than the next and catches different things, so do not skip ahead: a render will not tell you that an edge is 2 px off, and a lint will not tell you that the eye lands on the wrong box.

## 1. Generator warnings

Run the generator and read stderr. Fix every `OVERFLOW` and `OUT CHIP TOO WIDE` before anything else: they come from the kit's own size estimates and are the cheapest to fix (shorter words, wider card, `out_high=True`).

## 2. Lint

```bash
python scripts/lint_scene.py diagram.excalidraw            # errors + default warnings, exit 1 on any error
python scripts/lint_scene.py diagram.excalidraw --strict   # final polish pass: adds near-miss, rhythm, padding, touch
python scripts/lint_scene.py diagram.excalidraw --taste    # art direction: hero, type scale, claim, format minimum, margins, dead bands, hues
python scripts/lint_scene.py diagram.excalidraw --json      # machine-readable, same content
```

Zero errors is the bar. Warnings are triaged: fix, or keep with a reason you can say in one sentence. Every geometry finding ends with a `crop x,y,w,h` hint in scene coordinates; feed it to the renderer's `--crop` to see the spot (step 4).

| Finding | What it means | Usual fix |
|---|---|---|
| `corner` (error from 2 px) | A square or less-rounded shape (accent bar, header band, chip) pokes out of a rounded corner. Excalidraw's adaptive radius is `0.25 × min(w, h)`, capped at 32 px, so a 120 px tall card has r = 30. | Give the inner shape the same roundness and size as its corner, inset it by r, move it out of the corner zone, or make the outer box square. A header band must use the container's radius, not its own. |
| `arrow-end` | An arrow starts or ends inside a text or a badge / chip. A stem drawn from the exact centre of a dot is allowed. | End the arrow 4–8 px before the text's or badge's edge, or move the label. |
| `arrowhead` | The tip is inside a box, so the head sits across its border. Most often an arrow entering a lane or group to reach a card close to the group's edge. | Stop 4–8 px before the edge; keep targets 30 px or more inside a group, or end the arrow outside the group. |
| `contrast` | WCAG AA fails: under 4.5:1 for text under 24 px, under 3:1 from 24 px. The background is the solid fill under the text's centre, or the canvas. Grouped by colour pair. | Darken the text (`MID`/`INK` instead of `GREY` for anything someone must read) or lighten the fill. Grey is acceptable only for captions nobody needs. |
| `orphan` | A few elements sit far away from the rest (often a stray arrow or a forgotten note). | Move them in or delete them. |
| `near-miss` (strict) | Two box edges 1–3 px apart: they look misaligned, not deliberately offset. | Snap to the same coordinate, or separate by 8 px or more. |
| `rhythm` (strict) | Uneven gaps between same-style siblings in a row or column (up to 1.5× apart; larger differences count as deliberate), or same-style boxes of slightly different sizes. | Compute positions from one gap constant and one size constant. |
| `padding` (strict) | Text within 8 px of its box's left edge or 6 px of its top/bottom (2 px in chips). The right edge is not checked: generated widths are estimates. | Increase the inset; 16–24 px reads as designed. |
| `touch` (strict) | An arrowhead tip lands exactly on a border. Acceptable in dense diagrams, cleaner with a 4–8 px gap. | Shorten the arrow by 4–8 px. |

The lint reads widths from the file. Generated widths are estimates (the kit overestimates Nunito by 10–25 %), so a pass is necessary, not sufficient.

## 3. Local render

`scripts/render_scene.mjs` renders a `.excalidraw` file to PNG with headless Chromium and the official Excalidraw export (`exportToSvg` from `@excalidraw/excalidraw`, pinned version, from the jsDelivr CDN), fonts included (Nunito = fontFamily 6, Excalifont = 5). It needs no Excalidraw+ account, only network access to the CDN.

One-time setup, in a folder outside the skill:

```bash
mkdir -p ~/excalidraw-render && cd ~/excalidraw-render
npm i playwright
npx playwright install chromium
```

Then run it from that folder (or anywhere with `NODE_PATH=<that folder>/node_modules`):

```bash
node <skill>/scripts/render_scene.mjs --in diagram.excalidraw --out diagram.png            # 100 %
node <skill>/scripts/render_scene.mjs --in diagram.excalidraw --out thumb.png --scale 0.35 # thumbnail
node <skill>/scripts/render_scene.mjs --in diagram.excalidraw --out zoom.png --crop 400,120,300,200 --scale 3
node <skill>/scripts/render_scene.mjs --in diagram.excalidraw --out dark.png --dark
node <skill>/scripts/render_scene.mjs --in diagram.excalidraw --out d.png --text-report     # real vs stored text widths
```

Exit codes: 0 rendered, 1 render failed, 2 bad arguments, 3 Playwright or Chromium missing (the message says what to install). If Playwright's expected browser build is missing, the script falls back to any Chromium in the Playwright cache, or to `CHROMIUM_PATH`.

The render matches an Excalidraw+ screenshot of the same file (same export code, same fonts, same 20 px margin); Excalidraw+ downscales to 1920 px wide, and small text can look a touch heavier locally. Neither re-measures text: both draw the widths stored in the file, so `--text-report` is the way to see where the kit's estimate is far from the real font. Use Excalidraw+ (`references/excalidraw-plus.md`) when the diagram is published there anyway or when the network blocks the CDN.

## 4. Look: thumbnail, 100 %, zoom

**Thumbnail (`--scale 0.3`–`0.4`, about 600 px wide).** This is how most people first see it, in Slack or on a slide. Check only what survives at that size:
- Where the eye lands first, second, third. Is the first stop the message?
- One loud element at most (a dark or saturated box). Two loud elements fight.
- The overall shape: columns, lanes or a flow direction readable without text.
- Balance: no empty band, no corner crammed while another is bare.
- Colour: each colour family reads as one meaning; a stray colour stands out here.

**100 % (`--scale 1`).** Read it as the audience would:
- Every text readable without effort; no label you have to hunt for.
- Arrows: each one clearly starts and ends somewhere, none passes behind a box or through a label.
- Cards of the same role look identical (size, padding, title position).
- Alignment: columns share their left edges, rows share their tops.

**Zoomed regions (`--crop … --scale 2` or `3`).** Defects that are invisible at 100 % but jar on a projector or a 4K screen. Always zoom on:
1. Every place the lint gave a crop hint.
2. The corners of each rounded card that carries an accent bar, a header band, a badge or a chip near its edge.
3. Every arrowhead entering a lane, group or card, and every arrow start leaving a badge.
4. The densest card (the most text) and the longest label of each kind, where the stored width is most likely wrong.
5. Chips and status pills: text centred, padding even, nothing clipped.
6. The legend and the cartouche: they are read last and checked hardest.

Crop coordinates are scene coordinates, the same numbers as in the generator, so `--crop x,y,w,h` takes a card's own `x, y, w, h` plus a margin. Scale 2 is the default for a zoom; scale 3–5 for corners and arrowheads.

## 5. Optional: cold critique

For anything presented or published, follow `references/review-loop.md`: give one or two reviewers the 100 % render, the thumbnail and a text dump, never your own opinion. Run it after steps 1–4 are clean, so reviewers spend their attention on the message and not on defects a script could find.

## Loop

After each round of fixes: regenerate → lint → render the thumbnail and the regions you touched. Re-render the whole diagram at 100 % before delivery.
