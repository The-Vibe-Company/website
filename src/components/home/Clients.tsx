import { Marquee } from "@/components/Marquee";

interface Client {
  name: string;
  src: string;
  url: string;
  /**
   * Per-logo height, tuned by eye so every logo's MAIN wordmark reads at
   * roughly the same optical size. Logos have very different shapes and
   * weights, and some carry a small tagline underneath (Monka, Coup de Pâtes);
   * the tagline is kept but is NOT counted in the sizing/centering. For those,
   * the height targets the wordmark (so the mark matches the others) and a
   * small downward translate re-centers the wordmark on the row, letting the
   * tagline hang below.
   */
  className: string;
}

const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com", className: "h-5 md:h-7" },
  { name: "Coup de Pâtes", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr", className: "h-8 md:h-11 translate-y-[3px] md:translate-y-[4px]" },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care", className: "h-11 md:h-14 translate-y-[8px] md:translate-y-[10px]" },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com", className: "h-5 md:h-6" },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr", className: "h-4 md:h-6" },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr", className: "h-9 md:h-11" },
];

export function Clients() {
  return (
    <section id="clients" className="bg-background py-20 md:py-24">
      <p className="mb-8 px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:mb-10">
        Trusted by
      </p>
      <Marquee>
        {CLIENTS.map((client) => (
          <a
            key={client.name}
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={client.name}
            className="mx-8 flex h-16 shrink-0 items-center overflow-visible transition-opacity duration-200 hover:opacity-50 md:mx-12 md:h-[4.5rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.src}
              alt={client.name}
              className={`${client.className} w-auto object-contain brightness-0`}
              loading="eager"
              decoding="async"
            />
          </a>
        ))}
      </Marquee>
    </section>
  );
}
