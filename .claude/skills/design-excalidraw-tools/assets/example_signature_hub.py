"""Example (signature) — convergence: two lines of support merge into one goal.

Brief
  Claim     A new hire ships in week two, never alone.            (highlighter on "week two")
  Hero      the goal, "Week 2", on the right third, with a shipped change drawn in it
  Device    two coloured lines whose stations are the supports (people, knowledge), merging into the hero
  Voice     one hand note on the most surprising support
  Format    slide 16:9 · plan hero-right
  Depths    3 s: title + hero · 30 s: the two lines · 3 min: subs under each station, the note
  Colour    mood coral: coral = the goal; teal / raspberry = the two families (labelled on the lines, no legend)

    python example_signature_hub.py --out hub.excalidraw [--style signature|corporate|night|mono|...] [--format slide]
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
import signature as G
import doodles
from excalikit import Palette as P

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("--out", default="signature_hub.excalidraw")
ap.add_argument("--style", default="signature")
ap.add_argument("--mood", default="coral", help="signature colour mood (sun, coral, mint, sky, lavender, red-pen)")
args = ap.parse_args()

S, F, pal = G.setup("slide", style=args.style, mood=args.mood if args.style == "signature" else None)
Z = G.plan(F, "hero-right")
G.claim_title(S, F, "A new hire ships in week two, never alone", mark="week two",
              sub="Two lines of support carry them there: the people around them and the knowledge they need.")

# hero -----------------------------------------------------------------------------------------------------------
hx, hy, hw, hh = Z["hero"]
hx, hw = hx + 20, hw - 20


def shipped(S, x, y, w, h):
    """A small change card with a big tick, bottom-right of the hero."""
    cx, cy = x + w - 150, y + h - 160
    S.rect(cx, cy, 112, 120, P.WHITE, P.INK, 2, radius=12)
    for i, lw in enumerate((64, 48, 70, 40)):
        S.line(cx + 18, cy + 26 + i * 18, [[0, 0], [lw, 0]], P.STONE, 3)
    doodles.check(S, cx + 62, cy - 26, 64, P.GOOD if hasattr(P, "GOOD") else P.GREEN, 6)


G.hero(S, hx, hy, hw, hh, "Week 2", kicker="the goal", body="a first real change,\nreviewed and shipped",
       drawing=shipped)
G.sparks(S, hx + 10, hy + 10)

# the two lines --------------------------------------------------------------------------------------------------
mx, my, mw, mh = Z["main"]
SW, SH, SG = 256, 84, (mw - 3 * 256) / 2
fam = [("people", P.TEAL, my + mh * 0.28,
        [("Buddy", "answers daily questions", "user"), ("Manager", "weekly one-to-one", "chat"),
         ("Team", "two pairing sessions", "users")]),
       ("knowledge", P.BLUE, my + mh * 0.78,
        [("Starter tasks", "small, labelled, real", "flag"), ("Docs map", "where things live", "doc"),
         ("Dev setup", "one command", "terminal")])]
targets = [hy + hh * 0.42, hy + hh * 0.60]
for (name, col, cy, stops), ty in zip(fam, targets):
    boxes, end = G.line_of_stops(S, mx, cy, stops, SW, SH, SG, col, label=name)
    G.merge(S, end + 8, cy, hx - 8, ty, col)

# the voice --------------------------------------------------------------------------------------------------------
dev = boxes[2]
G.margin_note(S, dev[0] - 210, dev[1] + SH + 64, "the first small win, on day one", dev[0] + SW * 0.5,
              dev[1] + SH + 8)

G.whisper(S, F, "Illustrative example · supports are not ranked")
G.finish(S, F, args.out,
         alt="Diagram: a new hire ships in week two, supported by two lines, people and knowledge.",
         long="""1. Goal (right, largest): week 2, a first real change reviewed and shipped.
2. Line "people" (top) runs through Buddy (answers daily questions), Manager (weekly one-to-one) and Team (two
   pairing sessions), then merges into the goal.
3. Line "knowledge" (bottom) runs through Starter tasks (small, labelled, real), Docs map (where things live) and
   Dev setup (one command), then merges into the goal.
4. Note on Dev setup: the first small win, on day one.""")
print(args.out, len(S.els), "elements")
