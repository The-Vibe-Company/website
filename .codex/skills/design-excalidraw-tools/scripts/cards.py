"""Flashcards: a deck of portrait study cards, one idea per card, drawn side by side on one canvas.

A deck is a cover (kicker, poster title, subtitle with a rule, numbered table of contents, a call to swipe) and
concept cards (kicker, poster title, optional handwritten side tag, one to three short paragraphs or a numbered list
with a bold lead word, one small hand-drawn diagram, one "rule of thumb" tip box, a quiet footer). Each card is
CARD_W x CARD_H scene units (4:5 portrait) and exports alone at scale 2 to 1200 x 1500 px:

    node scripts/render_scene.mjs --in deck.excalidraw --out card-1.png --crop <x>,<y>,600,750 --scale 2 --padding 0

Fonts follow the genre rather than the style's body font: poster titles in the display face (Lilita One; Liberation
Sans in editorial and mono), body text in a clean face for long reading (Nunito; Liberation Sans in editorial and
mono), kickers, side tags and annotations in the hand face (Excalifont). Diagrams inside a card use the style's own
rendering (hand-drawn in sketch and playful).

Every helper takes the scene S and absolute coordinates, returns the y under what it drew, and warns on stderr
(OVERFLOW ...) when text does not fit its width or a card's content runs into its footer.
"""
import excalikit as K
from excalikit import Palette as P, text_size, warn, FONT_CLEAN, FONT_HAND, FONT_DISPLAY, FONT_SANS
import doodles as D

CARD_W, CARD_H = 600, 750        # 4:5 portrait, exports at scale 2 to 1200 x 1500
CARD_GAP = 80                    # between cards on the canvas
MARGIN = 44                      # inner side margin
FOOTER_H = 52                    # band kept free at the bottom for the footer
EXPORT_SCALE = 2
LH = K.LINE_HEIGHT


def _sober_type():
    return K.STYLE.get("font") == FONT_SANS


def body_font():
    return FONT_SANS if _sober_type() else FONT_CLEAN


def title_font():
    return FONT_SANS if _sober_type() else FONT_DISPLAY


def card_xy(i, y=0, x0=0):
    """Top-left corner of card i when the deck is laid out in one row."""
    return x0 + i * (CARD_W + CARD_GAP), y


def _txt(S, x, y, s, size, color, font, align="left", role="body"):
    """Text in an explicit font (the kit picks the style font by size; cards need their own type roles). Tagged
    customData.card = role so lint_scene accepts the deck's three faces (display, body, hand) as intended."""
    e = S.text(x, y, s, size, color, "left")
    w, h = text_size(s, size, font)
    e["x"] = x - w / 2 if align == "center" else (x - w if align == "right" else x)
    e.update(width=w, height=h, fontFamily=font, textAlign=align)
    e["customData"] = dict(e.get("customData") or {}, card=role)
    return e


def wrap(s, size, font, width, first_width=None):
    """Greedy word wrap with the kit's glyph tables; first_width lets a list item start after its lead word."""
    lines, cur, limit = [], "", first_width or width
    for word in s.split():
        cand = (cur + " " + word).strip()
        if text_size(cand, size, font)[0] <= limit or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur, limit = word, width
    if cur:
        lines.append(cur)
    return lines


# ---------------------------------------------------------------- the card
def card(S, x, y, deck=None, source=None, page=None):
    """White portrait page with a hairline border and a footer (deck name left, source or page right).
    Returns the content box (x0, y0, w, y_max): draw between y0 and y_max."""
    S.rect(x, y, CARD_W, CARD_H, P.WHITE, P.LINE, 1, radius=10)
    fy = y + CARD_H - 34
    if deck:
        _txt(S, x + MARGIN, fy, deck, 13, P.GREY, body_font())
    right = source or (str(page) if page is not None else None)
    if right:
        _txt(S, x + CARD_W - MARGIN, fy, right, 13, P.GREY, body_font(), align="right")
    return x + MARGIN, y + 36, CARD_W - 2 * MARGIN, y + CARD_H - FOOTER_H


def check_fit(bottom, y_max, what="card"):
    if bottom > y_max:
        warn(f"OVERFLOW in {what}: content ends at {bottom:.0f}, footer band starts at {y_max:.0f} "
             f"({bottom - y_max:.0f} px too long; cut words, not font size)")


# ---------------------------------------------------------------- titles
def kicker(S, cx, y, s, color=None, size=28):
    """Small handwritten line above the title ("How to do", "Pocket guide to")."""
    _txt(S, cx, y, s, size, color or P.ACCENT, FONT_HAND, align="center", role="hand")
    return y + size * LH


def poster_title(S, cx, y, s, max_w, color=None, size=68, min_size=36, shadow=True, align="center"):
    """Big display title, shrunk until every line fits max_w, with an ink offset shadow (poster look).
    Use \\n to break it where the meaning breaks. Returns the y under it."""
    font = title_font()
    while size > min_size and text_size(s, size, font)[0] > max_w:
        size -= 2
    w, h = text_size(s, size, font)
    if w > max_w:
        warn(f"OVERFLOW in poster title '{s[:30]}': {w:.0f} px for {max_w:.0f}")
    if shadow and not _sober_type() and D._lum(P.CANVAS) >= 0.35:   # no ink shadow on dark pages
        d = max(2, round(size / 22))
        sh = _txt(S, cx + d, y + d, s, size, P.INK, font, align=align, role="title")
        sh["customData"]["decor"] = "shadow"          # a decorative copy: lint skips it
    _txt(S, cx, y, s, size, color or P.ACCENT, font, align=align, role="title")
    return y + h


def side_tag(S, x, y, s, color=None, size=22):
    """Handwritten aside next to the title ("for LLM-as-a-judge")."""
    _txt(S, x, y, s, size, color or P.BLUE, FONT_HAND, role="hand")
    return y + text_size(s, size, FONT_HAND)[1]


def title_with_tag(S, x0, y, w, s, tag, color=None, tag_color=None, size=64, tag_size=22, gap=18):
    """Poster title with a handwritten aside on its right (the aside sits beside the last line of the title).
    The title is centred in the width the tag leaves free. Returns the y under the title."""
    tw, th = text_size(tag, tag_size, FONT_HAND)
    tx = x0 + w - tw
    bottom = poster_title(S, x0 + (w - tw - gap) / 2, y, s, w - tw - gap, color, size)
    side_tag(S, tx, max(y, bottom - th - 6), tag, tag_color, tag_size)
    return bottom


def rule(S, x, y, w, color=None, sw=2):
    S.line(x, y, [[0, 0], [w, 0]], color or P.ACCENT, sw)
    return y + sw


# ---------------------------------------------------------------- body
def paragraph(S, x, y, w, s, size=18, color=None, gap=14):
    """Wrapped paragraph in the body font; returns the y under it plus a paragraph gap."""
    lines = wrap(s, size, body_font(), w)
    _txt(S, x, y, "\n".join(lines), size, color or P.INK, body_font())
    return y + len(lines) * size * LH + gap


def numbered(S, x, y, w, items, size=17, gap=12, disc=None):
    """Numbered list: items are (lead, rest). The lead word is set in the display face (reads as bold), the rest
    follows on the same line and wraps under it. Returns the y under the list."""
    bf, lf = body_font(), title_font()
    d = 24
    tx = x + d + 12
    tw = w - (tx - x)
    for i, (lead, rest) in enumerate(items, 1):
        lead_s = lead + (":" if rest and not lead.endswith(":") else "")
        lw = text_size(lead_s + " ", size, lf)[0]
        lines = wrap(rest, size, bf, tw, first_width=tw - lw) if rest else []
        cy = y + size * LH / 2
        S.ellipse(x, cy - d / 2, d, d, disc or P.INK, disc or P.INK, 1)
        S.text_mid(x + d / 2, cy, str(i), 13, P.WHITE, align="center")["fontFamily"] = bf
        _txt(S, tx, y, lead_s, size, P.INK, lf, role="lead")
        if lines:
            _txt(S, tx + lw, y, lines[0], size, P.MID, bf)
            if len(lines) > 1:
                _txt(S, tx, y + size * LH, "\n".join(lines[1:]), size, P.MID, bf)
        y += max(1, len(lines)) * size * LH + gap
    return y


TIP_LIGHT = ("#fff9db", "#fab005")     # pale yellow note, amber edge (on light pages)
TIP_DARK = ("#3b3313", "#fab005")      # same note on dark pages


def tip(S, x, y, w, s, size=16, icon=True, bottom=None):
    """Rule-of-thumb box: pale yellow, a bulb on the left, wrapped text. With bottom, the box is anchored so that it
    ends there (the card's last block sits on the footer band, free space goes above it). Returns the y under it."""
    pad = 14
    iw = 34 if icon else 0
    lines = wrap(s, size, body_font(), w - 2 * pad - (iw + 12 if icon else 0))
    h = max(len(lines) * size * LH, 40 if icon else 0) + 2 * pad
    if bottom is not None:
        if y > bottom - h:
            warn(f"OVERFLOW in tip: needs {h:.0f} px from y={y:.0f}, ends past {bottom:.0f}")
        y = max(y, bottom - h)
    fill, edge = TIP_DARK if D._lum(P.CANVAS) < 0.35 else TIP_LIGHT
    S.rect(x, y, w, h, fill, edge, 1.5, radius=8)
    if icon:
        D.bulb(S, x + pad, y + pad, iw, iw * 1.1)
    _txt(S, x + pad + (iw + 12 if icon else 0), y + pad, "\n".join(lines), size, P.INK, body_font())
    return y + h


NOTE_LIGHT, NOTE_DARK = "#c4510b", "#ff922b"   # the warning pen ("Don't do this!"), whatever the palette


def note(S, x, y, s, to, color=None, size=20, bend=-14):
    """Handwritten annotation with an arched arrow to a target point (x, y) = text top-left; to = (tx, ty).
    The arrow leaves the side of the text nearest the target."""
    color = color or (NOTE_DARK if D._lum(P.CANVAS) < 0.35 else NOTE_LIGHT)
    w, h = text_size(s, size, FONT_HAND)
    _txt(S, x, y, s, size, color, FONT_HAND, role="hand")
    tx, ty = to
    sx = x + w + 6 if tx > x + w else (x - 6 if tx < x else x + w / 2)
    sy = y + h / 2 if (tx > x + w or tx < x) else (y + h + 4 if ty > y else y - 4)
    D.curvy_arrow(S, sx, sy, tx, ty, bend=bend, color=color, sw=2)
    return y + h


def box(S, x, y, w, h, label, size=16, fill=None, stroke=None, color=None):
    """Small labelled box for the in-card diagram (body font, centred)."""
    S.rect(x, y, w, h, fill or P.WHITE, stroke or P.INK, 2, radius=6)
    lw, lh = text_size(label, size, body_font())
    if lw > w - 16:
        warn(f"OVERFLOW in card box '{label[:30]}': {lw:.0f} px for {w - 16:.0f}")
    _txt(S, x + w / 2, y + h / 2 - lh / 2, label, size, color or P.INK, body_font(), align="center")
    return (x, y, w, h)


# ---------------------------------------------------------------- cover
def toc(S, x, y, w, items, cols=2, size=18, row=46):
    """Numbered table of contents in columns (black discs, white numbers). Returns the y under it."""
    per = -(-len(items) // cols)
    cw = w / cols
    bf = body_font()
    for i, s in enumerate(items):
        c, r = divmod(i, per)
        cx, cy = x + c * cw, y + r * row
        d = 24
        S.ellipse(cx, cy + 1, d, d, P.INK, P.INK, 1)
        S.text_mid(cx + d / 2, cy + 1 + d / 2, str(i + 1), 13, P.WHITE, align="center")["fontFamily"] = bf
        lines = wrap(s, size, bf, cw - d - 26)
        if len(lines) > 2:
            warn(f"OVERFLOW in toc item '{s[:30]}': {len(lines)} lines in a {cw - d - 26:.0f} px column")
        _txt(S, cx + d + 12, cy, "\n".join(lines), size, P.INK, bf)
    return y + per * row


def cta(S, cx, y, s, size=24, color=None):
    """Call to action at the bottom of the cover ("Swipe through the 12 cards ->")."""
    _txt(S, cx, y, s, size, color or P.MID, title_font(), align="center", role="title")
    return y + size * LH


def export_commands(n, deck_path, y=0, x0=0, prefix="card"):
    """Shell lines that export each card of the deck to its own 1200 x 1500 PNG."""
    out = []
    for i in range(n):
        x, yy = card_xy(i, y, x0)
        out.append(f"node scripts/render_scene.mjs --in {deck_path} --out {prefix}-{i}.png "
                   f"--crop {x},{yy},{CARD_W},{CARD_H} --scale {EXPORT_SCALE} --padding 0")
    return out
