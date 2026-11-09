"""Example — a layered stack: full-width bands from foundation (bottom) to users (top), one layer in accent.

Message: this year's effort goes into the services layer; the layers under it stay as they are.
Composition: equal bands, a fixed label column on the left, components on a column grid shared by every band (so
edges line up vertically across layers), no arrows between layers (stacking already says "built on"), a single
accent tag on each component that actually changes.

    python example_stack.py --out stack.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P, text_size

args, S, pal = example("stack.excalidraw", __doc__)

LABEL_W = 248                            # label column inside each band
NW, NH, NG = 220, 64, 24                 # component nodes on a shared column grid
BH, BG = NH + 48, 16                     # band height, gap between bands
TOP = 148
W = LABEL_W + 4 * NW + 3 * NG + 24

S.header("Platform stack: where this year's work sits", "The effort goes into services; the layers under them stay as they are.")

LAYERS = [  # top (closest to users) to bottom (foundation)
    ("Experiences", "what users touch", ["Web app", "Mobile app", "Partner API"], False),
    ("Services", "this year's work", ["Orders", "Billing", "Search", "Notifications"], True),
    ("Data", "state and history", ["Main database", "Cache", "Event log", "Warehouse"], False),
    ("Infrastructure", "runs everything", ["Containers", "Network", "Secrets", "Observability"], False),
]
for i, (name, sub, comps, hot) in enumerate(LAYERS):
    y = TOP + i * (BH + BG)
    S.rect(0, y, W, BH, P.ACCENT_BG if hot else P.PAPER, P.ACCENT if hot else P.LINE, 2 if hot else 1)
    S.text(28, y + BH / 2 - 22, name, 20, P.ACCENT if hot else P.INK)
    S.text(28, y + BH / 2 + 6, sub, 13, P.GREY)
    for j, c in enumerate(comps):
        S.node(LABEL_W + j * (NW + NG), y + 24, NW, NH, c, fill=P.WHITE, stroke=P.ACCENT if hot else P.STONE, size=16)

# what changes inside the accent layer: tags straddling the top edge of the two components concerned
for j, tag in [(0, "split in two"), (2, "rebuilt")]:
    tx = LABEL_W + j * (NW + NG) + NW - 16
    tw = S.text_size(tag, 12)[0] + 22
    S.chip(tx - tw, TOP + (BH + BG) + 24 - 13, tag, P.ACCENT, P.ACCENT, P.WHITE, 12)

FY = TOP + 4 * BH + 3 * BG + 40
S.text(0, FY, "Top = closest to users · bottom = foundation · component lists are not exhaustive", 13, P.GREY)

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
