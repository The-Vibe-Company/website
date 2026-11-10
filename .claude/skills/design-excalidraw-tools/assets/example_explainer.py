"""Example — an illustrated explainer: five pastel cards, one drawing each, read left to right.

Message: the assistant does not answer from memory; it reads the right passages first and shows where it found them.
Audience: non-technical readers of a blog post, glancing for ten seconds, maybe reading for thirty.
Composition: centred title with a hand underline; a row of equal cards, each with a number badge straddling its
top-left corner, a drawing in the icon zone, a two-line title and a short example line; arched arrows between cards;
the takeaway in the accent colour under the row; a quiet note that the example is made up.
Colour: follows the style's mood. sober (sketch, corporate, editorial, night): neutral cards, the answer card in the
accent tint; pastel (playful): one pastel per step paces the reading, no legend, the accent kept for the takeaway;
mono: no hue, the answer card marked by a heavier outline and a grey fill.

    python example_explainer.py --out explainer.excalidraw [--style sketch|playful|corporate|editorial|night|mono]
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)  # works under python -I too
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
from palettes import example, tints
import excalikit
from excalikit import Palette as P, ARROW_GAP
import doodles as D

args, S, pal = example("explainer.excalidraw", __doc__, default_style="sketch")
STYLE = pal["_style"]
MOOD = STYLE["mood"]
HAND = STYLE["hand"]
D.set_mood(MOOD)

# ---------------------------------------------------------------- grid
CW, CH, GAP = 256, 330, 80            # card size and gap (the gap holds an arched arrow)
N = 5
W = N * CW + (N - 1) * GAP
MID = W / 2
TOP = 196                             # card row
ICON_TOP, ICON_H = 40, 132            # icon zone, relative to the card top
TITLE_Y, BODY_Y = 196, 262            # card title (2 lines, 22) and example line (2 lines, 16)

STEPS = [
    ("You ask\na question", "“Can I work from home\non Fridays?”"),
    ("It searches the\ncompany documents", "like a librarian\nscanning the shelves"),
    ("It picks the most\nhelpful passages", "just the few lines\nthat answer it"),
    ("The AI reads them\nwith your question", "passages + question\ngo in together"),
    ("You get an answer,\nwith its sources", "“Yes, with your\nmanager's OK.”"),
]
KEY = N - 1                           # the step the message is about (sober and mono moods mark only this one)
FILLS = tints(N, STYLE["palette"], MOOD, key=KEY)

# ---------------------------------------------------------------- header
S.header("How an AI assistant answers your question",
         "It reads your company's documents first, then answers and shows where it looked.", underline=HAND)

# ---------------------------------------------------------------- cards
cards = []
for i, ((t, body), (fill, mark)) in enumerate(zip(STEPS, FILLS)):
    x = i * (CW + GAP)
    key = i == KEY and MOOD != "pastel"
    stroke = (P.ACCENT if key else P.INK) if (HAND or MOOD == "pastel") else (P.ACCENT if key else P.STONE)
    S.rect(x, TOP, CW, CH, fill, stroke, 3 if key else 2, radius=None)
    cards.append(x)
    zx, zy, zw, zh = x + 40, TOP + ICON_TOP, CW - 80, ICON_H
    cx = x + CW / 2
    if i == 0:
        D.bubble(S, zx - 8, zy, zw - 40, zh - 24, mark="?")
        D.person(S, x + CW - 98, zy + zh - 74, 60, 74)
    elif i == 1:
        D.page_stack(S, zx, zy + 6, zw - 40, zh - 12)
        D.magnifier(S, zx + zw - 84, zy + zh - 90, 80, 80)
    elif i == 2:
        D.page(S, cx - 52, zy, 104, zh, lines=6, highlight=(1, 4))
        D.check(S, cx + 60, zy + 18, 26)
        D.check(S, cx + 60, zy + 74, 26)
    elif i == 3:
        D.page(S, x + 24, zy + 6, 44, 58, lines=3, highlight=(0, 2))
        D.bubble(S, x + CW - 90, zy, 66, 60, mark="?")
        D.robot(S, cx - 52, zy + 28, 104, 104)
    else:
        D.answer(S, zx - 16, zy + 4, zw + 32, zh - 8, tags=("HR policy", "Handbook"))
    D.badge(S, x + 4, TOP + 4, i + 1, mark, d=46)
    S.text(cx, TOP + TITLE_Y, t, 22, P.INK, align="center")
    S.text(cx, TOP + BODY_Y, body, 16, P.MID, align="center")

# ---------------------------------------------------------------- arrows between cards (mid icon height)
ay = TOP + ICON_TOP + ICON_H / 2 + 20
for x in cards[:-1]:
    D.curvy_arrow(S, x + CW + ARROW_GAP + 6, ay, x + CW + GAP - ARROW_GAP - 6, ay, bend=-18)

# ---------------------------------------------------------------- takeaway and note
FY = TOP + CH + 48
S.text(MID, FY, "It doesn't answer from memory: it reads the right pages first, then tells you where it found them.",
       24, P.INK if MOOD == "mono" else P.ACCENT, align="center")
S.text(W, FY + 56, "Example question and answer are made up.", 14, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out)
