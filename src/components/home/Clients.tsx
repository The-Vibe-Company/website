/**
 * The clients whose logos the site shows: the homepage's logo loop, the About
 * page and the agency pages draw them from this list.
 */
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

export const CLIENTS: Client[] = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com", className: "h-8 md:h-9" },
  { name: "Coup de Pates", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr", className: "h-9 md:h-11" },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care", className: "h-10 md:h-12" },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com", className: "h-6 md:h-7" },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr", className: "h-6 md:h-7" },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr", className: "h-6 md:h-7" },
  { name: "Theodo", src: "/images/clients/theodo.svg", url: "https://www.theodo.com", className: "h-6 md:h-7" },
];
