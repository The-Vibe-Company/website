"""lint_scene — static checks on an .excalidraw file before publishing.

    python lint_scene.py diagram.excalidraw [--max-words 40] [--max-colors 12] [--strict] [--taste] [--json]

Errors (exit 1): text overflowing the smallest box that contains its top-left corner; two texts overlapping;
text crossing a box edge; a square (or less rounded) shape poking out of a rounded corner by 2 px or more.

Warnings: arrows crossing a label, tiny fonts, too many words in a box, too many stroke colours (tints included),
mixed font families, and the geometry checks below.

Geometry checks (always on):
  corner     a non-rounded or less-rounded shape inside a rounded rectangle pokes out of its corner zone
             (Excalidraw adaptive radius: r = 0.25 * min(w, h), capped at 32)
  arrow-end  an arrow starts or ends inside a text or a badge / chip
  arrowhead  an arrowhead overlaps a box border (tip past the border, inside the box)
  contrast   text / background contrast below WCAG AA (4.5:1 under 24 px, 3:1 from 24 px), background = the fill of
             the shape the text sits on
  orphan     a small group of elements far away from the rest of the diagram
Strict-only checks (--strict, noisier, for a final polish pass):
  near-miss  edges 1-3 px apart: align them or separate them clearly
  rhythm     uneven gaps between siblings of a row or column; same-style boxes of slightly different sizes
  padding    text closer than 8 px to the edge of its box
  touch      an arrowhead tip touching a box border with no gap
Taste checks (--taste, art direction; page checks need the signature page rect, customData.decor = "page"):
  hero, type-scale, title, min-text, margin, balance, dead band, colour budget, legend (soft note).

Each geometry finding ends with a crop hint ("crop x,y,w,h") to pass to render_scene.mjs --crop for a zoomed look.
Widths come from the file (estimated by the generator), so a pass is necessary, not sufficient: always look at a
real render too.
"""
import argparse
import colorsys
import json
import math
import statistics
import sys

SHAPES = ("rectangle", "ellipse", "diamond", "image")
HEAD_LEN = 24          # how far back an Excalidraw arrowhead reaches from its tip

# taste thresholds (--taste)
HERO_RATIO = 2.5       # a tagged hero is at least this many times the largest other block
FOCAL_RATIO = 2.0      # untagged: the largest block is at least this many times the median block
BADGE_MAX = 60         # shapes this small (badges, dots, swatches) are not blocks
MAX_TYPE_SIZES = 5     # distinct font sizes (voice excluded)
TITLE_RATIO = 2.0      # largest text vs median text size
MARGIN_SLACK = 0.6     # content closer than margin * this to the page edge is flagged
BALANCE_RATIO = 2.2    # opposite margins differing by more than this ratio...
BALANCE_PX = 60        # ...and by more than this many px
BAND_CELL = 10         # grid cell (px) for the dead-band and fill-share rasters
BAND_INFLATE = 12      # content boxes are inflated by this before rasterising
BAND_SHARE = 0.22      # an empty full-width / full-height band larger than this share of the content area
SAT_MIN, LIGHT_MIN, LIGHT_MAX = 0.35, 0.2, 0.85      # a "saturated" colour (HSL)
HUE_STEP = 30          # hue family width in degrees
MAX_HUES = 4           # saturated hue families allowed
SAT_FILL_SHARE = 0.18  # share of the page covered by saturated fills (hero excluded)
SWATCH_MAX = 28        # legend swatch size


def is_decor(e):
    """Purely decorative copies (sticker shadows): no check applies to them."""
    return (e.get("customData") or {}).get("decor") is not None


def is_doodle(e):
    """Parts of a pictogram drawn by doodles.py: their shapes overlap and nest on purpose, so the layout checks
    (near-miss, rhythm) leave them alone. Overflow, contrast and corner checks still apply."""
    return bool((e.get("customData") or {}).get("doodle"))


def bbox(e):
    if e["type"] in ("arrow", "line", "freedraw") and e.get("points"):
        xs = [e["x"] + p[0] for p in e["points"]]
        ys = [e["y"] + p[1] for p in e["points"]]
        return min(xs), min(ys), max(xs), max(ys)
    x, y, w, h = e["x"], e["y"], e.get("width", 0), e.get("height", 0)
    return min(x, x + w), min(y, y + h), max(x, x + w), max(y, y + h)


def inside(pt, b, pad=0):
    return b[0] - pad <= pt[0] <= b[2] + pad and b[1] - pad <= pt[1] <= b[3] + pad


def overlap(a, b, margin=0):
    return not (a[2] - margin <= b[0] or b[2] - margin <= a[0] or a[3] - margin <= b[1] or b[3] - margin <= a[1])


def inter_area(a, b):
    w = min(a[2], b[2]) - max(a[0], b[0])
    h = min(a[3], b[3]) - max(a[1], b[1])
    return w * h if w > 0 and h > 0 else 0


def area(b):
    return max(0.0, b[2] - b[0]) * max(0.0, b[3] - b[1])


def seg_hits_box(p, q, b):
    """Axis-aligned segment (elbow arrows) against a box, conservative for diagonals via sampling."""
    steps = 24
    for i in range(steps + 1):
        x = p[0] + (q[0] - p[0]) * i / steps
        y = p[1] + (q[1] - p[1]) * i / steps
        if b[0] + 2 < x < b[2] - 2 and b[1] + 2 < y < b[3] - 2:
            return True
    return False


# ------------------------------------------------------------------ geometry helpers
def radius(e):
    """Corner radius as Excalidraw draws it."""
    rd = e.get("roundness")
    if e["type"] != "rectangle" or not rd:
        return 0.0
    m = min(abs(e.get("width", 0)), abs(e.get("height", 0)))
    if rd.get("type") == 3:                          # adaptive
        fixed = rd.get("value") or 32
        return m * 0.25 if m <= fixed / 0.25 else fixed
    return m * 0.25                                  # proportional (legacy)


def sd_shape(px, py, e):
    """Signed distance from a point to the outline of a shape (negative inside). Approximate for ellipses/diamonds."""
    b = bbox(e)
    cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    hx, hy = (b[2] - b[0]) / 2, (b[3] - b[1]) / 2
    if e["type"] == "ellipse" and hx > 0 and hy > 0:
        k = math.hypot((px - cx) / hx, (py - cy) / hy)
        return (k - 1) * min(hx, hy)
    if e["type"] == "diamond" and hx > 0 and hy > 0:
        k = abs(px - cx) / hx + abs(py - cy) / hy
        return (k - 1) * (hx * hy) / math.hypot(hx, hy)
    r = min(radius(e), hx, hy)
    qx, qy = abs(px - cx) - hx + r, abs(py - cy) - hy + r
    return math.hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - r


def frange(a, b, step):
    n = max(1, int((b - a) / step))
    return [a + (b - a) * i / n for i in range(n + 1)] if b > a else []


def outline(e, step=6.0):
    """Points along the drawn outline of a shape."""
    b = bbox(e)
    w, h = b[2] - b[0], b[3] - b[1]
    if e["type"] == "ellipse":
        n = 72
        return [((b[0] + b[2]) / 2 + w / 2 * math.cos(2 * math.pi * i / n),
                 (b[1] + b[3]) / 2 + h / 2 * math.sin(2 * math.pi * i / n)) for i in range(n)]
    pts = []
    if e["type"] == "diamond":
        vs = [((b[0] + b[2]) / 2, b[1]), (b[2], (b[1] + b[3]) / 2), ((b[0] + b[2]) / 2, b[3]), (b[0], (b[1] + b[3]) / 2)]
        for (x1, y1), (x2, y2) in zip(vs, vs[1:] + vs[:1]):
            n = max(2, int(math.hypot(x2 - x1, y2 - y1) / step))
            pts += [(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n) for i in range(n)]
        return pts
    r = min(radius(e), w / 2, h / 2)
    for (ax, ay), (dx, dy) in (((b[0] + r, b[1] + r), (-1, -1)), ((b[2] - r, b[1] + r), (1, -1)),
                               ((b[2] - r, b[3] - r), (1, 1)), ((b[0] + r, b[3] - r), (-1, 1))):
        for i in range(13):
            t = math.pi / 2 * i / 12
            pts.append((ax + dx * r * math.cos(t), ay + dy * r * math.sin(t)))
    for x in frange(b[0] + r, b[2] - r, step):
        pts += [(x, b[1]), (x, b[3])]
    for y in frange(b[1] + r, b[3] - r, step):
        pts += [(b[0], y), (b[2], y)]
    return pts


def visible_stroke(e):
    return e.get("strokeColor") not in (None, "transparent") and e.get("strokeWidth", 1) > 0


def visible_fill(e):
    return e.get("backgroundColor") not in (None, "transparent", "")


def hex_rgb(c):
    c = (c or "").strip().lower()
    c = {"white": "#ffffff", "black": "#000000"}.get(c, c)
    if not c.startswith("#"):
        return None
    c = c[1:]
    if len(c) in (3, 4):
        c = "".join(ch * 2 for ch in c[:3])
    if len(c) < 6:
        return None
    try:
        return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        return None


def blend(fg, bg, alpha):
    return tuple(round(f * alpha + b * (1 - alpha)) for f, b in zip(fg, bg))


def luminance(rgb):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def style_sig(e):
    return (e["type"], (e.get("backgroundColor") or "").lower(), (e.get("strokeColor") or "").lower(),
            e.get("strokeWidth"), e.get("strokeStyle"), bool(e.get("roundness")))


def crop_hint(*bs, pad=40):
    x0 = min(b[0] for b in bs) - pad
    y0 = min(b[1] for b in bs) - pad
    x1 = max(b[2] for b in bs) + pad
    y1 = max(b[3] for b in bs) + pad
    return f"crop {x0:.0f},{y0:.0f},{x1 - x0:.0f},{y1 - y0:.0f}"


# ------------------------------------------------------------------ geometry checks
class Geo:
    def __init__(self, els, texts, bg, overflowing=()):
        self.els, self.texts, self.bg = els, texts, bg
        self.overflowing = set(overflowing)
        self.shapes = [e for e in els if e["type"] in SHAPES and not e.get("angle")
                       and abs(e.get("width", 0)) >= 4 and abs(e.get("height", 0)) >= 4]
        self.by_id = {s["id"]: s for s in self.shapes}
        self.order = {e["id"]: i for i, e in enumerate(els)}
        self.arrows = [e for e in els if e["type"] == "arrow" and len(e.get("points") or []) >= 2]
        self.errors, self.warnings, self.strict = [], [], []
        self._label = {}                              # shape id -> its first own text (bound, or smallest shape around it)
        for t in sorted(texts, key=lambda t: (bbox(t)[1], bbox(t)[0])):
            tb = bbox(t)
            c = self.by_id.get(t.get("containerId"))
            if c is None:
                mid = ((tb[0] + tb[2]) / 2, (tb[1] + tb[3]) / 2)
                cands = [s for s in self.shapes if inside(mid, bbox(s))]
                c = min(cands, key=lambda s: area(bbox(s))) if cands else None
            if c is not None and c["id"] not in self._label:
                self._label[c["id"]] = t["text"].splitlines()[0][:30]

    def name(self, e):
        b = bbox(e)
        lab = self._label.get(e["id"])
        kind = "box" if e["type"] == "rectangle" else e["type"]
        size = f"{b[2] - b[0]:.0f}x{b[3] - b[1]:.0f}"
        return f"{kind} '{lab}' ({size})" if lab else f"{kind} {size} at {b[0]:.0f},{b[1]:.0f}"

    def parent(self, e):
        """Smallest shape that fully contains e."""
        eb = bbox(e)
        cands = [s for s in self.shapes if s is not e and inside(eb[:2], bbox(s), 0.5) and inside(eb[2:], bbox(s), 0.5)
                 and area(bbox(s)) > area(eb)]
        return min(cands, key=lambda s: area(bbox(s))) if cands else None

    # -- corner: a shape sticking out of a rounded corner (the accent-bar defect)
    def corners(self):
        for R in self.shapes:
            r = radius(R)
            if r < 3:
                continue
            rb = bbox(R)
            for S in self.shapes:
                if S is R:
                    continue
                sb = bbox(S)
                sa = area(sb)
                if sa <= 0 or sa >= area(rb) or inter_area(sb, rb) < 0.75 * sa:
                    continue
                if not (visible_fill(S) or visible_stroke(S)):
                    continue
                fill = (R.get("backgroundColor") or "").lower()
                if (S.get("backgroundColor") or "").lower() == fill and fill not in ("", "transparent") and \
                        (not visible_stroke(S) or S["strokeColor"].lower() in (fill, R["strokeColor"].lower())):
                    continue                          # same-colour patch that squares a corner on purpose
                s_sw = S.get("strokeWidth", 1) / 2 if visible_stroke(S) else 0
                r_sw = R.get("strokeWidth", 1) / 2 if visible_stroke(R) else 0
                worst, at = 0.0, None
                for px, py in outline(S):
                    if not ((px < rb[0] + r or px > rb[2] - r) and (py < rb[1] + r or py > rb[3] - r)):
                        continue                      # only the corner zones
                    d = sd_shape(px, py, R) + s_sw - r_sw
                    if d > worst:
                        worst, at = d, (px, py)
                if worst >= 1.0:
                    msg = (f"corner: {self.name(S)} pokes {worst:.0f}px out of the rounded corner of {self.name(R)} "
                           f"(r={r:.0f}) near {at[0]:.0f},{at[1]:.0f} — give it the same rounding, inset it by r, or "
                           f"keep it clear of the corner ({crop_hint((at[0], at[1], at[0], at[1]), pad=30)})")
                    (self.errors if worst >= 2 else self.warnings).append(msg)

    # -- arrows landing in texts or badges, arrowheads over borders
    def arrow_ends(self):
        smalls = [s for s in self.shapes if max(s["width"], s["height"]) <= 60 or (s["height"] <= 36 and s["width"] <= 320)]
        boxes = [s for s in self.shapes if s["width"] > 30 and s["height"] > 20 and s["type"] != "image"]
        for ar in self.arrows:
            pts = [(ar["x"] + p[0], ar["y"] + p[1]) for p in ar["points"]]
            ends = (("end", pts[-1], pts[-2], ar.get("endArrowhead")), ("start", pts[0], pts[1], ar.get("startArrowhead")))
            for which, tip, prev, head in ends:
                hint = crop_hint((tip[0], tip[1], tip[0], tip[1]), pad=60)
                for t in self.texts:
                    if t["id"] in self.overflowing:
                        continue                      # already reported as an overflow
                    tb = bbox(t)
                    if tb[0] + 2 < tip[0] < tb[2] - 2 and tb[1] + 2 < tip[1] < tb[3] - 2:
                        self.warnings.append(f"arrow-end: arrow {which} at {tip[0]:.0f},{tip[1]:.0f} lands inside the "
                                             f"text '{t['text'].splitlines()[0][:30]}' ({hint})")
                        break
                for s in smalls:
                    sb = bbox(s)
                    centred = math.hypot(tip[0] - (sb[0] + sb[2]) / 2, tip[1] - (sb[1] + sb[3]) / 2) <= 2
                    if sd_shape(tip[0], tip[1], s) < -1 and not centred:      # a stem from a dot's centre is fine
                        self.warnings.append(f"arrow-end: arrow {which} at {tip[0]:.0f},{tip[1]:.0f} lands inside the "
                                             f"badge/chip {self.name(s)} ({hint})")
                        break
                if not head:
                    continue
                for b in boxes:
                    d = sd_shape(tip[0], tip[1], b)
                    half = (b.get("strokeWidth", 1) + ar.get("strokeWidth", 1)) / 2
                    if -HEAD_LEN < d < -half - 1 and sd_shape(prev[0], prev[1], b) > d + 2:
                        group = any(s is not b and inter_area(bbox(s), bbox(b)) >= 0.9 * area(bbox(s)) > 0
                                    and area(bbox(s)) < area(bbox(b)) and s["width"] > 30 and s["height"] > 20
                                    for s in boxes)
                        fix = ("move the target 30px+ inside the group or end the arrow outside it" if group
                               else "stop the arrow 4-8px before the edge")
                        self.warnings.append(f"arrowhead: arrow {which} tip is {-d:.0f}px inside {self.name(b)}, the "
                                             f"head overlaps its border — {fix} ({hint})")
                    elif -half - 1 <= d <= half + 0.5 and sd_shape(prev[0], prev[1], b) > d:
                        self.strict.append(f"touch: arrow {which} tip touches the border of {self.name(b)} — leave a "
                                           f"4-8px gap ({hint})")

    # -- near-misses: edges 1-3 px apart
    def near_misses(self):
        cand = [s for s in self.shapes if s["width"] >= 36 and s["height"] >= 36     # boxes, not chips or badges
                and not is_doodle(s)]                                              # nor parts of a pictogram
        for i, a in enumerate(cand):
            ab = bbox(a)
            for b in cand[i + 1:]:
                bb = bbox(b)
                vgap = max(bb[1] - ab[3], ab[1] - bb[3])
                hgap = max(bb[0] - ab[2], ab[0] - bb[2])
                for k, lab, gap in ((0, "left", vgap), (2, "right", vgap), (1, "top", hgap), (3, "bottom", hgap)):
                    dlt = abs(ab[k] - bb[k])
                    if 1.0 <= dlt <= 3.0 and gap <= 120:
                        self.strict.append(f"near-miss: {lab} edges of {self.name(a)} and {self.name(b)} are "
                                           f"{dlt:.1f}px apart — align them ({crop_hint(ab, bb, pad=10)})")
                ov_y = min(ab[3], bb[3]) - max(ab[1], bb[1])
                ov_x = min(ab[2], bb[2]) - max(ab[0], bb[0])
                for g, ov in ((bb[0] - ab[2], ov_y), (ab[0] - bb[2], ov_y), (bb[1] - ab[3], ov_x), (ab[1] - bb[3], ov_x)):
                    if 1.0 <= g <= 3.0 and ov > 0:
                        self.strict.append(f"near-miss: {self.name(a)} and {self.name(b)} are {g:.1f}px apart — "
                                           f"make them touch or separate them by 8px+ ({crop_hint(ab, bb, pad=10)})")

    # -- rhythm: uneven gaps between siblings, same-style boxes of slightly different sizes
    def rhythm(self):
        cand = [s for s in self.shapes if s["height"] >= 36 and s["width"] >= 60 and not is_doodle(s)]
        fam = {}
        for s in cand:
            p = self.parent(s)
            fam.setdefault(p["id"] if p else None, []).append(s)
        for sibs in fam.values():
            for axis in (0, 1):                       # 0: rows (same top), 1: columns (same left)
                k = 1 - axis
                lines = []
                for s in sorted(sibs, key=lambda e: bbox(e)[k]):
                    for ln in lines:
                        if abs(bbox(ln[0])[k] - bbox(s)[k]) <= 2:
                            ln.append(s)
                            break
                    else:
                        lines.append([s])
                for ln in lines:
                    if len(ln) < 2:
                        continue
                    ln.sort(key=lambda e: bbox(e)[axis])
                    bs = [bbox(e) for e in ln]
                    # gaps between consecutive boxes of the same style only: a box styled differently (an outcome,
                    # a highlight) is often set apart on purpose
                    gaps = [bs[i + 1][axis] - bs[i][axis + 2] for i in range(len(bs) - 1)
                            if style_sig(ln[i]) == style_sig(ln[i + 1])]
                    if len(gaps) >= 2 and min(gaps) >= 0:
                        spread = max(gaps) - min(gaps)
                        if 2 < spread and max(gaps) <= 1.5 * max(min(gaps), 1):     # larger = a deliberate break
                            what = "row" if axis == 0 else "column"
                            self.strict.append(f"rhythm: uneven gaps in a {what} of {len(ln)} "
                                               f"({', '.join(f'{g:.0f}' for g in gaps)} px) starting at "
                                               f"{self.name(ln[0])} ({crop_hint(*bs, pad=10)})")
                    styl = {}
                    for e in ln:
                        styl.setdefault(style_sig(e), []).append(e)
                    for same in styl.values():
                        for dim in ("width", "height"):
                            vals = [abs(e[dim]) for e in same]
                            d = max(vals) - min(vals)
                            if len(vals) >= 2 and 1 < d <= max(8, 0.06 * max(vals)):
                                self.strict.append(f"rhythm: same-style boxes with near-equal {dim}s "
                                                   f"({', '.join(f'{v:.0f}' for v in vals)}) starting at "
                                                   f"{self.name(same[0])} — make them equal "
                                                   f"({crop_hint(*[bbox(e) for e in same], pad=10)})")

    # -- text padding and contrast
    def text_checks(self, container):
        low = {}
        for t in self.texts:
            tb = bbox(t)
            c = None if t.get("containerId") else container(t)
            if c is not None and c["type"] == "rectangle" and (visible_stroke(c) or visible_fill(c)):
                cb = bbox(c)
                small = (cb[3] - cb[1]) < 48
                # right edge left out: text widths in generated files are estimates (the overflow error covers it);
                # left edge only for left-aligned text, whose x is where the glyphs start
                pads = {"top": tb[1] - cb[1], "bottom": cb[3] - tb[3]}
                if t.get("textAlign", "left") == "left":
                    pads["left"] = tb[0] - cb[0]
                need = {"left": 6 if small else 8, "top": 2 if small else 6, "bottom": 2 if small else 6}
                tight = [f"{k} {v:.0f}px" for k, v in pads.items() if 0 <= v < need[k]]
                if tight:
                    self.strict.append(f"padding: '{t['text'].splitlines()[0][:30]}' is close to the edge of "
                                       f"{self.name(c)} ({', '.join(tight)}; aim for 8px+) "
                                       f"({crop_hint(tb, cb, pad=10)})")
            fg = hex_rgb(t.get("strokeColor"))
            if not fg:
                continue
            bg = self.background_at(t)
            fg = blend(fg, bg, t.get("opacity", 100) / 100)
            ratio = contrast(fg, bg)
            need = 3.0 if t.get("fontSize", 20) >= 24 else 4.5
            if ratio < need:
                key = ("#%02x%02x%02x" % fg, "#%02x%02x%02x" % bg, need)
                low.setdefault(key, []).append((ratio, t))
        for (fgc, bgc, need), items in sorted(low.items(), key=lambda kv: kv[1][0][0]):
            ratio, t = items[0]
            more = f" and {len(items) - 1} more" if len(items) > 1 else ""
            self.warnings.append(f"contrast: {ratio:.1f}:1 for {fgc} text on {bgc} (needs {need:.1f}:1) — "
                                 f"'{t['text'].splitlines()[0][:30]}'{more} ({crop_hint(bbox(t), pad=20)})")

    def background_at(self, t):
        """Colour under the centre of a text: solid fills drawn before it, top-most last."""
        tb = bbox(t)
        cx, cy = (tb[0] + tb[2]) / 2, (tb[1] + tb[3]) / 2
        ti = self.order.get(t["id"], len(self.els))
        if t.get("containerId") in self.by_id:
            ti = max(ti, self.order[t["containerId"]] + 1)
        under = [s for s in self.shapes if self.order[s["id"]] < ti and hex_rgb(s.get("backgroundColor"))
                 and s.get("fillStyle", "solid") == "solid" and sd_shape(cx, cy, s) < 0]
        col = self.bg
        for s in sorted(under, key=lambda s: self.order[s["id"]]):
            col = blend(hex_rgb(s["backgroundColor"]), col, s.get("opacity", 100) / 100)
        return col

    # -- orphans: small clusters far from the main drawing
    def orphans(self):
        items = [(e, bbox(e)) for e in self.els if e["type"] not in ("frame", "magicframe")]
        n = len(items)
        if n < 6:
            return
        bs = [b for _, b in items]
        span = math.hypot(max(b[2] for b in bs) - min(b[0] for b in bs), max(b[3] for b in bs) - min(b[1] for b in bs))
        link = max(160.0, 0.08 * span)
        par = list(range(n))

        def find(i):
            while par[i] != i:
                par[i] = par[par[i]]
                i = par[i]
            return i
        order = sorted(range(n), key=lambda i: bs[i][0])
        for oi, i in enumerate(order):
            for j in order[oi + 1:]:
                if bs[j][0] - bs[i][2] > link:
                    break
                if max(bs[j][1] - bs[i][3], bs[i][1] - bs[j][3]) <= link:
                    par[find(i)] = find(j)
        groups = {}
        for i in range(n):
            groups.setdefault(find(i), []).append(i)
        if len(groups) < 2:
            return
        main = max(groups.values(), key=len)
        mb = (min(bs[i][0] for i in main), min(bs[i][1] for i in main), max(bs[i][2] for i in main), max(bs[i][3] for i in main))
        for g in groups.values():
            if g is main or len(g) > max(5, 0.1 * n):
                continue
            gb = (min(bs[i][0] for i in g), min(bs[i][1] for i in g), max(bs[i][2] for i in g), max(bs[i][3] for i in g))
            dist = max(gb[0] - mb[2], mb[0] - gb[2], gb[1] - mb[3], mb[1] - gb[3], 0)
            what = next((items[i][0]["text"].splitlines()[0][:30] for i in g if items[i][0]["type"] == "text"), None)
            what = f"'{what}'" if what else items[g[0]][0]["type"]
            self.warnings.append(f"orphan: {len(g)} element(s) ({what}) at {gb[0]:.0f},{gb[1]:.0f} sit {dist:.0f}px "
                                 f"away from the diagram — move them in or delete them ({crop_hint(gb, pad=20)})")

    def run(self, container, strict):
        self.corners()
        self.arrow_ends()
        self.text_checks(container)
        self.orphans()
        if strict:
            self.near_misses()
            self.rhythm()
        return self.errors, self.warnings, (self.strict if strict else [])


# ------------------------------------------------------------------ taste checks (--taste)
def is_voice(e):
    """Hand annotations (signature.hand / margin_note): a deliberate second font and size, outside the type scale."""
    return bool((e.get("customData") or {}).get("voice"))


def is_whisper(e):
    """Footer provenance (signature.whisper): small on purpose, allowed down to 80 % of the format's minimum."""
    return bool((e.get("customData") or {}).get("whisper"))


def hue_family(c):
    """Hue family index of a saturated colour, None for greys, tints and near-blacks."""
    rgb = hex_rgb(c)
    if not rgb:
        return None
    h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in rgb))
    if s <= SAT_MIN or not LIGHT_MIN <= l <= LIGHT_MAX:
        return None
    return int(h * 360 // HUE_STEP) % (360 // HUE_STEP)


def raster(region, items, cell=BAND_CELL):
    """Coarse occupancy grid over region (x0, y0, x1, y1): items are boxes, or (box, test(x, y)) for exact shapes."""
    x0, y0, x1, y1 = region
    nc, nr = max(1, math.ceil((x1 - x0) / cell)), max(1, math.ceil((y1 - y0) / cell))
    grid = [[False] * nc for _ in range(nr)]
    for it in items:
        b, test = it if len(it) == 2 else (it, None)
        c0, c1 = max(0, int((b[0] - x0) // cell)), min(nc - 1, int((b[2] - x0) // cell))
        r0, r1 = max(0, int((b[1] - y0) // cell)), min(nr - 1, int((b[3] - y0) // cell))
        for r in range(r0, r1 + 1):
            for c in range(c0, c1 + 1):
                if not grid[r][c] and (test is None or test(x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell)):
                    grid[r][c] = True
    return grid


def longest_run(flags):
    """(start, length) of the longest run of True."""
    best, cur, start = (0, 0), 0, 0
    for i, f in enumerate(flags):
        if f:
            if cur == 0:
                start = i
            cur += 1
            if cur > best[1]:
                best = (start, cur)
        else:
            cur = 0
    return best


def taste(raw, els, texts, boxes, geo):
    """Art-direction checks: one focal point, a short type scale, a real title, text readable at the format's size,
    margins, no dead band, a small colour budget. Returns warnings."""
    out = []

    def lab(e):
        if e["type"] == "text":
            return f"'{e['text'].splitlines()[0][:30]}'"
        return geo.name(e) if e["id"] in geo.by_id else f"{e['type']} at {bbox(e)[0]:.0f},{bbox(e)[1]:.0f}"

    page = next((e for e in raw if (e.get("customData") or {}).get("decor") == "page"), None)
    pcd = (page or {}).get("customData") or {}
    pb = bbox(page) if page else None
    m = pcd.get("margin") or 0
    fmt = pcd.get("format", "?")

    # 1. hero / focal point
    blocks = [b for b in boxes if not is_doodle(b) and max(abs(b["width"]), abs(b["height"])) > BADGE_MAX]

    def holds(a, b):
        ab, bb = bbox(a), bbox(b)
        return a is not b and area(ab) > area(bb) and inside(bb[:2], ab, 0.5) and inside(bb[2:], ab, 0.5)
    leaves = [b for b in blocks if not any(holds(b, o) for o in blocks)]
    heroes = [b for b in blocks if (b.get("customData") or {}).get("hero")]
    if heroes:
        hero = max(heroes, key=lambda b: area(bbox(b)))
        others = [b for b in leaves if b not in heroes]
        if others:
            big = max(others, key=lambda b: area(bbox(b)))
            k = area(bbox(hero)) / max(area(bbox(big)), 1)
            if k < HERO_RATIO:
                out.append(f"hero: the hero {geo.name(hero)} is only {k:.1f}x the largest other block {geo.name(big)} "
                           f"(aim for {HERO_RATIO:g}x+, 3-4x reads best) — grow it or shrink the others "
                           f"({crop_hint(bbox(hero), bbox(big), pad=20)})")
    elif len(leaves) >= 3:
        big = max(leaves, key=lambda b: area(bbox(b)))
        med = statistics.median(area(bbox(b)) for b in leaves)
        k = area(bbox(big)) / max(med, 1)
        if k < FOCAL_RATIO:
            out.append(f"hero: no focal point, the largest block {geo.name(big)} is {k:.1f}x the median block — make "
                       f"one block 3-4x the others, or tag the hero (customData.hero)")

    # 2-3. type scale and title
    body = [t for t in texts if not is_voice(t) and not is_doodle(t) and not is_whisper(t)]
    sizes = sorted({round(t.get("fontSize", 20)) for t in body})
    if len(sizes) > MAX_TYPE_SIZES:
        out.append(f"type-scale: {len(sizes)} font sizes ({', '.join(str(z) for z in sizes)} px; max "
                   f"{MAX_TYPE_SIZES}) — keep about 4 sizes: title, hero word, label, detail")
    if len(body) >= 3:
        top = max(body, key=lambda t: t.get("fontSize", 20))
        med = statistics.median(t.get("fontSize", 20) for t in body)
        if top.get("fontSize", 20) < TITLE_RATIO * med:
            out.append(f"title: the largest text {lab(top)} is {top.get('fontSize', 20):g} px, only "
                       f"{top.get('fontSize', 20) / med:.1f}x the median text ({med:g} px) — set the title at "
                       f"{TITLE_RATIO:g}x+ the body")

    # 4. smallest readable text for the format
    if page and pcd.get("min_text"):
        mt = pcd["min_text"]
        small = sorted((t for t in texts if t.get("fontSize", 20) < (mt * 0.8 if is_whisper(t) else mt)), key=lambda t: t.get("fontSize", 20))
        if small:
            ex = ", ".join(f"{lab(t)} ({t.get('fontSize', 20):g} px)" for t in small[:3])
            more = f" and {len(small) - 3} more" if len(small) > 3 else ""
            out.append(f"min-text: {len(small)} text(s) under {mt} px, too small for the {fmt} format once it is shown "
                       f"scaled down: {ex}{more} — raise them to {mt} px+ or cut them")

    # 5. margins and balance
    if page and els:
        slack = m * MARGIN_SLACK
        outside, near = [], []
        for e in els:
            b = bbox(e)
            if b[0] < pb[0] - 0.5 or b[1] < pb[1] - 0.5 or b[2] > pb[2] + 0.5 or b[3] > pb[3] + 0.5:
                outside.append(e)
            elif b[0] < pb[0] + slack or b[1] < pb[1] + slack or b[2] > pb[2] - slack or b[3] > pb[3] - slack:
                near.append(e)
        for what, items, fix in (("outside the page", outside, "bring them inside the margin"),
                                 (f"within {slack:.0f} px of the page edge (margin {m} px)", near,
                                  "keep content inside the margin")):
            if items:
                ex = ", ".join(lab(e) for e in items[:3])
                more = f" and {len(items) - 3} more" if len(items) > 3 else ""
                out.append(f"margin: {len(items)} element(s) {what}: {ex}{more} — {fix} "
                           f"({crop_hint(*[bbox(e) for e in items[:6]], pad=20)})")
        cb = (min(bbox(e)[0] for e in els), min(bbox(e)[1] for e in els),
              max(bbox(e)[2] for e in els), max(bbox(e)[3] for e in els))
        for (na, va), (nb, vb) in ((("left", cb[0] - pb[0]), ("right", pb[2] - cb[2])),
                                   (("top", cb[1] - pb[1]), ("bottom", pb[3] - cb[3]))):
            lo, hi = sorted((va, vb))
            if hi - lo > BALANCE_PX and hi > BALANCE_RATIO * max(lo, 1):
                out.append(f"balance: {na} margin {va:.0f} px vs {nb} {vb:.0f} px — re-centre the content or let a "
                           f"block fill the wide side")

    # 6. dead bands inside the margins
    if page and els:
        inner = (pb[0] + m, pb[1] + m, pb[2] - m, pb[3] - m)
        iw, ih = inner[2] - inner[0], inner[3] - inner[1]
        if iw > 0 and ih > 0:
            grid = raster(inner, [(b[0] - BAND_INFLATE, b[1] - BAND_INFLATE, b[2] + BAND_INFLATE, b[3] + BAND_INFLATE)
                                  for b in map(bbox, els)])
            rows = [not any(r) for r in grid]
            cols = [not any(r[c] for r in grid) for c in range(len(grid[0]))]
            for kind, flags, span, o, axis in (("horizontal", rows, ih, inner[1], "height"),
                                               ("vertical", cols, iw, inner[0], "width")):
                s, n = longest_run(flags)
                size = min(n * BAND_CELL, span - s * BAND_CELL)
                if size > BAND_SHARE * span:
                    a0 = o + s * BAND_CELL
                    hint = (crop_hint((inner[0], a0, inner[2], a0 + size), pad=0) if kind == "horizontal"
                            else crop_hint((a0, inner[1], a0 + size, inner[3]), pad=0))
                    xy = "y" if kind == "horizontal" else "x"
                    out.append(f"dead band: an empty {kind} band of {size:.0f} px ({xy} {a0:.0f}-{a0 + size:.0f}, "
                               f"{100 * size / span:.0f} % of the content {axis}) — grow the hero, move notes there, "
                               f"or crop the format ({hint})")

    # 7. colour budget
    fams = {}
    for e in els:
        if is_doodle(e):
            continue
        cols = []
        if e["type"] == "text" or visible_stroke(e):
            cols.append(e.get("strokeColor"))
        if e["type"] != "text" and visible_fill(e):
            cols.append(e.get("backgroundColor"))
        for c in cols:
            f = hue_family(c)
            if f is not None:
                fams.setdefault(f, set()).add(c.lower())
    if len(fams) > MAX_HUES:
        ex = ", ".join(sorted(v)[0] for _, v in sorted(fams.items()))
        out.append(f"colour: {len(fams)} saturated hue families ({ex}; max {MAX_HUES}) — each hue needs a meaning; "
                   f"grey the rest")
    region = pb if page else ((min(bbox(e)[0] for e in els), min(bbox(e)[1] for e in els),
                               max(bbox(e)[2] for e in els), max(bbox(e)[3] for e in els)) if els else None)
    if region and area(region) > 0:
        loud = [s for s in geo.shapes if s["type"] != "image" and not is_doodle(s) and visible_fill(s)
                and hue_family(s["backgroundColor"]) is not None and not (s.get("customData") or {}).get("hero")]
        if loud:
            grid = raster(region, [(bbox(s), (lambda x, y, s=s: sd_shape(x, y, s) <= 0)) for s in loud])
            share = sum(map(sum, grid)) / (len(grid) * len(grid[0]))
            if share > SAT_FILL_SHARE:
                out.append(f"colour: saturated fills cover {100 * share:.0f} % of the {'page' if page else 'drawing'} "
                           f"(hero excluded; max {100 * SAT_FILL_SHARE:.0f} %) — use pale tints for areas and keep "
                           f"saturated colour for lines, text and the hero")

    # 8. legend where direct labels would do (soft)
    has_legend = any(t["text"].strip().rstrip(":").strip().lower() == "legend" for t in texts)
    if not has_legend and els:
        cb = (min(bbox(e)[1] for e in els), max(bbox(e)[3] for e in els))
        low = cb[0] + 0.75 * (cb[1] - cb[0])
        swatches = 0
        for s in geo.shapes:
            sb = bbox(s)
            if max(sb[2] - sb[0], sb[3] - sb[1]) > SWATCH_MAX or (sb[1] + sb[3]) / 2 < low:
                continue
            if not (visible_fill(s) or visible_stroke(s)):
                continue
            mid = (sb[1] + sb[3]) / 2
            if any(0 <= bbox(t)[0] - sb[2] <= 16 and bbox(t)[1] - 6 <= mid <= bbox(t)[3] + 6 for t in texts):
                swatches += 1
        has_legend = swatches >= 2
    if has_legend and len(fams) < MAX_HUES:
        out.append(f"legend (soft): a legend for {len(fams)} colour famil{'y' if len(fams) == 1 else 'ies'} — label "
                   f"each colour directly where it is used and drop the legend")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--max-words", type=int, default=40)
    ap.add_argument("--max-colors", type=int, default=12)
    ap.add_argument("--strict", action="store_true", help="also report near-misses, uneven rhythm, tight padding and "
                                                           "arrow tips touching borders")
    ap.add_argument("--taste", action="store_true", help="also report art-direction issues: hero, type scale, "
                                                          "title, min text, margins, dead bands, colour budget")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    doc = json.load(open(a.path, encoding="utf-8"))
    els = [e for e in doc["elements"] if not e.get("isDeleted") and not is_decor(e)]
    texts = [e for e in els if e["type"] == "text" and e.get("text", "").strip()]
    boxes = [e for e in els if e["type"] in ("rectangle", "ellipse", "diamond") and e.get("width", 0) > 30 and e.get("height", 0) > 20]
    arrows = [e for e in els if e["type"] == "arrow"]
    errors, warnings, overflowing = [], [], []

    def label(t):
        return t["text"].splitlines()[0][:40]

    # container = smallest box containing the text's top-left corner
    def container(t):
        tb = bbox(t)
        cands = [b for b in boxes if inside((tb[0] + 1, tb[1] + 1), bbox(b))]
        return min(cands, key=lambda b: b["width"] * b["height"]) if cands else None

    for t in texts:
        tb = bbox(t)
        c = container(t)
        if c is not None:
            cb = bbox(c)
            if tb[2] > cb[2] - 4 or tb[3] > cb[3] - 2:
                overflowing.append(t["id"])
                errors.append(f"overflow: '{label(t)}' leaves its box by {max(tb[2] - cb[2], tb[3] - cb[3]) + 4:.0f}px")
        else:
            for b in boxes:
                bb = bbox(b)
                if b["width"] * b["height"] < 900:      # skip small markers
                    continue
                if overlap(tb, bb) and not inside((tb[0], tb[1]), bb) and not (bb[0] >= tb[0] and bb[2] <= tb[2]):
                    errors.append(f"crosses a box edge: '{label(t)}'")
                    break
        if t.get("fontSize", 14) < 11:
            warnings.append(f"tiny font {t.get('fontSize')}px: '{label(t)}'")

    for i, t in enumerate(texts):
        for u in texts[i + 1:]:
            if overlap(bbox(t), bbox(u), margin=1):
                errors.append(f"texts overlap: '{label(t)}' / '{label(u)}'")

    for ar in arrows:
        pts = [(ar["x"] + p[0], ar["y"] + p[1]) for p in ar.get("points", [])]
        for p, q in zip(pts, pts[1:]):
            for t in texts:
                if seg_hits_box(p, q, bbox(t)):
                    warnings.append(f"arrow crosses label: '{label(t)}'")

    for b in boxes:
        if b["width"] < 150 or b["height"] < 80 or b["width"] > 460:     # cards only, not frames or blocks
            continue
        bb = bbox(b)
        words = sum(len(t["text"].split()) for t in texts if inside((bbox(t)[0] + 1, bbox(t)[1] + 1), bb)
                    and container(t) is b)
        if words > a.max_words:
            warnings.append(f"{words} words in one box (max {a.max_words}) at x={b['x']:.0f}, y={b['y']:.0f}")

    strokes = {e["strokeColor"].lower() for e in els if e["type"] != "text" and e.get("strokeColor")
               and not is_doodle(e)}                     # icons, pictograms and widget parts are not "meanings"
    if len(strokes) > a.max_colors:
        warnings.append(f"{len(strokes)} stroke colours (max {a.max_colors}): does each colour still mean one thing?")
    fams = {}
    for t in texts:
        cd = t.get("customData") or {}
        if cd.get("card") or cd.get("voice"):         # flashcard type roles and hand annotations are deliberate
            continue
        fams.setdefault(t.get("fontFamily"), []).append(t.get("fontSize", 20))
    if len(fams) > 1:
        body = max(fams, key=lambda f: len(fams[f]))
        # a style may give titles (>= 28 px) and small labels (<= 12 px) their own font; anything else is a mix
        stray = [f for f, sizes in fams.items() if f != body
                 and not (all(z >= 28 for z in sizes) or all(z <= 12 for z in sizes))]
        if stray or len(fams) > 3:
            warnings.append(f"mixed font families {sorted(fams)}: keep one body font, plus at most a title font "
                            f"(>= 28 px) and a label font (<= 12 px)")

    bg = hex_rgb((doc.get("appState") or {}).get("viewBackgroundColor")) or (255, 255, 255)
    geo = Geo(els, texts, bg, overflowing)
    g_err, g_warn, g_strict = geo.run(container, a.strict)
    errors += list(dict.fromkeys(g_err))
    warnings = sorted(set(warnings)) + list(dict.fromkeys(g_warn)) + list(dict.fromkeys(g_strict))
    raw = [e for e in doc["elements"] if not e.get("isDeleted")]
    if a.taste:
        warnings += list(dict.fromkeys(taste(raw, els, texts, boxes, geo)))
    page = next((e for e in raw if (e.get("customData") or {}).get("decor") == "page"), None)
    if a.json:
        print(json.dumps({"errors": errors, "warnings": warnings}, ensure_ascii=False, indent=2))
    else:
        for e in errors:
            print("ERROR  ", e)
        for w in warnings:
            print("warning", w)
        print(f"{len(errors)} error(s), {len(warnings)} warning(s) — {len(texts)} texts, {len(boxes)} boxes, {len(arrows)} arrows"
              + ("" if a.strict else " (--strict adds near-miss, rhythm, padding and touch checks)")
              + ("" if not a.taste else f" [taste: {page['customData'].get('format', '?')} page]" if page
                 else " [taste: no page rect, min-text, margin and band checks skipped]"))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
