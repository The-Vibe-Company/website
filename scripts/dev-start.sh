#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# dev-start.sh — Idempotent dev environment bootstrap
#
# Usage: ./scripts/dev-start.sh          Start/verify dev server
#        ./scripts/dev-start.sh --stop   Stop the dev server
#        ./scripts/dev-start.sh --status Check if running
#
# Idempotent: safe to run N times. If the server is healthy, exits instantly.
# =============================================================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEV_PORT=4200
PID_FILE="$ROOT_DIR/.dev-server.pid"
LOG_FILE="$ROOT_DIR/.dev-server.log"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
die()   { echo -e "${RED}[✗]${NC} $*" >&2; exit 1; }

# --------------- helpers ---------------

is_port_listening() {
  lsof -iTCP:"$DEV_PORT" -sTCP:LISTEN -t &>/dev/null
}

is_server_healthy() {
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$DEV_PORT" 2>/dev/null || echo "000")
  [[ "$code" =~ ^[23] ]]
}

get_pid_on_port() {
  lsof -iTCP:"$DEV_PORT" -sTCP:LISTEN -t 2>/dev/null | head -1
}

kill_server() {
  local pid
  # Kill by PID file
  if [ -f "$PID_FILE" ]; then
    pid=$(cat "$PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
  # Kill anything still on the port
  if is_port_listening; then
    pid=$(get_pid_on_port)
    if [ -n "$pid" ]; then
      kill "$pid" 2>/dev/null || true
    fi
  fi
  # Kill any next dev process running from this project (any port)
  local stale_pids_list
  stale_pids_list=$(pgrep -f "next dev.*$(basename "$ROOT_DIR")" 2>/dev/null || true)
  if [ -n "$stale_pids_list" ]; then
    echo "$stale_pids_list" | while read -r pid; do
      kill "$pid" 2>/dev/null || true
    done
  fi
  # Remove stale Next.js lock
  rm -f "$ROOT_DIR/.next/dev/lock"
  sleep 1
}

# --------------- commands ---------------

cmd_stop() {
  kill_server
  info "Dev server stopped"
}

cmd_status() {
  if is_port_listening && is_server_healthy; then
    info "Dev server running on http://localhost:$DEV_PORT (PID: $(get_pid_on_port))"
    return 0
  elif is_port_listening; then
    warn "Port $DEV_PORT is occupied but server is not healthy"
    return 1
  else
    warn "Dev server is not running"
    return 1
  fi
}

cmd_start() {
  cd "$ROOT_DIR"

  # --- Fast path: already running and healthy? Do nothing. ---
  if is_port_listening && is_server_healthy; then
    info "Dev server already running on http://localhost:$DEV_PORT"
    exit 0
  fi

  # --- Kill any existing next dev for this project (any port) ---
  local stale_pids
  stale_pids=$(pgrep -f "next dev.*$(basename "$ROOT_DIR")" 2>/dev/null || true)
  if [ -n "$stale_pids" ] || is_port_listening; then
    warn "Cleaning up existing next dev processes..."
    kill_server
  fi

  # --- Clean stale PID file ---
  if [ -f "$PID_FILE" ]; then
    local old_pid
    old_pid=$(cat "$PID_FILE")
    if ! kill -0 "$old_pid" 2>/dev/null; then
      rm -f "$PID_FILE"
    fi
  fi

  # --- Remove stale Next.js lock (safety net) ---
  rm -f "$ROOT_DIR/.next/dev/lock"

  # --- Check bun ---
  command -v bun &>/dev/null || die "bun not found. Install: curl -fsSL https://bun.sh/install | bash"
  info "bun $(bun --version)"

  # --- Install deps (bun install is idempotent) ---
  info "Checking dependencies..."
  if [ ! -d "$ROOT_DIR/node_modules" ]; then
    bun install --frozen-lockfile 2>&1 | tail -3
  fi
  info "Dependencies OK"

  # --- Start dev server on unique port ---
  warn "Starting dev server on port $DEV_PORT..."
  NODE_OPTIONS="--max-old-space-size=8192" nohup bun run dev --port "$DEV_PORT" > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  # --- Wait for healthy response ---
  local waited=0
  local max_wait=90
  while [ $waited -lt $max_wait ]; do
    if is_server_healthy; then
      echo ""
      info "Dev server ready at http://localhost:$DEV_PORT (PID: $(cat "$PID_FILE"))"
      exit 0
    fi
    # Check process didn't crash
    if [ -f "$PID_FILE" ] && ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo ""
      die "Dev server crashed. Logs:\n$(tail -30 "$LOG_FILE")"
    fi
    printf "."
    sleep 2
    waited=$((waited + 2))
  done

  echo ""
  die "Timeout (${max_wait}s). Logs:\n$(tail -30 "$LOG_FILE")"
}

# --------------- main ---------------

case "${1:-}" in
  --stop)   cmd_stop   ;;
  --status) cmd_status ;;
  *)        cmd_start  ;;
esac
