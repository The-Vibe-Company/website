#!/usr/bin/env bash
# Prevents re-introducing src/app/layout.tsx which conflicts with Payload's own root layout.
# Each route group ((frontend), (payload)) must have its own independent <html> root layout.
# A shared root layout wraps both groups with a duplicate <html>, causing React hydration error #418.

if [ -f "src/app/layout.tsx" ] || [ -f "src/app/layout.ts" ] || [ -f "src/app/layout.jsx" ] || [ -f "src/app/layout.js" ]; then
  echo "ERROR: src/app/layout.tsx must not exist!"
  echo ""
  echo "The (payload) route group has its own root layout that renders <html>."
  echo "A root layout at src/app/layout.tsx would wrap it, creating duplicate <html>"
  echo "elements and causing React hydration error #418 (blank admin page)."
  echo ""
  echo "Instead, put your frontend root layout in src/app/(frontend)/layout.tsx"
  exit 1
fi
