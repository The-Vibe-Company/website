"""signature — the art-directed layer on top of excalikit: a fixed frame, page plans, and composed blocks that are
beautiful by default (a claim title with a highlighter swipe, one hero, lines of stations, a numbered path, hand
margin notes, a zoom inset, twin panels, a takeaway, a whisper footer) plus alt text for every diagram.

    import sys; sys.path.insert(0, "<skill>/scripts"); sys.path.insert(0, "<skill>/assets")
    import signature as G
    S, F, pal = G.setup("slide")                       # house look ("signature" style) on a 1600 x 900 frame
    Z = G.plan(F, "hero-right")                        # zones: title, main, hero, notes, footer
    G.claim_title(S, F, "A new hire ships in week two", mark="week two", sub="...")
    G.hero(S, *Z["hero"], "Week 2", kicker="the goal", body="a first real change,\\nreviewed and shipped")
    ...
    G.margin_note(S, x, y, "the first small win, on day one", tx, ty)
    G.whisper(S, F, "Illustrative example")
    G.finish(S, F, "out.excalidraw", alt="...", long="...")   # writes the scene and out.alt.md

Every block reads the current style and palette (call setup() with another style to get the same composition in
corporate, night, mono...). Conventions read by lint_scene --taste: the page rectangle carries
customData {"decor": "page", "format", "margin"}; the hero box carries {"hero": true}; hand annotations (the voice)
carry {"voice": true}, so a hand note next to a sans body is not reported as a mixed font.
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "assets"))
import excalikit as K                                   # noqa: E402
from excalikit import Palette as P, ARROW_GAP          # noqa: E402

# ------------------------------------------------------------------------------------------------ formats
# (width, height, smallest text in px for the size the picture is usually shown at)
FORMATS = {
    "slide": (1600, 900, 16),      # 16:9 deck, blog header, doc figure
    "social": (1080, 1350, 30),    # 4:5 LinkedIn / Instagram: seen ~400 px wide on a phone, so text must be big
    "square": (1080, 1080, 28),    # 1:1 post, thumbnail
    "doc": (1240, 1600, 14),       # portrait page, Notion / Confluence / PDF
    "wide": (1600, 760, 18),       # README or banner: GitHub shows it ~830 px wide
}

# hero fill / stroke / text and highlighter colour per palette (the hero is the one big warm block)
HERO = {"signature": ("#ffe066", None, None), "warm": ("#ffe8a3", None, None), "playful": ("#ffe066", None, None),
        "whiteboard": ("#dbe4ff", None, None), "notebook": ("#dcf5ae", None, None),
        "clean": (None, None, None), "ink": (None, None, None), "night": (None, None, None),
        "mono": (None, None, None)}
MARK = {"signature": "#ffd43b", "warm": "#ffd43b", "playful": "#ffd43b", "whiteboard": "#ffe066",
        "notebook": "#c0eb75", "clean": "#d0bfff", "ink": "#b3c5f5", "night": "#0b7285", "mono": "#dcdcdc"}

# Colour moods of the signature style: (palette, hero fill or None for an ink block, highlighter). The grammar does
# not change, only the pair of colours. Pick one from the content (references/styles.md, "Signature moods"); with no
# signal, mood_for(claim) picks one so that two diagrams in a row do not wear the same colours.
MOODS = {
    "sun": ("signature", "#ffe066", "#ffd43b"),               # yellow hero, burnt-orange voice: the original
    "coral": ("signature-coral", "#ffc4b8", "#ff9f8f"),       # coral hero, navy voice: people, warm, human topics
    "mint": ("signature-mint", "#b8ecc8", "#8ce0a4"),         # mint hero, fir-green voice: growth, health, calm
    "sky": ("signature-sky", "#cfe6ff", "#9fd0ff"),           # sky hero, cobalt voice: tech, systems, data
    "lavender": ("signature-lavender", "#e4d7ff", "#cbb4ff"),  # lavender hero, violet voice: ideas, AI, product
    "red-pen": ("signature-red-pen", None, "#ffc9c9"),        # ink hero, red-pen voice: reviews, rules, corrections
}
for _name, (_pal, _hero, _mark) in MOODS.items():
    HERO.setdefault(_pal, (_hero, None, None))
    MARK.setdefault(_pal, _mark)

_state = {"palette": "signature", "frame": None, "mood": "sun"}


def mood_for(text):
    """A mood picked from a text (the claim): stable for the same diagram, different across diagrams. Use it when
    the content gives no colour signal, instead of always falling back on sun."""
    h = sum((i + 1) * ord(c) for i, c in enumerate(text or ""))
    names = list(MOODS)
    return names[h % len(names)]


class Frame:
    """A canvas of a known format: page size, outer margin (about 7.5 % of the short side), a 12-column grid,
    the thirds, and the smallest readable text for the format."""

    def __init__(self, fmt="slide"):
        self.fmt = fmt
        self.W, self.H, self.min_text = FORMATS[fmt]
        self.m = round(0.075 * min(self.W, self.H) / 4) * 4
        self.x0, self.y0, self.x1, self.y1 = self.m, self.m, self.W - self.m, self.H - self.m
        self.cw, self.ch = self.x1 - self.x0, self.y1 - self.y0

    def col(self, i, n=12):
        """x of grid line i (0..n) inside the margins."""
        return self.x0 + self.cw * i / n

    def third(self, i, j):
        """Rule-of-thirds point (i, j in 1..2)."""
        return self.W * i / 3, self.H * j / 3


def setup(fmt="slide", style="signature", palette=None, mood=None):
    """House look on a fixed frame. Returns (Scene, Frame, palette dict). Any style works; signature is the
    default. `mood` (signature only): sun, coral, mint, sky, lavender, red-pen; see MOODS and mood_for()."""
    import palettes
    import doodles
    if mood:
        if mood not in MOODS:
            raise ValueError(f"unknown mood {mood!r}; pick one of {', '.join(MOODS)}")
        if style != "signature":
            print(f"mood {mood!r} ignored: moods belong to the signature style, not {style}", file=sys.stderr)
        elif not palette:
            palette = MOODS[mood][0]
    S, pal = palettes.setup(style=style, palette=palette)
    _state["palette"] = pal["_style"]["palette"]
    _state["mood"] = mood if (mood and style == "signature") else None
    doodles.MARKER = MARK.get(_state["palette"])        # drawings highlight with the diagram's highlighter
    doodles.HIGHLIGHT = doodles.MARKER or doodles.HIGHLIGHT
    F = Frame(fmt)
    _state["frame"] = F
    if F.min_text >= 28:                                # phone formats: big body text stays in the body font
        K.STYLE["title_min"] = 44
    page = S.rect(0, 0, F.W, F.H, pal["canvas"], "transparent", 1, rounded=False)
    page["roughness"] = 0
    page["customData"] = {"decor": "page", "format": fmt, "margin": F.m, "min_text": F.min_text}
    pal["_frame"] = F
    return S, F, pal


def mark_colour():
    return MARK.get(_state["palette"], MARK["signature"])


def hero_colours():
    fill, stroke, txt = HERO.get(_state["palette"], (None, None, None))
    if fill is None:                                    # sober palettes: the hero is the loud block
        return P.LOUD, P.LOUD, P.LOUD_TXT, P.LOUD_SUB
    return fill, stroke or P.INK, txt or P.INK, P.MID


# ------------------------------------------------------------------------------------------------ page plans
def plan(F, name="hero-right", title_h=None):
    """Zones (x, y, w, h) for a page plan. Plans: hero-right, hero-left, hero-top, path, split, ring, zoom, stack.
    Every plan has 'title', 'footer' and the zones it is named for; 'notes' is where depth-3 details go."""
    th = title_h or (150 if F.H < 1000 else 220)
    top = F.y0 + th
    foot = 40
    bot = F.y1 - foot
    H = bot - top
    g = 48
    Z = {"title": (F.x0, F.y0, F.cw, th - 24), "footer": (F.x0, F.y1 - 24, F.cw, 24)}
    if name in ("hero-right", "hero-left"):
        hw = F.cw * 0.34
        main_w = F.cw - hw - 2 * g
        hx = F.x1 - hw if name == "hero-right" else F.x0
        mx = F.x0 if name == "hero-right" else F.x0 + hw + 2 * g
        Z.update(hero=(hx, top + H * 0.08, hw, H * 0.80), main=(mx, top, main_w, H * 0.78),
                 notes=(mx, top + H * 0.80, main_w, H * 0.20), gutter=(F.x0 + main_w if name == "hero-right"
                                                                    else F.x0 + hw, top, 2 * g, H))
    elif name == "hero-top":
        Z.update(hero=(F.x0, top, F.cw, H * 0.42), main=(F.x0, top + H * 0.42 + g, F.cw, H * 0.58 - g - 40),
                 notes=(F.x0, bot - 40, F.cw, 40))
    elif name == "path":
        Z.update(main=(F.x0, top + H * 0.06, F.cw, H * 0.62), notes=(F.x0, top + H * 0.72, F.cw, H * 0.28))
    elif name == "split":
        pw = (F.cw - g) / 2
        Z.update(left=(F.x0, top, pw, H * 0.80), right=(F.x0 + pw + g, top, pw, H * 0.80),
                 notes=(F.x0, top + H * 0.84, F.cw, H * 0.16))
    elif name == "ring":
        rw = min(F.cw * 0.62, H)
        Z.update(main=(F.x0, top, rw, H), notes=(F.x0 + rw + g, top + H * 0.15, F.cw - rw - g, H * 0.7))
    elif name == "zoom":
        mw = F.cw * 0.54
        Z.update(main=(F.x0, top, mw, H), inset=(F.x0 + mw + g * 1.5, top + H * 0.06, F.cw - mw - g * 1.5, H * 0.82),
                 notes=(F.x0, bot - 40, mw, 40))
    elif name == "stack":
        Z.update(hero=(F.x0, top, F.cw, H * 0.38), main=(F.x0, top + H * 0.38 + g, F.cw, H * 0.50),
                 notes=(F.x0, bot - H * 0.10, F.cw, H * 0.10))
    else:
        raise ValueError(f"unknown plan {name}")
    return Z


# ------------------------------------------------------------------------------------------------ text helpers
def _voice(e):
    e["customData"] = dict(e.get("customData") or {}, voice=True)
    return e


def hand(S, x, y, s, size, color=None, align="left", voice=True):
    """Hand-lettered text (Excalifont) at any size: the voice of a person explaining. Tagged as voice."""
    w, h = K.text_size(s, size, K.FONT_HAND)
    if align == "center":
        x -= w / 2
    elif align == "right":
        x -= w
    e = S.text(x, y, s, size, color or P.INK)
    e["fontFamily"], e["width"], e["height"] = K.FONT_HAND, w, h
    return _voice(e) if voice else e


def highlight(S, x, y, w, h, color=None, tilt=-0.012):
    """Marker swipe behind a text line: its lower 55 %, overshooting by 8 px, slightly tilted. Draw it BEFORE the
    text (later elements sit on top)."""
    e = S.rect(x - 8, y + h * 0.42, w + 16, h * 0.52, color or mark_colour(), "transparent", 1, radius=6)
    e["opacity"], e["angle"], e["roughness"] = 75, tilt, 0
    e["customData"] = {"decor": "highlight"}
    return e


def _font_of(S, size):
    return K.font_for(size, S.font)


def marked_text(S, x, y, s, size, mark=None, color=None, align="left"):
    """Text with the highlighter behind the words `mark` (a substring of any one line). Returns the text element."""
    font = _font_of(S, size)
    w, h = K.text_size(s, size, font)
    if align == "center":
        x -= w / 2
    if mark:
        for i, line in enumerate(s.split("\n")):
            if mark in line:
                pre = line[:line.index(mark)]
                pw = K.text_size(pre, size, font)[0] if pre else 0
                lh = size * K.LINE_HEIGHT
                highlight(S, x + pw, y + i * lh, K.text_size(mark, size, font)[0], K.text_size("X", size, font)[1])
                break
    return S.text(x, y, s, size, color or P.INK)


def claim_title(S, F, title, mark=None, sub=None, size=None, x=None, y=None, max_w=None):
    """The claim (a sentence that says something, not a topic), big, top-left, with the highlighter on `mark`.
    The size shrinks to fit the frame width. Returns the y under the block."""
    import excalikit
    size = size or excalikit.STYLE["title"]
    x = F.x0 if x is None else x
    y = F.y0 if y is None else y
    max_w = max_w or F.cw
    font = _font_of(S, size)
    while size > 30 and max(K.text_size(l, size, font)[0] for l in title.split("\n")) > max_w:
        size -= 2
        font = _font_of(S, size)
    marked_text(S, x, y, title, size, mark)
    yy = y + K.text_size(title, size, font)[1] + 10
    if sub:
        ss = max(20, F.min_text + 4)
        S.text(x + 2, yy, sub, ss, P.MID)
        yy += S.text_size(sub, ss)[1]
    S._header = {"els": [], "rule_y": None, "align": "left"}
    return yy


# ------------------------------------------------------------------------------------------------ blocks
def hero(S, x, y, w, h, word, kicker=None, body=None, fill=None, drawing=None, word_size=None, align="left"):
    """The one big block that carries the message: a kicker (hand, small), a word or number set huge, a short body.
    `drawing(S, x, y, w, h)` may draw an illustration in the free area (right or bottom part of the block).
    Tagged hero for lint. Make it 3-4 x the area of any other block. Returns (x, y, w, h)."""
    f, stroke, txt, sub = hero_colours()
    fill = fill or f
    box = S.rect(x, y, w, h, fill, stroke, 3, radius=24)
    box["customData"] = {"hero": True}
    pad = max(32, w * 0.07)
    cy = y + pad
    tx = x + pad if align == "left" else x + w / 2
    if kicker:
        k = hand(S, tx, cy, kicker, 24, sub, align=align)
        cy += k["height"] + 4
    font = _font_of(S, 100)
    ws = word_size or 112
    while ws > 36 and K.text_size(word, ws, _font_of(S, ws))[0] > w - 2 * pad:
        ws -= 4
    S.text(tx, cy, word, ws, txt, align=align)
    cy += K.text_size(word, ws, _font_of(S, ws))[1] + 6
    if body:
        S.text(tx, cy, body, 20, txt, align=align)
        cy += S.text_size(body, 20)[1]
    if drawing:
        import doodles
        doodles.ON_DARK = doodles._lum(fill) < 0.2      # free-standing strokes switch to a light line on an ink hero
        try:
            drawing(S, x, y, w, h)
        finally:
            doodles.ON_DARK = False
    return (x, y, w, h)


def station(S, x, y, w, h, title, sub=None, icon=None, color=None, fill=None, size=18):
    """A white stop: icon, title, grey sub. The border takes the line colour. Returns (x, y, w, h)."""
    S.rect(x, y, w, h, fill or P.WHITE, color or P.LINE, 2, radius=14)
    tx = x + 18
    if icon:
        isz = round(size * 1.45)
        S._icon(icon, tx + isz / 2, y + h / 2, isz, color or P.INK)
        tx += isz + 14
    if sub:
        th = S.text_size(title, size)[1]
        sh = S.text_size(sub, size - 2)[1]
        top = y + (h - th - sh - 2) / 2
        S.text(tx, top, title, size, P.INK)
        S.text(tx, top + th + 2, sub, size - 2, P.GREY)
        need = max(S.text_size(title, size)[0], S.text_size(sub, size - 2)[0]) + (tx - x) + 16
    else:
        S.text_mid(tx, y + h / 2, title, size, P.INK)
        need = S.text_size(title, size)[0] + (tx - x) + 16
    if need > w:
        K.warn(f"OVERFLOW in station '{title}': needs {need:.0f} px, has {w:.0f}")
    return (x, y, w, h)


def line_of_stops(S, x, cy, stops, w=256, h=80, gap=44, color=None, label=None, size=18):
    """A coloured line (5 px) running behind a row of stations: a family of supports, a track, a lane without a
    box. stops = [(title, sub, icon), ...]. label = hand text above the start, in the line colour.
    Returns (boxes, end_x)."""
    color = color or P.ACCENT
    n = len(stops)
    end = x + n * w + (n - 1) * gap
    S.line(x + 40, cy, [[0, 0], [end - x - 56, 0]], color, 5)
    if label:
        hand(S, x, cy - h / 2 - 42, label, 26, color)
    boxes = [station(S, x + i * (w + gap), cy - h / 2, w, h, t, sub, ic, color, size=size)
             for i, (t, sub, ic) in enumerate(stops)]
    return boxes, end


def bezier(S, pts, color=None, sw=3, head=True, n=24, style="solid"):
    """Smooth cubic through 4 absolute control points; arrowhead at the end unless head=False."""
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = pts
    path = []
    for i in range(n + 1):
        t = i / n
        a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3
        path.append((a * x0 + b * x1 + c * x2 + d * x3, a * y0 + b * y1 + c * y2 + d * y3))
    color = color or P.INK
    if head:
        e = S.arrow(x0, y0, x3, y3, color, sw, style, via=path[1:-1])
    else:
        e = S.line(x0, y0, [[px - x0, py - y0] for px, py in path], color, sw, style)
    e["roundness"] = {"type": 2}
    return e


def merge(S, x1, y1, x2, y2, color=None, sw=5, head=True):
    """S-shaped stream from (x1, y1) leaving horizontally to (x2, y2) arriving horizontally: lines converging into
    the hero, a track joining another."""
    k = (x2 - x1) * 0.5
    return bezier(S, [(x1, y1), (x1 + k, y1), (x2 - k, y2), (x2, y2)], color, sw, head)


def margin_note(S, x, y, text, tx, ty, color=None, size=22, bend=0.35, align="left"):
    """A person explaining in the margin: hand text in the accent, a curved arrow to one exact point (tx, ty).
    One or two per diagram, for the insight or the surprise, never for a label."""
    color = color or P.ACCENT
    t = hand(S, x, y, text, size, color, align=align)
    x, w, h = t["x"], t["width"], t["height"]
    if tx > x + w:
        sx, sy = x + w + 12, y + h / 2
    elif tx < x:
        sx, sy = x - 12, y + h / 2
    else:
        sx, sy = min(max(tx, x + 24), x + w - 24), (y - 10 if ty < y else y + h + 10)
    dx, dy = tx - sx, ty - sy
    mx, my = sx + dx / 2 - dy * bend * 0.5, sy + dy / 2 + dx * bend * 0.5
    c1 = (sx + (mx - sx) * 0.8, sy + (my - sy) * 0.8)
    c2 = (tx + (mx - tx) * 0.8, ty + (my - ty) * 0.8)
    bezier(S, [(sx, sy), c1, c2, (tx, ty)], color, 2, head=True)
    return t


def path_badge(S, cx, cy, n, d=36, fill=None, color=None, stroke=None):
    """Filled number disc for the reading path (accent by default), centred on (cx, cy): put it on a card's
    top-left corner so it straddles it, or on the arrow between two steps."""
    fill = fill or P.ACCENT
    e = S.ellipse(cx - d / 2, cy - d / 2, d, d, fill, stroke or fill, 2)
    e["roughness"] = 0
    import doodles
    S.text_mid(cx, cy, str(n), round(d * 0.52), color or doodles.readable_on(fill), align="center")
    return d


def step_card(S, x, y, w, h, n, title, body=None, icon=None, key=False, size=20):
    """A step of a numbered path: badge on the corner, icon, title, short body. key=True = the step that matters
    (accent border, tinted face); the hero of a path is usually bigger instead."""
    S.rect(x, y, w, h, P.ACCENT_BG if key else P.WHITE, P.ACCENT if key else P.INK, 3 if key else 2, radius=16)
    path_badge(S, x + 4, y + 4, n)
    cy = y + 30
    if icon:
        S._icon(icon, x + 28 + 14, cy + 14, 28, P.ACCENT if key else P.INK)
        cy += 44
    S.text(x + 28, cy, title, size, P.INK)
    cy += S.text_size(title, size)[1] + 6
    if body:
        S.text(x + 28, cy, body, size - 4, P.MID)
        cy += S.text_size(body, size - 4)[1]
    if cy - y + 20 > h:
        K.warn(f"OVERFLOW in step_card '{title}': needs {cy - y + 20:.0f} px of height, has {h:.0f}")
    return (x, y, w, h)


def zoom_inset(S, focus, inset, color=None, label=None, hero=False):
    """Micro / macro: a dashed ring around a detail (focus = (cx, cy, r)) and a framed inset showing it bigger
    (inset = (x, y, w, h)), joined by two thin lines. Draw the inset's content inside the returned inner box."""
    color = color or P.ACCENT
    cx, cy, r = focus
    x, y, w, h = inset
    ring = S.ellipse(cx - r, cy - r, 2 * r, 2 * r, "transparent", color, 2)
    ring["strokeStyle"] = "dashed"
    box = S.rect(x, y, w, h, P.WHITE, color, 3 if hero else 2, radius=20)
    if hero:                                            # the inset is the message: lint treats it as the hero
        box["customData"] = {"hero": True}
    for ex, ey in ((x, y + 24), (x, y + h - 24)) if x > cx else ((x + w, y + 24), (x + w, y + h - 24)):
        a = math.atan2(ey - cy, ex - cx)
        sx, sy = cx + r * math.cos(a), cy + r * math.sin(a)
        S.line(sx, sy, [[0, 0], [ex - sx, ey - sy]], color, 1, "dashed")
    if label:
        hand(S, x + 24, y + 16, label, 22, color)
        return (x + 24, y + 56, w - 48, h - 80)
    return (x + 24, y + 24, w - 48, h - 48)


def twins(x, y, w, h, n=2, gap=48):
    """Equal panels side by side for small multiples (before / after, three options): same size, same internal
    layout; only the thing that changes gets the accent."""
    pw = (w - (n - 1) * gap) / n
    return [(x + i * (pw + gap), y, pw, h) for i in range(n)]


def takeaway(S, x, y, text, mark=None, size=28, align="left"):
    """The sentence to remember, hand-lettered, with the highlighter on its key words. Bottom of the main zone."""
    font = K.FONT_HAND
    w, h = K.text_size(text, size, font)
    if align == "center":
        x -= w / 2
    if mark and mark in text:
        pre = text[:text.index(mark)]
        pw = K.text_size(pre, size, font)[0] if pre else 0
        highlight(S, x + pw, y, K.text_size(mark, size, font)[0], h)
    return hand(S, x, y, text, size, P.INK)


def sparks(S, cx, cy, r=24, n=3, color=None, start=-170, spread=80):
    """Three short strokes radiating from a corner of the hero: 'this is the good part'. Decor."""
    for i in range(n):
        a = math.radians(start + i * spread / (n - 1))
        x1, y1 = cx + math.cos(a) * r, cy + math.sin(a) * r
        x2, y2 = cx + math.cos(a) * (r + 22), cy + math.sin(a) * (r + 22)
        e = S.line(x1, y1, [[0, 0], [x2 - x1, y2 - y1]], color or P.INK, 3)
        e["customData"] = {"decor": "spark"}


def whisper(S, F, text):
    """Provenance or disclaimer: small, grey, bottom-right, out of the way (still readable)."""
    e = S.text(F.x1, F.y1 - 18, text, max(13, round(F.min_text * 0.85)), P.GREY, align="right")
    e["customData"] = {"whisper": True}
    return e


# ------------------------------------------------------------------------------------------------ delivery
def finish(S, F, out, alt=None, long=None):
    """Write the scene (page already painted) and, when alt is given, <out>.alt.md with the alt text (<= 125
    characters) and the long description (what leads to what, in reading order)."""
    S.dump(out, background=P.CANVAS if hasattr(P, "CANVAS") else "#ffffff")
    if alt:
        if len(alt) > 125:
            K.warn(f"alt text is {len(alt)} characters; keep it under 125 and put the rest in the long description")
        base = out[:-len(".excalidraw")] if out.endswith(".excalidraw") else out
        with open(base + ".alt.md", "w", encoding="utf-8") as f:
            f.write(f"**Alt text:** {alt}\n\n")
            if long:
                f.write("**Description:**\n\n" + long.strip() + "\n")
    return out
