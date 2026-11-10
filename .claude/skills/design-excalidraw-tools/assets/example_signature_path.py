"""Example (signature) — a numbered path: how an AI assistant answers from company documents (retrieval).

Brief
  Claim     It reads your documents before it answers.             (highlighter on "before")
  Hero      step 5, the answer with its sources, on the right third, with a reply card drawn in it
  Device    a numbered path of five steps left to right; a bracket over steps 2-4 shows what "before" covers
  Voice     one hand note on step 3, the step that decides the quality
  Format    slide 16:9 · plan path
  Depths    3 s: title + hero · 30 s: the five numbered steps · 3 min: step bodies, the note, the takeaway
  Colour    mood lavender: lavender = the payoff; accent = the reading order (badges) and the voice; everything else grey

    python example_signature_path.py --out path.excalidraw [--style signature|corporate|night|mono|...]
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
import signature as G
import doodles
from excalikit import Palette as P, ARROW_GAP

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("--out", default="signature_path.excalidraw")
ap.add_argument("--style", default="signature")
ap.add_argument("--mood", default="lavender", help="signature colour mood (sun, coral, mint, sky, lavender, red-pen)")
args = ap.parse_args()

S, F, pal = G.setup("slide", style=args.style, mood=args.mood if args.style == "signature" else None)
doodles.set_mood("mono" if args.style == "mono" else "colour")
Z = G.plan(F, "path")
G.claim_title(S, F, "It reads your documents before it answers", mark="before",
              sub="Five steps between your question and its answer; three of them happen before the AI writes a word.")

mx, my, mw, mh = Z["main"]

# hero: step 5, the answer --------------------------------------------------------------------------------------
HW, HH = 460, 440
hx, hy = F.x1 - HW, my - 16


def reply(S, x, y, w, h, tags=("Leave policy, p. 4", "HR FAQ")):
    """A reply card bottom-right of the hero: three text lines and the source tags, set at 16 px so the sources
    stay readable on a slide (doodles.answer draws its tags at 13 px, a pictogram size)."""
    cw, ch = 300, 108
    cx, cy = x + w - cw - 36, y + h - ch - 52
    S.line(cx + cw - 70, cy + ch - 2, [[0, 0], [22, 24], [28, 0], [0, 0]], P.INK, 2).update(
        backgroundColor=P.WHITE, fillStyle="solid")
    S.rect(cx, cy, cw, ch, P.WHITE, P.INK, 2, radius=14)
    for i, lw in enumerate((0.86, 0.72, 0.52)):
        S.line(cx + 18, cy + 20 + i * 13, [[0, 0], [(cw - 36) * lw, 0]], P.STONE, 2)
    tx = cx + 16
    for t in tags:
        tx += S.chip(tx, cy + ch - 16 - S.chip_height(16), t, getattr(P, "GREEN_SOFT", P.PAPER), P.INK, P.INK,
                     16) + 8


G.hero(S, hx, hy, HW, HH, "Answer", kicker="at last, the", body="with its sources,\nso you can check it",
       drawing=reply)
if G.hero_colours()[0] == P.ACCENT:                    # mono: an accent disc would vanish on the hero corner
    G.path_badge(S, hx + 6, hy + 6, 5, fill=P.WHITE, color=P.INK)
    S.els[-2]["strokeColor"] = P.INK
else:
    G.path_badge(S, hx + 6, hy + 6, 5)
G.sparks(S, hx + HW - 10, hy + 10, start=-100, spread=80)

# steps 1-4 -----------------------------------------------------------------------------------------------------
CW, CH = 196, 180
gap = (hx - mx - 4 * CW) / 4
cy = hy + HH / 2 - CH / 2
steps = [("You ask", "“Can I carry over\nunused leave?”", "chat"),
         ("It searches", "the company\ndocuments", "search"),
         ("It picks", "the most helpful\npassages", "filter"),
         ("The AI reads", "those passages\nwith your question", "robot")]
cards = []
for i, (title, body, icon) in enumerate(steps):
    x = mx + i * (CW + gap)
    cards.append(G.step_card(S, x, cy, CW, CH, i + 1, title, body, icon))
    nx = x + CW + gap                                   # next card, or the hero
    S.arrow(x + CW + ARROW_GAP, cy + CH / 2, nx - ARROW_GAP, cy + CH / 2, P.STONE, 2)

# what "before" covers: a quiet bracket over steps 2-4 ---------------------------------------------------------
bx0, bx1 = cards[1][0] + 8, cards[3][0] + CW - 8
by = cy - 44
S.line(bx0, by + 14, [[0, 0], [0, -14], [bx1 - bx0, -14], [bx1 - bx0, 0]], P.STONE, 2)
G.hand(S, (bx0 + bx1) / 2, by - 50, "before it writes a word", 24, P.MID, align="center")

# the voice: one note on step 3 ---------------------------------------------------------------------------------
c3 = cards[2]
G.margin_note(S, c3[0] + CW * 0.5 - 40, cy + CH + 62, "a handful of passages, not the whole drive",
              c3[0] + CW * 0.5, cy + CH + 8, align="right")

# takeaway -------------------------------------------------------------------------------------------------------
nx_, ny_, nw_, nh_ = Z["notes"]
G.takeaway(S, mx, ny_ + nh_ - 70, "The answer is only as good as the passages it finds.", mark="passages it finds")

G.whisper(S, F, "Illustrative example · the question, answer and sources are made up")
G.finish(S, F, args.out,
         alt="Diagram: an AI assistant answers in five steps and reads your documents before it answers.",
         long="""1. You ask a question in plain words (example: "Can I carry over unused leave?").
2. It searches the company documents.
3. It picks the most helpful passages. Note: a handful of passages, not the whole drive.
4. The AI reads those passages with your question.
5. Result (right, largest): an answer with its sources (example tags: Leave policy p. 4, HR FAQ), so you can
   check it.
A bracket over steps 2 to 4 reads "before it writes a word".
Takeaway: the answer is only as good as the passages it finds.""")
print(args.out, len(S.els), "elements")
