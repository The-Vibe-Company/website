"""Example — a roadmap on a timeline: milestones above the axis, phases below it, one decision made loud.

Message: pilot first, then scale; the go / no-go decides the rollout.
Composition: equal quarters labelled in their span (not on the ticks); milestones in one row above the axis, equal
cards centred on their date with dashed stems; phases as tinted spans right under the quarter labels; 'today' as a
dashed line with a small chip at its top, running through the gap between two cards.

    python example_timeline.py --out roadmap.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P

args, S, pal = example("timeline.excalidraw", __doc__)

QW = 380                                   # one quarter
W = 4 * QW
Y = 330                                    # the axis
CW, CH = 200, 92                           # milestone cards
CY = Y - 56 - CH                           # card row, 56 px above the axis

def at(q):                                 # position in quarters -> x
    return q * QW

S.header("Roadmap: pilot first, then scale", "Nothing reaches every team before the pilot shows a measured gain.")

# axis, quarter boundaries, quarter labels centred in their span --------------------------------------------------
S.line(0, Y, [[0, 0], [W, 0]], P.INK, 2)
for i in range(5):
    S.line(at(i), Y - 8, [[0, 0], [0, 16]], P.INK, 2)
for i, q in enumerate(["QUARTER 1", "QUARTER 2", "QUARTER 3", "QUARTER 4"]):
    S.text(at(i + 0.5), Y + 16, q, 13, P.GREY, align="center")

# phases under the labels -----------------------------------------------------------------------------------------
PY = Y + 52
S.rect(at(0), PY, at(1.6) - 8, 48, P.ACCENT_BG, P.ACCENT_SOFT, 1)
S.text(at(0) + 16, PY + 14, "Pilot · two teams", 16, P.ACCENT)
S.rect(at(1.6), PY, at(4) - at(1.6), 48, P.LANE, P.LINE, 1)
S.text(at(1.6) + 16, PY + 14, "Rollout · every team, two at a time", 16, P.MID)

# milestones: one row, the decision is the loud one ---------------------------------------------------------------
MS = [(0.3, "Kick-off", "scope, pilot teams"), (0.95, "First measure", "baseline vs pilot"),
      (1.6, "Go / no-go", "scale or stop"), (2.55, "Half of teams", "trained, migrated"),
      (3.5, "Every team", "pilot rules by default")]
for q, title, sub in MS:
    x = at(q)
    hot = title.startswith("Go")
    S.node(x - CW / 2, CY, CW, CH, title, sub, fill=P.WHITE, stroke=P.STONE, strong=hot)
    S.line(x, CY + CH + 6, [[0, 0], [0, Y - (CY + CH) - 14]], P.STONE, 2, "dashed")
    S.ellipse(x - 7, Y - 7, 14, 14, P.INK, P.INK, 1)

# today: through the gap between the first two cards --------------------------------------------------------------
TX = at(0.62)
S.line(TX, CY - 4, [[0, 0], [0, PY + 48 + 12 - (CY - 4)]], P.MID, 2, "dashed")
S.chip(TX - 33, CY - 34, "TODAY", P.MID, P.MID, P.WHITE, 12)

# footer -----------------------------------------------------------------------------------------------------------
FY = PY + 48 + 48
S.legend(0, FY, [("fill", "pilot", (P.ACCENT_BG, P.ACCENT_SOFT)), ("fill", "the decision", (P.LOUD, P.INK))])
S.text(W, FY + 2, "Quarters evenly spaced · milestones are targets, not commitments", 13, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
