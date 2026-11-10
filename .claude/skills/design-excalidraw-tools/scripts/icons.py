"""icons — small inline line icons (16-40 px) for cards, list bullets, labels and queue rows, built on excalikit.

Unlike doodles (large pictograms that fill an icon zone), these are glyph-sized marks that sit next to text: a
layers icon before "Product Lead", a flask as the bullet of "Test", a shield inside "Security checks".

    import sys; sys.path.insert(0, "<skill>/scripts")
    from excalikit import Scene
    import icons as I
    S = Scene()
    I.icon(S, "shield_check", 120, 80, size=24)                  # centred on (120, 80)
    w = I.icon_label(S, 40, 140, "layers", "Product Lead")       # icon then text, optically centred on y = 140

Every icon is drawn on a 24 x 24 grid (the Lucide / Feather convention: circles r = 10, squares 18 x 18, so round
and square icons look the same size) and scaled to `size`. Outlines only, one stroke weight (size / 12, at least
1.5 px), stroke colour Palette.INK unless `color` is given, no fills except tiny dots: icons sit on any card tint.
Below 30 px icons are always crisp (roughness 0), even in a hand-drawn scene: crisp marks next to hand lettering
read better than wobbly ones. Every element carries customData.doodle = "icon:<name>", so lint_scene skips the
layout checks inside an icon.

Names: see NAMES (user, users, layers, code, flask, chat, bulb, list, image, play, mic, check, cross, shield,
shield_check, brain, gear, search, doc, folder, database, cloud, mail, bell, clock, calendar, lock, key, chart, bolt,
star, heart, flag, link, globe, terminal, git, robot, rocket, target, eye, pencil, trash, plus, warning, info,
sparkle, inbox, send, refresh, filter, home).
Sizes: 16-20 px inline with 13-16 px text, 22-28 px as card or row markers, up to 40 px as a card's lead icon. For
a large illustration use doodles instead.
"""
import math

from excalikit import Palette as P

GRID = 24


def _r(v):
    return round(v * 100) / 100


class _Pen:
    """Draws on the 24-unit grid, mapped onto a size x size box centred on (cx, cy); `rot` (degrees) turns every
    line point about the grid centre (used for the diagonal icons: pencil, rocket)."""

    def __init__(self, S, name, cx, cy, size, color, sw):
        self.S, self.name, self.color, self.sw = S, name, color, sw
        self.k = size / GRID
        self.ox, self.oy = cx - size / 2, cy - size / 2
        self.size = size
        self.rough = min(2, max(0, int(round(S.roughness)))) if size >= 30 else 0
        self.rot = 0

    # -- geometry
    def p(self, x, y):
        if self.rot:
            a = math.radians(self.rot)
            dx, dy = x - 12, y - 12
            x, y = 12 + dx * math.cos(a) - dy * math.sin(a), 12 + dx * math.sin(a) + dy * math.cos(a)
        return self.ox + x * self.k, self.oy + y * self.k

    def _fix(self, e, fill="transparent"):
        """Force the icon's own stroke, so style passes (STYLE sw / outline) never make one icon heavier."""
        e["strokeColor"] = self.color
        e["strokeWidth"] = self.sw
        e["backgroundColor"] = fill
        e["fillStyle"] = "solid"
        # only the large outline of a big icon wobbles in a hand-drawn scene: small inner parts (a head, an eye,
        # a gear hub) stay crisp, a rough 10 px circle reads as a blob
        e["roughness"] = self.rough if max(e["width"], e["height"]) >= 0.6 * self.size else 0
        e["strokeStyle"] = "solid"
        e["customData"] = dict(e.get("customData") or {}, doodle="icon:" + self.name)
        return e

    # -- primitives (grid units)
    def line(self, *pts, smooth=False):
        ap = [self.p(*q) for q in pts]
        x0, y0 = ap[0]
        e = self.S.line(x0, y0, [[_r(x - x0), _r(y - y0)] for x, y in ap], self.color, self.sw)
        if smooth:
            e["roundness"] = {"type": 2}
        return self._fix(e)

    def curve(self, *pts):
        return self.line(*pts, smooth=True)

    def ellipse(self, x, y, w, h):
        """Axis-aligned ellipse (its centre follows `rot`, its axes do not)."""
        ax, ay = self.p(x + w / 2, y + h / 2)
        w, h = w * self.k, h * self.k
        e = self.S.ellipse(ax - w / 2, ay - h / 2, w, h, "transparent", self.color, self.sw)
        return self._fix(e)

    def circle(self, cx, cy, r):
        return self.ellipse(cx - r, cy - r, 2 * r, 2 * r)

    def rect(self, x, y, w, h, r=2):
        ax, ay = self.p(x, y)
        e = self.S.rect(ax, ay, w * self.k, h * self.k, "transparent", self.color, self.sw, radius=r * self.k)
        return self._fix(e)

    def dot(self, cx, cy):
        """Small solid dot (the dot of an 'i', a list bullet), sized from the stroke so it matches every icon."""
        d = self.sw * 1.2
        ax, ay = self.p(cx, cy)
        e = self.S.ellipse(ax - d / 2, ay - d / 2, d, d, self.color, self.color, 1)
        self._fix(e, fill=self.color)
        e["strokeWidth"] = 1
        e["roughness"] = 0
        return e


def _arc(cx, cy, rx, a0, a1, ry=None, step=30):
    """Points along an ellipse arc from angle a0 to a1 (degrees, screen convention: 0 = east, 90 = south)."""
    ry = rx if ry is None else ry
    n = max(2, int(math.ceil(abs(a1 - a0) / step)))
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def _corner(cx, cy, r, a0, a1):
    """Dense points of a small rounded corner, for straight polylines (crisp edges, round corners)."""
    return _arc(cx, cy, r, a0, a1, step=22.5)


def _quad(p0, c, p2, n=6):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]


# ---------------------------------------------------------------- the icons (24-unit grid)
def _user(g):
    g.circle(12, 7.5, 4)
    g.curve(*_arc(12, 21, 7.5, 180, 360, ry=7))


def _users(g):
    g.circle(9, 8, 3.6)
    g.curve(*_arc(9, 21, 6.5, 180, 360, ry=6.5))
    g.curve(*_arc(15.6, 8, 3.6, -80, 90))
    g.curve(*_arc(16.5, 21, 5.5, 292, 360, ry=6.5, step=20))


def _layers(g):
    g.line((12, 2.5), (21.5, 7.2), (12, 11.9), (2.5, 7.2), (12, 2.5))
    g.line((2.5, 12), (12, 16.7), (21.5, 12))
    g.line((2.5, 16.8), (12, 21.5), (21.5, 16.8))


def _code(g):
    g.line((7, 7), (2, 12), (7, 17))
    g.line((17, 7), (22, 12), (17, 17))
    g.line((14.3, 4), (9.7, 20))


def _flask(g):
    g.line((10, 2.8), (10, 9.4), (4.4, 19.6), (5.4, 21.4), (18.6, 21.4), (19.6, 19.6), (14, 9.4), (14, 2.8))
    g.line((8.3, 2.8), (15.7, 2.8))
    g.line((7, 15.5), (17, 15.5))


def _chat(g):
    pts = [(10.5, 17.5)] + _corner(18.5, 15, 2.5, 90, 0) + _corner(18.5, 6, 2.5, 0, -90) + \
        _corner(5.5, 6, 2.5, 270, 180) + _corner(5.5, 15, 2.5, 180, 90) + [(6.6, 17.5), (6.6, 21.2), (10.5, 17.5)]
    g.line(*pts)
    g.line((7.8, 9.6), (16.2, 9.6))
    g.line((7.8, 13), (13.2, 13))


def _bulb(g):
    cx, cy, r = 12, 9, 6.6
    glass = [(9.2, 15.6)] + _arc(cx, cy, r, 130, 410, step=35) + [(14.8, 15.6)]
    g.curve(*glass)
    g.line((9.2, 15.6), (14.8, 15.6))
    g.line((9.4, 18.6), (14.6, 18.6))
    g.line((10.6, 21.5), (13.4, 21.5))


def _list(g):
    for y in (6, 12, 18):
        g.line((8.5, y), (21, y))
        g.dot(3.8, y)


def _image(g):
    g.rect(3, 3, 18, 18, 2.5)
    g.circle(9, 9, 2)
    g.line((21, 15.2), (16.2, 10.4), (5.6, 21))


def _play(g):
    g.circle(12, 12, 10)
    g.line((9.6, 7.8), (16.4, 12), (9.6, 16.2), (9.6, 7.8))


def _mic(g):
    pts = _arc(12, 6, 3, 180, 360, step=30) + _arc(12, 12, 3, 0, 180, step=30)
    g.curve(*(pts + [pts[0]]))
    g.curve((5, 10), *_arc(12, 11.5, 7, 180, 0, step=30)[0:], (19, 10))
    g.line((12, 18.5), (12, 21.5))
    g.line((8.5, 21.5), (15.5, 21.5))


def _check(g):
    g.line((3.8, 12.6), (9.2, 18), (20.2, 6.6))


def _cross(g):
    g.line((5.5, 5.5), (18.5, 18.5))
    g.line((18.5, 5.5), (5.5, 18.5))


def _shield_path(g):
    g.curve((12, 2.4), (8.2, 4.4), (4.6, 5.2), (4.4, 12.2), (6.6, 17.4), (12, 21.6))
    g.curve((12, 2.4), (15.8, 4.4), (19.4, 5.2), (19.6, 12.2), (17.4, 17.4), (12, 21.6))


def _shield(g):
    _shield_path(g)


def _shield_check(g):
    _shield_path(g)
    g.line((8.6, 12), (11, 14.4), (15.6, 9.6))


def _chain(g, circles, start, end, centre):
    """Outline made of overlapping circles: one arc per circle, from `start` on the first circle through the outer
    cusps where consecutive circles cross, to `end` on the last one. Arcs bulge away from `centre`."""
    def cross(a, b):
        (x0, y0, r0), (x1, y1, r1) = a, b
        d = math.hypot(x1 - x0, y1 - y0)
        t = (r0 * r0 - r1 * r1 + d * d) / (2 * d)
        h = math.sqrt(max(0.0, r0 * r0 - t * t))
        mx, my = x0 + t * (x1 - x0) / d, y0 + t * (y1 - y0) / d
        two = [(mx + h * (y1 - y0) / d, my - h * (x1 - x0) / d), (mx - h * (y1 - y0) / d, my + h * (x1 - x0) / d)]
        return max(two, key=lambda q: math.hypot(q[0] - centre[0], q[1] - centre[1]))

    stops = [start] + [cross(a, b) for a, b in zip(circles, circles[1:])] + [end]
    for (x, y, r), p0, p1 in zip(circles, stops, stops[1:]):
        a0 = math.degrees(math.atan2(p0[1] - y, p0[0] - x))
        a1 = math.degrees(math.atan2(p1[1] - y, p1[0] - x))
        best = None
        for b1 in (a1, a1 + 360, a1 - 360):              # the way round that bulges outwards
            if abs(b1 - a0) >= 360:
                continue
            m = math.radians((a0 + b1) / 2)
            dist = math.hypot(x + r * math.cos(m) - centre[0], y + r * math.sin(m) - centre[1])
            if best is None or dist > best[0]:
                best = (dist, b1)
        g.curve(*_arc(x, y, r, a0, best[1], step=30))


def _brain(g):
    # each hemisphere is a chain of lobes meeting in small cusps, joined by the midline
    left = [(9.2, 5.8, 3.3), (6.7, 10, 3.4), (6.9, 15, 3.4), (9.6, 18, 2.6)]
    (x0, y0, r0), (x1, y1, r1) = left[0], left[-1]
    top = y0 - math.sqrt(r0 * r0 - (12 - x0) ** 2)
    bottom = y1 + math.sqrt(r1 * r1 - (12 - x1) ** 2)
    _chain(g, left, (12, top), (12, bottom), (12, 12))
    _chain(g, [(24 - x, y, r) for x, y, r in left], (12, top), (12, bottom), (12, 12))
    g.line((12, top), (12, bottom))
    g.curve((6.4, 13.2), (8.4, 12.6), (9.2, 10.8))
    g.curve((17.6, 13.2), (15.6, 12.6), (14.8, 10.8))


def _gear(g):
    pts = []
    n, ro, ri = 8, 10, 7.2
    for i in range(n):
        a = i * 360 / n - 90
        for da, rr in ((-13, ri), (-8, ro), (8, ro), (13, ri)):
            t = math.radians(a + da)
            pts.append((12 + rr * math.cos(t), 12 + rr * math.sin(t)))
        t = math.radians(a + 22.5)
        pts.append((12 + ri * math.cos(t), 12 + ri * math.sin(t)))
    g.line(*(pts + [pts[0]]))
    g.circle(12, 12, 3.2)


def _search(g):
    g.circle(10.6, 10.6, 7.4)
    g.line((16, 16), (21, 21))


def _doc(g):
    pts = [(14, 2.5), (19.5, 8)] + _corner(17.5, 19.5, 2, 0, 90) + _corner(6.5, 19.5, 2, 90, 180) + \
        _corner(6.5, 4.5, 2, 180, 270) + [(14, 2.5)]
    g.line(*pts)
    g.line((14, 2.6), (14, 8), (19.4, 8))
    g.line((8.5, 13), (15.5, 13))
    g.line((8.5, 17), (15.5, 17))
    g.line((8.5, 9), (10.5, 9))


def _folder(g):
    pts = _corner(4.5, 18, 2, 90, 180) + _corner(4.5, 5, 2, 180, 270) + [(8.6, 3), (10.6, 5.8)] + \
        _corner(19.5, 7.8, 2, 270, 360) + _corner(19.5, 18, 2, 0, 90)
    g.line(*(pts + [pts[0]]))


def _database(g):
    g.ellipse(3, 2.5, 18, 6)
    g.line((3, 5.5), (3, 18.5))
    g.line((21, 5.5), (21, 18.5))
    g.curve(*_arc(12, 18.5, 9, 180, 0, ry=3))
    g.curve(*_arc(12, 12, 9, 180, 0, ry=3))


def _cloud(g):
    # three bumps on a flat base
    y = 19
    bumps = [(6.9, y - 4.3, 4.3), (12.2, y - 8.6, 5.8), (17.4, y - 4.3, 4.3)]
    _chain(g, bumps, (6.9, y), (17.4, y), (12, y - 3))
    g.line((6.9, y), (17.4, y))


def _mail(g):
    g.rect(2.5, 4.5, 19, 15, 2.5)
    g.line((3, 7.2), (12, 13.2), (21, 7.2))


def _bell(g):
    body = [(3.4, 17.2)] + [(5.5, 14.6), (6, 11.2)] + _arc(12, 8.8, 6, 180, 360, step=36) + \
        [(18, 11.2), (18.5, 14.6), (20.6, 17.2)]
    g.curve(*body)
    g.line((3.4, 17.2), (20.6, 17.2))
    g.curve(*_arc(12, 19.2, 2.5, 25, 155, step=32))


def _clock(g):
    g.circle(12, 12, 10)
    g.line((12, 6.2), (12, 12), (15.8, 14.2))


def _calendar(g):
    g.rect(3, 4.5, 18, 17, 2.5)
    g.line((3, 10), (21, 10))
    g.line((8, 2.5), (8, 6.5))
    g.line((16, 2.5), (16, 6.5))


def _lock(g):
    g.rect(4, 11, 16, 11, 2.5)
    g.curve((7.5, 11), *_arc(12, 7, 4.5, 180, 360, step=30), (16.5, 11))
    g.line((12, 15.2), (12, 17.6))


def _key(g):
    g.circle(7.6, 16.4, 5.2)
    g.line((11.3, 12.7), (21.4, 2.6))
    g.line((18.4, 5.6), (21.2, 8.4))
    g.line((15.1, 8.9), (17.6, 11.4))


def _chart(g):
    g.line((3, 3), (3, 21), (21, 21))
    g.line((8, 17), (8, 13.5))
    g.line((13, 17), (13, 6.5))
    g.line((18, 17), (18, 10))


def _bolt(g):
    g.line((13, 2), (3.5, 13.8), (12, 13.8), (11, 22), (20.5, 10.2), (12, 10.2), (13, 2))


def _star(g):
    pts = []
    for i in range(10):
        a = math.radians(-90 + i * 36)
        r = 10.2 if i % 2 == 0 else 4.3
        pts.append((12 + r * math.cos(a), 12.9 + r * math.sin(a)))
    g.line(*(pts + [pts[0]]))


def _heart(g):
    left = [(12, 20.8), (8.4, 17.3), (4.9, 13.9)] + _arc(7.4, 8.9, 5.2, 150, 300, step=30) + [(12, 5.4)]
    g.curve(*left)
    g.curve(*[(24 - x, y) for x, y in left])


def _flag(g):
    g.line((4.5, 21.5), (4.5, 3.2))
    g.curve((4.5, 3.5), (8.2, 2.4), (12.2, 3.8), (16.4, 4.9), (19.8, 3.9))
    g.line((19.8, 3.9), (19.8, 14))
    g.curve((19.8, 14), (16.4, 15), (12.2, 13.9), (8.2, 12.5), (4.5, 13.6))


def _link(g):
    g.curve((9.5, 17), (7, 17), *_arc(7, 12, 5, 90, 270, step=30)[1:-1], (7, 7), (9.5, 7))
    g.curve((14.5, 7), (17, 7), *_arc(17, 12, 5, -90, 90, step=30)[1:-1], (17, 17), (14.5, 17))
    g.line((8, 12), (16, 12))


def _globe(g):
    g.circle(12, 12, 10)
    g.ellipse(7.4, 2, 9.2, 20)
    g.line((2, 12), (22, 12))


def _terminal(g):
    g.rect(2.5, 3.5, 19, 17, 2.5)
    g.line((7, 9), (10.4, 12), (7, 15))
    g.line((12.6, 15.4), (17, 15.4))


def _git(g):
    g.line((6, 3), (6, 15))
    g.circle(18, 6, 3)
    g.circle(6, 18, 3)
    g.curve(*_arc(9, 9, 9, 0, 90, step=22.5))


def _robot(g):
    g.rect(4, 8, 16, 12.5, 3)
    g.line((12, 8), (12, 4.6))
    g.circle(12, 3.6, 1.3)
    g.line((2, 13), (2, 16))
    g.line((22, 13), (22, 16))
    g.line((9, 13), (9, 15.2))
    g.line((15, 13), (15, 15.2))


def _rocket(g):
    g.rot = 45
    g.curve((9.2, 16.6), (8.8, 11.6), (9.6, 6.9), (12, 2.2), (14.4, 6.9), (15.2, 11.6), (14.8, 16.6))
    g.line((9.2, 16.6), (14.8, 16.6))
    g.line((9, 11.6), (6, 14.8), (6, 18.6), (9.1, 16.6))
    g.line((15, 11.6), (18, 14.8), (18, 18.6), (14.9, 16.6))
    g.circle(12, 9.6, 1.9)
    g.line((12, 19), (12, 22))


def _target(g):
    g.circle(12, 12, 10)
    g.circle(12, 12, 6)
    g.dot(12, 12)


def _eye(g):
    g.curve((2, 12), (5.2, 7.6), (12, 5), (18.8, 7.6), (22, 12))
    g.curve((2, 12), (5.2, 16.4), (12, 19), (18.8, 16.4), (22, 12))
    g.circle(12, 12, 3.2)


def _pencil(g):
    g.rot = 45
    top = _arc(12, 3.8, 2.7, 180, 360, step=45)
    g.line((12, 23), (9.3, 17.4), *[(9.3, 3.8)], *top[1:-1], (14.7, 3.8), (14.7, 17.4), (12, 23))
    g.line((9.3, 17.4), (14.7, 17.4))
    g.line((9.3, 6.4), (14.7, 6.4))


def _trash(g):
    g.line((3, 6.3), (21, 6.3))
    g.line((5.4, 6.5), (6.4, 19.6), (8.2, 21.4), (15.8, 21.4), (17.6, 19.6), (18.6, 6.5))
    g.line((8.8, 6.2), (8.8, 4), (10.2, 2.6), (13.8, 2.6), (15.2, 4), (15.2, 6.2))
    g.line((10, 10.6), (10, 17))
    g.line((14, 10.6), (14, 17))


def _plus(g):
    g.line((12, 4.5), (12, 19.5))
    g.line((4.5, 12), (19.5, 12))


def _warning(g):
    g.line((12, 2.8), (22, 20.2), (2, 20.2), (12, 2.8))
    g.line((12, 9), (12, 13.6))
    g.dot(12, 16.9)


def _info(g):
    g.circle(12, 12, 10)
    g.line((12, 11), (12, 16.6))
    g.dot(12, 7.6)


def _sparkle_pts(cx, cy, r, bulge=0.16):
    tips = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    pts = []
    for i in range(4):
        a, b = tips[i], tips[(i + 1) % 4]
        mx, my = (a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy
        c = (cx + mx * bulge * 2, cy + my * bulge * 2)
        pts += _quad(a, c, b)[:-1]
    return pts + [pts[0]]


def _sparkle(g):
    g.line(*_sparkle_pts(10.2, 13.4, 8.6))
    g.line(*_sparkle_pts(19, 5, 3.2, bulge=0.2))


def _inbox(g):
    g.line((2.5, 12.5), (8.2, 12.5), (10, 15.5), (14, 15.5), (15.8, 12.5), (21.5, 12.5))
    pts = [(2.5, 12.5), (5.8, 4.5), (18.2, 4.5), (21.5, 12.5)] + _corner(19.5, 18, 2, 0, 90) + \
        _corner(4.5, 18, 2, 90, 180) + [(2.5, 12.5)]
    g.line(*pts)


def _send(g):
    g.line((21.5, 2.5), (14.8, 21.5), (11, 13), (2.5, 9.2), (21.5, 2.5))
    g.line((21.5, 2.5), (11, 13))


def _refresh(g):
    g.curve(*_arc(12, 12, 9, 180, 315, step=27), (21, 8))
    g.line((21, 3), (21, 8), (16, 8))
    g.curve(*_arc(12, 12, 9, 0, 135, step=27), (3, 16))
    g.line((8, 16), (3, 16), (3, 21))


def _filter(g):
    g.line((21.5, 3.5), (2.5, 3.5), (10, 12.4), (10, 19), (14, 21), (14, 12.4), (21.5, 3.5))


def _home(g):
    g.line((3, 10.2), (12, 2.8), (21, 10.2), (21, 21), (3, 21), (3, 10.2))
    g.line((9.5, 21), (9.5, 14.4), (14.5, 14.4), (14.5, 21))


_ICONS = {
    "user": _user, "users": _users, "layers": _layers, "code": _code, "flask": _flask, "chat": _chat, "bulb": _bulb,
    "list": _list, "image": _image, "play": _play, "mic": _mic, "check": _check, "cross": _cross, "shield": _shield,
    "shield_check": _shield_check, "brain": _brain, "gear": _gear, "search": _search, "doc": _doc,
    "folder": _folder, "database": _database, "cloud": _cloud, "mail": _mail, "bell": _bell, "clock": _clock,
    "calendar": _calendar, "lock": _lock, "key": _key, "chart": _chart, "bolt": _bolt, "star": _star,
    "heart": _heart, "flag": _flag, "link": _link, "globe": _globe, "terminal": _terminal, "git": _git,
    "robot": _robot, "rocket": _rocket, "target": _target, "eye": _eye, "pencil": _pencil, "trash": _trash,
    "plus": _plus, "warning": _warning, "info": _info, "sparkle": _sparkle, "inbox": _inbox, "send": _send,
    "refresh": _refresh, "filter": _filter, "home": _home,
}
NAMES = tuple(_ICONS)


def stroke_for(size):
    """Default stroke width of an icon of this size: size / 12, at least 1.5, rounded to 0.5."""
    return round(max(1.5, size / 12) * 2) / 2


def icon(S, name, cx, cy, size=22, color=None, sw=None):
    """Draw icon `name` centred on (cx, cy), fitting a size x size box. Returns size."""
    fn = _ICONS.get(name)
    if fn is None:
        raise ValueError(f"unknown icon {name!r}; available: {', '.join(NAMES)}")
    g = _Pen(S, name, cx, cy, size, color or P.INK, sw or stroke_for(size))
    fn(g)
    return size


def icon_label(S, x, cy, name, label, size=16, icon_size=None, color=None, gap=8):
    """Icon then text on one line, both optically centred on cy, starting at x (the icon's left edge). The text
    takes `size` and the scene's style font; the icon defaults to 1.25 x the text size. Returns the total width."""
    isz = icon_size or round(size * 1.25)
    icon(S, name, x + isz / 2, cy, isz, color)
    tx = x + isz + gap
    S.text_mid(tx, cy, label, size, color or P.INK)
    return isz + gap + S.text_size(label, size)[0]
