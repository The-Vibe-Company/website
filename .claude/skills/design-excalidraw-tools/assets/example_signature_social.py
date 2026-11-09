"""Example (signature) — a feedback loop for a social post: the step everyone skips is the hero.

Brief
  Claim     The loop only closes when users see the change.      (highlighter on "see the change")
  Hero      step 6, the closing moment, "Oh, it's fixed!", on top, with a user who notices it drawn in it
  Device    one accent track looping under the hero; the five other steps sit on it as short numbered stops
  Voice     one hand note inside the loop, on the arrow from "We ship" back into the hero
  Format    social 4:5 (1080 x 1350, seen ~400 px wide on a phone: every text >= 30 px) · plan stack
  Depths    3 s: title + hero · 30 s: the numbered loop · 3 min: the note, the hero's line
  Colour    yellow = the moment that matters; accent = the loop and its numbers; everything else grey and white

    python example_signature_social.py --out social.excalidraw [--style signature|corporate|night|mono|...]
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
import signature as G
import doodles
import excalikit as K
from excalikit import Palette as P

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("--out", default="signature_social.excalidraw")
ap.add_argument("--style", default="signature")
args = ap.parse_args()

S, F, pal = G.setup("social", style=args.style)
Z = G.plan(F, "stack")
T = F.min_text                                          # 30 px: the floor for every text but the whisper


def fit(s, size, max_w, floor):
    """Largest size <= `size` at which `s` fits in max_w (in the font that size gets under the current style)."""
    while size > floor and K.text_size(s, size, K.font_for(size, S.font))[0] > max_w:
        size -= 2
    return size


def badge(cx, cy, n):
    """Reading-path number (on a phone format, text under 44 px stays in the body font)."""
    G.path_badge(S, cx, cy, n, d=58)


G.claim_title(S, F, "The loop only closes\nwhen users see the change", mark="see the change", size=68)

# hero: step 6, the closing moment ----------------------------------------------------------------------------------
hx, hy, hw = F.x0, Z["hero"][1], F.cw
hh = 410
fill, stroke, txt, sub = G.hero_colours()
LOOP_L, LOOP_R, LOOP_B = F.x0 + 170, F.x1 - 170, 1170  # the track: two columns and a bottom row
STOP_W, STOP_H = 340, 88

# the loop is drawn first so the hero and the stops cover it: only the stretches between them show
track = S.rect(LOOP_L, hy + hh - 80, LOOP_R - LOOP_L, LOOP_B - (hy + hh - 80), "transparent", P.ACCENT, 5,
               radius=72)
track["customData"] = {"decor": "track"}

box = S.rect(hx, hy, hw, hh, fill, stroke, 3, radius=28)
box["customData"] = {"hero": True}
pad = 56
cy = hy + 44
badge(hx + pad + 29, cy + 22, 6)
G.hand(S, hx + pad + 58 + 18, cy + 2, "the moment that closes it", 34, sub)
cy += 70
word = "“Oh, it's fixed!”"
ws = fit(word, 104, hw - 2 * pad, 60)
S.text(hx + pad, cy, word, ws, txt)
cy += K.text_size(word, ws, K.font_for(ws, S.font))[1]
top, bot = cy + 16, hy + hh - 30                        # the drawing sits under the word, right of the body
cy += 24
S.text(hx + pad, cy, "users notice the change,\nright where they asked", T + 2, txt)

# the drawing: the user who asked, with a ticked speech bubble
dh = bot - top
bw, bh = dh * 1.25, dh * 0.8
bx = hx + hw - pad - bw
doodles.bubble(S, bx, top, bw, bh, mark=None, fill=P.WHITE)
doodles.check(S, bx + bw * 0.32, top + bh * 0.1, bh * 0.5, P.GREEN, 6)
doodles.person(S, bx - dh * 0.62, bot - dh * 0.85, dh * 0.68, dh * 0.85)
G.sparks(S, hx + hw - 14, hy + 14, start=-80, spread=80)

# the five other steps, stops on the loop ----------------------------------------------------------------------------
rows = (hy + hh + 120, hy + hh + 280)                   # centres of the two side rows
stops = [(LOOP_L, rows[0], "Users report"), (LOOP_L, rows[1], "Support triages"), ((LOOP_L + LOOP_R) / 2, LOOP_B,
         "Product ranks"), (LOOP_R, rows[1], "Devs fix"), (LOOP_R, rows[0], "We ship")]
boxes = []
for i, (cx, cyy, label) in enumerate(stops, 1):
    x, y = cx - STOP_W / 2, cyy - STOP_H / 2
    S.rect(x, y, STOP_W, STOP_H, P.WHITE, P.LINE, 2, radius=18)
    badge(x + 16 + 29, cyy, i)
    S.text_mid(x + 16 + 58 + 18, cyy, label, T + 2, P.INK)
    boxes.append((x, y, STOP_W, STOP_H))

# direction along the track: short arrows on the visible stretches, same colour as the track
g = G.ARROW_GAP
S.arrow(LOOP_L, hy + hh + g, LOOP_L, boxes[0][1] - g, P.ACCENT, 5)                  # 6 -> 1
S.arrow(LOOP_L, boxes[0][1] + STOP_H + g, LOOP_L, boxes[1][1] - g, P.ACCENT, 5)     # 1 -> 2
S.arrow(LOOP_L, boxes[1][1] + STOP_H + g, LOOP_L, LOOP_B - 72, P.ACCENT, 5)            # 2 -> (3), into the bend
S.arrow(LOOP_R, LOOP_B - 72, LOOP_R, boxes[3][1] + STOP_H + g, P.ACCENT, 5)            # (3) -> 4, out of the bend
S.arrow(LOOP_R, boxes[3][1] - g, LOOP_R, boxes[4][1] + STOP_H + g, P.ACCENT, 5)     # 4 -> 5
key = S.arrow(LOOP_R, boxes[4][1] - g, LOOP_R, hy + hh + g, P.ACCENT, 5)            # 5 -> 6, the one teams skip

# the voice ---------------------------------------------------------------------------------------------------------
# inside the loop, under the hero: the curve leaves the top of the note and lands on the 5 -> 6 arrow, passing
# above the "We ship" stop (margin_note would leave from the side of the text, straight through that stop)
note = G.hand(S, (LOOP_L + LOOP_R) / 2, boxes[0][1] + 8, "most teams\nstop at\n\u201cshipped\u201d", T + 2,
              P.ACCENT, align="center")
sx, sy = note["x"] + note["width"] * 0.7, note["y"] - 10
tx, ty = LOOP_R - 12, hy + hh + 34
G.bezier(S, [(sx, sy), (sx + 6, ty + 4), (tx - 80, ty - 6), (tx, ty)], P.ACCENT, 2)

G.whisper(S, F, "Illustrative loop")
G.finish(S, F, args.out,
         alt="Diagram: a product feedback loop that only closes when users see the change.",
         long="""1. Hero (top, largest): step 6, the closing moment: "Oh, it's fixed!", users notice the change right
   where they asked.
2. Below it, a loop of five numbered steps: 1 Users report, 2 Support triages, 3 Product ranks, 4 Devs fix,
   5 We ship, then back up into step 6, and from 6 down to 1 again.
3. Note inside the loop, on the arrow from We ship to the hero: most teams stop at "shipped".""")
print(args.out, len(S.els), "elements")
