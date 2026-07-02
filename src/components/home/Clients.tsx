import { Marquee } from "@/components/Marquee";

interface Client {
  name: string;
  src: string;
  /**
   * Per-logo height, tuned by eye so every mark reads at roughly the same
   * optical size. Logos have very different shapes and weights, so a single
   * shared size makes some look bigger than others; balancing height per logo
   * is the standard way to keep a logo wall fair.
   */
  className: string;
}

const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", className: "h-5 md:h-6" },
  { name: "Coup de Pâtes", src: "/images/clients/coup-de-pates.svg", className: "h-6 md:h-7" },
  { name: "Monka", src: "/images/clients/monka.webp", className: "h-7 md:h-9" },
  { name: "Trusk", src: "/images/clients/trusk.svg", className: "h-4 md:h-5" },
  { name: "LocService", src: "/images/clients/locservice.png", className: "h-6 md:h-7" },
  { name: "Zapa", src: "/images/clients/zapa.svg", className: "h-7 md:h-9" },
];

export function Clients() {
  return (
    <section id="clients" className="bg-background py-20 md:py-24">
      <p className="mb-8 px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:mb-10">
        Trusted by
      </p>
      <Marquee>
        {CLIENTS.map((client) => (
          <div key={client.name} className="mx-8 flex h-12 shrink-0 items-center md:mx-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.src}
              alt={client.name}
              className={`${client.className} w-auto object-contain grayscale`}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
