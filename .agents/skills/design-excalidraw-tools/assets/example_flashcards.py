"""Example — a deck of flashcards: a cover and three concept cards, portrait 4:5, one idea per card.

Message of the deck: three habits make a diagram readable in thirty seconds.
Audience: people learning a practice (a course, an onboarding, a team wiki), who swipe through the cards on a phone or
print them; each card must stand alone.
Composition of a concept card, top to bottom: handwritten kicker, poster title (display face, ink shadow), optional
handwritten side tag, one short paragraph, a numbered list with bold lead words or a second paragraph, one small
hand-drawn diagram (with a "Don't do this!" note when the card warns against something), a yellow rule-of-thumb box,
a quiet footer (deck name, page). The cover has the kicker, the poster title, a subtitle over a rule, a numbered table
of contents and a call to swipe.
Colour: the style's accent for titles and the rule; orange handwritten notes for warnings; green check and red cross;
yellow only for the tip box. Default style playful (hand-drawn diagrams on a warm page); every style works.

    python example_flashcards.py --out flashcards.excalidraw [--style playful|sketch|corporate|editorial|night|mono]
    # export one card at 1200 x 1500 (card i starts at x = i * 680):
    node ../scripts/render_scene.mjs --in flashcards.excalidraw --out card-1.png --crop 680,0,600,750 --scale 2 --padding 0
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
from palettes import example
from excalikit import Palette as P
import doodles as D
import cards as C

args, S, pal = example("flashcards.excalidraw", __doc__, default_style="playful")
D.set_mood(pal["_style"]["mood"])

DECK = "Clear diagrams"
N = 4


def page(i):
    x, y = C.card_xy(i)
    return C.card(S, x, y, deck=DECK, source=f"{i} / {N - 1}" if i else "pocket guide")


# ---------------------------------------------------------------- cover
x0, y0, w, ymax = page(0)
cx = x0 + w / 2
y = C.kicker(S, cx, y0 + 10, "Pocket guide to", size=32)
y = C.poster_title(S, cx, y + 6, "CLEAR\nDIAGRAMS", w, size=96)
y += 30
C._txt(S, cx, y, "3 habits for diagrams people get in thirty seconds", 20, P.INK, C.body_font(), align="center")
y = C.rule(S, x0 + 10, y + 36, w - 20) + 34
y = C.toc(S, x0 + 8, y, w - 8, ["One message per diagram", "One accent, one meaning", "Look before you ship"],
          cols=1, size=20, row=54)
C.cta(S, cx, ymax - 60, "Swipe through the 3 cards  →")
C.check_fit(y, ymax - 70, "cover")

# ---------------------------------------------------------------- card 1: one message
x0, y0, w, ymax = page(1)
cx = x0 + w / 2
y = C.kicker(S, cx, y0, "Before you draw")
y = C.poster_title(S, cx, y + 4, "ONE MESSAGE", w) + 22
y = C.paragraph(S, x0, y, w, "A diagram is read in thirty seconds. Decide what the reader must remember before you "
                "place a single box, and write it under the title.")
y = C.numbered(S, x0, y, w, [("Audience", "who looks at it, where, and for how long."),
                             ("Message", "one sentence, written in the subtitle."),
                             ("Words", "the reader's own terms, kept verbatim.")]) + 12
# diagram: a crowded box crossed out -> one clear box with a check
bh = 120
C.box(S, x0 + 10, y + 34, 190, bh, "12 ideas,\n9 colours", size=18)
D.cross(S, x0 + 176, y + 20, 26)
S.arrow(x0 + 216, y + 34 + bh / 2, x0 + w - 216, y + 34 + bh / 2, P.INK, 2)
C.box(S, x0 + w - 200, y + 34, 190, bh, "1 message", size=18, stroke=P.ACCENT, color=P.ACCENT)
D.check(S, x0 + w - 36, y + 18, 28)
C.note(S, x0 + 24, y + bh + 54, "Don't do this!", (x0 + 70, y + 34 + bh + 6), bend=-10)
y += bh + 100
y = C.tip(S, x0, y, w, "If you cannot say the message in one sentence, you need two diagrams.", bottom=ymax)
C.check_fit(y, ymax, "card 1")

# ---------------------------------------------------------------- card 2: one accent
x0, y0, w, ymax = page(2)
cx = x0 + w / 2
y = C.kicker(S, cx, y0, "Colour")
y = C.title_with_tag(S, x0, y + 4, w, "ONE ACCENT", "one colour,\none meaning") + 22
y = C.paragraph(S, x0, y, w, "Colour is a signal, not decoration. When every box is coloured, nothing stands out and "
                "the eye has nowhere to land.")
y = C.paragraph(S, x0, y, w, "Start in grey. Spend the accent on the one thing the reader must see first, and say "
                "what it means in a legend.") + 6
bw, bh, g = 104, 64, 32
fills = [(P.RED_BG, P.RED), (P.BLUE_BG, P.BLUE), (P.GREEN_BG, P.GREEN), (P.ORANGE_BG, P.ORANGE)]
for k, (f, s) in enumerate(fills):
    C.box(S, x0 + k * (bw + g), y + 30, bw, bh, f"step {k + 1}", fill=f, stroke=s, color=s)
C.note(S, x0 + w - 150, y - 4, "Don't do this!", (x0 + 3 * (bw + g) + bw / 2, y + 24), bend=12)
y2 = y + 30 + bh + 56
for k in range(4):
    key = k == 2
    C.box(S, x0 + k * (bw + g), y2, bw, bh, f"step {k + 1}", fill=P.ACCENT_BG if key else P.WHITE,
          stroke=P.ACCENT if key else P.STONE, color=P.ACCENT if key else P.MID)
D.check(S, x0 + 2 * (bw + g) + bw - 10, y2 - 20, 26)
y = y2 + bh + 30
y = C.tip(S, x0, y, w, "Two meanings need two colours and a legend. Five meanings need a different diagram.",
          bottom=ymax)
C.check_fit(y, ymax, "card 2")

# ---------------------------------------------------------------- card 3: look before you ship
x0, y0, w, ymax = page(3)
cx = x0 + w / 2
y = C.kicker(S, cx, y0, "How to")
y = C.poster_title(S, cx, y + 4, "LOOK BEFORE\nYOU SHIP", w, size=60) + 22
y = C.paragraph(S, x0, y, w, "A lint catches overlaps and overflowing text. Only a render shows what a stranger sees: "
                "where the eye lands, what feels cramped, what floats.")
# loop of four steps, clockwise, with the stopping rule in the middle
bw, bh = 196, 64
lx, rx = x0 + 6, x0 + w - 6 - bw
ty, by = y + 12, y + 12 + bh + 130
steps = [(lx, ty, "1  Generate"), (rx, ty, "2  Lint"), (rx, by, "3  Render"), (lx, by, "4  Look")]
for sx, sy, lab in steps:
    C.box(S, sx, sy, bw, bh, lab, size=17, fill=P.BLUE_BG, stroke=P.BLUE, color=P.INK)
S.arrow(lx + bw + 8, ty + bh / 2, rx - 8, ty + bh / 2, P.INK, 2)
S.arrow(rx + bw / 2, ty + bh + 8, rx + bw / 2, by - 8, P.INK, 2)
S.arrow(rx - 8, by + bh / 2, lx + bw + 8, by + bh / 2, P.INK, 2)
S.arrow(lx + bw / 2, by - 8, lx + bw / 2, ty + bh + 8, P.INK, 2)
C.box(S, cx - 112, ty + bh + 34, 224, 62, "repeat until nothing\njumps out", size=16, fill=P.PAPER, stroke=P.STONE,
      color=P.MID)
y = by + bh + 26
y = C.tip(S, x0, y, w, "Look at the thumbnail first. Where does your eye land? It should be the message.",
          bottom=ymax)
C.check_fit(y, ymax, "card 3")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out)
if os.environ.get("CARDS_EXPORT"):
    print("\n".join(C.export_commands(N, args.out)))
