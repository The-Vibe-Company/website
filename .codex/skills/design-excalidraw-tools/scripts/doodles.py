"""doodles — small hand-drawable pictograms for illustrated explainers, built on excalikit.

Every doodle takes the scene and a bounding box (x, y, w, h); it keeps its own proportions, is centred in the box and
scales with it, so a grid of icon zones gives icons of equal visual size. Strokes use Palette.INK, surfaces
Palette.WHITE, marks Palette.ACCENT unless a colour is passed. They look best in the hand-drawn style
(excalikit.hand_drawn) but also work clean.

    import sys; sys.path.insert(0, "<skill>/scripts")
    from excalikit import Scene, hand_drawn
    import doodles as D
    S = hand_drawn(Scene())
    D.bubble(S, 40, 40, 140, 120, mark="?")
    D.page_stack(S, 220, 40, 140, 120); D.magnifier(S, 300, 90, 70, 70)

Doodles: bubble, page, page_stack, magnifier, check, cross, robot, person, database, bulb, clock, envelope, cloud,
answer (reply card with source tags), bars (tiny bar chart), gear-free on purpose (gears read as noise when small).
Decorations: badge (number disc meant to straddle a card corner), curvy_arrow, underline (hand underline for a title).
Keep doodles inside their card's icon zone, at least PAD from the card edge; one doodle (or one small scene of two or
three) per card. Doodles carry meaning: draw the thing the step talks about, not decoration.
"""
from excalikit import Palette as P, PAD

HIGHLIGHT = "#ffd43b"   # marker-pen yellow for highlighted lines
CHEEK = "#ffa8a8"


def set_mood(mood):
    """Match the marker colours to the style's colour mood: 'mono' turns the yellow marker and pink cheeks grey."""
    global HIGHLIGHT, CHEEK
    if mood == "mono":
        HIGHLIGHT, CHEEK = "#d4d4d4", "#e0e0e0"
    elif _lum(P.CANVAS) < 0.2:                       # dark palettes: markers must not outshine the accent
        HIGHLIGHT, CHEEK = P.ACCENT_SOFT, P.STONE
    else:
        HIGHLIGHT, CHEEK = "#ffd43b", "#ffa8a8"


def _lum(c):
    c = c.lstrip("#")
    r, g, b = (int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4  # noqa: E731
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def readable_on(fill):
    """Ink or surface colour, whichever reads better on `fill` (works for light and dark palettes)."""
    a, b = P.INK, P.WHITE
    def ratio(x, y):
        hi, lo = max(_lum(x), _lum(y)), min(_lum(x), _lum(y))
        return (hi + 0.05) / (lo + 0.05)
    return a if ratio(a, fill) >= ratio(b, fill) else b


def _tagged(fn):
    """Mark every element a pictogram adds with customData.doodle, so lint_scene skips its layout checks on them."""
    import functools

    @functools.wraps(fn)
    def wrap(S, *a, **kw):
        n = len(S.els)
        out = fn(S, *a, **kw)
        for e in S.els[n:]:
            e["customData"] = dict(e.get("customData") or {}, doodle=fn.__name__)
        return out
    return wrap


class _Frame:
    """Maps a doodle's reference coordinates (rw x rh) onto the box (x, y, w, h), keeping proportions."""

    def __init__(self, x, y, w, h, rw, rh):
        self.k = min(w / rw, h / rh)
        self.ox = x + (w - rw * self.k) / 2
        self.oy = y + (h - rh * self.k) / 2

    def p(self, px, py):
        return self.ox + px * self.k, self.oy + py * self.k

    def s(self, v):
        return v * self.k


def _smooth(e):
    e["roundness"] = {"type": 2}
    return e


def _poly(S, f, pts, color=None, sw=2, fill=None, smooth=False):
    """Polyline through reference points; closed polygons (first == last) can be filled."""
    ap = [f.p(*q) for q in pts]
    x0, y0 = ap[0]
    e = S.line(x0, y0, [[px - x0, py - y0] for px, py in ap], color or P.INK, sw)
    if fill:
        e["backgroundColor"] = fill
        e["fillStyle"] = "solid"
    return _smooth(e) if smooth else e


def _ell(S, f, x, y, w, h, fill=None, stroke=None, sw=2):
    ax, ay = f.p(x, y)
    return S.ellipse(ax, ay, f.s(w), f.s(h), fill or P.WHITE, stroke or P.INK, sw)


def _rect(S, f, x, y, w, h, fill=None, stroke=None, sw=2, rounded=False, radius=None):
    ax, ay = f.p(x, y)
    r = None if radius is None else f.s(radius)
    return S.rect(ax, ay, f.s(w), f.s(h), fill or P.WHITE, stroke or P.INK, sw, rounded=rounded, radius=r)


def _no_stroke(e):
    e["strokeColor"] = "transparent"
    return e


# ---------------------------------------------------------------- pictograms
@_tagged
def bubble(S, x, y, w, h, mark="?", mark_color=None, tail="left", fill=None):
    """Speech bubble with a big mark ("?", "!", "…") or None. tail: 'left' or 'right'."""
    f = _Frame(x, y, w, h, 140, 125)
    t = [(36, 84), (12, 122), (62, 92), (36, 84)] if tail == "left" else [(104, 84), (128, 122), (78, 92), (104, 84)]
    _poly(S, f, t, fill=fill or P.WHITE)
    _ell(S, f, 0, 0, 140, 95, fill)
    if mark:
        size = round(f.s(56))
        cx, cy = f.p(70, 47)
        S.text_mid(cx, cy, mark, size, mark_color or P.ACCENT, align="center")


@_tagged
def page(S, x, y, w, h, lines=5, highlight=(), fill=None, mark=None):
    """A sheet with text lines; `highlight` = indexes of lines under a yellow marker; mark='check' adds a tick."""
    f = _Frame(x, y, w, h, 100, 130)
    _rect(S, f, 0, 0, 100, 130, fill)
    step = 96 / max(lines, 1)
    for i in range(lines):
        ly = 22 + i * step
        right = 86 - (i % 3) * 12
        if i in highlight:
            _no_stroke(_rect(S, f, 10, ly - 6, 80, 12, HIGHLIGHT, HIGHLIGHT, 1))
        _poly(S, f, [(14, ly), (right, ly)], P.MID, 1)
    if mark == "check":
        check(S, *f.p(62, 92), f.s(30))


@_tagged
def page_stack(S, x, y, w, h, n=3, lines=4, fill=None):
    """A small pile of sheets, the front one with text lines."""
    f = _Frame(x, y, w, h, 92 + 12 * (n - 1), 108 + 11 * (n - 1))
    for i in range(n):
        _rect(S, f, 12 * i, 11 * (n - 1 - i), 92, 108, fill)
    fx = 12 * (n - 1)
    for i in range(lines):
        ly = 24 + i * 16
        _poly(S, f, [(fx + 14, ly), (fx + 78 - (i % 2) * 18, ly)], P.MID, 1)


@_tagged
def magnifier(S, x, y, w, h, lens=None):
    """Magnifying glass; lens = tint of the glass (default cat1 soft)."""
    f = _Frame(x, y, w, h, 90, 90)
    _poly(S, f, [(52, 52), (86, 86)], P.INK, max(3, f.s(7)))
    e = _ell(S, f, 0, 0, 62, 62, lens or getattr(P, "BLUE_SOFT", P.WHITE), P.INK, 3)
    e["fillStyle"] = "hachure"


@_tagged
def check(S, x, y, size, color=None, sw=3):
    """Hand tick whose box is (x, y, size, size)."""
    f = _Frame(x, y, size, size, 30, 30)
    _poly(S, f, [(2, 16), (11, 26), (28, 4)], color or getattr(P, "GREEN", P.INK), sw)


@_tagged
def cross(S, x, y, size, color=None, sw=3):
    f = _Frame(x, y, size, size, 30, 30)
    c = color or getattr(P, "RED", P.INK)
    _poly(S, f, [(4, 4), (26, 26)], c, sw)
    _poly(S, f, [(26, 4), (4, 26)], c, sw)


@_tagged
def robot(S, x, y, w, h, antenna=None):
    """Friendly robot head: the 'AI' / 'model' / 'bot'."""
    f = _Frame(x, y, w, h, 110, 110)
    _poly(S, f, [(55, 30), (55, 12)], P.INK, 2)
    _ell(S, f, 48, 0, 14, 14, antenna or P.ACCENT)
    _rect(S, f, 10, 30, 90, 76, rounded=True, radius=16)
    _ell(S, f, 32, 52, 14, 14, P.INK)
    _ell(S, f, 64, 52, 14, 14, P.INK)
    _poly(S, f, [(40, 84), (55, 92), (70, 84)], P.INK, 2, smooth=True)
    _no_stroke(_ell(S, f, 20, 74, 12, 8, CHEEK, CHEEK, 1))
    _no_stroke(_ell(S, f, 78, 74, 12, 8, CHEEK, CHEEK, 1))


@_tagged
def person(S, x, y, w, h, fill=None):
    """Head and shoulders: a user, a customer, 'you'."""
    f = _Frame(x, y, w, h, 64, 80)
    _rect(S, f, 4, 40, 56, 40, fill or P.PAPER, rounded=True, radius=18)
    _ell(S, f, 17, 4, 30, 30, fill or P.WHITE)


@_tagged
def database(S, x, y, w, h, fill=None):
    """Cylinder: a database, a store, 'the documents'."""
    fill = fill or P.WHITE
    f = _Frame(x, y, w, h, 90, 110)
    _ell(S, f, 0, 84, 90, 24, fill)
    _no_stroke(_rect(S, f, 0, 12, 90, 84, fill, fill, 1))
    _poly(S, f, [(0, 12), (0, 96)], P.INK, 2)
    _poly(S, f, [(90, 12), (90, 96)], P.INK, 2)
    _poly(S, f, [(0, 52), (22, 61), (45, 64), (68, 61), (90, 52)], P.INK, 2, smooth=True)
    _ell(S, f, 0, 0, 90, 24, fill)


@_tagged
def bulb(S, x, y, w, h, glass=None):
    """Light bulb with rays: an idea, an insight."""
    f = _Frame(x, y, w, h, 110, 120)
    for a, b in (((55, 2), (55, 12)), ((14, 18), (22, 26)), ((96, 18), (88, 26)), ((2, 54), (12, 54)),
                 ((108, 54), (98, 54))):
        _poly(S, f, [a, b], P.INK, 2)
    _rect(S, f, 40, 86, 30, 26, P.PAPER, rounded=True, radius=6)
    _ell(S, f, 22, 22, 66, 70, glass or HIGHLIGHT)


@_tagged
def clock(S, x, y, w, h, fill=None):
    """Clock face at ten past ten: time, waiting, a schedule."""
    f = _Frame(x, y, w, h, 90, 90)
    _ell(S, f, 0, 0, 90, 90, fill)
    for px, py in ((45, 8), (82, 45), (45, 82), (8, 45)):
        _ell(S, f, px - 3, py - 3, 6, 6, P.INK, P.INK, 1)
    _poly(S, f, [(45, 45), (45, 18)], P.INK, 3)
    _poly(S, f, [(45, 45), (66, 54)], P.ACCENT, 3)


@_tagged
def envelope(S, x, y, w, h, fill=None):
    """Envelope: a message, an e-mail, a notification."""
    f = _Frame(x, y, w, h, 120, 80)
    _rect(S, f, 0, 0, 120, 80, fill, rounded=True, radius=6)
    _poly(S, f, [(4, 6), (60, 46), (116, 6)], P.INK, 2)


@_tagged
def cloud(S, x, y, w, h, fill=None):
    """Cloud: the internet, a hosted service. Outlines first, fills on top, so inner overlaps disappear."""
    fill = fill or P.WHITE
    f = _Frame(x, y, w, h, 140, 80)
    blobs = [(0, 34, 52, 44), (24, 10, 56, 56), (62, 0, 56, 56), (92, 30, 48, 48), (28, 40, 84, 40)]
    for b in blobs:
        _ell(S, f, *b, fill)
    inset = 2.5 / f.k
    for bx, by, bw, bh in blobs:
        _no_stroke(_ell(S, f, bx + inset, by + inset, bw - 2 * inset, bh - 2 * inset, fill, fill, 1))


@_tagged
def bars(S, x, y, w, h, values=(0.45, 0.7, 0.55, 0.95), color=None):
    """Tiny bar chart pictogram (not a data chart): a report, a dashboard, results."""
    f = _Frame(x, y, w, h, 110, 90)
    _poly(S, f, [(4, 2), (4, 86), (108, 86)], P.INK, 2)
    bw = 18
    for i, v in enumerate(values[:4]):
        bh = 76 * v
        _rect(S, f, 16 + i * 24, 86 - bh, bw, bh, color or P.ACCENT_SOFT, P.INK, 2)


@_tagged
def answer(S, x, y, w, h, tags=("source 1", "source 2"), tag_fill=None, lines=3, fill=None):
    """Reply card (speech-bubble rectangle) with text lines and small source tags. Tags share a row when they fit,
    otherwise they stack; the card grows to hold them and the whole doodle stays inside (x, y, w, h)."""
    from excalikit import text_size, CHIP_PX
    size = 12 if h < 110 else 13
    tag_w = [S.text_size(t, size)[0] + 2 * CHIP_PX for t in tags]
    ch = S.chip_height(size)
    inner = w - 24
    rows = [[0]] if tags else []
    for i in range(1, len(tags)):
        row_w = sum(tag_w[j] for j in rows[-1]) + 8 * len(rows[-1]) + tag_w[i]
        if row_w <= inner:
            rows[-1].append(i)
        else:
            rows.append([i])
    tail = 22
    tags_h = len(rows) * (ch + 6) + 10
    while lines > 1 and 12 + lines * 12 + tags_h > h - tail:
        lines -= 1                                   # make room for the tags before anything overflows
    lines_h = 12 + lines * 12
    bh = lines_h + tags_h
    if bh > h - tail:
        from excalikit import warn
        warn(f"answer(): tags need {bh + tail:.0f}px, box is {h:.0f}px high — shorten the tags or enlarge the box")
    ty0 = y + (h - bh - tail) / 2
    S.line(x + w - 56, ty0 + bh - 2, [[0, 0], [22, tail], [26, 0], [0, 0]], P.INK, 2).update(
        backgroundColor=fill or P.WHITE, fillStyle="solid")
    S.rect(x, ty0, w, bh, fill or P.WHITE, P.INK, 2, radius=14)
    for i in range(lines):
        ly = ty0 + 16 + i * 12
        S.line(x + 16, ly, [[0, 0], [w - 34 - i * 0.18 * w, 0]], P.MID, 1)
    cy = ty0 + lines_h + 6
    for r in rows:
        cx = x + 12
        for i in r:
            S.chip(cx, cy, tags[i], tag_fill or getattr(P, "GREEN_SOFT", P.PAPER), P.INK, P.INK, size)
            cx += tag_w[i] + 8
        cy += ch + 6


# ---------------------------------------------------------------- decorations
def badge(S, cx, cy, n, fill=None, d=44, color=None):
    """Number disc centred on (cx, cy), typically a card's top-left corner so it straddles it. The number takes ink or
    surface colour, whichever contrasts more with the fill (white on yellow would be unreadable)."""
    fill = fill or P.ACCENT_SOFT
    S.ellipse(cx - d / 2, cy - d / 2, d, d, fill, P.INK, 2)
    S.text_mid(cx, cy, str(n), round(d * 0.55), color or readable_on(fill), align="center")
    return d


def curvy_arrow(S, x1, y1, x2, y2, bend=-16, color=None, sw=3):
    """Gently arched arrow from (x1, y1) to (x2, y2); bend < 0 arches upwards. Leave ARROW_GAP to the boxes."""
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + bend
    e = S.arrow(x1, y1, x2, y2, color or P.INK, sw, via=[(mx, my)])
    return _smooth(e)


def underline(S, x, y, w, color=None, sw=3):
    """Hand underline under a title, slightly wavy; place it 4–8 px under the text box."""
    pts = [[0, 0], [w * 0.33, 4], [w * 0.7, -2], [w, 3]]
    return _smooth(S.line(x, y, pts, color or P.ACCENT, sw))


def icon_zone(card_x, card_y, card_w, top=None, height=130):
    """The icon area of an illustrated card: full card width minus PAD*2, starting under the badge."""
    top = card_y + 30 if top is None else top
    return card_x + PAD * 2, top, card_w - PAD * 4, height
