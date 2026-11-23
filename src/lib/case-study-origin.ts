/**
 * In-memory note of the last case card click: the page it was clicked from
 * and the case study it opened. Module state survives client-side navigation
 * and nothing is written to browser storage or the URL.
 */
let lastCardClick: { from: string; to: string } | null = null;

export function rememberCardClick(from: string, to: string): void {
  lastCardClick = { from, to };
}

/**
 * The page the card leading to `pathname` was clicked from, if any. A note
 * for another page is stale (the visitor moved on without a card) and is
 * dropped. Matching does not clear it, so a repeated read gives the same answer.
 */
export function cardOriginFor(pathname: string): string | null {
  if (lastCardClick?.to === pathname) return lastCardClick.from;
  lastCardClick = null;
  return null;
}
