/**
 * Unlisted download page for "Coup de Pates Ensemble", the employee app we
 * built for Coup de Pates. The page is French-only and reachable by link only.
 */
export const ENSEMBLE_PATH = "/coup-de-pates-ensemble";

export type EnsembleStore = "appStore" | "googlePlay";

/**
 * Where each button sends the visitor, filled in one by one as Coup de Pates
 * sends the addresses.
 *
 * A missing entry renders that store as a disabled "Bientôt disponible"
 * control: the page never guesses a URL, never points at a store search, and
 * never sniffs the visitor's device to redirect them somewhere.
 *
 * An entry may legitimately be a TestFlight invitation rather than a store
 * listing while the app is still in beta. The button reads the destination and
 * names it, so replacing this line with the real App Store URL is all it takes
 * to turn the beta wording back into "Télécharger sur l'App Store".
 */
export const ENSEMBLE_STORE_URLS: Partial<Record<EnsembleStore, string>> = {
  appStore: "https://testflight.apple.com/join/SDtzxs2A",
  // googlePlay: "https://play.google.com/store/apps/details?id=…",
};
