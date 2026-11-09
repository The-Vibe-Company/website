"""Example — an agent system map: who does what, where the work queues up, where the human decides, what learns.

Message: lead agents fan the work out; one person reviews a single prioritised queue; their feedback teaches the
system, so the next drafts need fewer corrections.
Composition: an orchestrator on the left fans out (bracket) to role cards in one pastel each; a list card says what
the helpers do (icon bullets); a window mock-up stands for the queue; the person is the one loud card, followed by a
gate and the outcome; notes under the person say how they review; an idea bubble arcs over the row into the queue;
a feedback curve runs under the row into a capability box, and from it back to the roles.

    python example_agent_system.py --out agents.excalidraw [--style whiteboard|corporate|sketch|playful|night|mono]
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)  # works under python -I too
sys.path.insert(0, os.path.join(HERE, "..", "scripts"))
from palettes import example, tints
from excalikit import Palette as P, ARROW_GAP

args, S, pal = example("agent_system.excalidraw", __doc__, default_style="whiteboard")
MOOD = pal["_style"]["mood"]

S.header("How our agent team ships a change",
         "Lead agents fan the work out; one person reviews a single queue; their feedback teaches the system.")

# grid ---------------------------------------------------------------------------------------------------------------
OY = 150                                    # content top (header above)
ROW = OY + 150                              # top of the main row
LEAD_X, LEAD_W, LEAD_H, LEAD_STEP = 270, 236, 58, 78
LIST_X, LIST_W = 560, 236
QX, QW = 846, 320
PX, PW = 1222, 176                          # the person
GX, GW = 1446, 196                          # the gate
OX, OW = 1690, 160                          # the outcome
MID = ROW + 2 * LEAD_STEP - 10              # the row's middle line
CARD_H = 132

# orchestrator and the fan-out -------------------------------------------------------------------------------------------
S.icon_card(0, MID - 110, 214, 220, "Coordinator\nagent", "user", sub="oversees the\nlead agents", layout="stack",
            size=20)
leads = ["Product lead", "Engineering lead", "Design lead", "Support lead"]
fills = tints(len(leads), pal["_style"]["palette"], MOOD)
ly = [ROW + i * LEAD_STEP for i in range(len(leads))]
for (name, (fill, edge)), y in zip(zip(leads, fills), ly):
    S.icon_card(LEAD_X, y, LEAD_W, LEAD_H, name, "layers", fill=fill,
                stroke=edge if MOOD == "pastel" else P.INK, size=18)
more_y = ly[-1] + LEAD_STEP + 6
S.text(LEAD_X + 70, more_y - 14, "· · ·", 24, P.MID)
S.fan_out(214 + ARROW_GAP, MID, [(LEAD_X - ARROW_GAP, y + LEAD_H / 2) for y in ly], x_spine=242, more=more_y)

# helpers, queue -------------------------------------------------------------------------------------------------------
LIST_Y, LIST_H = ROW - 8, 4 * LEAD_STEP - 4
S.list_card(LIST_X, LIST_Y, LIST_W, LIST_H, "Helpers", [("code", "Write code"), ("flask", "Run the tests"),
            ("chat", "Chase reviews"), ("users", "Sync with\nthe team")], note="(per lead)", size=17)
for y in ly:
    S.arrow(LEAD_X + LEAD_W + ARROW_GAP, y + LEAD_H / 2, LIST_X - ARROW_GAP, y + LEAD_H / 2, P.INK, 2)
QY, QH = ROW - 18, 4 * LEAD_STEP + 16
S.window_card(QX, QY, QW, QH, "Prioritised queue", [(("image", "play"), P.RED_SOFT if MOOD == "mono" else "#ff8787"),
              (("image", "play"), "#ffd43b" if MOOD != "mono" else P.STONE),
              (("image", "play"), "#8ce99a" if MOOD != "mono" else P.LINE)])
S.arrow(LIST_X + LIST_W + ARROW_GAP, MID, QX - ARROW_GAP, MID, P.INK, 2)

# the human, the gate, the outcome ----------------------------------------------------------------------------------------
CY = MID - CARD_H / 2
S.icon_card(PX, CY, PW, CARD_H, "You", "user", sub="(the reviewer)", layout="stack", fill=P.LOUD, size=22, sw=3)
S.icon_card(GX, CY, GW, CARD_H, "Review &\nsecurity checks", "shield_check", layout="stack", size=18)
S.icon_card(OX, CY + 8, OW, CARD_H - 16, "Shipped\nchange", "check", layout="stack", fill=P.GREEN_BG,
            stroke=P.GREEN if MOOD != "mono" else P.INK, size=19)
for a, b in ((QX + QW, PX), (PX + PW, GX), (GX + GW, OX)):
    S.arrow(a + ARROW_GAP, MID, b - ARROW_GAP, MID, P.INK, 2)
NY = CY + CARD_H + 26
end = S.icon_list(PX + 4, NY, [("mic", "Reviews in batches\n(voice + shortcuts)"), ("check", "Decides, approves"),
                               ("check", "Gives feedback")], size=16)

# an idea arcs over the row into the queue ---------------------------------------------------------------------------------
BX, BY, BW, BH = 590, OY + 4, 300, 82
S.icon_card(BX, BY, BW, BH, "Suggests ideas you\nhadn't asked for", "bulb", fill=P.ACCENT_BG, stroke=P.ACCENT_SOFT,
            size=18, radius=36)
S.curve(LEAD_X + LEAD_W * 0.7, ly[0] - ARROW_GAP, BX - ARROW_GAP, BY + BH / 2, start="v", head=False)
S.curve(BX + BW + ARROW_GAP, BY + BH / 2, QX + QW * 0.55, QY - ARROW_GAP, start="h")

# feedback teaches the system ----------------------------------------------------------------------------------------------
FX, FY, FW, FH = 560, end + 64, 470, 196
S.feature_box(FX, FY, FW, FH, "Team memory", "brain", ["Learns your preferences", "Captures your judgment",
              "Better first drafts,\nfewer corrections"], fill=P.ACCENT_BG)
S.curve(PX + 70, end + 8, FX + FW + ARROW_GAP, FY + FH / 2, start="v")
S.curve(FX - ARROW_GAP, FY + FH / 2, LEAD_X + 96, more_y + 22, start="h")

S.text(OX + OW, FY + FH - 16, "Illustrative setup · roles and steps are examples", 13, P.GREY, align="right")

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements")
