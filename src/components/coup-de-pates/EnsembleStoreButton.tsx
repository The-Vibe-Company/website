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
 * One store control. With a URL it is a link straight to the official listing;
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
  const { name, label, modifier } = STORES[store];
  const mark = store === "appStore" ? <AppleMark /> : <GooglePlayMark muted={!href} />;

  const content = (
    <>
      {mark}
      <span>
        <span className="cdpe-store__label">{href ? label : PENDING_LABEL}</span>
        <span className="cdpe-store__name">{name}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <button type="button" disabled className={`cdpe-store ${modifier}`}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cdpe-store ${modifier}`}
    >
      {content}
    </a>
  );
}
