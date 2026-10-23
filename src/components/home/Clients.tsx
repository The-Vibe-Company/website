import { useTranslations } from "next-intl";
import { Kicker } from "@/components/kit";

interface Client {
  name: string;
  src: string;
  url: string;
  /**
   * Per-logo height, tuned by eye so every logo reads at roughly the same
   * optical size. Each asset is trimmed to its content, so the whole logo
   * (tagline included) centers cleanly on the row. Other pages that list the
   * clients (À propos) read this one.
   */
  className: string;
  /** Intrinsic size of the asset: reserves the logo's room before it loads. */
  width: number;
  height: number;
  /** Height of the logo on the shelf, in px: on phones, then from 768px. */
  phone: number;
  shelf: number;
}

export const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com", className: "h-8 md:h-9", width: 299, height: 95, phone: 22, shelf: 32 },
  { name: "Coup de Pates", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr", className: "h-9 md:h-11", width: 583, height: 118, phone: 24, shelf: 36 },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care", className: "h-10 md:h-12", width: 600, height: 210, phone: 30, shelf: 44 },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com", className: "h-6 md:h-7", width: 147, height: 44, phone: 18, shelf: 26 },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr", className: "h-6 md:h-7", width: 256, height: 43, phone: 18, shelf: 26 },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr", className: "h-6 md:h-7", width: 71, height: 20, phone: 18, shelf: 26 },
  { name: "Theodo", src: "/images/clients/theodo.svg", url: "https://www.theodo.com", className: "h-6 md:h-7", width: 111, height: 24, phone: 18, shelf: 26 },
];

/**
 * The client wall: one quiet clay shelf whose logos slide past slowly, in ink.
 * The track holds the seven logos twice (the copy hidden from assistive tech
 * and the keyboard) and slides by half its width, so the loop has no seam. It
 * pauses under the pointer or the keyboard, and under reduced motion it stops
 * and shows the seven logos once, wrapped and centred. Every logo carries its
 * intrinsic size, so the shelf never changes height when the images arrive.
 */
export function Clients() {
  const t = useTranslations("clients");

  const logos = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={`shelf-set m-0 list-none pl-0${copy ? " shelf-copy" : ""}`}
    >
      {CLIENTS.map((client) => (
        <li key={client.name} className="flex h-[72px] shrink-0 items-center md:h-24">
          <a
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={client.name}
            tabIndex={copy ? -1 : undefined}
            className="flex min-h-11 items-center justify-center rounded-lg px-1 transition-opacity duration-200 hover:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.src}
              alt=""
              width={client.width}
              height={client.height}
              style={{ "--phone": `${client.phone}px`, "--shelf": `${client.shelf}px` } as React.CSSProperties}
              className="h-[var(--phone)] w-auto object-contain brightness-0 md:h-[var(--shelf)]"
              loading="eager"
              decoding="async"
            />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="clients" className="pt-[72px] md:pt-24">
      <div className="wrap">
        <Kicker className="justify-center">{t("trustedBy")}</Kicker>
        <div className="clay-quiet mt-5 overflow-hidden rounded-plate lg:rounded-full">
          <div className="shelf [--shelf-duration:32s] md:[--shelf-duration:44s]">
            <div className="shelf-track">
              {logos(false)}
              {logos(true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
