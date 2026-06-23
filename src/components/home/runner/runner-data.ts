// Shared, presentational data for the playable-runner homepage (preview /v2).
// Consumed by HomeSections.tsx (work grid + departures). The game engine in
// VibeRunner.tsx keeps its own world/death data internally.

export interface Project {
  name: string;
  date: string;
  /** Local cover under /public/projects/. */
  cover: string;
  desc: string;
  /** Inverted (dark) card treatment. */
  inverted: boolean;
}

export interface Slab {
  num: string;
  title: string;
  meta: string;
  gate: string;
  status: string;
  /** Wired to real site destinations where they exist. */
  href: string;
}

export const PROJECTS: Project[] = [
  {
    name: "vanish.sh",
    date: "Feb 2026",
    cover: "/projects/vanish-home.png",
    desc: "A temporary upload service: send a file, get a public link, let it expire automatically.",
    inverted: false,
  },
  {
    name: "The Companion",
    date: "Feb 2026",
    cover: "/projects/compagnon-home.png",
    desc: "Agent workflows, orchestration, and product ops — execution without slideware.",
    inverted: true,
  },
  {
    name: "vibedrift.dev",
    date: "Feb 2026",
    cover: "/projects/vibedrift-home.png",
    desc: "Tracks real developer activity and turns it into useful metrics for flow and friction.",
    inverted: false,
  },
  {
    name: "Granite",
    date: "Apr 2026",
    cover: "/projects/granite-home.png",
    desc: "The personal OS your agent runs on: markdown notes, a SQLite index, a typed contract system.",
    inverted: false,
  },
];

export const SLABS: Slab[] = [
  {
    num: "01",
    title: "What we built.",
    meta: "Product showcase · distinct identities",
    gate: "GATE 01 / 03",
    status: "SHIPPED",
    href: "/portfolio",
  },
  {
    num: "02",
    title: "What we learned.",
    meta: "Tutorials · build logs · raw learnings",
    gate: "GATE 02 / 03",
    status: "SHIPPING",
    href: "/resources",
  },
  {
    num: "03",
    title: "Work with us.",
    meta: "Agency engagements · ops design · agents",
    gate: "GATE 03 / 03",
    status: "OPEN",
    href: "mailto:founders@thevibecompany.co",
  },
];
