"""palettes — three curated colour systems for excalikit, plus the spacing and type scales.

    from palettes import use, SPACE, TYPE
    pal = use("warm")              # recolours excalikit.Palette (and the kit's colour defaults) in place
    S = Scene(); ...; S.dump(out, background=pal["canvas"])

Every palette fills the same roles, so a generator written for one works with the others:

    canvas   page background (Scene.dump background)
    white    card / node surface            paper  quiet zone, unchanged or out-of-scope box
    lane     lane / container tint          line   hairline borders of quiet boxes and zones
    stone    dashed outlines, chip borders  grey   captions, section labels, footers
    mid      body text, secondary arrows    ink    titles, main strokes, the one loud fill
    on_dark  secondary text on an ink fill
    accent   THE thing that matters (one per diagram), with accent_bg (tint) and accent_soft (border of tints)
    bad      problems, failure paths, what disappears        good  targets, improvements, what appears
    wait     waiting, in progress                            open  open questions (always dashed), open_txt for its text
    cat1     first category family (data, infra)             cat2  second category family (people, services)

Each colour role has a *_bg (pale tint for fills) and a *_soft (mid tint for borders of tinted boxes).
`use()` maps the roles onto the kit's names (ACCENT, RED, GREEN, ORANGE, YELLOW, BLUE, TEAL, INK...) and also swaps the
kit's default colour arguments, so calls that rely on defaults follow the palette.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import excalikit  # noqa: E402

# ---------------------------------------------------------------- scales (use these, not ad-hoc numbers)
SPACE = {"xs": 4, "s": 8, "m": 16, "l": 24, "xl": 32, "2xl": 48, "3xl": 64, "4xl": 96}
TYPE = {"display": 56, "title": 36, "subtitle": 20, "heading": 18, "label": 16, "body": 14, "caption": 13, "micro": 12}

# ---------------------------------------------------------------- palettes
PALETTES = {
    # Signature: the house look. Warm paper, near-black ink, warm greys for context, one burnt-orange voice
    # (hand notes, the reading path), a yellow highlighter and a yellow hero. The default for anything new.
    "signature": {
        "canvas": "#fbf8f1", "white": "#ffffff", "paper": "#f4f0e6", "lane": "#f2ede2", "line": "#ddd6c8",
        "stone": "#b9b1a2", "grey": "#716b61", "mid": "#57524a", "ink": "#1f1d1a", "on_dark": "#e9e4d8",
        "accent": "#c2410c", "accent_bg": "#fff1e8", "accent_soft": "#ffc8a8",
        "bad": "#c92a2a", "bad_bg": "#fff5f5", "bad_soft": "#ffc9c9",
        "good": "#2b7a3d", "good_bg": "#ebfbee", "good_soft": "#b2f2bb",
        "wait": "#9c5b00", "wait_bg": "#fff4e0", "wait_soft": "#ffd8a8",
        "open": "#e0a800", "open_bg": "#fff8dc", "open_txt": "#7a5a00",
        "cat1": "#1864ab", "cat1_bg": "#e7f5ff", "cat1_soft": "#a5d8ff",
        "cat2": "#a61e4d", "cat2_bg": "#fff0f6", "cat2_soft": "#fcc2d7",
        "loud": "#1f1d1a",
        "loud_txt": "#ffffff",
        "loud_sub": "#e9e4d8",
        "badge": "#c2410c",
        "badge_txt": "#ffffff",},
    # Clean: cool neutrals on white, one violet accent. Slides, documentation, anything shared outside the team.
    "clean": {
        "canvas": "#ffffff", "white": "#ffffff", "paper": "#f8f9fa", "lane": "#f1f3f5", "line": "#dee2e6",
        "stone": "#adb5bd", "grey": "#646c74", "mid": "#495057", "ink": "#212529", "on_dark": "#ced4da",
        "accent": "#6741d9", "accent_bg": "#f3f0ff", "accent_soft": "#d0bfff",
        "bad": "#c92a2a", "bad_bg": "#fff5f5", "bad_soft": "#ffc9c9",
        "good": "#287d39", "good_bg": "#ebfbee", "good_soft": "#b2f2bb",
        "wait": "#b8470a", "wait_bg": "#fff4e6", "wait_soft": "#ffd8a8",
        "open": "#f0b400", "open_bg": "#fffbe8", "open_txt": "#806600",
        "cat1": "#1864ab", "cat1_bg": "#e7f5ff", "cat1_soft": "#a5d8ff",
        "cat2": "#087c59", "cat2_bg": "#e6fcf5", "cat2_soft": "#96f2d7",
        "loud": "#212529",
        "loud_txt": "#ffffff",
        "loud_sub": "#ced4da",
        "badge": "#212529",
        "badge_txt": "#ffffff",},
    # Warm: cream paper, warm greys, terracotta accent. Hand-drawn explainers, workshops, blog posts.
    "warm": {
        "canvas": "#fdf8f1", "white": "#fffdf9", "paper": "#f6efe5", "lane": "#f3ebdf", "line": "#e6dccd",
        "stone": "#c4b6a4", "grey": "#70675d", "mid": "#5c544b", "ink": "#2d2926", "on_dark": "#d8cfc3",
        "accent": "#bb3f0d", "accent_bg": "#fff1e6", "accent_soft": "#ffc9a3",
        "bad": "#7d3a6e", "bad_bg": "#f7edf4", "bad_soft": "#dcb8d2",
        "good": "#3a7535", "good_bg": "#eff6ea", "good_soft": "#bfdcb3",
        "wait": "#8c6017", "wait_bg": "#faf1dc", "wait_soft": "#e7cf9c",
        "open": "#e0a800", "open_bg": "#fff8dc", "open_txt": "#7a5a00",
        "cat1": "#3c6c96", "cat1_bg": "#edf3f8", "cat1_soft": "#bcd2e6",
        "cat2": "#47725f", "cat2_bg": "#eef5f0", "cat2_soft": "#bfd8cb",
        "loud": "#2d2926",
        "loud_txt": "#fffdf9",
        "loud_sub": "#d8cfc3",
        "badge": "#2d2926",
        "badge_txt": "#fffdf9",},
    # Ink: deep navy ink on off-white paper, a single cobalt pen. Posters, editorial pieces, one-page summaries.
    "ink": {
        "canvas": "#f7f4ec", "white": "#fcfaf5", "paper": "#efebe0", "lane": "#ece7da", "line": "#dbd5c7",
        "stone": "#aaa69b", "grey": "#62666d", "mid": "#454b58", "ink": "#1b2030", "on_dark": "#c9cdd8",
        "accent": "#1d4ed8", "accent_bg": "#ebf0fd", "accent_soft": "#b3c5f5",
        "bad": "#b83729", "bad_bg": "#fbeeec", "bad_soft": "#efbdb6",
        "good": "#2b7349", "good_bg": "#ecf5ef", "good_soft": "#b5d8c2",
        "wait": "#955400", "wait_bg": "#fcf2e3", "wait_soft": "#f0cf9d",
        "open": "#1b2030", "open_bg": "#f7f4ec", "open_txt": "#1b2030",
        "cat1": "#1b2030", "cat1_bg": "#ece7da", "cat1_soft": "#8d8a82",
        "cat2": "#62666d", "cat2_bg": "#f7f4ec", "cat2_soft": "#c9c4b8",
        "loud": "#1b2030",
        "loud_txt": "#f7f4ec",
        "loud_sub": "#c9cdd8",
        "badge": "#1b2030",
        "badge_txt": "#f7f4ec",},
    # Playful: cream paper, soft ink, bright pastels, orange pen. Illustrated explainers for a general audience,
    # blog posts, onboarding. Pair it with tints() for one pastel per step.
    "playful": {
        "canvas": "#fffcf5", "white": "#ffffff", "paper": "#f8f4ec", "lane": "#f5efe3", "line": "#e6ddcd",
        "stone": "#c6bba8", "grey": "#6a645d", "mid": "#55504a", "ink": "#343a40", "on_dark": "#e9ecef",
        "accent": "#c2410c", "accent_bg": "#fff4e6", "accent_soft": "#ffc078",
        "bad": "#c92a2a", "bad_bg": "#fff5f5", "bad_soft": "#ffc9c9",
        "good": "#237032", "good_bg": "#ebfbee", "good_soft": "#b2f2bb",
        "wait": "#0b7285", "wait_bg": "#e3fafc", "wait_soft": "#99e9f2",
        "open": "#7048e8", "open_bg": "#f3f0ff", "open_txt": "#5f3dc4",
        "cat1": "#1864ab", "cat1_bg": "#e7f5ff", "cat1_soft": "#a5d8ff",
        "cat2": "#c2255c", "cat2_bg": "#fff0f6", "cat2_soft": "#fcc2d7",
        "loud": "#ffd43b",
        "loud_txt": "#343a40",
        "loud_sub": "#55504a",
        "badge": "#ffd43b",
        "badge_txt": "#343a40",},
    # Night: deep navy canvas, light ink, one cyan accent. Dark slides, developer talks, dark-mode documentation.
    "night": {
        "canvas": "#0e1016", "white": "#212739", "paper": "#1a1f2c", "lane": "#161a24", "line": "#3b445e",
        "stone": "#5b6683", "grey": "#9aa2b6", "mid": "#c3c9d8", "ink": "#eef1f7", "on_dark": "#c3c9d8",
        "accent": "#67e8f9", "accent_bg": "#15313a", "accent_soft": "#2b7080",
        "bad": "#fb7185", "bad_bg": "#3a1d26", "bad_soft": "#7a3445",
        "good": "#4ade80", "good_bg": "#173324", "good_soft": "#2f6b46",
        "wait": "#fbbf24", "wait_bg": "#382c12", "wait_soft": "#7a5f1f",
        "open": "#facc15", "open_bg": "#1a1f2c", "open_txt": "#fde68a",
        "cat1": "#a5b4fc", "cat1_bg": "#1d2140", "cat1_soft": "#4a538f",
        "cat2": "#f9a8d4", "cat2_bg": "#3a1f33", "cat2_soft": "#8a4a74",
        "loud": "#2b3350",
        "loud_txt": "#eef1f7",
        "loud_sub": "#c3c9d8",
        "badge": "#2b3350",
        "badge_txt": "#eef1f7",},
    # Mono: black ink on white, greys only. Print, black-and-white handouts, "sober / minimal" requests. Emphasis comes
    # from weight, fill and dashes, never from hue; the accent is the ink itself.
    "mono": {
        "canvas": "#ffffff", "white": "#ffffff", "paper": "#ececec", "lane": "#f2f2f2", "line": "#bdbdbd",
        "stone": "#8f8f8f", "grey": "#5f5f5f", "mid": "#3d3d3d", "ink": "#111111", "on_dark": "#cfcfcf",
        "accent": "#111111", "accent_bg": "#e0e0e0", "accent_soft": "#8f8f8f",
        "bad": "#6b6b6b", "bad_bg": "#ffffff", "bad_soft": "#bdbdbd",
        "good": "#2e2e2e", "good_bg": "#ececec", "good_soft": "#b0b0b0",
        "wait": "#4d4d4d", "wait_bg": "#ececec", "wait_soft": "#c2c2c2",
        "open": "#6e6e6e", "open_bg": "#ffffff", "open_txt": "#3d3d3d",
        "cat1": "#2b2b2b", "cat1_bg": "#e0e0e0", "cat1_soft": "#bababa",
        "cat2": "#565656", "cat2_bg": "#ffffff", "cat2_soft": "#cfcfcf",
        "loud": "#111111",
        "loud_txt": "#ffffff",
        "loud_sub": "#cfcfcf",
        "badge": "#111111",
        "badge_txt": "#ffffff",},
    # Whiteboard: white board, soft ink, hand lettering on crisp lines, one pastel family per role or actor.
    # Agent systems, product and tech posts, "how our setup works" for a team or a talk.
    "whiteboard": {
        "canvas": "#ffffff", "white": "#ffffff", "paper": "#f8f9fa", "lane": "#f6f6f8", "line": "#d7d9de",
        "stone": "#a9adb5", "grey": "#666b73", "mid": "#4a4f57", "ink": "#2b2f36", "on_dark": "#e9ecef",
        "accent": "#6741d9", "accent_bg": "#f1edff", "accent_soft": "#c9bdf7",
        "bad": "#c92a2a", "bad_bg": "#fff5f5", "bad_soft": "#ffc9c9",
        "good": "#1f6f31", "good_bg": "#e6f8e9", "good_soft": "#a9dcb4",
        "wait": "#b8470a", "wait_bg": "#fff4e6", "wait_soft": "#ffd8a8",
        "open": "#c99700", "open_bg": "#fff8db", "open_txt": "#7a5d00",
        "cat1": "#1864ab", "cat1_bg": "#e3eeff", "cat1_soft": "#9fc1ef",
        "cat2": "#0b7285", "cat2_bg": "#e3f8f6", "cat2_soft": "#97d9cf",
        "loud": "#e3eeff", "loud_txt": "#2b2f36", "loud_sub": "#4a4f57", "badge": "#2b2f36", "badge_txt": "#ffffff",
    },
}

# role -> kit attribute names it drives
_KIT = {
    "ink": ["INK"], "mid": ["MID"], "grey": ["GREY"], "line": ["LINE"], "paper": ["PAPER"], "stone": ["STONE"],
    "white": ["WHITE"], "lane": ["LANE"], "on_dark": ["ON_DARK"],
    "accent": ["ACCENT"], "accent_bg": ["ACCENT_BG"], "accent_soft": ["ACCENT_SOFT"],
    "bad": ["RED"], "bad_bg": ["RED_BG"], "bad_soft": ["RED_SOFT"],
    "good": ["GREEN"], "good_bg": ["GREEN_BG"], "good_soft": ["GREEN_SOFT"],
    "wait": ["ORANGE"], "wait_bg": ["ORANGE_BG"], "wait_soft": ["ORANGE_SOFT"],
    "open": ["YELLOW"], "open_bg": ["YELLOW_BG"], "open_txt": ["YELLOW_TXT"],
    "cat1": ["BLUE"], "cat1_bg": ["BLUE_BG"], "cat1_soft": ["BLUE_SOFT"],
    "cat2": ["TEAL"], "cat2_bg": ["TEAL_BG"], "cat2_soft": ["TEAL_SOFT"],
    "loud": ["LOUD"], "loud_txt": ["LOUD_TXT"], "loud_sub": ["LOUD_SUB"], "badge": ["BADGE"], "badge_txt": ["BADGE_TXT"],
    "canvas": ["CANVAS"],
}

_ORIGINAL = {a: getattr(excalikit.Palette, a) for names in _KIT.values() for a in names if hasattr(excalikit.Palette, a)}


def _swap(value, table):
    if isinstance(value, str):
        return table.get(value.lower(), value)
    if isinstance(value, tuple):
        return tuple(_swap(v, table) for v in value)
    return value


def use(name="clean"):
    """Recolour the kit with palette `name`; returns the palette dict (read 'canvas' for Scene.dump).
    Call once, before building the scene."""
    pal = PALETTES[name]
    current = {a: getattr(excalikit.Palette, a) for a in _ORIGINAL}
    table = {}
    for role, attrs in _KIT.items():
        for a in attrs:
            if a in current:
                table.setdefault(current[a].lower(), pal[role])   # first role wins (ink before loud)
                setattr(excalikit.Palette, a, pal[role])
    for fn in vars(excalikit.Scene).values():          # colour defaults were bound at import time
        if callable(fn) and getattr(fn, "__defaults__", None):
            fn.__defaults__ = tuple(_swap(v, table) for v in fn.__defaults__)
        if callable(fn) and getattr(fn, "__kwdefaults__", None):
            fn.__kwdefaults__ = {k: _swap(v, table) for k, v in fn.__kwdefaults__.items()}
    if hasattr(excalikit, "STATUS"):
        for k, v in list(excalikit.STATUS.items()):
            excalikit.STATUS[k] = _swap(v, table)
    return pal


# ---------------------------------------------------------------- styles (palette + rendering + shape + colour mood)
# A style is the whole look, chosen from the request and the audience (see references/styles.md). `mood` says how
# colour is spent: sober = neutrals + one accent; pastel = one tint per step or family (explainers, hubs);
# mono = no hue at all, emphasis by weight and fill.
STYLES = {
    # Each style is a grammar, not only a palette:
    #   font / title_font / label_font  Excalidraw font ids for body, titles (>= 28 px) and small labels (<= 13 px):
    #                                   6 Nunito, 5 Excalifont (hand), 9 Liberation Sans, 3 Cascadia (mono), 7 Lilita One
    #   title / sub / align             header sizes and alignment used by Scene.header()
    #   rule                            hairline rule under the header and above the footer
    #   sw / sw_key                     stroke of quiet boxes / of the key and loud boxes
    #   outline                         role that outlines solid boxes drawn with the quiet LINE / STONE colours
    #                                   (None keeps them; 'mid' or 'ink' gives a pen line)
    #   zone_fill                       'solid' or 'hachure' for tinted containers (zones, lanes, bands)
    #   curved                          arch the straight step-to-step arrows
    #   shadow                          solid offset shadow behind the loud and key boxes (sticker look)
    #   mood                            how colour is spent: sober, pastel (one tint per step / family), mono
    "signature": {"palette": "signature", "hand": False, "roughness": 0, "radius": 14, "mood": "sober",
                  "font": 6, "title_font": 5, "label_font": 6, "title": 56, "sub": 20, "align": "left",
                  "rule": False, "sw": 2, "sw_key": 3, "outline": None, "zone_fill": "solid", "curved": False,
                  "shadow": False,
                  "use": "DEFAULT house look for anything new: hand-lettered claim with a highlighter, sans body, "
                         "warm paper, one yellow hero, a burnt-orange voice for notes and the path"},
    "corporate": {"palette": "clean", "hand": False, "radius": 12, "mood": "sober",
                  "font": 6, "title_font": 6, "label_font": 6, "title": 36, "sub": 20, "align": "left", "rule": False,
                  "sw": 1.5, "sw_key": 2.5, "outline": None, "zone_fill": "solid", "curved": False, "shadow": False,
                  "use": "default; clients, management, slides, documentation"},
    "editorial": {"palette": "ink", "hand": False, "radius": 0, "mood": "sober",
                  "font": 9, "title_font": 9, "label_font": 9, "title": 44, "sub": 22, "align": "left", "rule": True,
                  "sw": 1, "sw_key": 2.5, "outline": "ink", "zone_fill": "solid", "curved": False, "shadow": False,
                  "use": "posters, one-page summaries, reports, articles"},
    "sketch": {"palette": "warm", "hand": True, "radius": 16, "mood": "sober",
               "font": 5, "title_font": 5, "label_font": 5, "title": 38, "sub": 20, "align": "left", "rule": False,
               "sw": 2, "sw_key": 3, "outline": "mid", "zone_fill": "hachure", "curved": True, "shadow": False,
               "use": "workshops, brainstorms, internal explainers, anything informal"},
    "playful": {"palette": "playful", "hand": True, "radius": 20, "mood": "pastel",
                "font": 5, "title_font": 7, "label_font": 5, "title": 40, "sub": 20, "align": "center", "rule": False,
                "sw": 2, "sw_key": 3, "outline": "ink", "zone_fill": "solid", "curved": True, "shadow": True,
                "use": "blog posts, onboarding, general public, when asked for friendly / fun / colourful"},
    "whiteboard": {"palette": "whiteboard", "hand": True, "roughness": 0, "radius": 14, "mood": "pastel",
                   "font": 5, "title_font": 5, "label_font": 5, "title": 36, "sub": 20, "align": "left",
                   "rule": False, "sw": 2, "sw_key": 3, "outline": "ink", "zone_fill": "solid", "curved": False,
                   "shadow": False,
                   "use": "agent and system maps, product or tech posts and talks: hand lettering, crisp lines, "
                          "line icons, one pastel per role"},
    "night": {"palette": "night", "hand": False, "radius": 12, "mood": "sober",
              "font": 6, "title_font": 6, "label_font": 3, "title": 36, "sub": 20, "align": "left", "rule": False,
              "sw": 1.5, "sw_key": 3, "outline": None, "zone_fill": "solid", "curved": False, "shadow": False,
              "use": "dark slides, developer talks, dark-mode docs"},
    "mono": {"palette": "mono", "hand": False, "radius": 2, "mood": "mono",
             "font": 9, "title_font": 9, "label_font": 9, "title": 36, "sub": 20, "align": "left", "rule": True,
             "sw": 1.5, "sw_key": 3, "outline": "ink", "zone_fill": "solid", "curved": False, "shadow": False,
             "use": "print, black and white, when asked for sober / minimal / no colour"},
}


def setup(args_hand=False, palette=None, style=None):
    """Common preamble for the examples. With `style`, the style decides palette, rendering and corner radius;
    otherwise palette (warm for hand-drawn unless given) and hand flag as before. Returns (Scene, palette dict);
    the style spec is in palette dict["_style"]."""
    spec = dict(STYLES[style]) if style else {"palette": palette or ("warm" if args_hand else "clean"),
                                              "hand": args_hand, "radius": 12, "mood": "sober"}
    if style and palette:
        spec["palette"] = palette
    pal = dict(use(spec["palette"]))
    pal["_style"] = spec
    excalikit.RADIUS = spec["radius"]
    base = {"font": None, "title_font": None, "label_font": None, "title": 36, "sub": 20, "align": "left",
            "rule": False, "sw": None, "sw_key": None, "outline": None, "zone_fill": "solid", "curved": False,
            "shadow": False, "tints": None}
    if spec.get("mood") == "pastel":
        base["tints"] = [f for f, _ in TINTS.get(spec["palette"], TINTS["playful"])]
    excalikit.set_style(dict(base, **spec))
    S = excalikit.Scene()
    if spec["hand"]:
        excalikit.hand_drawn(S)
    if "roughness" in spec:                          # hand lettering on crisp lines (whiteboard)
        S.roughness = spec["roughness"]
    return S, pal


def example(default_out, doc="", default_style=None):
    """Argument parsing shared by the examples: --style (or the older --hand / --palette), --out.
    Returns (args, Scene, palette dict)."""
    import argparse
    ap = argparse.ArgumentParser(description=doc)
    ap.add_argument("--out", default=default_out)
    ap.add_argument("--style", choices=sorted(STYLES), default=default_style,
                    help="whole look: " + ", ".join(f"{k} ({v['use']})" for k, v in STYLES.items()))
    ap.add_argument("--hand", action="store_true", help="hand-drawn look (without --style)")
    ap.add_argument("--palette", choices=sorted(PALETTES), help="palette only (overrides the style's palette)")
    args = ap.parse_args()
    style = args.style if (args.style or not (args.hand or args.palette)) else None
    S, pal = setup(args.hand, args.palette, style or (None if (args.hand or args.palette) else "corporate"))
    return args, S, pal


# ---------------------------------------------------------------- per-step tints (illustrated explainers)
# (card fill, badge fill) pairs. In an explainer each step may get its own pastel: colour paces the reading instead of
# coding a meaning, so no legend is needed. Keep the accent for the takeaway line. Badges carry ink numbers.
TINTS = {
    "playful": [("#fff3bf", "#ffd43b"), ("#d3f9d8", "#69db7c"), ("#e5dbff", "#b197fc"), ("#ffdeeb", "#faa2c1"),
                ("#d0ebff", "#74c0fc"), ("#c3fae8", "#63e6be"), ("#ffe8cc", "#ffa94d")],
    "whiteboard": [("#ece6ff", "#9f8fd9"), ("#e2f6e6", "#86c49a"), ("#fff4d1", "#d8b85a"), ("#ffe6ea", "#e09aa8"),
                   ("#dff5f2", "#7cbfb5"), ("#ffead8", "#e0a173"), ("#e1edff", "#86a9dc")],   # blue last: the loud card is blue
    "warm": [("#faefd9", "#e9c46a"), ("#f9e3d3", "#e5986b"), ("#e6efdf", "#9cc18b"), ("#ebe4f1", "#b5a2cf"),
             ("#f6e1e3", "#d99aa3"), ("#e1ebf3", "#8fb3d3"), ("#e0f0ec", "#86c2b2")],
}


def tints(n, name="playful", mood="pastel", key=None):
    """n (card fill, badge fill) pairs for the cards of a row.
    pastel: one tint per card (cycling); sober: neutral cards, the card at index `key` in the accent tint;
    mono: neutral cards, the key card in paper grey. Badge fills follow the same logic."""
    from excalikit import Palette as K
    if mood == "pastel":
        seq = TINTS.get(name, TINTS["playful"])
        return [seq[i % len(seq)] for i in range(n)]
    out = [(K.WHITE, K.INK) for _ in range(n)]
    if key is not None:
        out[key] = (K.ACCENT_BG, K.ACCENT) if mood == "sober" else (K.PAPER, K.INK)
    return out
