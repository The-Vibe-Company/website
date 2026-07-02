import { Marquee } from "@/components/Marquee";

interface Client {
  name: string;
  src: string;
}

const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg" },
  { name: "Coup de Pâtes", src: "/images/clients/coup-de-pates.svg" },
  { name: "Monka", src: "/images/clients/monka.webp" },
];

export function Clients() {
  return (
    <section id="clients" className="bg-background py-20 md:py-24">
      <p className="mb-8 px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:mb-10">
        Trusted by
      </p>
      <Marquee>
        {CLIENTS.map((client) => (
          <div key={client.name} className="mx-10 flex shrink-0 items-center md:mx-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.src}
              alt={client.name}
              className="h-8 w-auto object-contain opacity-70 grayscale md:h-10"
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
