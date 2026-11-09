"""Example — a flow that splits into two tracks and meets again at one gate.

Message: simple tickets take the automated track; every ticket meets the same merge gate.
Composition: five equal columns with numbered headers; shared steps are tall cards spanning both lanes; the fork is
drawn as two chips inside the splitting card; two arrows in, one arrow out of the gate; the rework path runs under
the lanes, dashed red.

    python example_flow_tracks.py --out flow.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P, text_size

args, S, pal = example("flow_tracks.excalidraw", __doc__)

# grid -------------------------------------------------------------------------------------------------------------
CW, GAP = 260, 72
X = [i * (CW + GAP) for i in range(5)]           # triage, build, check, gate, release
W = X[-1] + CW
HEAD_Y = 148                                     # column headers
LA = HEAD_Y + 36                                 # lane A top
LH, LGAP = 224, 24
LB = LA + LH + LGAP
TALL = 2 * LH + LGAP
CH = LH - 80                                     # card height: 40 px of lane above (label) and below
AY, BY = LA + 40 + CH / 2, LB + 40 + CH / 2      # the two track lines

S.header("Feature delivery: two tracks, one gate", "Simple tickets take the automated track; every ticket meets the same merge gate.")
for x, h in zip(X, ["1 · TRIAGE", "2 · BUILD", "3 · CHECK", "4 · GATE", "5 · RELEASE"]):
    S.text(x, HEAD_Y, h, 13, P.GREY)

# lanes (tracks) ---------------------------------------------------------------------------------------------------
PAD = 36                                         # lane padding: arrowheads end inside the lane, clear of its border
L0, LW = X[1] - PAD, X[2] + CW + PAD - (X[1] - PAD)
S.lane(L0, LA, LW, LH, "AUTOMATED TRACK · simple tickets", P.ACCENT_BG, P.ACCENT_SOFT, P.ACCENT)
S.lane(L0, LB, LW, LH, "TEAM TRACK · tickets needing expertise", P.LANE, P.LINE, P.MID)

# shared tall cards ------------------------------------------------------------------------------------------------
S.card(X[0], LA, CW, TALL, "Triage", "PRODUCT OWNER", None, out="tagged tickets", stroke=P.STONE)
S.chip(X[0] + 18, AY - 14, "simple", P.ACCENT, P.ACCENT, P.WHITE, 13)
S.chip(X[0] + 18, BY - 14, "expert", P.INK, P.INK, P.WHITE, 13)
S.node(X[3], LA, CW, TALL, "Merge gate", "tests green · proof per criterion", strong=True, size=22)
S.text(X[0] + 18, LA + TALL / 2 - 16, "decides the track\nof each ticket", 13, P.GREY)
MY = LA + TALL / 2                               # one line out of the gate, to a normal-size card on that line
S.card(X[4], MY - CH / 2, CW, CH, "Release", "RELEASE TRAIN", "weekly, unchanged", out="shipped", fill=P.PAPER,
       stroke=P.LINE, tcolor=P.MID, bcolor=P.GREY)

# track cards ------------------------------------------------------------------------------------------------------
S.card(X[1], LA + 40, CW, CH, "Agent builds", "AUTOMATED", "disposable environment", out="merge request",
       stroke=P.ACCENT, tcolor=P.ACCENT)
S.card(X[2], LA + 40, CW, CH, "Agent checks", "AUTOMATED", "scenarios replayed", out="checked request",
       stroke=P.ACCENT, tcolor=P.ACCENT)
S.card(X[1], LB + 40, CW, CH, "Developer builds", "DEVELOPER", "local tests", out="merge request", stroke=P.STONE)
S.card(X[2], LB + 40, CW, CH, "Tester checks", "TESTER", "one-click environment", out="verified", stroke=P.STONE)

# arrows: one line per track into the gate, a single line out --------------------------------------------------------
fa = X[0] + 18 + S.text_size("simple", 13)[0] + 22 + 8
fb = X[0] + 18 + S.text_size("expert", 13)[0] + 22 + 8
for y, col, f in [(AY, P.ACCENT, fa), (BY, P.INK, fb)]:
    S.arrow(f, y, X[1] - 8, y, col, 2)
    S.arrow(X[1] + CW + 8, y, X[2] - 8, y, col, 2)
    S.arrow(X[2] + CW + 8, y, X[3] - 8, y, col, 2)
S.arrow(X[3] + CW + 8, MY, X[4] - 8, MY, P.INK, 3)

# rework path under the lanes --------------------------------------------------------------------------------------
KO = LB + LH + 28
S.arrow(X[2] + 60, LB + 40 + CH + 4, X[1] + CW - 60, LB + 40 + CH + 6, P.RED, 2, "dashed",
        via=[(X[2] + 60, KO), (X[1] + CW - 60, KO)])
S.text((X[1] + CW + X[2]) / 2, KO + 10, "KO: written feedback to the developer", 13, P.RED, align="center")

# footer -----------------------------------------------------------------------------------------------------------
FY = KO + 64
S.legend(0, FY, [("fill", "automated track (new)", (P.ACCENT_BG, P.ACCENT)), ("fill", "the one gate", (P.LOUD, P.INK)),
                 ("arrow", "rework", P.RED)])
S.text(W, FY + 2, "Target process · release cadence out of scope", 13, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
