"""Example — a poster with key figures: headline, one hero figure and three supporting ones, how it was obtained,
what is still open.

Message: the pilot cut the time to a first answer by three quarters.
Composition: the hero tile is wider and carries the accent, the three others share the remaining width and the same
height (tops and bottoms aligned); below, two thirds for the "how" (three steps) and one third for open questions,
both starting on the same line with the same height. Every figure carries its unit and its base.

    python example_poster.py --out poster.excalidraw [--hand] [--palette clean|warm|ink]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
from excalikit import Palette as P

args, S, pal = example("poster.excalidraw", __doc__)

W, G = 1440, 32
TOP = 148
TH = 128                                         # every tile the same height
HERO_W = 560
SMALL_W = (W - HERO_W - 3 * G) / 3

S.header("Support pilot: answers in hours, not days", "Eight weeks, two teams: routing in the form cut the wait for a first answer by three quarters.")

# the hero figure: a tinted tile, the number twice the size of the others (no edge bar: it is already the loudest)
S.rect(0, TOP, HERO_W, TH, P.ACCENT_BG, P.ACCENT, 2)
S.text(28, TOP + 14, "−75 %", 56, P.ACCENT)
S.text(28, TOP + 94, "median time to a first answer: 24 h → 6 h", 16, P.INK)
x = HERO_W + G
for value, label in [("92 %", "routed to the right team first time"), ("2", "people touch a request (was 4)"),
                     ("1 400", "requests in the pilot, 8 weeks")]:
    S.rect(x, TOP, SMALL_W, TH, P.WHITE, P.LINE, 2)           # supporting figures: plain tiles, ink numbers
    S.text(x + 24, TOP + 22, value, 28, P.INK)
    S.text(x + 24, TOP + 70, label, 13, P.MID)
    x += SMALL_W + G

# how (two thirds) and open questions (one third), same top line, same height --------------------------------------
BY = TOP + TH + 64
BH = 104
HOW_W = (W - G) * 2 / 3
QW = W - HOW_W - G
S.text(0, BY, "HOW IT WAS OBTAINED", 13, P.GREY)
STEPS = [("Short form", "customer picks a category"), ("Auto-routing", "category → team queue"),
         ("Specialist answers", "no triage, no re-routing")]
CWD = (HOW_W - 2 * 56) / 3
for i, (t, b) in enumerate(STEPS):
    cx = i * (CWD + 56)
    hot = t == "Auto-routing"
    S.card(cx, BY + 30, CWD, BH, t, None, b, stroke=P.ACCENT if hot else P.STONE, tcolor=P.ACCENT if hot else P.INK,
           tsize=18)
    if i:
        S.arrow(cx - 56 + 8, BY + 30 + BH / 2, cx - 8, BY + 30 + BH / 2, P.MID, 2)
S.questions_box(HOW_W + G, BY, QW, BH, "STILL OPEN", ["Does it hold with five teams?", "Who owns the categories?"])

S.text(0, BY + 30 + BH + 40, "Illustrative figures · median over all pilot requests, compared with the 8 weeks before",
       13, P.GREY)

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
