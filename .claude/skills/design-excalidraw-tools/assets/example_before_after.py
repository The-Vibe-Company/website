"""Example — before / after on one canvas: two panels on the same grid, the change in colour, nothing else.

Message: routing moves into the form, so two people touch a request instead of four.
Composition: two equal panels, identical row grid (the same step sits at the same height on both sides); the
headline figure of each side in its header; steps that disappear are dashed red on the left and leave a dashed ghost
on the right; new steps carry the accent. A numbered stepper replaces arrows between rows.

    python example_before_after.py --out compare.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P

args, S, pal = example("before_after.excalidraw", __doc__)

PW, MID_GAP = 660, 112                  # panel width, gap between panels (holds the big arrow)
TOP = 148
HEAD = 112                              # panel header: label + figure
RH, RG = 64, 20                         # row height and gap: shared by both panels
PH = HEAD + 5 * RH + 4 * RG + 32
PX = [0, PW + MID_GAP]
W = 2 * PW + MID_GAP

S.header("Support requests: from four people to two", "Routing moves into the form; nobody triages or re-routes by hand.")

# kind: same | gone | new | ghost
BEFORE = [("Customer writes an email", "CUSTOMER", "same"), ("Shared inbox", "WAITING", "same"),
          ("Agent reads and triages", "SUPPORT AGENT", "gone"), ("Wrong team: re-routed", "TEAM LEAD", "gone"),
          ("Specialist answers", "SPECIALIST", "same")]
AFTER = [("Customer fills a short form", "CUSTOMER", "new"), ("Category picks the queue", "AUTOMATIC", "new"),
         ("no manual triage", "", "ghost"), ("no re-routing", "", "ghost"), ("Specialist answers", "SPECIALIST", "same")]

STYLE = {  # fill, stroke, stroke style, title colour, number disc
    "same": (P.WHITE, P.STONE, "solid", P.INK, P.INK),
    "gone": (P.RED_BG, P.RED, "dashed", P.RED, P.RED),
    "new": (P.ACCENT_BG, P.ACCENT, "solid", P.ACCENT, P.ACCENT),
    "ghost": (P.PAPER, P.STONE, "dashed", P.GREY, None),
}

for px, (label, figure, fcol), rows in [(PX[0], ("TODAY", "4 people touch a request", P.INK), BEFORE),
                                         (PX[1], ("TARGET", "2 people touch a request", P.ACCENT), AFTER)]:
    S.rect(px, TOP, PW, PH, P.PAPER, P.LINE, 1)
    S.text(px + 32, TOP + 28, label, 13, P.GREY)
    S.text(px + 32, TOP + 52, figure, 28, fcol)
    y0 = TOP + HEAD
    S.line(px + 46, y0 + RH / 2, [[0, 0], [0, 4 * (RH + RG)]], P.LINE, 2)          # stepper spine
    n = 0
    for i, (title, actor, kind) in enumerate(rows):
        y = y0 + i * (RH + RG)
        fill, stroke, style, tcol, disc = STYLE[kind]
        S.rect(px + 80, y, PW - 112, RH, fill, stroke, 2, style)
        S.text(px + 104, y + RH / 2 - 12, title, 18, tcol)
        if actor:
            S.text(px + PW - 56, y + RH / 2 - 8, actor, 12, P.GREY, align="right")
        if disc:
            n += 1
            S.ellipse(px + 32, y + RH / 2 - 14, 28, 28, disc, disc, 1)
            S.text(px + 46, y + RH / 2 - 9, str(n), 14, P.WHITE, align="center")

AY = TOP + PH / 2
S.arrow(PW + 24, AY, PX[1] - 24, AY, P.INK, 3)

FY = TOP + PH + 40
S.legend(0, FY, [("fill", "new step", (P.ACCENT_BG, P.ACCENT)), ("dashed", "disappears", P.RED), ("box", "unchanged", P.STONE)])
S.text(W, FY + 2, "Counts read from the two flows above", 13, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
