"""Example — a dense, presentation-grade process map: a product lifecycle around the delivery scope a team owns.

Who looks at it: a steering committee, on a wall screen or a printed A3, for several minutes. The thumbnail must
still show the shape: an entry lane on top, the owned block with two tracks, one gate, loops underneath.
Message: two entrances (features shaped by the product owner, customer bugs investigated by an agent) and two tracks
(agent-ready tickets reach the merge without a human, the others go through a developer and a tester), all through
one evidence gate.
Composition: header (title + version chip, two message lines, TODAY / GOAL banners); cartouche and legends top
right; a dashed lifecycle frame holding an entry lane, a greyed upstream column, the owned block (dark header,
numbered columns, two track lanes, tall shared cards, the gate as the one loud element, a failure loop, tools per
step, a skills legend), a continuous-improvement loop under the block and an out-of-scope card; a bottom band of
three equal blocks (who does what, what disappears, open questions); a sources footer. Names and figures are made up.

    python example_process_map.py --out process_map.excalidraw [--style corporate|editorial|sketch|playful|night|mono]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # works under python -I too
from palettes import example
import excalikit
from excalikit import Palette as P, STATUS

args, S, pal = example("process_map.excalidraw", __doc__, default_style="corporate")
ts = S.text_size                                  # style-aware widths (each style has its own fonts)

# ================================================================ content
PROPOSED = "ABDEG"                                # skill letters drawn in the accent (proposed); the others exist
SKILLS = [("A", "splitting skill · to build", True), ("B", "evidence check · v0, in progress", True),
          ("C", "coding agent · exists", False), ("D", "bug investigation · to build", True),
          ("E", "agent check · to build", True), ("F", "AI review · exists", False),
          ("G", "improvement loop · to build", True), ("H", "code review · exists", False)]
KIND = {"skill": ("skill", P.PAPER, P.STONE, P.INK),         # tools under the steps, coloured by kind
        "harness": ("harness · tests · environment", P.TEAL_BG, P.STONE, P.TEAL),
        "data": ("data source", P.BLUE_BG, P.STONE, P.BLUE)}
TOOLS = {"split": [("data", "ticket tracker")],
         "plan": [("data", "team capacity")],
         "build": [("harness", "local test harness"), ("skill", "coding rules")],
         "gate": [("data", "acceptance criteria"), ("harness", "preview database")],
         "check": [("harness", "on-demand environment"), ("data", "written feedback")],
         "integrate": [("harness", "tests on every build"), ("skill", "gate required at merge")]}

# ================================================================ grid (every x and y below derives from these)
COLS = [("split", 240), ("plan", 240), ("build", 280), ("gate", 300), ("check", 280), ("integrate", 240),
        ("release", 200)]
HEADS = ["1 · SPLIT", "2 · PLAN", "3 · BUILD", "4 · GATE", "5 · CHECK", "6 · INTEGRATE", "7 · RELEASE"]
CGAP = 56                                         # between columns: room for one arrow
BP = 40                                           # inner padding of the owned block
UX, UW = 48, 280                                  # upstream column (and first card of the entry lane)
BX = UX + UW + 48                                 # owned block
X, CW = {}, {}
_x = BX + BP
for k, w in COLS:
    X[k], CW[k] = _x, w
    _x += w + CGAP
BW = _x - CGAP + BP - BX
BR = BX + BW
OOS_W = 220                                       # out-of-scope card, right of the block
W = BR + 40 + OOS_W + 24                          # frame width = drawing width
LX = W - 460                                      # cartouche and legends column

# ================================================================ header (left-aligned in every style: the cartouche
# holds the top right, and the version chip must follow the title)
T_SIZE, SUB_SIZE = excalikit.STYLE["title"], excalikit.STYLE["sub"]
title = "Delivery process · target"
tw, th = ts(title, T_SIZE)
S.text(0, 0, title, T_SIZE, P.INK)
S.chip(tw + 24, th / 2 - S.chip_height(15) / 2, "v3 · for discussion", P.ACCENT, P.ACCENT, P.WHITE, 15)
sub = ("Two entrances: features, shaped by the product owner; customer bugs, investigated and specified by an agent.\n"
       "Two tracks: agent-ready tickets reach the merge without a human; to-dev tickets go through a developer and a tester.")
SUB_Y = th + 11
S.text(0, SUB_Y, sub, SUB_SIZE, P.MID)
BAN_Y = SUB_Y + ts(sub, SUB_SIZE)[1] + 18
banners = [("TODAY:", "peer review on every change · regression tests run overnight on shared databases, read the next morning",
            P.RED, P.RED_BG),
           ("GOAL:", "+20 % tickets merged per month vs. control teams · 6-month baseline · tracked per track and per entrance",
            P.GREEN, P.GREEN_BG)]
BAN_W = max(excalikit.EDGE + 2 * 16 + ts(l, 16)[0] + 8 + ts(t, 16)[0] for l, t, _, _ in banners)
by = BAN_Y
for lab, txt, col, fill in banners:
    by += S.banner(0, by, lab, txt, col, fill, w=BAN_W)[3] + 8
if BAN_W > LX - 48:
    excalikit.warn("OVERFLOW: banners run into the legend column")

# cartouche, status chips and colour legend, top right
S.cartouche(LX, 0, "ENGINEERING  ×  PRODUCT", "Delivery process · target state of the product",
            "Proposal · working document · figures illustrative")
CHIP_H = S.chip_height(12)
S.text_mid(LX, 112 + CHIP_H / 2, "STATUS", 12, P.GREY)
_lx = LX + 64
for key in ("progress", "build", "unchanged"):
    lab, bg, bd, tx = STATUS[key]
    _lx += S.chip(_lx, 112, lab, bg, bd, tx, 12) + 8
S.legend(LX, 150, [("box", "proposed", P.ACCENT), ("box", "current process", P.INK)])
S.text(LX, 186, "track = swimlane · letters = skills, listed in the block", 13, P.GREY)
FRAME_Y = max(by, 186 + ts("X", 13)[1]) + 44

# ================================================================ vertical grid
ENTRY_Y = FRAME_Y + 72                            # entry lane (second entrance)
EC = 168                                          # entry card height
EH = 40 + EC + 32
BLOCK_Y = ENTRY_Y + EH + 64
LA = BLOCK_Y + 112                                # agent lane
LH, LGAP = 256, 24
LB = LA + LH + LGAP                               # team lane
CH = LH - 80                                      # lane card: 40 px of lane above (label) and below
TALL = 2 * LH + LGAP                              # shared card spanning both lanes
AY, DY = LA + 40 + CH / 2, LB + 40 + CH / 2       # the two track lines
MIDY = LA + TALL / 2                              # single line after the tracks merge
KO_Y = LB + LH + 24                               # failure loop, under the lanes
TOOLS_Y = KO_Y + 56                               # hairline above the tools strip
UH, UG = 88, 32                                   # upstream cards

# ================================================================ lifecycle frame
# measured first so the frame can be drawn under everything; the block height follows the strips inside it
TT = TOOLS_Y + 56                                 # first row of tool chips
TOOL_ROWS = max(len(v) for v in TOOLS.values())
SK_Y = TT + TOOL_ROWS * (S.chip_height(13) + 8) + 24
SK_H = 2 * 32 + 12                                # two rows of badges
BLOCK_H = SK_Y + SK_H + 32 - BLOCK_Y
BLOCK_B = BLOCK_Y + BLOCK_H
LOOP_Y = BLOCK_B + 40
FRAME_H = LOOP_Y + 8 + ts("X", 14)[1] + 32 - FRAME_Y
S.rect(0, FRAME_Y, W, FRAME_H, "transparent", P.STONE, 2, "dashed")
S.text(24, FRAME_Y + 16, "PRODUCT LIFECYCLE", 14, P.MID)
S.text(24, FRAME_Y + 40, "from the first need to customers running the product", 13, P.GREY)

# ================================================================ entry lane: customer bugs (proposed)
S.lane(24, ENTRY_Y, BR - 24, EH, "ENTRY · CUSTOMER BUGS — investigated by an agent", P.ACCENT_BG, P.ACCENT_SOFT,
       P.ACCENT)
ECY = ENTRY_Y + 40
entry = [(UX, UW, "Bug reported\nby a customer", "from the support desk", None, "bug ticket", "", P.LINE, P.INK),
         (X["split"], CW["split"], "Reproduced and\ninvestigated", "fresh environment,\nyesterday's data", "build",
          "repro + cause", "D", P.ACCENT_SOFT, P.ACCENT),
         (X["plan"], CW["plan"], "Fix spec\nwritten", "drafted by the agent,\nread by the PO", "build", "fix spec",
          "D", P.ACCENT_SOFT, P.ACCENT),
         (X["build"], CW["build"], "Agent-ready?", "yes: starts at once\nno: split with the PO", "build",
          "tagged tickets", "A", P.ACCENT, P.ACCENT)]
for i, (ex, ew, t, body, st, out, sk, stroke, tcol) in enumerate(entry):
    S.card(ex, ECY, ew, EC, t, None, body, status=st, out=out, skills=sk, proposed_skills=PROPOSED, stroke=stroke,
           tcolor=tcol)
    if i < len(entry) - 1:
        S.arrow(ex + ew + 8, ECY + EC / 2, entry[i + 1][0] - 8, ECY + EC / 2, P.ACCENT, 2)
S.text(X["gate"], ECY + 8, "The PO hears about every bug an agent handles;\nthe fix ships with the next release.", 16,
       P.INK)
S.text(X["gate"], ECY + 72, "TOOLS", 12, P.GREY)
_k = KIND["harness"]
S.chip(X["gate"], ECY + 94, "daily data snapshot", _k[1], _k[2], _k[3], 13)

# express path: an agent-ready bug starts at once, without waiting for the sprint
EXX = X["build"] + CW["build"] - 72
S.arrow(EXX, ECY + EC + 6, EXX, LA + 40 - 6, P.ACCENT, 2)
S.text(EXX - 12, ENTRY_Y + EH + 16, "starts without waiting for the sprint", 13, P.ACCENT, align="right")

# ================================================================ upstream column: the first entrance, unchanged
S.text(UX, LA - 32, "ENTRY · FEATURES · unchanged", 13, P.MID)
for i, (t, body) in enumerate([("Customer need", "customers · support · roadmap"), ("One-pager", "PM · PO · design"),
                               ("Spec = epic", "PM · PO · design")]):
    uy = LA + i * (UH + UG)
    S.card(UX, uy, UW, UH, t, None, body, fill=P.PAPER, stroke=P.LINE, tcolor=P.GREY, bcolor=P.GREY, tsize=17)
    if i < 2:
        S.arrow(UX + UW / 2, uy + UH + 6, UX + UW / 2, uy + UH + UG - 6, P.STONE, 2)
SPEC_Y = LA + 2 * (UH + UG) + UH / 2

# ================================================================ owned block
S.section_block(BX, BLOCK_Y, BW, BLOCK_H, "DELIVERY · the scope we own",
                scope="Done = merged on main · the release is shown for the end-to-end lead time")
for (k, _), h in zip(COLS, HEADS):
    S.text(X[k], BLOCK_Y + 76, h, 13, P.GREY)

L0, L1 = X["build"] - 36, X["check"] + CW["check"] + 36
S.lane(L0, LA, L1 - L0, LH, "AGENT TRACK · agent-ready", P.ACCENT_BG, P.ACCENT_SOFT, P.ACCENT)
S.lane(L0, LB, L1 - L0, LH, "TEAM TRACK · to-dev, domain expertise", P.LANE, P.LINE, P.MID)
if L0 + 16 + ts("AGENT TRACK · agent-ready", 13)[0] > EXX - 16:
    excalikit.warn("OVERFLOW: the express arrow crosses the agent lane label")

# 1 · split: the fork is drawn here, one chip per track
xs, ws = X["split"], CW["split"]
S.card(xs, LA, ws, TALL, "Split the\nspec", None, None, status="build", out="tickets + test scenarios", out_high=True,
       skills="A", proposed_skills=PROPOSED, stroke=P.STONE)
fa = xs + 16 + S.chip(xs + 16, AY - S.chip_height(13) / 2, "agent-ready", P.ACCENT, P.ACCENT, P.WHITE, 13)
fd = xs + 16 + S.chip(xs + 16, DY - S.chip_height(13) / 2, "to-dev", P.INK, P.INK, P.WHITE, 13)
S.text(xs + 16, AY + 28, "The PO, helped by an\nagent, sets the track\nof each ticket", 14, P.MID)

# 2 · plan
xp, wp = X["plan"], CW["plan"]
S.card(xp, LA, wp, TALL, "Sprint\nplanning", "PO · DEVS · TESTERS", None, status="build", out="sprint plan",
       stroke=P.STONE)
S.rect(xp + 16, AY - 30, wp - 32, 84, P.ACCENT_BG, P.ACCENT_SOFT, 1)
S.text(xp + 32, AY - 18, "Sprint approved:", 14, P.ACCENT)
S.text(xp + 32, AY + 4, "agent-ready tickets\nstart on their own", 14, P.INK)
S.text(xp + 16, DY - 16, "developers pick\ntheir own tickets", 13, P.GREY)

# 3 · build, 5 · check: one card per track
for k, y, t, body, st, out, sk, agent in [
        ("build", LA, "Agent builds", "isolated environment,\nfrom the ticket alone", "build", "merge request", "C", True),
        ("build", LB, "Developer builds", "domain expertise; tests\nrun before the request", "progress", "merge request",
         "", False),
        ("check", LA, "Agents check", "test scenarios replayed,\nno tester needed", "build", "approved or KO", "E", True),
        ("check", LB, "Tester checks", "one-click environment,\nwritten test procedure", "progress", "verified or KO",
         "B", False)]:
    ty = S.card(X[k], y + 40, CW[k], CH, t, None, body, status=st, out=out, skills=sk, proposed_skills=PROPOSED,
                stroke=P.ACCENT if agent else P.STONE, tcolor=P.ACCENT if agent else P.INK)
    if k == "check" and agent:
        S.text(X[k] + 16, ty + 8, "KO: back to the agent\n2nd KO: moves to to-dev", 13, P.RED)

# 4 · gate: the one loud element
xg, wg = X["gate"], CW["gate"]
S.rect(xg, LA, wg, TALL, P.WHITE, P.INK, 3)
S.chip(xg + 16, LA + 16, "GATE", P.INK, P.INK, P.WHITE, 12)
S.text(xg + 16, LA + 52, "Evidence check", 24, P.ACCENT)
S.text(xg + 16, LA + 90, "run by the agent or the dev,\nbefore any check", 14, P.MID)
gy = S.checklist(xg + 18, LA + 150, [("Coding rules, build", True), ("Proof per criterion", True),
                                     ("Test procedure written", True), ("AI review", True),
                                     ("AI review replaces the peer", False), ("Tests of the change", False),
                                     ("Test data set", False)], step=34, key=("live", "to build"))
G_ROW = LA + TALL - 16 - CHIP_H
S.status_chip(xg + wg - 16, G_ROW, "progress")
S.out_chip(xg + 16, G_ROW - CHIP_H - 8, "request, proofs, test data")
if gy > G_ROW - CHIP_H - 16:
    excalikit.warn("OVERFLOW in the gate card")
S.badges(xg + wg, LA, "BFH", PROPOSED)

# 6 · integrate, 7 · release
S.card(X["integrate"], LA, CW["integrate"], TALL, "Merge to main\n→ pre-release", None,
       "several builds a day;\ntests run on each build,\na red test blocks it\n\nowner: team QA\n\nthe gate is advisory\nfor a month, then\nrequired at merge",
       status="build", out="beta build", stroke=P.STONE)
S.card(X["release"], LA, CW["release"], TALL, "Monthly\nrelease", None, "fixed release train,\noutside our lever",
       status="unchanged", out="final build", out_high=True, fill=P.PAPER, stroke=P.LINE, tcolor=P.GREY,
       bcolor=P.GREY)

# out of scope, right of the block
OX, OY = BR + 40, MIDY - 60
S.text(OX, OY - 28, "OUT OF SCOPE", 12, P.GREY)
S.card(OX, OY, OOS_W, 120, "Deployment\nto customers", None, "outside this process", fill=P.PAPER, stroke=P.LINE,
       tcolor=P.GREY, bcolor=P.GREY, tsize=17)

# ---------------------------------------------------------------- flows: one line per track, one line after the merge
S.arrow(UX + UW + 8, SPEC_Y, xs - 8, SPEC_Y, P.INK, 2)                       # spec -> split
S.arrow(fa + 8, AY, xp - 8, AY, P.ACCENT, 2)
S.arrow(fd + 8, DY, xp - 8, DY, P.INK, 2)
for a, b in [("plan", "build"), ("build", "gate"), ("gate", "check"), ("check", "integrate")]:
    S.arrow(X[a] + CW[a] + 8, AY, X[b] - 8, AY, P.ACCENT, 2)
    S.arrow(X[a] + CW[a] + 8, DY, X[b] - 8, DY, P.INK, 2)
S.arrow(X["integrate"] + CW["integrate"] + 8, MIDY, X["release"] - 8, MIDY, P.INK, 2)
S.arrow(X["release"] + CW["release"] + 8, MIDY, OX - 8, MIDY, P.STONE, 2)

# failure loop: the tester's KO goes back to the developer, under the lanes
S.return_loop(X["check"] + CW["check"] / 2, LB + 40 + CH + 6, X["build"] + CW["build"] / 2, LB + 40 + CH + 6, KO_Y,
              "KO at the check: written feedback to the developer", P.RED)

# ---------------------------------------------------------------- tools per step (chips aligned on the columns)
S.divider(BX + 24, TOOLS_Y, BW - 48)
TY = TOOLS_Y + 20
S.text_mid(BX + 24, TY + CHIP_H / 2, "TOOLS PER STEP", 12, P.GREY)
_kx = BX + 24 + ts("TOOLS PER STEP", 12)[0] + 16
for lab, fill, stroke, col in KIND.values():
    _kx += S.chip(_kx, TY, lab, fill, stroke, col, 12) + 8
for k, items in TOOLS.items():
    S.chip_stack(X[k], TT, [(lab,) + KIND[kind][1:] for kind, lab in items], max_w=CW[k],
                 size=13)

# skills: one letter per skill, the same on every card
S.text(BX + 24, SK_Y + 2, "SKILLS · working names", 12, P.GREY)
S.text(BX + 24, SK_Y + 24, "accent: proposed", 12, P.ACCENT)
S.text(BX + 24, SK_Y + 46, "ink: existing", 12, P.INK)
S.badge_legend(X["plan"], SK_Y, SKILLS, per_row=4, col_w=(X["release"] + CW["release"] - X["plan"]) / 4)

# continuous improvement: under the block, back to the first column
S.return_loop(X["release"] + CW["release"] / 2, BLOCK_B + 4, xs + ws / 2, BLOCK_B + 8, LOOP_Y,
              "CONTINUOUS IMPROVEMENT (skill G) · every week, QA feedback, reopened tickets and gate verdicts tune "
              "the skills and the agent-ready rules", P.GREEN, size=14)

# ================================================================ bottom band: three equal blocks, same top, same height
BOT_Y = FRAME_Y + FRAME_H + 56
C3 = (W - 2 * 48) / 3
BH = 300
S.text(0, BOT_Y, "WHO DOES WHAT", 14, P.GREY)
who = [("PO", P.INK, "shapes features and picks the sprint; told about every bug an agent handles"),
       ("Agent", P.ACCENT, "investigates customer bugs, builds and checks agent-ready tickets up to the merge"),
       ("Developer", P.INK, "builds to-dev tickets, runs the tests locally, runs the gate before the check"),
       ("Tester", P.INK, "checks to-dev tickets on a one-click environment, with the written procedure")]
RH = (BH - 10 * (len(who) - 1)) / len(who)
for i, (name, col, what) in enumerate(who):
    S.rows(0, BOT_Y + 30 + i * (RH + 10), C3, RH, [(name, what)], bar=col, label_w=136)
GX = C3 + 48
S.text(GX, BOT_Y, "WHAT DISAPPEARS", 14, P.GREY)
S.rows(GX, BOT_Y + 30, C3, BH, ["Peer code review on every change", "Overnight tests on shared databases",
                                "Reading the overnight results the next morning", "Manual end-of-sprint check",
                                "Manual reproduction of eligible bugs"], bar=P.RED, fill=P.RED_BG, stroke="transparent")
S.questions_box(2 * GX, BOT_Y, C3, BH, "OPEN QUESTIONS",
                ["Agent-ready rules: who sets them, and how strict?",
                 "Which customer bugs are eligible for the agent track?",
                 "Masking production data before any agent reads it",
                 "Who builds and runs the on-demand environments?",
                 "Who writes the test scenarios at the split when QA is away?",
                 "Weekly improvement loop: owner, cadence, output"])

# ================================================================ footer
S.text(0, BOT_Y + 30 + BH + 40, "Sources: delivery workshop notes · 12 months of ticket history · all names, steps "
       "and figures in this example are illustrative.", 13, P.GREY)

S.canvas(pal["canvas"])
S.dump(args.out, background=pal["canvas"])
print(args.out, len(S.els), "elements, width", W)
