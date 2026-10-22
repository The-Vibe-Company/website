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
 * The client wall: one quiet clay shelf holding the seven logos in ink. A
 * three-column grid on phones, one row from 768px. Every logo carries its
 * intrinsic size, so the shelf is the same height before and after the images
 * arrive and nothing below it moves.
 */
export function Clients() {
  const t = useTranslations("clients");

  return (
    <section id="clients" className="pt-[72px] md:pt-24">
      <div className="wrap">
        <Kicker className="justify-center">{t("trustedBy")}</Kicker>
        <ul className="clay-quiet m-0 mt-5 grid list-none grid-cols-3 rounded-plate p-2 md:flex md:h-24 md:items-center md:justify-between md:gap-7 md:rounded-full md:px-11 md:py-0">
          {CLIENTS.map((client) => (
            <li
              key={client.name}
              className="flex h-[68px] items-center justify-center last:col-span-3 md:h-auto md:last:col-span-1"
            >
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="flex min-h-11 items-center justify-center px-2 transition-opacity md:px-0 duration-200 hover:opacity-55"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt=""
                  width={client.width}
                  height={client.height}
                  style={{ "--phone": `${client.phone}px`, "--shelf": `${client.shelf}px` } as React.CSSProperties}
                  className="h-[var(--phone)] w-auto max-w-[92px] object-contain brightness-0 md:h-[var(--shelf)] md:max-w-none"
                  loading="eager"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
