#!/usr/bin/env python3
"""Build the two self-hosted Bricolage Grotesque instances in src/app/fonts/.

The Google Fonts file (latin subset, wght + opsz + wdth axes) weighs ~130 KB:
too heavy for the mobile LCP path. The site only uses two corners of it:

- display titles (`.display`, article headings): wdth 92, opsz 96,
  weights 600-700  -> bricolage-display-latin.woff2 (~34 KB)
- running text: wdth 100, weights 300-800, opsz pinned at 16, the size most
  of the text is set at                         -> bricolage-text-latin.woff2 (~39 KB)

Bricolage Grotesque is under the SIL Open Font License 1.1 (no reserved
font name), which allows these derived instances.

Usage (needs fonttools and brotli: `pip install fonttools brotli`):
  python3 scripts/fonts/build-bricolage.py
"""
import io
import os
import re
import urllib.request

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

CSS_URL = (
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:"
    "opsz,wdth,wght@12..96,75..100,200..800&display=swap"
)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36"
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "src", "app", "fonts")

INSTANCES = {
    "bricolage-display-latin.woff2": {"wdth": 92, "opsz": 96, "wght": (600, 700)},
    "bricolage-text-latin.woff2": {"wdth": 100, "opsz": 16, "wght": (300, 800)},
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


def latin_source() -> bytes:
    css = fetch(CSS_URL).decode()
    # Google lists one @font-face per subset; the latin one is introduced by
    # a "/* latin */" comment.
    block = css.split("/* latin */", 1)[1].split("}", 1)[0]
    url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    return fetch(url)


def main() -> None:
    source = latin_source()
    os.makedirs(OUT, exist_ok=True)
    for name, limits in INSTANCES.items():
        font = instancer.instantiateVariableFont(TTFont(io.BytesIO(source)), limits)
        font.flavor = "woff2"
        path = os.path.join(OUT, name)
        font.save(path)
        print(f"{name}: {os.path.getsize(path) / 1024:.1f} KB {limits}")


if __name__ == "__main__":
    main()
