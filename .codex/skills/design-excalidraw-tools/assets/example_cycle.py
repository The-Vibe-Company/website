"""Example — a cycle around a core: five stages on a circle, arc arrows between them, the thing they all feed in the
middle.

Message: every answered ticket improves the shared guide, and the guide makes the next answers better.
Shape: a loop (main) around a centre (secondary). Layout: ring() places the stages, cycle() draws the arcs, the core
is the one loud card; one callout says where a person steps in. No row, no lanes: the content is a loop.

    python example_cycle.py --out cycle.excalidraw [--style whiteboard|corporate|sketch|playful|editorial|night|mono]
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)  # works under python -I too
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
from palettes import example, tints
from excalikit import Palette as P, ring

args, S, pal = example("cycle.excalidraw", __doc__, default_style="whiteboard")
MOOD = pal["_style"]["mood"]

top = S.header("Every ticket makes the next answer better",
               "Answers feed one shared guide; the guide trains the assistant that drafts the next answers.")

CX, CY, R = 520, top + 330, 300           # centre and radius of the loop
BW, BH = 262, 76                          # stage cards
stages = [("Answer the ticket", "chat"), ("Tag what was missing", "flag"), ("Weekly review", "users"),
          ("Update the guide", "pencil"), ("Retrain the assistant", "robot")]
pos = ring(CX, CY, R, len(stages), BW, BH)
fills = tints(len(stages), pal["_style"]["palette"], MOOD)
boxes = []
for (x, y), (label, ic), (fill, edge) in zip(pos, stages, fills):
    boxes.append(S.icon_card(x, y, BW, BH, label, ic, fill=fill, stroke=edge if MOOD == "pastel" else P.INK,
                             size=17))
S.cycle(CX, CY, R, boxes, P.MID, 2)

core = S.icon_card(CX - 120, CY - 70, 240, 140, "Shared guide", "doc", sub="one source of truth", layout="stack",
                   fill=P.LOUD, sw=3, size=22)

# one callout: where a person steps in
bx, by, bw, bh = boxes[2]
S.callout(bx + bw + 40, by + bh + 34, bx + bw - 30, by + bh + 2, "a person decides what changes", P.MID, 14)

S.text(CX + R + BW / 2, CY + R + BH / 2 + 40, "Illustrative loop · stages are examples", 13, P.GREY, align="right")
S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements")
