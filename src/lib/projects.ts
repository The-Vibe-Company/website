export type ContentLocale = "fr" | "en";

/** A string available in both languages. */
type L = { en: string; fr: string };

function pick(value: L, locale: ContentLocale): string {
  return value[locale] ?? value.en;
}

interface RawProject {
  slug: string;
  name: string;
  logo: string;
  cover: string;
  accent: string;
  url: string;
  tag: L;
  date: L;
  status: L;
  description: L;
}

export interface Project {
  slug: string;
  name: string;
  logo: string;
  cover: string;
  accent: string;
  url: string;
  tag: string;
  date: string;
  status: string;
  description: string;
}

const PROJECTS_RAW: RawProject[] = [
  {
    slug: "vanish",
    name: "vanish.sh",
    logo: "/projects/vanish-favicon.svg",
    cover: "/projects/vanish-home.png",
    accent: "#10b981",
    url: "https://vanish.sh",
    tag: { en: "File sharing", fr: "Partage de fichiers" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "Vanish is a temporary upload service: send a file, get a public link, and let it expire automatically.",
      fr: "Vanish est un service d’upload temporaire. Envoyez un fichier, récupérez un lien public, et laissez-le expirer automatiquement.",
    },
  },
  {
    slug: "the-companion",
    name: "The Companion",
    logo: "/projects/compagnon-favicon.png",
    cover: "/projects/compagnon-home.png",
    accent: "#f97316",
    url: "https://www.thecompanion.sh/",
    tag: { en: "Skill library", fr: "Bibliothèque de skills" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "The Companion is a shared skill library for teams. Package your colleagues' best prompts as reusable skills, browse what the team has built, and use them in your AI for anything.",
      fr: "The Companion est une bibliothèque de skills partagée pour les équipes. On empaquette les meilleurs prompts de ses collègues en skills réutilisables, on parcourt ce que l’équipe a construit, et on les utilise dans son IA pour tout.",
    },
  },
  {
    slug: "vibedrift",
    name: "vibedrift.dev",
    logo: "/projects/vibedrift-favicon.svg",
    cover: "/projects/vibedrift-home.png",
    accent: "#facc15",
    url: "https://www.vibedrift.dev",
    tag: { en: "Dev analytics", fr: "Analytics développeur" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "VibeDrift tracks real developer activity and turns it into useful metrics to understand flow and friction.",
      fr: "VibeDrift suit l’activité réelle des développeurs et la transforme en métriques utiles pour comprendre le flow et les frictions.",
    },
  },
  {
    slug: "granite",
    name: "Granite",
    logo: "/projects/granite-favicon.png",
    cover: "/projects/granite-home.png",
    accent: "#62D1AF",
    url: "https://github.com/The-Vibe-Company/Granite",
    tag: { en: "Agent OS", fr: "OS pour agents" },
    date: { en: "Apr 2026", fr: "avr. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "Granite is the personal OS your agent runs on: markdown notes, a SQLite index, and a typed contract system that turns local files into a navigable company memory.",
      fr: "Granite est l’OS personnel sur lequel tourne votre agent. Des notes markdown, un index SQLite et un système de contrats typés qui transforme vos fichiers locaux en une mémoire d’entreprise navigable.",
    },
  },
];

function localize(raw: RawProject, locale: ContentLocale): Project {
  return {
    slug: raw.slug,
    name: raw.name,
    logo: raw.logo,
    cover: raw.cover,
    accent: raw.accent,
    url: raw.url,
    tag: pick(raw.tag, locale),
    date: pick(raw.date, locale),
    status: pick(raw.status, locale),
    description: pick(raw.description, locale),
  };
}

export const PROJECT_SLUGS = PROJECTS_RAW.map((p) => p.slug);

export function getProjects(locale: ContentLocale): Project[] {
  return PROJECTS_RAW.map((p) => localize(p, locale));
}

export function getProject(slug: string, locale: ContentLocale): Project | undefined {
  const raw = PROJECTS_RAW.find((p) => p.slug === slug);
  return raw ? localize(raw, locale) : undefined;
}
