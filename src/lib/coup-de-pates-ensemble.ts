/**
 * Unlisted download page for "Coup de Pates Ensemble", the employee app we
 * built for Coup de Pates. The page is French-only and reachable by link only.
 */
export const ENSEMBLE_PATH = "/coup-de-pates-ensemble";

export type EnsembleStore = "appStore" | "googlePlay";

/**
 * Official store listings, filled in one by one as Coup de Pates sends them.
 *
 * A missing entry renders that store as a disabled "Bientôt disponible"
 * control: the page never guesses a URL, never points at a store search, and
 * never sniffs the visitor's device to redirect them somewhere.
 */
export const ENSEMBLE_STORE_URLS: Partial<Record<EnsembleStore, string>> = {
  // appStore: "https://apps.apple.com/fr/app/…",
  // googlePlay: "https://play.google.com/store/apps/details?id=…",
};
