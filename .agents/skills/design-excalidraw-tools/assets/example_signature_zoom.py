"""Example (signature) — micro / macro: a grey system map, one part circled and opened up in a big inset.

Brief
  Claim     Failed jobs never disappear: they wait in the dead-letter queue.   (highlighter on "never disappear")
  Hero      the inset (right, largest): inside the queue and its workers, retries then the dead-letter queue
  Device    zoom: the whole architecture small and grey on the left, a dashed ring on queue + workers, the inset
  Voice     one hand note under the inset, on the replay path out of the dead-letter queue
  Format    slide 16:9 · plan zoom
  Depths    3 s: title + inset · 30 s: retry, then dead-letter queue · 3 min: the map on the left, the note
  Colour    greys for the context, ink for the zoom; accent = the failure path (3rd failure, replay); red dots = failed jobs

    python example_signature_zoom.py --out zoom.excalidraw [--style signature|corporate|night|mono|...]
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
import signature as G
from excalikit import Palette as P

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("--out", default="signature_zoom.excalidraw")
ap.add_argument("--style", default="signature")
args = ap.parse_args()

S, F, pal = G.setup("slide", style=args.style)
under = G.claim_title(S, F, "Failed jobs never disappear:\nthey wait in the dead-letter queue", mark="never disappear")
Z = G.plan(F, "zoom", title_h=under - F.y0 + 30)       # the zones start under the claim, whatever its style size
g = G.ARROW_GAP


# the whole system, small and grey ----------------------------------------------------------------------------------
mx, my, mw, mh = Z["main"]
NW, NH, COL = 160, 60, 255
cols = [mx, mx + COL, mx + 2 * COL]
mid = Z["inset"][1] + Z["inset"][3] / 2                # the map's main flow on the inset's middle line
rows = [mid - 132, mid, mid + 132]                      # centres: cache above, the main flow, the back end
grey = dict(fill=P.WHITE, stroke=P.LINE, color=P.MID, size=16)


def node(c, r, label, icon):
    return S.icon_card(cols[c], rows[r] - NH / 2, NW, NH, label, icon, **grey)


web, api, cache = node(0, 1, "Web app", "globe"), node(1, 1, "API", "code"), node(1, 0, "Cache", "bolt")
queue, workers, db = node(2, 1, "Queue", "inbox"), node(2, 2, "Workers", "gear"), node(1, 2, "Database", "database")
for a, b in ((web, api), (api, queue), (queue, workers), (workers, db)):
    S.connect(a, b, color=P.STONE, sw=2)
S.connect(api, cache, color=P.STONE, sw=2, style="dashed")

# the zoom: ring on queue + workers, inset on the right (the hero) ----------------------------------------------------
focus = (cols[2] + NW / 2, (rows[1] + rows[2]) / 2, 140)
ix0, iy0, iw0, ih0 = Z["inset"]
ix, iy, iw, ih = G.zoom_inset(S, focus, Z["inset"], color=P.INK, label="inside the queue and its workers",
                              hero=True)

# inside: queue -> worker -> saved; fails are retried; the 3rd failure goes to the dead-letter queue
big = dict(size=18, stroke=P.INK, color=P.INK)
row_y, row_h = iy + 8, 68
q = S.icon_card(ix, row_y, 150, row_h, "Queue", "inbox", **big)
w = S.icon_card(ix + 210, row_y, 170, row_h, "Worker", "gear", **big)
ok = S.icon_card(ix + iw - 120, row_y, 120, row_h, "Saved", "database", fill=P.WHITE, stroke=P.LINE, color=P.MID,
                 size=16)
S.connect(q, w, color=P.INK, sw=2)
S.connect(w, ok, "done", color=P.GREY, sw=2, size=16)

loop_y = row_y + row_h + 44
S.return_loop(w[0] + 40, row_y + row_h + g, q[0] + q[2] - 34, row_y + row_h + g, loop_y,
              "fails? retried, up to 3 times", color=P.MID, sw=2, size=16)

dlq_h = 186
dlq = S.window_card(ix + 150, iy + ih - dlq_h, iw - 150, dlq_h, "Dead-letter queue", [(("warning",), P.RED),
                    (("warning",), P.RED)], title_icon="inbox", fill=P.ACCENT_BG, stroke=P.ACCENT, size=18)
fx = w[0] + w[2] - 28
S.labelled_arrow(fx, row_y + row_h + g, fx, dlq[1] - g, "3rd failure", P.ACCENT, 3, 16)
replay_y = dlq[1] + dlq_h * 0.62
replay_x = q[0] + 34
S.arrow(dlq[0] - g, replay_y, replay_x, row_y + row_h + g, P.ACCENT, 2, "dashed", via=[(replay_x, replay_y)])

# the voice ---------------------------------------------------------------------------------------------------------
G.margin_note(S, ix0 + 20, iy0 + ih0 + 18, "fix the bug, then replay them", replay_x + 56, replay_y + 8,
              bend=-0.3)

G.whisper(S, F, "Illustrative architecture")
G.finish(S, F, args.out,
         alt="Diagram: a web app's job queue, zoomed in: failed jobs are retried 3 times, then kept in a dead-letter "
             "queue.",
         long="""1. Left, small and grey: the whole system. Web app to API to Queue to Workers to Database; the API
   also reads a Cache.
2. A dashed ring circles the Queue and the Workers; the inset on the right (largest) shows inside them.
3. Inside: Queue to Worker; when the job is done it is saved. When it fails, it goes back in line, up to 3 times.
4. On the 3rd failure the job moves to the dead-letter queue, where failed jobs wait; a dashed path replays them
   into the queue.
5. Note under the inset, on the replay path: fix the bug, then replay them.""")
print(args.out, len(S.els), "elements")
