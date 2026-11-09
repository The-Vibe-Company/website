"""Example — a concept hub: one bold centre, two families of satellites, short fanned connectors.

Message: six supports serve one goal; people on one side, knowledge on the other.
Composition: a 3 x 3 grid with the centre in the middle cell, satellites in the side columns (three per family),
family names as coloured column headers instead of a legend; connectors fan into evenly spaced points of the centre's
edge so no two lines meet before they arrive.

    python example_hub.py --out hub.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P

args, S, pal = example("hub.excalidraw", __doc__)

SW, SH, RG = 280, 92, 36                # satellite size and row gap
G = 168                                 # gap between a satellite column and the centre
CWD, CHT = 320, 168                     # centre size
TOP = 196                               # first satellite row (column headers sit 36 px above)
xs = [0, SW + G, SW + G + CWD + G]      # left, centre, right
W = xs[2] + SW
ROWS_H = 3 * SH + 2 * RG
CY = TOP + (ROWS_H - CHT) / 2

S.header("Onboarding: what a new hire leans on", "Six supports, one goal: a first real change shipped in week two.")

S.node(xs[1], CY, CWD, CHT, "First change shipped", "by the end of week two", strong=True, size=24)

FAM = [("PEOPLE", P.TEAL, P.TEAL_BG, P.TEAL_SOFT, xs[0], +1,
        [("Buddy", "answers daily questions"), ("Manager", "weekly one-to-one"), ("Team", "two pairing sessions")]),
       ("KNOWLEDGE", P.BLUE, P.BLUE_BG, P.BLUE_SOFT, xs[2], -1,
        [("Starter tasks", "small, labelled, real"), ("Docs map", "where things live"), ("Dev setup", "one command")])]
for name, col, bg, soft, x, side, items in FAM:
    S.text(x, TOP - 36, name, 13, col)
    for i, (title, sub) in enumerate(items):
        y = TOP + i * (SH + RG)
        S.node(x, y, SW, SH, title, sub, fill=bg, stroke=col)
        # from the satellite's inner edge to a fanned point on the centre's facing edge
        sx = x + SW + 8 if side > 0 else x - 8
        ex = xs[1] - 8 if side > 0 else xs[1] + CWD + 8
        ey = CY + CHT / 2 + (i - 1) * 44
        S.line(sx, y + SH / 2, [[0, 0], [ex - sx, ey - (y + SH / 2)]], col, 1)

S.text(0, TOP + ROWS_H + 48, "Illustrative example · supports are not ranked", 13, P.GREY)

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
