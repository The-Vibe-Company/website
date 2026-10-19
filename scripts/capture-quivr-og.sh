#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# capture-quivr-og.sh — Quivr social cards from the web app drawn in code
#
# Usage: ./scripts/capture-quivr-og.sh
#
# Captures the Quivr V2 web app drawn by QuivrFeedMock on /fr and
# /en/portfolio/quivr, at 2x, and writes the 1200x630 Open Graph / Twitter
# cards public/projects/quivr-og-{fr,en}.jpg. Needs the dev server
# (./scripts/dev-start.sh) and agent-browser. Re-run whenever the mock or its
# copy changes, then commit the two images.
# =============================================================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEV_PORT="${CONDUCTOR_PORT:-${PORT:-4200}}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"; agent-browser close >/dev/null 2>&1 || true' EXIT
export AGENT_BROWSER_SESSION="quivr-og"

command -v agent-browser >/dev/null || { echo "agent-browser is required" >&2; exit 1; }
curl -sf -o /dev/null "http://localhost:$DEV_PORT" || {
  echo "No dev server on port $DEV_PORT: run ./scripts/dev-start.sh first" >&2
  exit 1
}

# Retina, so the 1184px-wide mock downscales to a sharp 1200px card.
agent-browser set device "Desktop Chrome HiDPI" >/dev/null
agent-browser set viewport 1440 1000 >/dev/null

for locale in fr en; do
  agent-browser open "http://localhost:$DEV_PORT/$locale/portfolio/quivr" >/dev/null
  agent-browser wait "[data-quivr-mock]" >/dev/null
  # Below the sticky header, then wait for the pulse dot and fonts to settle.
  agent-browser eval "window.scrollTo(0, document.querySelector('[data-quivr-mock]').getBoundingClientRect().top + window.scrollY - 100)" >/dev/null
  agent-browser wait 1500 >/dev/null
  box="$(agent-browser eval "(() => { const r = document.querySelector('[data-quivr-mock]').getBoundingClientRect(); return [r.left, r.top, r.width, r.height, window.devicePixelRatio].join(','); })()" | tr -d '"')"
  agent-browser screenshot "$TMP_DIR/$locale.png" >/dev/null

  bun -e '
    import sharp from "sharp";
    const [src, out, box] = process.argv.slice(1);
    const [left, top, width, height, dpr] = box.split(",").map(Number);
    await sharp(src)
      .extract({
        left: Math.round(left * dpr),
        top: Math.round(top * dpr),
        width: Math.round(width * dpr),
        height: Math.round(height * dpr),
      })
      .resize({ width: 1200, height: 630, fit: "cover", position: "top" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out);
  ' "$TMP_DIR/$locale.png" "$ROOT_DIR/public/projects/quivr-og-$locale.jpg" "$box"
  echo "Wrote public/projects/quivr-og-$locale.jpg"
done
