#!/usr/bin/env bash
# Count commits per day on the default branch (main) of The Vibe Company's public repos.
# Author date in Europe/Paris. All authors count (coding agents commit under the owner's git identity).
# "nonbot" excludes github-actions[bot] release commits.
# Usage: ./count-commits.sh > commits-per-day.csv
set -euo pipefail
export TZ=Europe/Paris
WORK=${WORK:-$(mktemp -d)}
echo "repo,date,commits_all,commits_nonbot,commits_00_06_nonbot"
for repo in armada quivr openboard; do
  case $repo in
    quivr) url=https://github.com/The-Vibe-Company/quivr.git ;;
    *) url=https://github.com/The-Vibe-Company/$repo.git ;;
  esac
  [ -d "$WORK/$repo.git" ] || git clone -q --bare "$url" "$WORK/$repo.git"
  git -C "$WORK/$repo.git" log main --format='%ad|%an' --date=format-local:'%Y-%m-%d|%H' \
    --since=2026-09-28T00:00 --until=2026-11-27T00:00 |
  awk -F'|' -v r="$repo" '{
      d=$1; h=$2+0; bot=($3 ~ /github-actions\[bot\]/);
      all[d]++; if(!bot){nb[d]++; if(h<7) night[d]++}
    } END { for (d in all) printf "%s,%s,%d,%d,%d\n", r, d, all[d], nb[d]+0, night[d]+0 }' | sort
done
# Reverts on Armada, 30/10 to 26/11/2026 (non-bot commits whose subject starts with "revert"):
git -C "$WORK/armada.git" log main --format='%an|%s' --since=2026-10-30T00:00 --until=2026-11-27T00:00 |
  awk -F'|' '$1 !~ /github-actions\[bot\]/ && tolower($2) ~ /^revert/' | wc -l | sed 's/^/# armada reverts 30\/10-26\/11: /' >&2
