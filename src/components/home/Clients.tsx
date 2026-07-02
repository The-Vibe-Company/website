import { Marquee } from "@/components/Marquee";

interface Client {
  name: string;
  src: string;
  url: string;
  /**
   * Per-logo height, tuned by eye so every logo reads at roughly the same
   * optical size. Each asset is trimmed to its content, so the whole logo
   * (tagline included) centers cleanly on the row.
   */
  className: string;
}

const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com", className: "h-5 md:h-7" },
  { name: "Coup de Pâtes", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr", className: "h-9 md:h-11" },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care", className: "h-9 md:h-11" },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com", className: "h-5 md:h-6" },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr", className: "h-4 md:h-6" },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr", className: "h-9 md:h-11" },
];

export function Clients() {
  return (
    <section id="clients" className="bg-background py-10 md:py-12">
      <p className="mb-6 px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:mb-7">
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
            className="mx-8 flex h-12 shrink-0 items-center transition-opacity duration-200 hover:opacity-50 md:mx-12"
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
