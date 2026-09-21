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
 * An entry may legitimately point somewhere other than a store while the app is
 * still in beta: a TestFlight invitation, or an APK to download straight from
 * the EAS build. The button reads its destination and names it, so replacing a
 * line here with the real store URL restores the store wording on its own, with
 * nothing else to remember.
 *
 * The Android entry is an EAS build artifact. Expo keeps those for a limited
 * time, so this URL will stop working and has to be refreshed with each new
 * build until the app reaches Google Play.
 */
export const ENSEMBLE_STORE_URLS: Partial<Record<EnsembleStore, string>> = {
  appStore: "https://testflight.apple.com/join/SDtzxs2A",
  googlePlay:
    "https://expo.dev/artifacts/eas/JFZuAcnl7MxJetOuWufd5SbaSEJpMU21eiaLoFXP_N8.apk",
};
