import { Download } from "lucide-react";

import { AppleMark, GooglePlayMark } from "@/components/coup-de-pates/EnsembleMarks";
import type { EnsembleStore } from "@/lib/coup-de-pates-ensemble";

const STORES = {
  appStore: {
    name: "l’App Store",
    label: "Télécharger sur",
    modifier: "cdpe-store--apple",
  },
  googlePlay: {
    name: "Google Play",
    label: "Disponible sur",
    modifier: "cdpe-store--google",
  },
} as const satisfies Record<EnsembleStore, { name: string; label: string; modifier: string }>;

const PENDING_LABEL = "Bientôt disponible";

/**
 * A TestFlight invitation is not a store page. It opens Apple's beta app, which
 * the visitor may still have to install first, so the button names TestFlight
 * instead of promising an App Store listing it does not lead to. The day the
 * real listing exists, swapping the URL restores the store wording on its own.
 */
const TESTFLIGHT = {
  host: "testflight.apple.com",
  name: "TestFlight",
  label: "Tester la bêta sur",
};

/**
 * An APK link is not Google Play either. It downloads a file the visitor then
 * has to authorise Android to install, so the button says it downloads an APK
 * and drops the Play mark, which would claim a provenance the file does not
 * have. Same rule as above: the store wording comes back with the store URL.
 */
const APK = {
  name: "Android",
  label: "Télécharger l’APK",
};

function destination(href: string): "testflight" | "apk" | "store" {
  try {
    const url = new URL(href);
    if (url.hostname === TESTFLIGHT.host) return "testflight";
    if (url.pathname.toLowerCase().endsWith(".apk")) return "apk";
  } catch {
    // Not a URL we can read: fall through and keep the store wording.
  }
  return "store";
}

/**
 * One store control. With a URL it is a link straight to that destination;
 * without one it is a disabled button that says the app is not published yet,
 * so nobody lands on a dead or invented page.
 */
export function EnsembleStoreButton({
  store,
  href,
}: {
  store: EnsembleStore;
  href?: string;
}) {
  const storeDefaults = STORES[store];
  const kind = href === undefined ? "pending" : destination(href);
  const { name, label } =
    kind === "testflight" ? TESTFLIGHT : kind === "apk" ? APK : storeDefaults;

  const mark =
    store === "appStore" ? (
      <AppleMark />
    ) : kind === "apk" ? (
      <Download className="cdpe-store__mark" strokeWidth={2.25} aria-hidden="true" />
    ) : (
      <GooglePlayMark muted={!href} />
    );

  const content = (
    <>
      {mark}
      <span>
        <span className="cdpe-store__label">
          {kind === "pending" ? PENDING_LABEL : label}
        </span>
        <span className="cdpe-store__name">{name}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <button type="button" disabled className={`cdpe-store ${storeDefaults.modifier}`}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cdpe-store ${storeDefaults.modifier}`}
    >
      {content}
    </a>
  );
}
