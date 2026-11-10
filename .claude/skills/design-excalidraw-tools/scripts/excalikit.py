"""excalikit — build clean Excalidraw scenes from Python.

Primitives: text, rect, ellipse, line, arrow, chip.
Generic components: node, group, connect, labelled_arrow, stat, edge_rect, timeline.
Small marks: step (numbered marker), dot (status dot + label), divider, callout (annotation with a leader line).
System maps: icon_card, list_card, window_card, feature_box, icon_list, fan_out, curve (icons from icons.py).
Layouts beyond a row: ring() and grid() positions, cycle() and arc_arrow() around a circle, matrix() 2 x 2.
Flow and document components: card, out_chip, status_chip, badges, cartouche, legend, section_block, lane, hero_bar,
rows, questions_box.
Dense process maps: banner (TODAY / GOAL band), checklist (filled = live, hollow = to build), badge_legend (lettered
badges with names), chip_stack (tools under a step), return_loop (dashed path back to an earlier step, label beneath).
Page: canvas() paints a full-bleed page colour behind everything (Excalidraw+ ignores viewBackgroundColor).
Theme: set_palette() recolours Palette and STATUS; every method reads the palette when it is called.

Usage (inside a generator script):

    import sys; sys.path.insert(0, "<skill>/scripts")
    from excalikit import Scene, Palette as P, text_size
    S = Scene()
    S.card(40, 200, 260, 180, "Triage", "PRODUCT OWNER", "sorts incoming requests", status="unchanged", out="ranked backlog")
    S.dump("diagram.excalidraw")

Only the Python standard library is used.

Geometry notes (why the components are layered the way they are):
- Rounded rectangles get an explicit corner radius (RADIUS). Excalidraw draws r = min(value, 0.25 * min(w, h)), so a
  radius can be lowered but never pushed past a quarter of the shortest side. corner_radius() returns the real value.
- Excalidraw has no clipping. A coloured edge or a header band that must follow rounded corners is built by layering
  shapes that share the same radius (see edge_rect, section_block, group), never by laying a square patch on a corner.
- Text widths come from per-glyph advance tables measured with Excalidraw's own text measurement (Nunito and
  Excalifont). Renderers draw the stored width as is (Excalidraw+ and the local renderer do not re-measure), so these
  estimates are what centres text, sizes chips and places badges: keep the tables accurate.
"""
import json
import random
import sys
import unicodedata

FONT_CLEAN = 6          # Nunito
FONT_HAND = 5           # Excalifont (hand-drawn variant)
LINE_HEIGHT = 1.25      # Excalidraw text box height = lines * size * LINE_HEIGHT

# spacing and shape tokens: use them instead of magic numbers so every component breathes the same way
PAD = 16                # inner padding of cards, tiles and rows (text and chips sit on this inset)
GAP = 8                 # gap between stacked items inside a component (lines, chip rows)
ARROW_GAP = 6           # gap between an arrow tip (or tail) and the border of the box it touches
LABEL_GAP = 8           # gap between a label and the line it annotates
RADIUS = 12             # corner radius of rounded rectangles; None = Excalidraw's adaptive default (up to 32)
CHIP_PX, CHIP_PY = 11, 4  # chip padding around its text
EDGE = 8                # width of the coloured left edge of stat tiles and rows
CANVAS_MARGIN = 64      # margin of the painted page around the drawing (canvas())


class Palette:
    INK, MID, GREY, LINE, PAPER, STONE, WHITE = "#212529", "#495057", "#868e96", "#dee2e6", "#f8f9fa", "#adb5bd", "#ffffff"
    ACCENT, ACCENT_BG, ACCENT_SOFT = "#5f3dc4", "#f3f0ff", "#d0bfff"        # what you propose
    TEAL, TEAL_BG, TEAL_SOFT = "#0c8599", "#e3fafc", "#99e9f2"
    BLUE, BLUE_BG, BLUE_SOFT = "#1971c2", "#e7f5ff", "#a5d8ff"
    GREEN, GREEN_BG, GREEN_SOFT = "#2b8a3e", "#ebfbee", "#b2f2bb"            # targets, improvement loops
    ORANGE, ORANGE_BG, ORANGE_SOFT = "#e8590c", "#fff4e6", "#ffd8a8"         # waiting time, in progress
    RED, RED_BG, RED_SOFT = "#e03131", "#fff5f5", "#ffc9c9"                  # problems, KO paths, what disappears
    YELLOW, YELLOW_BG, YELLOW_TXT = "#fab005", "#fff9db", "#8a6d00"          # open questions
    LANE = "#f1f3f5"
    ON_DARK = "#ced4da"                                                      # secondary text on INK
    CANVAS = "#ffffff"                                                       # page colour (dump, canvas)
    LOUD, LOUD_TXT, LOUD_SUB = "#212529", "#ffffff", "#ced4da"              # the one strong block, its text
    BADGE, BADGE_TXT = "#212529", "#ffffff"                                  # number discs


P = Palette


def _c(value, attr):
    """Colour argument resolved at call time: None means the current Palette value."""
    return getattr(Palette, attr) if value is None else value


# Legacy average glyph widths (kept for scripts that import it; text_size now uses the per-glyph tables below).
CHAR_W = {11: 6.2, 12: 6.7, 13: 7.2, 13.5: 7.5, 14: 7.8, 15: 8.4, 16: 8.9, 17: 9.5, 18: 10.0, 19: 10.6, 20: 11.2,
          21: 11.8, 22: 12.3, 24: 13.4, 28: 15.6, 30: 16.8, 34: 19.0, 36: 20.0, 38: 21.2}
# Extra safety factor on estimated widths. The glyph tables cover both fonts, so hand_drawn() resets it to 1.0;
# raise it only to keep extra slack in overflow checks.
WIDEN = 1.0

# Advance widths in thousandths of an em, measured through Excalidraw's own text measurement.
_GLYPH_CHARS = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
                "→←↑↓·×éèàçêâîôûù’‘“”–—…€°✓✗•")
_NUNITO_EM = (
    261, 233, 405, 600, 600, 933, 701, 226, 326, 326, 451, 600, 233, 427, 233, 290, 600, 600, 600, 600, 600, 600,
    600, 600, 600, 600, 233, 233, 600, 600, 600, 447, 947, 733, 679, 675, 747, 586, 551, 729, 764, 262, 331, 634,
    548, 858, 741, 771, 637, 771, 673, 618, 607, 731, 694, 1104, 655, 601, 593, 324, 290, 324, 600, 500, 361, 533,
    587, 465, 587, 534, 340, 590, 572, 237, 241, 508, 301, 861, 572, 560, 587, 587, 365, 483, 358, 565, 518, 844,
    530, 517, 466, 361, 270, 361, 600, 1000, 1000, 500, 500, 233, 600, 534, 534, 533, 465, 534, 533, 237, 560, 565,
    565, 233, 233, 405, 405, 500, 1000, 700, 600, 373, 600, 600, 524)
_EXCALIFONT_EM = (
    400, 314, 371, 783, 721, 928, 718, 218, 441, 402, 525, 550, 257, 411, 274, 561, 664, 427, 700, 608, 585, 618,
    640, 558, 636, 629, 264, 298, 550, 550, 550, 466, 829, 676, 761, 629, 780, 707, 661, 780, 573, 545, 569, 613,
    543, 766, 632, 767, 698, 768, 736, 622, 857, 730, 592, 786, 628, 564, 832, 472, 589, 497, 510, 670, 600, 576,
    555, 504, 605, 537, 497, 555, 567, 244, 328, 533, 225, 663, 526, 600, 537, 539, 412, 543, 553, 548, 525, 693,
    591, 530, 572, 504, 299, 544, 669, 1000, 1000, 500, 500, 200, 550, 551, 551, 542, 504, 551, 542, 244, 561, 508,
    508, 304, 267, 412, 428, 702, 935, 709, 713, 412, 600, 600, 522)
_LIBERATION_EM = (
    278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556,
    556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667,
    556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556,
    556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722,
    500, 500, 500, 334, 260, 334, 584, 1000, 1000, 500, 500, 278, 584, 556, 556, 556, 500, 556, 556, 278, 556, 556,
    556, 222, 222, 333, 333, 556, 1000, 1000, 556, 400, 764, 571, 350)
_CASCADIA_EM = (
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586,
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586,
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586,
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586,
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586,
    586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 602, 586)
_LILITA_EM = (
    188, 287, 460, 833, 531, 798, 667, 301, 430, 422, 557, 602, 305, 525, 229, 573, 639, 406, 525, 528, 598, 524,
    575, 500, 570, 565, 277, 277, 484, 580, 450, 584, 867, 655, 594, 561, 616, 493, 472, 621, 644, 429, 462, 620,
    435, 907, 648, 696, 570, 706, 590, 531, 502, 628, 661, 953, 683, 615, 563, 385, 587, 385, 687, 636, 350, 517,
    520, 424, 565, 486, 375, 516, 501, 273, 271, 531, 272, 788, 551, 513, 555, 511, 396, 450, 368, 544, 521, 752,
    557, 537, 454, 362, 628, 362, 459, 1000, 1000, 645, 645, 309, 610, 486, 486, 517, 424, 486, 517, 267, 513, 544,
    544, 314, 341, 564, 530, 469, 789, 909, 574, 386, 764, 571, 357)
FONT_SANS, FONT_CODE, FONT_DISPLAY = 9, 3, 7   # Liberation Sans, Cascadia (monospace), Lilita One (display)
GLYPH_EM = {FONT_CLEAN: dict(zip(_GLYPH_CHARS, _NUNITO_EM)), FONT_HAND: dict(zip(_GLYPH_CHARS, _EXCALIFONT_EM)),
            FONT_SANS: dict(zip(_GLYPH_CHARS, _LIBERATION_EM)), FONT_CODE: dict(zip(_GLYPH_CHARS, _CASCADIA_EM)),
            FONT_DISPLAY: dict(zip(_GLYPH_CHARS, _LILITA_EM))}
# Arrows and ticks missing from Nunito / Excalifont are drawn with the system fallback (macOS widths measured).
for _t in (GLYPH_EM[FONT_CLEAN], GLYPH_EM[FONT_HAND]):
    _t.update({"↑": 645, "↓": 645, "✓": 764, "✗": 571})
# vertical metrics (ascender, descender) in em, used to centre glyphs optically in their line box
FONT_METRICS = {FONT_CLEAN: (1.011, -0.353), FONT_HAND: (0.886, -0.374), FONT_SANS: (0.9053, -0.2119),
                FONT_CODE: (0.9277, -0.2344), FONT_DISPLAY: (0.923, -0.22)}
_current_font = [FONT_CLEAN]

# Style grammar (set by palettes.setup(style=...) through set_style). None = leave the scene's own choice.
STYLE = {"font": None, "title_font": None, "label_font": None, "title": 36, "sub": 20, "align": "left",
         "rule": False, "sw": None, "sw_key": None, "outline": None, "zone_fill": "solid", "curved": False,
         "shadow": False, "tints": None, "title_min": 28}


def set_style(spec):
    """Apply a style grammar (a dict like palettes.STYLES[name]); unknown keys are ignored."""
    for k in STYLE:
        if k in spec:
            STYLE[k] = spec[k]
    return STYLE


def font_for(size, default=None):
    """Font id a text of this size gets under the current style: titles (>= 28) take title_font, small labels
    (<= 12) take label_font, the rest the body font."""
    body = STYLE["font"] or default or _current_font[0]
    if size >= STYLE.get("title_min", 28) and STYLE["title_font"]:
        return STYLE["title_font"]
    if size <= 12 and STYLE["label_font"]:
        return STYLE["label_font"]
    return body

_STATUS_ROLES = {"done": ("GREEN_BG", "GREEN_SOFT", "GREEN"), "progress": ("ORANGE_BG", "ORANGE_SOFT", "ORANGE"),
                 "build": ("WHITE", "STONE", "INK"), "unchanged": ("PAPER", "LINE", "GREY")}
STATUS = {               # key: (label, fill, stroke, text) — neutral so the accent keeps one meaning
    "done": ("delivered", Palette.GREEN_BG, Palette.GREEN_SOFT, Palette.GREEN),
    "progress": ("in progress", Palette.ORANGE_BG, Palette.ORANGE_SOFT, Palette.ORANGE),
    "build": ("to build", Palette.WHITE, Palette.STONE, Palette.INK),
    "unchanged": ("unchanged", Palette.PAPER, Palette.LINE, Palette.GREY),
}

# semantic role names accepted by set_palette(), mapped onto the Palette attributes they drive
_ROLE_ATTR = {"bad": "RED", "good": "GREEN", "wait": "ORANGE", "open": "YELLOW", "cat1": "BLUE", "cat2": "TEAL"}


def set_palette(colours):
    """Recolour the kit in place. `colours` maps Palette attribute names (INK, ACCENT_BG, ...; any case) or role
    names (bad, good_bg, wait_soft, open_txt, cat1, cat2_bg, canvas, on_dark, ...) to colours. Unknown keys are
    ignored. STATUS colours follow. Methods read Palette when called, so call this before building the scene.
    Returns the list of attributes changed."""
    changed = []
    for key, val in colours.items():
        k = key.lower()
        base, _, suffix = k.partition("_")
        if base in _ROLE_ATTR:
            attr = _ROLE_ATTR[base] + ("_" + suffix.upper() if suffix else "")
        else:
            attr = k.upper()
        if hasattr(Palette, attr) and attr.isupper():
            setattr(Palette, attr, val)
            changed.append(attr)
    for k, roles in _STATUS_ROLES.items():
        if k in STATUS:
            STATUS[k] = (STATUS[k][0],) + tuple(getattr(Palette, r) for r in roles)
    return changed


def _glyph_em(c, table):
    if c in table:
        return table[c] / 1000
    if unicodedata.combining(c):
        return 0.0
    if unicodedata.east_asian_width(c) in ("W", "F"):
        return 1.0
    return 0.56


def text_size(text, size, font=None):
    """(width, height) of a text element as Excalidraw measures it. font defaults to the font of the scene being
    built (Nunito, or Excalifont after hand_drawn())."""
    table = GLYPH_EM.get(font or _current_font[0], GLYPH_EM[FONT_CLEAN])
    lines = text.split("\n")
    w = max(sum(_glyph_em(c, table) for c in l) for l in lines) * size * WIDEN
    return w, len(lines) * size * LINE_HEIGHT


def corner_radius(w, h, radius=None):
    """Corner radius Excalidraw actually draws for a rounded rectangle of this size (radius None = RADIUS)."""
    v = RADIUS if radius is None else radius
    m = min(w, h)
    if v is None:
        v = 32
    return m * 0.25 if m <= v * 4 else v


def ring(cx, cy, r, n, w=0, h=0, start=-90):
    """Top-left corners of n boxes (w x h) centred on a circle of radius r around (cx, cy), the first at `start`
    degrees (-90 = top), going clockwise. For cycles, hubs with spokes, around-a-core layouts."""
    import math
    out = []
    for i in range(n):
        a = math.radians(start + 360 * i / n)
        out.append((cx + r * math.cos(a) - w / 2, cy + r * math.sin(a) - h / 2))
    return out


def grid(x, y, cols, n, w, h, gx=32, gy=32):
    """Top-left corners of n cells (w x h) in rows of `cols`, gaps gx / gy: matrices, galleries, catalogues."""
    return [(x + (i % cols) * (w + gx), y + (i // cols) * (h + gy)) for i in range(n)]


def warn(msg):
    print(msg, file=sys.stderr)


def _bounds(e):
    pts = e.get("points")
    if pts:
        xs = [e["x"] + p[0] for p in pts]
        ys = [e["y"] + p[1] for p in pts]
        return min(xs), min(ys), max(xs), max(ys)
    return e["x"], e["y"], e["x"] + e["width"], e["y"] + e["height"]


class Scene:
    def __init__(self, seed=7, font=FONT_CLEAN, roughness=0):
        self.els = []
        self._n = 0
        self.font = font
        self.roughness = roughness
        self.rng = random.Random(seed)
        self._canvas = None
        _current_font[0] = font

    # ------------------------------------------------------------ primitives
    def _id(self):
        self._n += 1
        return f"e{self._n:04d}"

    def _ts(self, s, size):
        return text_size(s, size, font_for(size, self.font))

    def _tint(self):
        """Next pastel of the style's tint cycle (pastel mood): one tint per zone, lane or family."""
        self._ti = getattr(self, "_ti", -1) + 1
        t = STYLE["tints"]
        return t[self._ti % len(t)]

    def text_size(self, s, size):
        """(width, height) of a text as this scene will draw it (per-size font of the current style)."""
        return self._ts(s, size)

    def _seed(self):
        return self.rng.randint(1, 2 ** 31)

    def _base(self, t, x, y, w, h, **kw):
        e = {"id": self._id(), "type": t, "x": x, "y": y, "width": w, "height": h, "angle": 0,
             "strokeColor": Palette.INK, "backgroundColor": "transparent", "fillStyle": "solid", "strokeWidth": 2,
             "strokeStyle": "solid", "roughness": 0 if t == "text" else self.roughness, "opacity": 100,
             "groupIds": [], "frameId": None, "roundness": None, "seed": self._seed(),
             "version": 1, "versionNonce": self._seed(), "isDeleted": False,
             "boundElements": None, "updated": 1, "link": None, "locked": False}
        e.update(kw)
        if t in ("rectangle", "ellipse", "diamond"):
            sw = e.get("strokeWidth", 2)
            if STYLE["sw"] and sw == 2:
                e["strokeWidth"] = STYLE["sw"]
            elif STYLE["sw_key"] and sw >= 3:
                e["strokeWidth"] = STYLE["sw_key"]
            if STYLE["outline"] and e.get("strokeStyle") == "solid" and \
                    str(e.get("strokeColor", "")).lower() in (Palette.LINE.lower(), Palette.STONE.lower()):
                e["strokeColor"] = getattr(Palette, STYLE["outline"].upper())
        self.els.append(e)
        return e

    def _baseline(self, size):
        """Distance from the top of a text box to the baseline of its first line (Excalidraw centres the font's
        ascender + descender in the line box)."""
        asc, desc = FONT_METRICS.get(font_for(size, self.font), FONT_METRICS[FONT_CLEAN])
        return size * LINE_HEIGHT / 2 + (asc + desc) / 2 * size

    def _optical_dy(self, size):
        """Offset that moves a line box so that capitals and digits sit on its geometric centre."""
        cap = 0.62 if font_for(size, self.font) == FONT_HAND else 0.7
        return size * LINE_HEIGHT / 2 - (self._baseline(size) - cap * size / 2)

    def text(self, x, y, s, size=14, color=None, align="left", width=None):
        color = _c(color, "MID")
        w, h = self._ts(s, size)
        w = width or w
        if align == "center":
            x -= w / 2
        elif align == "right":
            x -= w
        return self._base("text", x, y, w, h, text=s, originalText=s, fontSize=size, fontFamily=font_for(size, self.font),
                          textAlign=align, verticalAlign="top", containerId=None, lineHeight=LINE_HEIGHT,
                          strokeColor=color, autoResize=True, strokeWidth=1)

    def text_mid(self, x, cy, s, size=14, color=None, align="left"):
        """Text whose capitals are optically centred on the horizontal line cy (for chips, bars, badges)."""
        h = self._ts(s, size)[1]
        return self.text(x, cy - h / 2 + self._optical_dy(size), s, size, color, align)

    def rect(self, x, y, w, h, fill=None, stroke=None, sw=2, style="solid", rounded=True, radius=None, seed=None):
        """Rectangle; rounded ones use RADIUS (or `radius`), capped by Excalidraw at a quarter of the shortest side.
        fill / stroke default to PAPER / LINE."""
        v = RADIUS if radius is None else radius
        rnd = None if not rounded else ({"type": 3} if v is None else {"type": 3, "value": v})
        e = self._base("rectangle", x, y, w, h, backgroundColor=_c(fill, "PAPER"), strokeColor=_c(stroke, "LINE"),
                       strokeWidth=sw, strokeStyle=style, roundness=rnd)
        if seed is not None:
            e["seed"] = seed
        return e

    def ellipse(self, x, y, w, h, fill=None, stroke=None, sw=2):
        return self._base("ellipse", x, y, w, h, backgroundColor=_c(fill, "WHITE"), strokeColor=_c(stroke, "INK"),
                          strokeWidth=sw)

    def line(self, x, y, pts, color=None, sw=2, style="solid"):
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        return self._base("line", x, y, max(xs) - min(xs), max(ys) - min(ys), points=pts, strokeColor=_c(color, "MID"),
                          strokeWidth=sw, strokeStyle=style, startBinding=None, endBinding=None,
                          startArrowhead=None, endArrowhead=None, lastCommittedPoint=None)

    def arrow(self, x1, y1, x2, y2, color=None, sw=3, style="solid", via=None):
        """Straight or elbowed arrow (via = list of absolute (x, y) corners); elbows stay square. Callers leave
        ARROW_GAP between the tip and the box it points at (connect() does it for you)."""
        pts = [[0, 0]] + [[px - x1, py - y1] for px, py in (via or [])] + [[x2 - x1, y2 - y1]]
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        return self._base("arrow", x1, y1, max(xs) - min(xs), max(ys) - min(ys), points=pts,
                          strokeColor=_c(color, "INK"), strokeWidth=sw, strokeStyle=style, startBinding=None,
                          endBinding=None, startArrowhead=None, endArrowhead="arrow", lastCommittedPoint=None,
                          elbowed=False, roundness=None)

    def chip(self, x, y, s, fill=None, stroke=None, color=None, size=12, style="solid"):
        """Pill with text (defaults PAPER / STONE / INK); returns its width. Its height is chip_height(size)."""
        w, h = self._ts(s, size)
        ch = h + 2 * CHIP_PY
        self.rect(x, y, w + 2 * CHIP_PX, ch, _c(fill, "PAPER"), _c(stroke, "STONE"), 1, style)
        self.text_mid(x + CHIP_PX, y + ch / 2, s, size, _c(color, "INK"))
        return w + 2 * CHIP_PX

    def chip_height(self, size=12):
        return self._ts("X", size)[1] + 2 * CHIP_PY

    # ------------------------------------------------------------ page
    def canvas(self, colour=None, margin=CANVAS_MARGIN):
        """Paint a full-bleed page colour (default Palette.CANVAS) behind everything, `margin` px around the
        drawing. Excalidraw+ screenshots ignore the file's viewBackgroundColor, so warm and ink palettes need this.
        The rectangle is computed and put underneath at dump() time; call canvas() anywhere."""
        self._canvas = (colour, margin)

    # ------------------------------------------------------------ layered shapes (rounded corners done right)
    def _rounded_outline(self, x, y, w, h, r, x_from, color, sw, style="solid"):
        """Open path tracing the top, right and bottom sides of a rounded rectangle, from x_from on the top edge
        round to x_from on the bottom edge. Corners follow Excalidraw's quadratic curves exactly."""
        def quad(p0, c, p2, n=16):
            return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p2[0],
                     (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p2[1])
                    for t in (i / n for i in range(1, n + 1))]
        pts = [(x_from, y), (x + w - r, y)]
        pts += quad((x + w - r, y), (x + w, y), (x + w, y + r))
        pts += [(x + w, y + h - r)]
        pts += quad((x + w, y + h - r), (x + w, y + h), (x + w - r, y + h))
        pts += [(x_from, y + h)]
        return self.line(x_from, y, [[px - x_from, py - y] for px, py in pts], color, sw, style)

    def edge_rect(self, x, y, w, h, color, edge=EDGE, fill=None, stroke=None, sw=2, radius=None):
        """Rounded box whose left edge is a coloured band that follows the rounded corners (like a CSS
        border-left). Three layers: the full box in the edge colour, the face (fill, default WHITE) inset by `edge`
        on the left with the same height and radius, then the border (stroke, default LINE) on the top, right and
        bottom sides only. Both boxes span the full height, so text inside always sits in the face box.
        Returns the box (x, y, w, h)."""
        fill, stroke = _c(fill, "WHITE"), _c(stroke, "LINE")
        r = corner_radius(w, h, radius)
        seed = self._seed()
        # fills stay crisp (also in the hand-drawn look) and carry no stroke, so nothing peeks out from under the
        # border, and no accent stroke sits under the grey corners where anti-aliasing could tint them
        sil = self.rect(x, y, w, h, color, "transparent", 1, radius=r, seed=seed)
        face = self.rect(x + edge, y, w - edge, h, fill, "transparent", 1, radius=r, seed=seed)
        sil["roughness"] = face["roughness"] = 0
        self._rounded_outline(x, y, w, h, r, x + edge + r, stroke, sw)
        return (x, y, w, h)

    def _banded(self, x, y, w, h, band_h, band, fill, stroke, sw, style="solid"):
        """Container with a coloured header band whose top corners match the container's exactly: the band has
        the container's radius, a square patch squares its bottom edge, and the border goes back on top when the
        band colour differs. In the hand-drawn look the fills stay crisp and a single rough border is drawn last,
        so the band never pokes past a wobbling outline."""
        r = corner_radius(w, h, min(RADIUS or 32, band_h / 4))
        if not self.roughness:
            seed = self._seed()
            self.rect(x, y, w, h, fill, stroke, sw, style, radius=r, seed=seed)
            self.rect(x, y, w, band_h, band, band, sw, radius=r)
            self.rect(x, y + band_h - r - 1, w, r + 1, band, band, sw, rounded=False)   # squares the band's bottom
            if band != stroke or style != "solid":
                self.rect(x, y, w, h, "transparent", stroke, sw, style, radius=r, seed=seed)  # border back on top
            return r
        for e in (self.rect(x, y, w, h, fill, "transparent", 1, radius=r),       # crisp fills, no stroke
                  self.rect(x, y, w, band_h, band, "transparent", 1, radius=r),
                  self.rect(x, y + band_h - r - 1, w, r + 1, band, "transparent", 1, rounded=False)):
            e["roughness"] = 0
        self.rect(x, y, w, h, "transparent", stroke, sw, style, radius=r)
        return r

    # ------------------------------------------------------------ components
    def status_chip(self, x_right, y, key):
        lab, bg, bd, tx = STATUS[key]
        w = self._ts(lab, 12)[0] + 2 * CHIP_PX
        self.chip(x_right - w, y, lab, bg, bd, tx, 12)
        return w

    def out_chip(self, x, y, s):
        """The piece a step produces (= input of the next step)."""
        return self.chip(x, y, "→ " + s, Palette.WHITE, Palette.STONE, Palette.MID, 12, "dashed")

    def badges(self, x_right, y, letters, proposed=()):
        """Letter badges straddling a card's top edge, clear of its rounded corner; letters in `proposed` use the
        accent colour. A white ring cuts the border cleanly where a badge sits on it."""
        d = 32                                  # > 30 px so linters treat the disc as the letter's container
        for i, l in enumerate(letters):
            cx = x_right - PAD - d / 2 - i * (d + GAP)
            col = Palette.ACCENT if l in proposed else Palette.INK
            self.ellipse(cx - d / 2, y - d / 2, d, d, col, Palette.WHITE, 2)
            self.text_mid(cx, y, l, 15, Palette.WHITE, align="center")

    def card(self, x, y, w, h, title, actor=None, body=None, *, status=None, out=None, out_high=False, note=None,
             skills="", proposed_skills=(), stroke=None, fill=None, sw=2, style="solid", tcolor=None, bcolor=None,
             tsize=19):
        """Title (+ actor line) + body; status bottom-right; output chip bottom-left (or one row higher with
        out_high when the status chip leaves no room); grey note above the bottom row; skill badges on the corner.
        Everything sits on the PAD inset, so chips align with the text column. Defaults: stroke LINE, fill WHITE,
        title INK, body MID."""
        self.rect(x, y, w, h, _c(fill, "WHITE"), _c(stroke, "LINE"), sw, style)
        self.text(x + PAD, y + PAD, title, tsize, _c(tcolor, "INK"))
        ty = y + PAD + self._ts(title, tsize)[1] + 6
        if actor:
            self.text(x + PAD, ty, actor, 12, Palette.MID)
            ty += 22
        if body:
            self.text(x + PAD, ty, body, 14, _c(bcolor, "MID"))
            ty += self._ts(body, 14)[1]
        ch = self.chip_height(12)
        row_y = y + h - PAD - ch
        floor = row_y - GAP if (status or (out and not out_high)) else y + h - 12
        if status:
            self.status_chip(x + w - PAD, row_y, status)
        if out:
            oy = row_y - (ch + GAP if out_high else 0)
            ow = self.out_chip(x + PAD, oy, out)
            if not out_high and status and ow + self._ts(STATUS[status][0], 12)[0] + 2 * CHIP_PX + 2 * PAD > w:
                warn(f"OUT CHIP TOO WIDE in '{title[:30]}': use out_high=True or a shorter output")
            floor = min(floor, oy - GAP)
        if note:
            nh = self._ts(note, 13)[1]
            self.text(x + PAD, floor - nh, note, 13, Palette.GREY)
            floor -= nh + GAP
        if ty > floor:
            warn(f"OVERFLOW in card '{title[:30]}': content ends at {ty - y:.0f}, room until {floor - y:.0f}")
        for line in ((title, tsize), (body or "", 14)):
            if line[0] and self._ts(line[0], line[1])[0] > w - 2 * PAD:
                warn(f"OVERFLOW (width) in card '{title[:30]}': '{line[0].splitlines()[0][:30]}…'")
        if skills:
            self.badges(x + w, y, skills, proposed_skills)
        return ty

    def cartouche(self, x, y, headline, subject, footnote, w=460):
        """Who presents to whom. Light, so it never outweighs the diagram."""
        self.rect(x, y, w, 96, Palette.PAPER, Palette.STONE, 2)
        self.text(x + 20, y + 14, headline, 17, Palette.INK)
        self.text(x + 20, y + 44, subject, 13, Palette.MID)
        self.text(x + 20, y + 66, footnote, 13, Palette.MID)

    def legend(self, x, y, items):
        """items: list of (kind, label, colour) with kind in 'box', 'fill', 'dashed', 'arrow', 'dot', 'text'."""
        cx = x
        for kind, label, col in items:
            if kind == "box":
                self.rect(cx, y, 22, 22, Palette.WHITE, col, 2)
            elif kind == "fill":                   # col or (fill, stroke): match the swatch to the drawing
                f, st = col if isinstance(col, tuple) else (col, col)
                self.rect(cx, y, 22, 22, f, st, 2)
            elif kind == "dashed":
                self.rect(cx, y, 22, 22, Palette.WHITE, col, 2, "dashed")
            elif kind == "arrow":
                self.arrow(cx, y + 11, cx + 24, y + 11, col, 2)
            elif kind == "dot":
                self.ellipse(cx + 6, y + 6, 10, 10, col, col, 1)
            off = 0 if kind == "text" else 32
            self.text_mid(cx + off, y + 11, label, 13, col if kind == "text" else Palette.INK)
            col = col[1] if isinstance(col, tuple) else col
            cx += off + self._ts(label, 13)[0] + 26

    def section_block(self, x, y, w, h, title, scope=None, sub=None):
        """White box with a black header bar: the part of the system the diagram is about. The bar's top corners
        follow the box's corners exactly."""
        band = 56
        self._banded(x, y, w, h, band, Palette.LOUD, Palette.WHITE, Palette.INK, 3)
        self.text_mid(x + 24, y + band / 2, title, 22, Palette.LOUD_TXT)
        if scope:                                  # on the title's baseline
            base = y + band / 2 - self._ts(title, 22)[1] / 2 + self._optical_dy(22) + self._baseline(22)
            self.text(x + w - 24, base - self._baseline(15), scope, 15, Palette.LOUD_SUB, align="right")
        if sub:
            self.text(x + 24, y + band + 10, sub, 13, Palette.GREY)
        return (x, y, w, h)

    def lane(self, x, y, w, h, label, fill=None, stroke=None, color=None, style="solid", sw=1):
        """Horizontal swimlane: tinted band (default LANE / LINE) with its label (default INK) in the top-left."""
        if fill is None and STYLE["tints"]:
            fill, stroke = self._tint(), stroke or Palette.INK
        self.rect(x, y, w, h, _c(fill, "LANE"), _c(stroke, "LINE"), sw, style)
        self.text(x + PAD, y + 10, label, 13, _c(color, "INK"))
        return (x, y, w, h)

    def hero_bar(self, x, y, w, title, segments, caption=None, h=56):
        """segments: list of (value, label, kind) with kind in 'measured', 'measured_dark', 'wait', 'unmeasured'.
        Widths are proportional to value; unmeasured segments are dashed."""
        self.text(x, y, title, 24, Palette.INK)
        styles = {"measured": (Palette.PAPER, Palette.STONE, Palette.MID, "solid"),
                  "measured_dark": (Palette.LOUD, Palette.INK, Palette.LOUD_TXT, "solid"),
                  "wait": (Palette.ORANGE_SOFT, Palette.ORANGE, Palette.INK, "solid"),
                  "unmeasured": (Palette.PAPER, Palette.STONE, Palette.GREY, "dashed")}
        total = sum(s[0] for s in segments)
        bx = x
        for v, lab, kind in segments:
            bg, bd, tx, st = styles[kind]
            sw = w * v / total
            self.rect(bx, y + 50, sw, h, bg, bd, 2, st, rounded=False)
            self.text_mid(bx + 14, y + 50 + h / 2, lab, 16, tx)
            if self._ts(lab, 16)[0] > sw - 20:
                warn(f"OVERFLOW in hero segment '{lab[:30]}'")
            bx += sw
        if caption:
            self.text(x, y + 50 + h + 14, caption, 13, Palette.GREY)

    def rows(self, x, y, w, total_h, items, bar=None, fill=None, stroke=None, label_w=150):
        """Equal-height bars filling total_h, each with a coloured left edge (default INK) that follows its
        rounded corners. items: strings, or (label, text) pairs."""
        bar = _c(bar, "INK")
        gap = 10
        h = (total_h - gap * (len(items) - 1)) / len(items)
        for it in items:
            self.edge_rect(x, y, w, h, bar, EDGE, _c(fill, "WHITE"), _c(stroke, "LINE"), 2)
            if isinstance(it, tuple):
                self.text_mid(x + EDGE + PAD, y + h / 2, it[0], 17, Palette.INK)
                self.text_mid(x + label_w, y + h / 2, it[1], 16, Palette.INK)
                if self._ts(it[0], 17)[0] > label_w - EDGE - PAD - GAP:
                    warn(f"OVERFLOW in row label '{it[0][:30]}': raise label_w")
            else:
                self.text_mid(x + EDGE + PAD, y + h / 2, it, 16, Palette.INK)
            y += h + gap

    def questions_box(self, x, y, w, h, title, questions):
        self.text(x, y, title, 14, Palette.YELLOW_TXT)
        self.rect(x, y + 30, w, h, Palette.YELLOW_BG, Palette.YELLOW, 2, "dashed")
        body = "\n\n".join(f"{i + 1}. {q}" for i, q in enumerate(questions))
        self.text(x + 24, y + 50, body, 16, Palette.INK)
        if self._ts(body, 16)[1] > h - 30:
            warn(f"OVERFLOW in questions box '{title}'")

    # ------------------------------------------------------------ generic components (any diagram type)
    def node(self, x, y, w, h, label, sub=None, fill=None, stroke=None, strong=False, size=17):
        """A component, system or concept: centred label, optional small subtitle. strong = the one loud box.
        Defaults: fill WHITE, stroke INK."""
        fill, stroke = _c(fill, "WHITE"), _c(stroke, "INK")
        self.rect(x, y, w, h, Palette.LOUD if strong else fill, Palette.INK if strong else stroke, 3 if strong else 2)
        col = Palette.LOUD_TXT if strong else Palette.INK
        lh = self._ts(label, size)[1] + (self._ts(sub, 13)[1] + 4 if sub else 0)
        ty = y + (h - lh) / 2
        self.text(x + w / 2, ty, label, size, col, align="center")
        if sub:
            self.text(x + w / 2, ty + self._ts(label, size)[1] + 4, sub, 13, Palette.LOUD_SUB if strong else Palette.GREY,
                      align="center")
        if self._ts(label, size)[0] > w - 20 or (sub and self._ts(sub, 13)[0] > w - 20):
            warn(f"OVERFLOW in node '{label[:30]}'")
        return (x, y, w, h)

    def group(self, x, y, w, h, title, fill=None, stroke=None, header=None, header_text=None):
        """A tinted zone (default PAPER / LINE) holding related nodes; header = colour of an optional 44 px title
        band whose corners follow the zone's corners; header_text defaults to WHITE."""
        if fill is None and STYLE["tints"]:
            fill = self._tint()
            if header is None:
                stroke = stroke or Palette.INK
        fill, stroke = _c(fill, "PAPER"), _c(stroke, "LINE")
        if header:
            self._banded(x, y, w, h, 44, header, fill, stroke, 2)
            self.text_mid(x + 18, y + 22, title, 17, _c(header_text, "WHITE"))
        else:
            self.rect(x, y, w, h, fill, stroke, 1)
            self.text(x + PAD, y + 10, title, 13, Palette.GREY)
        return (x, y, w, h)

    def _label_path(self, pts, label, color, size, sw):
        """Place a label beside a polyline: above its longest horizontal segment, else right of its longest
        vertical one, else above the midpoint. Never on the line."""
        w, h = self._ts(label, size)
        segs = list(zip(pts, pts[1:]))
        hor = [s for s in segs if abs(s[0][1] - s[1][1]) < 0.5]
        ver = [s for s in segs if abs(s[0][0] - s[1][0]) < 0.5]
        if hor:
            a, b = max(hor, key=lambda s: abs(s[1][0] - s[0][0]))
            return self.text((a[0] + b[0]) / 2, a[1] - sw / 2 - LABEL_GAP - h, label, size, color, align="center")
        if ver:
            a, b = max(ver, key=lambda s: abs(s[1][1] - s[0][1]))
            return self.text(a[0] + sw / 2 + LABEL_GAP + 2, (a[1] + b[1]) / 2 - h / 2, label, size, color)
        a, b = pts[0], pts[-1]
        return self.text((a[0] + b[0]) / 2, min(a[1], b[1]) - LABEL_GAP - h, label, size, color, align="center")

    def labelled_arrow(self, x1, y1, x2, y2, label, color=None, sw=3, size=13, via=None):
        """Arrow with a short label above its longest horizontal segment (beside it when the arrow is vertical),
        never on the line."""
        color = _c(color, "INK")
        self.arrow(x1, y1, x2, y2, color, sw, via=via)
        self._label_path([(x1, y1)] + list(via or []) + [(x2, y2)], label, color, size, sw)

    def connect(self, a, b, label=None, color=None, sw=2, style="solid", gap=ARROW_GAP, size=13):
        """Arrow between two boxes (x, y, w, h) — e.g. what node() returns — leaving `gap` at both ends. Straight
        when the boxes face each other, otherwise a square elbow from side to side."""
        color = _c(color, "INK")
        ax, ay, aw, ah = a
        bx, by, bw, bh = b
        acx, acy, bcx, bcy = ax + aw / 2, ay + ah / 2, bx + bw / 2, by + bh / 2
        horizontal = bx >= ax + aw or bx + bw <= ax
        vertical = by >= ay + ah or by + bh <= ay
        if horizontal and vertical:      # diagonal neighbours: go along the larger separation
            horizontal = abs(bcx - acx) >= abs(bcy - acy)
        via = None
        if horizontal:
            right = bx >= ax + aw
            x1, x2 = (ax + aw + gap, bx - gap) if right else (ax - gap, bx + bw + gap)
            lo, hi = max(ay, by), min(ay + ah, by + bh)
            if hi - lo >= 16:
                y1 = y2 = (lo + hi) / 2
            else:
                y1, y2 = acy, bcy
                mx = (x1 + x2) / 2
                via = [(mx, y1), (mx, y2)]
        else:
            down = by >= ay + ah
            y1, y2 = (ay + ah + gap, by - gap) if down else (ay - gap, by + bh + gap)
            lo, hi = max(ax, bx), min(ax + aw, bx + bw)
            if hi - lo >= 16:
                x1 = x2 = (lo + hi) / 2
            else:
                x1, x2 = acx, bcx
                my = (y1 + y2) / 2
                via = [(x1, my), (x2, my)]
        e = self.arrow(x1, y1, x2, y2, color, sw, style, via=via)
        if label:
            self._label_path([(x1, y1)] + list(via or []) + [(x2, y2)], label, color, size, sw)
        return e

    def stat(self, x, y, w, value, label, color=None, big=False, h=None, value_size=None):
        """A key-figure tile: coloured left edge (default INK) that follows the rounded corners, the figure, one or
        two lines of context. value_size sets the figure size (default 38 when big, else 28; ~56 for the one hero
        figure of a poster); the height grows to fit unless h is given. Returns the box (x, y, w, h)."""
        color = _c(color, "INK")
        vs = value_size or (38 if big else 28)
        vh, (lw, lh) = self._ts(value, vs)[1], self._ts(label, 13)
        need = PAD - 2 + vh + 10 + lh + PAD
        h = h or max(150 if big else 120, need)
        self.edge_rect(x, y, w, h, color, EDGE, Palette.WHITE, Palette.LINE, 2)
        tx = x + EDGE + PAD + 4
        self.text(tx, y + PAD - 2, value, vs, color)
        ly = y + PAD - 2 + vh + 10
        self.text(tx, ly, label, 13, Palette.MID)
        if ly + lh > y + h - 8:
            warn(f"OVERFLOW in stat '{value}': raise h")
        if max(self._ts(value, vs)[0], lw) > w - (tx - x) - PAD:
            warn(f"OVERFLOW (width) in stat '{value}'")
        return (x, y, w, h)

    def timeline(self, x, y, w, ticks, color=None, today=None, *, label_mode="tick", spans=None, today_color=None,
                 today_label="today", today_up=120, today_down=120):
        """Horizontal axis with evenly spaced ticks; returns the x of every tick mark.

        label_mode "tick": one label under each tick (len(ticks) marks). "span": the labels name the intervals
        (quarters, sprints): len(ticks) + 1 marks, each label centred between two marks.
        spans: list of (start, end, label) or (start, end, label, colour) in tick units (0 = first mark), drawn as
        a bracket with its label centred below the tick labels.
        today: position in tick units for a dashed marker (today_color defaults to INK, today_label to "today",
        today_up / today_down = length above / below the axis)."""
        color = _c(color, "INK")
        n = len(ticks) if label_mode == "span" else max(1, len(ticks) - 1)

        def at(i):
            return x + w * i / n

        self.line(x, y, [[0, 0], [w, 0]], color, 3)
        xs = [at(i) for i in range(n + 1)]
        for tx in xs:
            self.line(tx, y - 8, [[0, 0], [0, 16]], color, 3)
        for i, lab in enumerate(ticks):
            self.text(at(i + 0.5) if label_mode == "span" else at(i), y + 16, lab, 13, Palette.MID, align="center")
        by = y + 16 + self._ts("X", 13)[1] + 18
        for sp in spans or ():
            s, e, lab = sp[:3]
            col = sp[3] if len(sp) > 3 else Palette.STONE
            x1, x2 = at(s) + 2, at(e) - 2
            self.line(x1, by - 6, [[0, 0], [0, 6], [x2 - x1, 6], [x2 - x1, 0]], col, 2)
            self.text((x1 + x2) / 2, by + LABEL_GAP, lab, 13, col if len(sp) > 3 else Palette.MID, align="center")
        if today is not None:
            tc = _c(today_color, "INK")
            tx = at(today)
            gap_top, gap_bottom = y + 10, y + 16 + self._ts("X", 13)[1] + 4      # keep clear of the tick labels
            if y + today_down <= gap_top:
                self.line(tx, y - today_up, [[0, 0], [0, today_up + today_down]], tc, 2, "dashed")
            else:
                self.line(tx, y - today_up, [[0, 0], [0, gap_top - (y - today_up)]], tc, 2, "dashed")
                if y + today_down > gap_bottom:
                    self.line(tx, gap_bottom, [[0, 0], [0, y + today_down - gap_bottom]], tc, 2, "dashed")
            if today_label:
                self.text(tx + LABEL_GAP, y - today_up, today_label, 13, tc)
        return xs

    # ------------------------------------------------------------ small marks
    def step(self, x, y, n, color=None, size=28, outline=False):
        """Numbered step marker: a disc of diameter `size` with its top-left at (x, y), the number optically
        centred. outline=True draws a white disc with a coloured ring and number. Returns the diameter."""
        on = Palette.BADGE_TXT if color is None else Palette.WHITE
        color = _c(color, "BADGE")
        fill, ring, txt = (Palette.WHITE, color, color) if outline else (color, color, on)
        self.ellipse(x, y, size, size, fill, ring, 2 if outline else 1)
        fs = round(size * (0.5 if len(str(n)) < 2 else 0.43))
        self.text_mid(x + size / 2, y + size / 2, str(n), fs, txt, align="center")
        return size

    def dot(self, cx, cy, color, label=None, d=10, size=13, label_color=None):
        """Status or category dot centred on (cx, cy), with an optional label to its right. Returns the total width."""
        self.ellipse(cx - d / 2, cy - d / 2, d, d, color, color, 1)
        if not label:
            return d
        self.text_mid(cx + d / 2 + GAP, cy, label, size, _c(label_color, "INK"))
        return d + GAP + self._ts(label, size)[0]

    def divider(self, x, y, w, label=None, color=None, size=12, label_color=None, sw=1):
        """Horizontal hairline at y (default LINE); with a label (default GREY), the line breaks around it."""
        color = _c(color, "LINE")
        if not label:
            return self.line(x, y, [[0, 0], [w, 0]], color, sw)
        tw = self._ts(label, size)[0]
        cx = x + w / 2
        g = GAP + 4
        self.line(x, y, [[0, 0], [w / 2 - tw / 2 - g, 0]], color, sw)
        self.line(cx + tw / 2 + g, y, [[0, 0], [w / 2 - tw / 2 - g, 0]], color, sw)
        return self.text_mid(cx, y, label, size, _c(label_color, "GREY"), align="center")

    def callout(self, x, y, tx, ty, text, color=None, size=13, line_color=None):
        """Annotation: text (default MID) with its top-left at (x, y) and a thin leader line (default STONE) from
        the text's nearest side to the target point (tx, ty), which gets a small dot. The leader never touches
        the text (LABEL_GAP)."""
        line_color = _c(line_color, "STONE")
        self.text(x, y, text, size, _c(color, "MID"))
        w, h = self._ts(text, size)
        if tx < x - LABEL_GAP:
            sx, sy = x - LABEL_GAP, y + h / 2
        elif tx > x + w + LABEL_GAP:
            sx, sy = x + w + LABEL_GAP, y + h / 2
        elif ty < y:
            sx, sy = min(max(tx, x), x + w), y - LABEL_GAP / 2
        else:
            sx, sy = min(max(tx, x), x + w), y + h + LABEL_GAP / 2
        self.line(sx, sy, [[0, 0], [tx - sx, ty - sy]], line_color, 1)
        self.ellipse(tx - 3, ty - 3, 6, 6, line_color, line_color, 1)

    # ------------------------------------------------------------ header (style-aware)
    def header(self, title, sub=None, x=0, y=0, kicker=None, underline=False):
        """Title block drawn the current style's way: sizes, title font, alignment (centred over the finished
        drawing at dump time when the style says so) and an optional hairline rule under it. kicker = a short
        caps line above the title (accent). Returns the y where content may start (keep content >= 148)."""
        els = []
        ty = y
        if kicker:
            els.append(self.text(x, ty, kicker.upper(), 13, Palette.ACCENT))
            ty += self._ts("X", 13)[1] + 6
        els.append(self.text(x, ty, title, STYLE["title"], Palette.INK))
        tw, th = self._ts(title, STYLE["title"])
        if underline:                               # hand underline under the middle of the title
            u = self.line(x + tw * 0.18, ty + th + 2, [[0, 0], [tw * 0.21, 4], [tw * 0.45, -2], [tw * 0.64, 3]],
                          Palette.ACCENT, 3)
            u["roundness"] = {"type": 2}
            els.append(u)
        ty += th + 10
        if sub:
            els.append(self.text(x, ty, sub, STYLE["sub"], Palette.MID))
            ty += self._ts(sub, STYLE["sub"])[1]
        self._header = {"els": els, "rule_y": ty + 22 if STYLE["rule"] else None, "align": STYLE["align"]}
        return ty + 48

    def _finish(self):
        """Style passes that need the whole drawing: header alignment and rule, hachure zones, arched arrows,
        sticker shadows. Runs once, at dump time."""
        if getattr(self, "_finished", False):
            return
        self._finished = True
        h = getattr(self, "_header", None)
        hid = {id(e) for e in (h["els"] if h else [])}
        body = [e for e in self.els if id(e) not in hid]
        if body:
            b = [_bounds(e) for e in body]
            x0, x1 = min(v[0] for v in b), max(v[2] for v in b)
            if h and h["align"] == "center":
                tx = h["els"][0]["x"]
                for e in h["els"]:
                    if e["type"] == "text":
                        e["x"] = (x0 + x1) / 2 - e["width"] / 2
                        e["textAlign"] = "center"
                title = next(e for e in h["els"] if e["type"] == "text" and e["fontSize"] == STYLE["title"])
                for e in h["els"]:                  # the underline follows its title
                    if e["type"] == "line":
                        e["x"] += title["x"] - tx
            if h and h["rule_y"] is not None:
                self.line(x0, h["rule_y"], [[0, 0], [x1 - x0, 0]], Palette.INK, 1)
        shapes = [e for e in self.els if e["type"] in ("rectangle", "ellipse", "diamond")]
        if STYLE["zone_fill"] == "hachure":
            soft = {Palette.LANE: Palette.LINE, Palette.PAPER: Palette.LINE, Palette.ACCENT_BG: Palette.ACCENT_SOFT,
                    Palette.BLUE_BG: Palette.BLUE_SOFT, Palette.TEAL_BG: Palette.TEAL_SOFT,
                    Palette.GREEN_BG: Palette.GREEN_SOFT, Palette.RED_BG: Palette.RED_SOFT,
                    Palette.ORANGE_BG: Palette.ORANGE_SOFT}
            for z in shapes:
                if z["type"] != "rectangle" or z["backgroundColor"] not in soft or z["width"] * z["height"] < 40000:
                    continue
                zb = _bounds(z)
                inner = [o for o in shapes if o is not z and 6000 <= o["width"] * o["height"] < z["width"] * z["height"] / 2
                         and _bounds(o)[0] >= zb[0] and _bounds(o)[2] <= zb[2] and _bounds(o)[1] >= zb[1]
                         and _bounds(o)[3] <= zb[3]]
                def _in(t, b):
                    tb = _bounds(t)
                    return tb[0] >= b[0] and tb[2] <= b[2] and tb[1] >= b[1] and tb[3] <= b[3]
                own_text = [t for t in self.els if t["type"] == "text" and t["fontSize"] >= 16 and _in(t, zb)
                            and not any(_in(t, _bounds(o)) for o in inner)]
                if inner and not own_text:          # a zone holding boxes, not a card holding its own text
                    z["fillStyle"] = "hachure"
                    z["backgroundColor"] = soft[z["backgroundColor"]]
        if STYLE["curved"]:
            for a in self.els:
                pts = a.get("points")
                if a["type"] != "arrow" or not pts or len(pts) != 2 or abs(pts[1][1]) > 1 or abs(pts[1][0]) < 40:
                    continue
                L = pts[1][0]
                bend = -min(10, abs(L) * 0.12)
                a["points"] = [[0, 0], [L / 2, bend], [L, pts[1][1]]]
                a["roundness"] = {"type": 2}
        if STYLE["shadow"] and STYLE["sw_key"]:
            out = []
            for e in self.els:
                if e["type"] == "rectangle" and e.get("strokeWidth") == STYLE["sw_key"] and \
                        e.get("backgroundColor") not in (None, "transparent") and e.get("strokeStyle") == "solid":
                    sh = dict(e, id=e["id"] + "s", x=e["x"] + 6, y=e["y"] + 6, backgroundColor=Palette.INK,
                              strokeColor="transparent", strokeWidth=1, seed=self._seed(),
                              customData={"decor": "shadow"})
                    out.append(sh)
                out.append(e)
            self.els = out

    # ------------------------------------------------------------ output
    def dump(self, path, background=None, paint_background=False):
        """Write the scene. background defaults to Palette.CANVAS; paint_background=True (or an earlier canvas()
        call) also paints it as a full-bleed rectangle under everything, for renderers that ignore the file's
        background colour."""
        bg = _c(background, "CANVAS")
        self._finish()
        els = self.els
        if (self._canvas or paint_background) and els:
            colour, margin = self._canvas or (None, CANVAS_MARGIN)
            colour = colour or bg
            b = [_bounds(e) for e in els]
            x0, y0 = min(v[0] for v in b) - margin, min(v[1] for v in b) - margin
            x1, y1 = max(v[2] for v in b) + margin, max(v[3] for v in b) + margin
            page = {"id": "page0000", "type": "rectangle", "x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0,
                    "angle": 0, "strokeColor": "transparent", "backgroundColor": colour, "fillStyle": "solid",
                    "strokeWidth": 1, "strokeStyle": "solid", "roughness": 0, "opacity": 100, "groupIds": [],
                    "frameId": None, "roundness": None, "seed": 1, "version": 1, "versionNonce": 1,
                    "isDeleted": False, "boundElements": None, "updated": 1, "link": None, "locked": False}
            els = [page] + els
        data = {"type": "excalidraw", "version": 2, "source": "https://excalidraw.com", "elements": els,
                "appState": {"gridSize": 20, "viewBackgroundColor": bg}, "files": {}}
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        return path

    # ------------------------------------------------------------ dense process maps (appended components)
    def banner(self, x, y, label, text, color=None, fill=None, w=None, size=16):
        """Thin statement band under a header ("TODAY: ..." in the bad tint, "GOAL: ..." in the good tint): a tint
        (default RED_BG) with a coloured left edge (default RED) that follows the rounded corners, the label in
        that colour then the text in INK, both optically centred. No border, so it adds no stroke colour. w
        defaults to the text width; give stacked banners the same w so they share a right edge.
        Returns the box (x, y, w, h)."""
        color, fill = _c(color, "RED"), _c(fill, "RED_BG")
        lw, th = self._ts(label, size)
        need = EDGE + PAD + lw + GAP + self._ts(text, size)[0] + PAD
        w = w or need
        h = th + 12
        if need > w:
            warn(f"OVERFLOW in banner '{label}': needs {need:.0f} px, has {w:.0f}")
        self.edge_rect(x, y, w, h, color, EDGE, fill, "transparent", 1)
        self.text_mid(x + EDGE + PAD, y + h / 2, label, size, color)
        self.text_mid(x + EDGE + PAD + lw + GAP, y + h / 2, text, size, Palette.INK)
        return (x, y, w, h)

    def _bullet(self, cx, cy, d, color, filled):
        self.ellipse(cx - d / 2, cy - d / 2, d, d, color if filled else Palette.WHITE, color, 1 if filled else 2)

    def checklist(self, x, y, items, color=None, size=14, step=30, key=None, d=10):
        """Checklist of (text, live) pairs, one row every `step` px: a filled disc (default ACCENT) marks what is
        live, a hollow ring what is still to build (its text in MID instead of INK). key = (live label, to-build
        label) adds a mini legend of the two bullets on the next row (12 px, GREY). Returns the y under the
        last row."""
        color = _c(color, "ACCENT")
        lh = self._ts("X", size)[1]
        for i, (s, live) in enumerate(items):
            cy = y + i * step + lh / 2
            self._bullet(x + d / 2, cy, d, color, live)
            self.text_mid(x + d + GAP + 2, cy, s, size, Palette.INK if live else Palette.MID)
        ny = y + len(items) * step
        if key:
            kh = self._ts("X", 12)[1]
            cx, cy = x, ny + kh / 2
            for lab, live in ((key[0], True), (key[1], False)):
                self._bullet(cx + 4, cy, 8, color, live)
                self.text_mid(cx + 8 + GAP, cy, lab, 12, Palette.GREY)
                cx += 8 + GAP + self._ts(lab, 12)[0] + 2 * PAD
            ny += kh
        return ny

    def badge_legend(self, x, y, items, per_row=4, col_w=None, size=13, d=32, row_gap=12):
        """Legend of lettered badges (skills, owners, systems) matching badges(): items are (letter, label,
        proposed) triples. Each entry is a disc (ACCENT when proposed, else INK) with its letter in WHITE, then a
        chip with the label (accent tint when proposed, PAPER otherwise), on a grid of `per_row` columns `col_w`
        apart (default: the widest entry + 32) so the chips line up. Returns the y under the last row."""
        ch = self.chip_height(size)
        rh = max(d, ch)
        widths = [d + GAP + self._ts(lab, size)[0] + 2 * CHIP_PX for _, lab, _ in items]
        col_w = col_w or max(widths) + 32
        for i, (letter, lab, proposed) in enumerate(items):
            r, c = divmod(i, per_row)
            ex, ey = x + c * col_w, y + r * (rh + row_gap)
            col = Palette.ACCENT if proposed else Palette.INK
            self.ellipse(ex, ey + (rh - d) / 2, d, d, col, col, 1)
            self.text_mid(ex + d / 2, ey + rh / 2, letter, 15, Palette.WHITE, align="center")
            fill, stroke, tc = ((Palette.ACCENT_BG, Palette.ACCENT_SOFT, Palette.ACCENT) if proposed
                                else (Palette.PAPER, Palette.STONE, Palette.INK))
            self.chip(ex + d + GAP, ey + (rh - ch) / 2, lab, fill, stroke, tc, size)
            if widths[i] > col_w - GAP:
                warn(f"OVERFLOW in badge legend '{lab[:30]}': raise col_w")
        rows = (len(items) + per_row - 1) // per_row
        return y + rows * rh + (rows - 1) * row_gap

    def chip_stack(self, x, y, items, max_w=None, size=12, step=None):
        """Chips stacked in a column (the tools under a step, tags): items are (label, fill, stroke, colour)
        tuples. Rows are chip_height + GAP apart unless `step` is given; warns when a chip is wider than max_w
        (the column it must stay in). Returns the y under the last chip."""
        ch = self.chip_height(size)
        step = step or ch + GAP
        for i, (lab, fill, stroke, colour) in enumerate(items):
            cw = self.chip(x, y + i * step, lab, fill, stroke, colour, size)
            if max_w and cw > max_w:
                warn(f"OVERFLOW in chip stack '{lab[:30]}': {cw:.0f} px for a {max_w:.0f} px column")
        return y + (len(items) - 1) * step + ch if items else y

    def return_loop(self, x_from, y_from, x_to, y_to, y_loop, label=None, color=None, sw=2, size=13,
                    style="dashed"):
        """Path back to an earlier step (rework, continuous improvement): an arrow (default RED, dashed) that
        leaves (x_from, y_from), runs along y_loop and climbs back to (x_to, y_to), with its label centred on the
        run, LABEL_GAP below it (above it when the loop runs over the steps). Callers keep ARROW_GAP at both
        ends. Returns the y beyond the label (or the run)."""
        color = _c(color, "RED")
        self.arrow(x_from, y_from, x_to, y_to, color, sw, style, via=[(x_from, y_loop), (x_to, y_loop)])
        if not label:
            return y_loop
        th = self._ts(label, size)[1]
        below = y_loop >= max(y_from, y_to)
        ly = y_loop + sw / 2 + LABEL_GAP if below else y_loop - sw / 2 - LABEL_GAP - th
        self.text((x_from + x_to) / 2, ly, label, size, color, align="center")
        return ly + th if below else ly


    # ------------------------------------------------------------ system maps (agents, services, people)
    def _icon(self, name, cx, cy, size, color=None):
        """Draw a line icon from icons.py (same folder) centred on (cx, cy)."""
        import os as _os
        here = _os.path.dirname(_os.path.abspath(__file__))
        if here not in sys.path:
            sys.path.insert(0, here)
        import icons
        return icons.icon(self, name, cx, cy, size, color)

    def _tag_since(self, n0, keep=(), tag="widget"):
        """Mark elements added since index n0 (except `keep`) as parts of a widget, so lint skips layout checks
        inside it (rows, tiles and bars nest and overlap on purpose)."""
        for e in self.els[n0:]:
            if e not in keep and not (e.get("customData") or {}).get("doodle"):
                e["customData"] = dict(e.get("customData") or {}, doodle=tag)

    def icon_card(self, x, y, w, h, label, icon=None, *, sub=None, fill=None, stroke=None, size=17, layout="row",
                  icon_size=None, color=None, sw=2, radius=None):
        """Card with a line icon and a label. layout='row': icon then label on the card's middle line (role cards:
        "Product Lead", an idea bubble with a bulb); layout='stack': icon above a centred label and an optional sub
        line (people, gates, outcomes: "You" / "(the reviewer)"). fill / stroke default WHITE / INK.
        Returns (x, y, w, h)."""
        fill, stroke = _c(fill, "WHITE"), _c(stroke, "INK")
        loud = str(fill).lower() == str(Palette.LOUD).lower()
        col = _c(color, "LOUD_TXT" if loud else "INK")
        sub_col = Palette.LOUD_SUB if loud else Palette.MID
        self.rect(x, y, w, h, fill, stroke, sw, radius=radius)
        if layout == "row":
            isz = icon_size or round(size * 1.4)
            cy = y + h / 2
            tx = x + PAD
            if icon:
                self._icon(icon, tx + isz / 2, cy, isz, col)
                tx += isz + 12
            self.text_mid(tx, cy, label, size, col)
            used = tx - x + self._ts(label, size)[0] + PAD
            tall = self._ts(label, size)[1] + 16
        else:
            isz = icon_size or round(size * 1.9)
            lh = self._ts(label, size)[1]
            sh = self._ts(sub, size - 2)[1] + 2 if sub else 0
            top = y + (h - ((isz + 10) if icon else 0) - lh - sh) / 2
            if icon:
                self._icon(icon, x + w / 2, top + isz / 2, isz, col)
                top += isz + 10
            self.text(x + w / 2, top, label, size, col, align="center")
            if sub:
                self.text(x + w / 2, top + lh + 2, sub, size - 2, sub_col, align="center")
            used = max(self._ts(label, size)[0], self._ts(sub or "", size - 2)[0]) + 2 * PAD
            tall = (isz + 10 if icon else 0) + lh + sh + 16
        if used > w or tall > h:
            warn(f"OVERFLOW in icon_card '{label.splitlines()[0][:30]}': needs {used:.0f} x {tall:.0f}")
        return (x, y, w, h)

    def icon_list(self, x, y, items, size=15, icon_size=None, step=None, icon_color=None, color=None):
        """Rows of (icon, text) with no box: notes under a node, ticks in a feature box. Text may hold two lines.
        Rows are `step` apart (default: row height + 10). Returns the y under the last row."""
        isz = icon_size or round(size * 1.3)
        cy = y
        for ic, t in items:
            th = self._ts(t, size)[1]
            rh = max(isz, th)
            self._icon(ic, x + isz / 2, cy + min(rh, self._ts("X", size)[1]) / 2, isz, icon_color)
            self.text(x + isz + 12, cy + (min(rh, self._ts("X", size)[1]) - self._ts("X", size)[1]) / 2, t, size,
                      _c(color, "INK"))
            cy += step if step else rh + 10
        return cy

    def list_card(self, x, y, w, h, title, items, *, note=None, fill=None, stroke=None, size=15, title_size=17,
                  icon_size=None):
        """What a role does: a header (title + optional small note) over a divider, then rows of (icon, text),
        spread evenly in the rest of the box. Returns (x, y, w, h)."""
        fill, stroke = _c(fill, "PAPER"), _c(stroke, "INK")
        self.rect(x, y, w, h, fill, stroke, 2)
        hh = self._ts(title, title_size)[1] + 24
        self.text_mid(x + PAD, y + hh / 2, title, title_size, Palette.INK)
        if note:
            self.text_mid(x + PAD + self._ts(title, title_size)[0] + 6, y + hh / 2 + 2, note, 12, Palette.MID)
        n0 = len(self.els)
        self.line(x + 1, y + hh, [[0, 0], [w - 2, 0]], stroke, 1)
        isz = icon_size or round(size * 1.3)
        cap = self._ts("X", size)[1]
        rows = [max(isz, self._ts(t, size)[1]) for _, t in items]
        top, bottom = y + hh + 16, y + h - 16
        gap = (bottom - top - sum(rows)) / max(len(items) - 1, 1)
        if gap < 6:
            warn(f"OVERFLOW in list_card '{title[:30]}': rows need {sum(rows) + 6 * (len(items) - 1):.0f}px")
        cy = top
        for (ic, t), rh in zip(items, rows):
            self._icon(ic, x + PAD + isz / 2, cy + cap / 2, isz, Palette.INK)
            self.text(x + PAD + isz + 12, cy, t, size, Palette.INK)
            if PAD + isz + 12 + self._ts(t, size)[0] > w - 10:
                warn(f"OVERFLOW (width) in list_card '{title[:30]}': '{t.splitlines()[0][:30]}'")
            cy += rh + gap
        self._tag_since(n0, tag="list_card")
        return (x, y, w, h)

    def window_card(self, x, y, w, h, title, rows, *, title_icon="list", fill=None, stroke=None, size=18,
                    row_fill=None):
        """App, inbox or queue mock-up: a window with a title bar (three dots), a title with its icon, and rows.
        rows: (icon names, status colour or None) — icons sit in small tiles, the content is two grey bars, the
        status is a dot on the right. Returns (x, y, w, h)."""
        fill, stroke = _c(fill, "WHITE"), _c(stroke, "INK")
        frame = self.rect(x, y, w, h, fill, stroke, 2)
        n0 = len(self.els)
        bar = 32
        for i in range(3):
            self.ellipse(x + 16 + i * 16, y + bar / 2 - 4, 8, 8, "transparent", stroke, 1.5)
        self.line(x + 1, y + bar, [[0, 0], [w - 2, 0]], stroke, 1.5)
        th = self._ts(title, size)[1]
        isz = round(size * 1.2)
        ty = y + bar + 14 + th / 2
        self._icon(title_icon, x + PAD + 4 + isz / 2, ty, isz, Palette.INK)
        self.text_mid(x + PAD + 4 + isz + 12, ty, title, size, Palette.INK)
        top = ty + th / 2 + 14
        n = len(rows)
        rh = min(64, (y + h - 14 - top - (n - 1) * 10) / max(n, 1))
        if rh < 36:
            warn(f"OVERFLOW in window_card '{title[:30]}': rows only {rh:.0f}px high")
        for i, (icons_, status) in enumerate(rows):
            ry = top + i * (rh + 10)
            self.rect(x + 14, ry, w - 28, rh, _c(row_fill, "PAPER"), Palette.LINE, 1, radius=8)
            tx = x + 26
            t = rh * 0.56
            for ic in icons_:
                self.rect(tx, ry + (rh - t) / 2, t, t, Palette.LANE, Palette.LINE, 1, radius=5)
                self._icon(ic, tx + t / 2, ry + rh / 2, t * 0.64, Palette.MID)
                tx += t + 8
            lw = (x + w - 14 - 44) - (tx + 8)
            self.line(tx + 8, ry + rh / 2 - 5, [[0, 0], [lw * 0.8, 0]], Palette.STONE, 2)
            self.line(tx + 8, ry + rh / 2 + 5, [[0, 0], [lw * 0.5, 0]], Palette.LINE, 2)
            if status:
                self.ellipse(x + w - 14 - 30, ry + rh / 2 - 7, 14, 14, status, status, 1)
        self._tag_since(n0, keep=(frame,), tag="window")
        return (x, y, w, h)

    def feature_box(self, x, y, w, h, title, icon, items, *, fill=None, stroke=None, size=16, title_size=20,
                    tick=None):
        """A capability in a box: icon + title, then a list of ticked points (what it does).
        Returns (x, y, w, h)."""
        self.rect(x, y, w, h, _c(fill, "ACCENT_BG"), _c(stroke, "INK"), 2)
        isz = round(title_size * 1.6)
        cy = y + PAD + isz / 2 + 4
        self._icon(icon, x + PAD + 6 + isz / 2, cy, isz, Palette.ACCENT)
        self.text_mid(x + PAD + 6 + isz + 14, cy, title, title_size, Palette.INK)
        end = self.icon_list(x + PAD + 22, cy + isz / 2 + 14, [("check", t) for t in items], size,
                             icon_color=_c(tick, "GREEN"))
        if end > y + h - 8:
            warn(f"OVERFLOW in feature_box '{title[:30]}': content ends {end - y:.0f}px, box {h:.0f}px")
        return (x, y, w, h)

    def curve(self, x1, y1, x2, y2, start="v", color=None, sw=2, head=True, style="solid", n=10):
        """Smooth quarter-turn link from (x1, y1) to (x2, y2): leaves vertically (start='v') and arrives
        horizontally, or the reverse (start='h'). For links that go over or under the main row (an idea feeding a
        later step, a feedback loop back to the start). Arrowhead at the end unless head=False; callers keep
        ARROW_GAP to the boxes."""
        cx, cy = (x1, y2) if start == "v" else (x2, y1)
        pts = []
        for i in range(n + 1):
            t = i / n
            px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2
            py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2
            pts.append((px, py))
        rel = [[px - x1, py - y1] for px, py in pts]
        if head:
            e = self.arrow(x1, y1, x2, y2, color, sw, style, via=pts[1:-1])
        else:
            e = self.line(x1, y1, rel, _c(color, "INK"), sw, style)
        e["roundness"] = {"type": 2}
        return e

    def fan_out(self, x_from, y_from, targets, x_spine=None, color=None, sw=2, more=None, r=12):
        """One-to-many bracket: a line from (x_from, y_from) to a vertical spine, the spine spanning the targets
        with rounded ends, and an arrow from the spine to each target point (x, y) — a box's left edge minus
        ARROW_GAP. more = y of an extra open stub (no arrowhead) for "… and more". Returns x_spine."""
        color = _c(color, "INK")
        xs = x_spine if x_spine is not None else x_from + (min(t[0] for t in targets) - x_from) * 0.45
        self.line(x_from, y_from, [[0, 0], [xs - x_from, 0]], color, sw)
        ys = sorted([t[1] for t in targets] + ([more] if more is not None else []))
        top, bot = ys[0], ys[-1]
        self.line(xs, top + r, [[0, 0], [0, bot - top - 2 * r]], color, sw)
        def corner(sy, ty, tail):
            """Quarter circle from the spine at (xs, sy) into a horizontal at (xs + r, ty), then `tail` px on."""
            import math
            sign = 1 if ty > sy else -1
            pts = [(r - r * math.cos(math.radians(90 * i / 8)), sign * r * math.sin(math.radians(90 * i / 8)))
                   for i in range(9)]
            if tail:
                pts.append((r + tail, ty - sy))
            c = self.line(xs, sy, [[px, py] for px, py in pts], color, sw)
            c["roundness"] = {"type": 2}

        for tx, ty in targets:
            if ty in (top, bot) and bot - top > 2 * r:
                sy = top + r if ty == top else bot - r
                corner(sy, ty, 0)
                self.arrow(xs + r, ty, tx, ty, color, sw)
            else:
                self.arrow(xs, ty, tx, ty, color, sw)
        if more is not None:
            if more == bot and bot - top > 2 * r:
                corner(bot - r, bot, 24 - r)
            else:
                self.line(xs, more, [[0, 0], [24, 0]], color, sw)
        return xs

    # ------------------------------------------------------------ circular and matrix layouts
    def arc_arrow(self, cx, cy, r, a0, a1, color=None, sw=2, head=True, style="solid", step=6):
        """Arrow along a circle of radius r around (cx, cy), from angle a0 to a1 in degrees (clockwise on screen
        when a1 > a0). For cycles and loops drawn around a core."""
        import math
        n = max(3, int(abs(a1 - a0) / step))
        pts = [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
                cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
        x1, y1 = pts[0]
        if head:
            e = self.arrow(x1, y1, pts[-1][0], pts[-1][1], color, sw, style, via=pts[1:-1])
        else:
            e = self.line(x1, y1, [[px - x1, py - y1] for px, py in pts], _c(color, "INK"), sw, style)
        e["roundness"] = {"type": 2}
        return e

    def cycle(self, cx, cy, r, boxes, color=None, sw=2, gap=ARROW_GAP + 4, style="solid", closed=True):
        """Arc arrows between successive boxes (x, y, w, h) placed on a circle (see ring()), each arrow leaving one
        box and stopping `gap` px before the next along the circle; closed=False leaves the last-to-first arc
        out. Returns the arrows."""
        import math

        def ang(b):
            return math.degrees(math.atan2(b[1] + b[3] / 2 - cy, b[0] + b[2] / 2 - cx))

        def exit_offset(b, a, sign):
            x, y, w, h = b
            t = 0.0
            while t < 170:
                px = cx + r * math.cos(math.radians(a + sign * t))
                py = cy + r * math.sin(math.radians(a + sign * t))
                if not (x - gap <= px <= x + w + gap and y - gap <= py <= y + h + gap):
                    return t
                t += 0.5
            return t
        out = []
        pairs = list(zip(boxes, boxes[1:] + (boxes[:1] if closed else [])))
        for b0, b1 in pairs:
            a0, a1 = ang(b0), ang(b1)
            while a1 <= a0:
                a1 += 360
            s0, e1 = a0 + exit_offset(b0, a0, 1), a1 - exit_offset(b1, a1 % 360 if a1 > 180 else a1, -1)
            if e1 - s0 > 4:
                out.append(self.arc_arrow(cx, cy, r, s0, e1, color, sw, True, style))
        return out

    def matrix(self, x, y, w, h, x_axis, y_axis, quads=(), *, fill=None, stroke=None, size=15):
        """2 x 2 matrix: four quadrants (top-left, top-right, bottom-left, bottom-right) with optional titles,
        axis arrows along the left and bottom edges and their labels ("low → high" reads left to right and bottom
        to top). Returns the four quadrant boxes (x, y, w, h) in that order, for placing items."""
        qw, qh = w / 2, h / 2
        boxes = [(x, y, qw, qh), (x + qw, y, qw, qh), (x, y + qh, qw, qh), (x + qw, y + qh, qw, qh)]
        for i, (bx, by, bw, bh) in enumerate(boxes):
            self.rect(bx, by, bw, bh, _c(fill, "WHITE"), _c(stroke, "LINE"), 1, rounded=False)
            if i < len(quads) and quads[i]:
                self.text(bx + PAD, by + 12, quads[i], size, Palette.MID)
        self.arrow(x - 18, y + h + 18, x + w + 8, y + h + 18, Palette.INK, 2)
        self.arrow(x - 18, y + h + 18, x - 18, y - 8, Palette.INK, 2)
        self.text(x + w / 2, y + h + 30, x_axis, 14, Palette.INK, align="center")
        lw, lh = self._ts(y_axis, 14)
        self.text(x - 30 - lw, y + h / 2 - lh / 2, y_axis, 14, Palette.INK)
        return boxes

def hand_drawn(scene):
    """Switch a scene to the hand-drawn look (Excalifont, roughness 1). Call right after Scene(), before building.
    Widths are measured per font, so this also resets WIDEN to 1.0 (older scripts set it to 1.16 first)."""
    global WIDEN
    scene.font = FONT_HAND
    scene.roughness = 1
    _current_font[0] = FONT_HAND
    WIDEN = 1.0
    return scene
