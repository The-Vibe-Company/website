import Image from "next/image";
import { Lock, Smartphone, Users, UsersRound } from "lucide-react";

import { EnsembleFlourish } from "@/components/coup-de-pates/EnsembleMarks";
import { EnsembleStoreButton } from "@/components/coup-de-pates/EnsembleStoreButton";
import { ENSEMBLE_STORE_URLS } from "@/lib/coup-de-pates-ensemble";

// Deliberately monolingual: this client page only exists in French, so the copy
// lives here instead of in the site's message catalogues.
const FACTS = [
  { Icon: Lock, text: "Sécurisée et réservée aux collaborateurs" },
  { Icon: Smartphone, text: "Accessible sur mobile professionnel ou personnel" },
  { Icon: UsersRound, text: "Une seule application pour rester connecté" },
];

export function EnsembleLanding({ fontClassName }: { fontClassName: string }) {
  return (
    <div className={`cdpe-page ${fontClassName}`}>
      <main id="main-content" tabIndex={-1} className="cdpe-shell">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clients/coup-de-pates.svg"
          alt="Coup de Pates, tradition et innovation"
          className="cdpe-logo"
          width={583}
          height={118}
        />

        <h1 className="cdpe-title">
          Coup de Pates
          <Image
            src="/images/coup-de-pates-ensemble/ensemble.png"
            alt="Ensemble"
            width={552}
            height={134}
            priority
            className="cdpe-title__script"
          />
        </h1>

        <p className="cdpe-tagline">L’application des collaborateurs Coup de Pates</p>

        <div className="cdpe-rule" aria-hidden="true">
          <Users strokeWidth={2.25} />
        </div>

        <p className="cdpe-lead">
          Partageons ensemble les moments qui font vivre notre entreprise.
        </p>

        <Image
          src="/images/coup-de-pates-ensemble/app-accueil.webp"
          alt="L’écran d’accueil de l’application Coup de Pates Ensemble sur un téléphone, entouré de photos de collaborateurs, des locaux de Coup de Pates et d’un boulanger au travail."
          width={1500}
          height={952}
          priority
          sizes="(max-width: 752px) 100vw, 720px"
          className="cdpe-montage"
        />

        <section className="cdpe-download" aria-labelledby="cdpe-download-title">
          <h2 id="cdpe-download-title" className="cdpe-download__title">
            <EnsembleFlourish />
            <span>Téléchargez l’application</span>
            <EnsembleFlourish flipped />
          </h2>
          <span className="cdpe-download__underline" aria-hidden="true" />

          <div className="cdpe-stores">
            <EnsembleStoreButton store="appStore" href={ENSEMBLE_STORE_URLS.appStore} />
            <EnsembleStoreButton store="googlePlay" href={ENSEMBLE_STORE_URLS.googlePlay} />
          </div>
        </section>

        <ul className="cdpe-facts">
          {FACTS.map(({ Icon, text }) => (
            <li key={text}>
              <span className="cdpe-facts__icon">
                <Icon aria-hidden="true" strokeWidth={1.75} />
              </span>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </main>

      <p className="cdpe-banner">Proximité · Excellence · Passion</p>
    </div>
  );
}
