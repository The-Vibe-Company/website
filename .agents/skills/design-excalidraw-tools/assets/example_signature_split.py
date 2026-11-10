"""Example (signature) — small multiples: the same release before and after the checks were automated.

Brief
  Claim     A release no longer waits on four people.               (highlighter on "four people")
  Hero      the payoff, "2 hours" (was 2 days), on the right third, beside the "now" panel, with a clock drawn in it
  Device    twin panels with the same five rows at identical positions; gone = dashed ghost, changed = accent
  Voice     one hand note on the vanished checklist: it did not disappear, it became code
  Format    slide 16:9 · plan split (twins on the left two thirds, hero on the right)
  Depths    3 s: title + hero · 30 s: compare the two panels row by row · 3 min: subs, the note
  Colour    mood mint: mint = the payoff; fir green = what changed; grey = unchanged context; dashed grey = gone

    python example_signature_split.py --out split.excalidraw [--style signature|corporate|night|mono|...]
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
import signature as G
import doodles
from excalikit import Palette as P

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("--out", default="signature_split.excalidraw")
ap.add_argument("--style", default="signature")
ap.add_argument("--mood", default="mint", help="signature colour mood (sun, coral, mint, sky, lavender, red-pen)")
args = ap.parse_args()

S, F, pal = G.setup("slide", style=args.style, mood=args.mood if args.style == "signature" else None)
Z = G.plan(F, "split")
G.claim_title(S, F, "A release no longer waits on four people", mark="four people",
              sub="The same release, row by row. Dashed rows are gone; highlighted rows changed.")

lx, top, _, _ = Z["left"]

# hero: the payoff -----------------------------------------------------------------------------------------------
HW = 440
hx = F.x1 - HW
RH, RG, HEAD = 64, 14, 64                              # row height, row gap, panel header
rows_y = top + 18 + HEAD
hy, hh = top + 18, HEAD + 5 * RH + 4 * RG


def clock(S, x, y, w, h):
    doodles.clock(S, x + w - 150, y + h - 150, 110, 110)


G.hero(S, hx, hy, HW, hh, "2 hours", kicker="from 2 days to", body="per release, with 2 people\ninstead of 4",
       drawing=clock)
G.sparks(S, hx + 10, hy + 10)

# the twin panels ------------------------------------------------------------------------------------------------
panels = G.twins(lx, hy, hx - 56 - lx, hh)
before = [("Developer", "writes the change", "code"),
          ("QA tester", "tests it by hand, a full day", "flask"),
          ("Ops engineer", "deploys it at night", "terminal"),
          ("Product owner", "signs off in a meeting", "user"),
          ("Manual checklist", "40 boxes ticked by hand", "list")]
now = [("Developer", "writes the change", "code", "same"),
       ("Automated checks", "run on every change, 20 min", "shield_check", "changed"),
       before[2] + ("gone",),
       ("Product owner", "approves in one click", "check", "changed"),
       before[4] + ("gone",)]


def row(x, y, w, title, sub, icon, kind):
    """One row of a panel. same = grey context, changed = accent, gone = dashed ghost."""
    if kind == "changed":
        return G.station(S, x, y, w, RH, title, sub, icon, P.ACCENT, P.ACCENT_BG, size=20)
    n = len(S.els)
    box = G.station(S, x, y, w, RH, title, sub, icon, P.STONE, size=20)
    if kind == "gone":
        for e in S.els[n:]:
            if e["type"] == "rectangle":
                e["strokeStyle"], e["backgroundColor"] = "dashed", "transparent"
            elif e["type"] == "text":
                e["strokeColor"] = P.GREY
            else:
                e["strokeColor"] = P.STONE
    return box


def header(x, y, word, sub, color):
    G.hand(S, x, y, word, 30, color)
    S.text(x + 2 + G.K.text_size(word, 30, G.K.FONT_HAND)[0] + 16, y + 10, sub, 18, color)


(bx, _, pw, _), (nx, _, _, _) = panels
header(bx, hy, "before", "4 people · 2 days", P.MID)
header(nx, hy, "now", "2 people · 2 hours", P.ACCENT)
for i, ((bt, bs, bi), (nt, ns, ni, kind)) in enumerate(zip(before, now)):
    y = rows_y + i * (RH + RG)
    row(bx, y, pw, bt, bs, bi, "same")
    last = row(nx, y, pw, nt, ns, ni, kind)

# the voice: the checklist did not vanish -------------------------------------------------------------------------
G.margin_note(S, last[0] + pw * 0.5 - 40, last[1] + RH + 44, "not gone: it runs as code now",
              last[0] + pw * 0.5, last[1] + RH + 8, align="right")

G.whisper(S, F, "Illustrative numbers · one team's release, simplified")
G.finish(S, F, args.out,
         alt="Before and after: a release went from 4 people and 2 days to 2 people and 2 hours.",
         long="""1. Result (right, largest): from 2 days to 2 hours per release, with 2 people instead of 4.
2. Panel "before" (4 people, 2 days): Developer writes the change; QA tester tests it by hand, a full day;
   Ops engineer deploys it at night; Product owner signs off in a meeting; Manual checklist, 40 boxes ticked by hand.
3. Panel "now" (2 people, 2 hours), same rows: Developer unchanged; Automated checks run on every change in 20
   minutes (replaces manual testing); Ops engineer gone; Product owner approves in one click; Manual checklist gone.
4. Note on the vanished checklist: not gone, it runs as code now.""")
print(args.out, len(S.els), "elements")
