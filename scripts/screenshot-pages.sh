#!/usr/bin/env bash
# Full-page screenshots of local pages with agent-browser, for visual review.
#
#   ./scripts/screenshot-pages.sh <out-dir> /fr /fr/portfolio /en/resources ...
#
# Each page is scrolled top to bottom first so scroll-triggered animations have
# played, then captured at 1440x900 to <out-dir>/<path-with-dashes>.png.
# Set WIDTH/HEIGHT to change the viewport (e.g. WIDTH=390 HEIGHT=844 for a phone).
# Needs the dev server (./scripts/dev-start.sh).
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "usage: $0 <out-dir> <path> [path...]" >&2
  exit 1
fi

OUT="$1"
shift
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"

PORT="${CONDUCTOR_PORT:-${PORT:-4200}}"
WIDTH="${WIDTH:-1440}"
HEIGHT="${HEIGHT:-900}"

agent-browser set viewport "$WIDTH" "$HEIGHT" >/dev/null

for path in "$@"; do
  name="$(echo "$path" | sed -e 's#^/##' -e 's#/#-#g')"
  name="${name:-root}"
  agent-browser open "http://localhost:${PORT}${path}" >/dev/null
  agent-browser wait 2500 >/dev/null
  agent-browser eval "(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo(0, 0); })()" >/dev/null
  agent-browser wait 600 >/dev/null
  agent-browser screenshot "$OUT/${name}.png" --full >/dev/null
  echo "$OUT/${name}.png"
done
