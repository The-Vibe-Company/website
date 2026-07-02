import { Marquee } from "@/components/Marquee";

interface Client {
  name: string;
  src: string;
  url: string;
  /**
   * Per-logo height, tuned by eye so every mark reads at roughly the same
   * optical size. Logos have very different shapes and weights, so a single
   * shared size makes some look bigger than others; balancing height per logo
   * is the standard way to keep a logo wall fair.
   */
  className: string;
}

const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com", className: "h-5 md:h-7" },
  { name: "Coup de Pâtes", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr", className: "h-6 md:h-7" },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care", className: "h-6 md:h-8" },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com", className: "h-5 md:h-6" },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr", className: "h-4 md:h-6" },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr", className: "h-7 md:h-9" },
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
            className="mx-8 flex h-12 shrink-0 items-center opacity-100 transition-opacity duration-200 hover:opacity-50 md:mx-12"
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
