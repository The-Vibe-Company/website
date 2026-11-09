"""Example — architecture: columns by role, zone-to-zone arrows labelled with the transport, one accent zone.

Message: every dashboard reads modelled tables, never raw sources.
Composition: four equal zones on one row, same header structure, colour only on the zone the message is about;
shared concerns as chips in a strip under everything; legend and source in the footer line.

    python example_architecture.py --out arch.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P

args, S, pal = example("architecture.excalidraw", __doc__)

# grid -------------------------------------------------------------------------------------------------------------
CW, GAP = 300, 104                    # zone width, gap between zones (room for a two-line arrow label)
NW, NH, NGAP = CW - 48, 76, 24        # node size and gap inside a zone
TOP = 148
HEAD = 44
ZH = HEAD + 24 + 2 * NH + NGAP + 24   # two nodes per zone: same height everywhere
W = 4 * CW + 3 * GAP
xs = [i * (CW + GAP) for i in range(4)]

S.header("Data platform: one road from source to screen", "Every dashboard reads modelled tables, never raw sources.")

ZONES = [
    ("SOURCES", [("Product database", "orders, users"), ("Event stream", "clicks, sessions")], False),
    ("INGESTION", [("Change capture", "every 5 min"), ("File loader", "nightly batch")], False),
    ("WAREHOUSE", [("Raw → staging", "typed, deduplicated"), ("Models + tests", "the only tables read")], True),
    ("CONSUMERS", [("Dashboards", "team metrics"), ("Notebooks", "ad-hoc analysis")], False),
]
for x, (name, nodes, hot) in zip(xs, ZONES):
    if hot:
        S.group(x, TOP, CW, ZH, name, P.ACCENT_BG, P.ACCENT, header=P.ACCENT, header_text=P.WHITE)
    else:
        S.group(x, TOP, CW, ZH, name, P.PAPER, P.LINE, header=P.LINE, header_text=P.INK)
    y = TOP + HEAD + 24
    for label, sub in nodes:
        S.node(x + 24, y, NW, NH, label, sub, fill=P.WHITE, stroke=P.ACCENT if hot else P.STONE)
        y += NH + NGAP

AY = TOP + HEAD + (ZH - HEAD) / 2     # arrows at the body's centre line, edge to edge with 8 px of air
for i, lab in enumerate(["CDC +\nfiles", "loads\nraw", "SQL on\nmodels"]):
    S.labelled_arrow(xs[i] + CW + 8, AY, xs[i + 1] - 8, AY, lab, P.MID, 2)

# shared concerns strip --------------------------------------------------------------------------------------------
SY = TOP + ZH + 32
S.rect(0, SY, W, 56, P.WHITE, P.LINE, 1)
S.text(24, SY + 19, "ACROSS EVERY ZONE", 13, P.GREY)
cx = xs[1] + 24                          # chips start on the second column: the strip keeps the grid
for c in ["access control", "monitoring", "lineage", "data contracts"]:
    cx += S.chip(cx, SY + 14, c, P.PAPER, P.STONE, P.INK, 13) + 16

# footer: legend left, provenance right, on one line ---------------------------------------------------------------
FY = SY + 56 + 40
S.legend(0, FY, [("fill", "where the rule is enforced", (P.ACCENT_BG, P.ACCENT)), ("box", "component", P.STONE)])
S.text(W, FY + 2, "Sketch for discussion · refresh rates to confirm", 13, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
