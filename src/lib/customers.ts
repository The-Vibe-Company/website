export type ContentLocale = "fr" | "en";

/** A string available in both languages. */
type L = { en: string; fr: string };

function pick(value: L, locale: ContentLocale): string {
  return value[locale] ?? value.en;
}

interface RawStat {
  value: L;
  label: L;
}

interface RawCustomer {
  slug: string;
  client: string;
  logo: string;
  url?: string;
  visuals: { src: string; alt: string }[];
  sector: L;
  metric: L;
  metricLabel: L;
  summary: L;
  points: L[];
  overview: L;
  results: RawStat[];
  quote?: { text: L; author: L };
}

export interface CustomerStat {
  value: string;
  label: string;
}

export interface Customer {
  slug: string;
  client: string;
  logo: string;
  url?: string;
  visuals: { src: string; alt: string }[];
  sector: string;
  metric: string;
  metricLabel: string;
  summary: string;
  points: string[];
  overview: string;
  results: CustomerStat[];
  quote?: { text: string; author: string };
}

const CUSTOMERS_RAW: RawCustomer[] = [
  {
    slug: "monka",
    client: "Monka",
    logo: "/images/clients/monka-color.webp",
    url: "https://www.monka.care",
    visuals: [],
    sector: { en: "Healthcare · Caregiver support", fr: "Santé · Accompagnement des aidants" },
    metric: { en: "2 months", fr: "2 mois" },
    metricLabel: {
      en: "from scratch to live on iOS and Android",
      fr: "de l'idée à la mise en ligne sur iOS et Android",
    },
    summary: {
      en: "Monka helps people who care for a loved one. They came to us with an ambitious roadmap and a deadline they couldn't miss. In two months we rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, and shipped the year of features they had planned.",
      fr: "Monka aide les personnes qui accompagnent un proche. Ils sont venus avec une roadmap ambitieuse et une deadline à ne pas rater. En deux mois, on a reconstruit leur app mobile et leur outil de coordination de zéro, 100% vibe codé, et livré les douze mois de fonctionnalités qu'ils avaient prévus.",
    },
    points: [
      {
        en: "A 150-question caregiver assessment that turns into a prioritized to-do list, plus a directory of health professionals.",
        fr: "Un questionnaire aidant de 150 questions qui se transforme en liste de tâches priorisées, plus un annuaire de professionnels de santé.",
      },
      {
        en: "Lifeline, a dashboard for the coordinating nurses: appointments, follow-up reports, shared documents.",
        fr: "Lifeline, un tableau de bord pour les infirmières de coordination : rendez-vous, comptes rendus de suivi, documents partagés.",
      },
      {
        en: "The 12 months of features on their roadmap, built and shipped in two.",
        fr: "Les 12 mois de fonctionnalités prévues à leur roadmap, construites et livrées en deux.",
      },
    ],
    overview: {
      en: "Monka helps people who care for a loved one in a difficult situation. They came to us with an ambitious roadmap and a hard deadline they couldn't miss. In two months, we rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, keeping their existing API and clearing their technical debt along the way.",
      fr: "Monka aide les personnes qui accompagnent un proche en situation difficile. Ils sont venus avec une roadmap ambitieuse et une deadline à ne pas manquer. En deux mois, on a reconstruit leur app mobile et leur outil de coordination de zéro, 100% vibe codé, en gardant leur API existante et en soldant leur dette technique au passage.",
    },
    results: [
      { value: { en: "2 months", fr: "2 mois" }, label: { en: "From first line to the App Store", fr: "De la première ligne à l'App Store" } },
      { value: { en: "iOS + Android", fr: "iOS + Android" }, label: { en: "Live on the App Store", fr: "En ligne sur l'App Store" } },
      { value: { en: "Every day", fr: "Chaque jour" }, label: { en: "New caregivers onboarded", fr: "De nouveaux aidants onboardés" } },
      { value: { en: "Daily", fr: "Au quotidien" }, label: { en: "Used by health professionals", fr: "Utilisé par des professionnels de santé" } },
    ],
    quote: {
      text: {
        en: "Travailler avec The Vibe Company est très différent d'une relation classique avec une agence. Ils ne se contentent pas d'exécuter un brief : ils challengent, structurent, prototypent et construisent avec nous. Ils apportent à la fois une vraie vision produit, une forte expertise IA et un pragmatisme rare pour transformer des sujets complexes en solutions concrètes, utiles et rapidement déployées chez Monka. En quelques semaines seulement nous avons soldé notre dette technique, structuré la scalabilité de notre techno et développé les 12 mois de fonctionnalités prévues dans notre roadmap.",
        fr: "Travailler avec The Vibe Company est très différent d'une relation classique avec une agence. Ils ne se contentent pas d'exécuter un brief : ils challengent, structurent, prototypent et construisent avec nous. Ils apportent à la fois une vraie vision produit, une forte expertise IA et un pragmatisme rare pour transformer des sujets complexes en solutions concrètes, utiles et rapidement déployées chez Monka. En quelques semaines seulement nous avons soldé notre dette technique, structuré la scalabilité de notre techno et développé les 12 mois de fonctionnalités prévues dans notre roadmap.",
      },
      author: {
        en: "Étienne, CEO and cofounder of Monka",
        fr: "Étienne, CEO et cofondateur de Monka",
      },
    },
  },
  {
    slug: "locservice",
    client: "LocService",
    logo: "/images/clients/locservice.png",
    url: "https://www.locservice.fr",
    visuals: [],
    sector: { en: "Rentals · Customer support", fr: "Location · Support client" },
    metric: { en: "87%", fr: "87%" },
    metricLabel: {
      en: "of support tickets answered with our AI drafts",
      fr: "des tickets support traités grâce à nos brouillons IA",
    },
    summary: {
      en: "LocService handles several hundred support tickets a day. We read all their past tickets and internal docs to draft the answer for each new one, tailored to the customer's profile and history.",
      fr: "LocService traite plusieurs centaines de tickets support par jour. On lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau, adaptée au profil et à l'historique du client.",
    },
    points: [
      { en: "Connected to their internal APIs to pull real customer context.", fr: "Connecté à leurs API internes pour récupérer le vrai contexte client." },
      { en: "Classification rules so the same question gets the right answer per customer type.", fr: "Des règles de classification pour que la même question ait la bonne réponse selon le type de client." },
      { en: "Hundreds of tickets a day, our drafts used on 87% of them.", fr: "Des centaines de tickets par jour, nos brouillons utilisés sur 87% d'entre eux." },
    ],
    overview: {
      en: "LocService handles several hundred customer-support tickets a day. We built an assistant that reads all their past tickets and internal documentation to draft the answer for each new ticket, tailored to the customer's profile and history.",
      fr: "LocService traite plusieurs centaines de tickets support par jour. On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau ticket, adaptée au profil et à l'historique du client.",
    },
    results: [
      { value: { en: "87%", fr: "87%" }, label: { en: "Of tickets answered with our AI drafts", fr: "Des tickets traités grâce à nos brouillons IA" } },
      { value: { en: "Hundreds", fr: "Des centaines" }, label: { en: "Of tickets handled per day", fr: "De tickets traités par jour" } },
    ],
  },
  {
    slug: "afp",
    client: "AFP",
    logo: "/images/clients/afp.svg",
    url: "https://www.afp.com",
    visuals: [],
    sector: { en: "News · Journalism", fr: "Presse · Journalisme" },
    metric: { en: "90M documents", fr: "90M documents" },
    metricLabel: {
      en: "of text, image, and video, made searchable by AI",
      fr: "de texte, image et vidéo, rendus explorables par l'IA",
    },
    summary: {
      en: "AFP is one of the world's largest news agencies. As part of a France 2030 project, we're building AI tools that help their journalists work faster, on top of a corpus of 90 million documents: articles, images, video, and wires.",
      fr: "L'AFP est l'une des plus grandes agences de presse du monde. Dans le cadre d'un projet France 2030, on construit des outils IA qui aident leurs journalistes à travailler plus vite, sur un corpus de 90 millions de documents : articles, images, vidéos et dépêches.",
    },
    points: [
      { en: "Multimodal search: ask a question, get every relevant article, image, and video across the archive.", fr: "Recherche multimodale : posez une question, obtenez tous les articles, images et vidéos pertinents de tout le fonds." },
      { en: "Topic watch that follows a subject and surfaces what matters.", fr: "Une veille qui suit un sujet et remonte ce qui compte." },
      { en: "A writing assistant for documentary research, fact-checking, and feedback.", fr: "Un assistant rédactionnel pour la recherche documentaire, la vérification des faits et les retours." },
    ],
    overview: {
      en: "AFP is one of the world's largest news agencies. As part of a two-year France 2030 project, we're building AI tools that help their journalists work faster, on top of a corpus of 90 million documents: articles, images, video, and wires.",
      fr: "L'AFP est l'une des plus grandes agences de presse du monde. Dans le cadre d'un projet France 2030 sur deux ans, on construit des outils IA qui aident leurs journalistes à travailler plus vite, sur un corpus de 90 millions de documents : articles, images, vidéos et dépêches.",
    },
    results: [
      { value: { en: "90M", fr: "90M" }, label: { en: "Documents made searchable", fr: "Documents rendus explorables" } },
      { value: { en: "2 years", fr: "2 ans" }, label: { en: "France 2030 project", fr: "Projet France 2030" } },
      { value: { en: "3 tools", fr: "3 outils" }, label: { en: "Watch, multimodal search, writing assistant", fr: "Veille, recherche multimodale, assistant rédactionnel" } },
    ],
  },
  {
    slug: "coup-de-pates",
    client: "Coup de Pâtes",
    logo: "/images/clients/coup-de-pates.svg",
    url: "https://www.coupdepates.fr",
    visuals: [],
    sector: { en: "Food · Design review", fr: "Agroalimentaire · Relecture design" },
    metric: { en: "At a glance", fr: "En un coup d'œil" },
    metricLabel: {
      en: "which catalog feedback was applied, which wasn't",
      fr: "quels retours du catalogue ont été appliqués, lesquels non",
    },
    summary: {
      en: "Coup de Pâtes reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note had been applied meant a careful manual pass. We built them AI skills that surface it all in a few glances.",
      fr: "Coup de Pâtes relit les catalogues produits de leurs designers : une v0 arrive, ils annotent leurs retours, et la version révisée revient. Vérifier que chaque retour avait bien été appliqué demandait une relecture manuelle minutieuse. On leur a construit des skills IA qui font ressortir tout ça en quelques coups d'œil.",
    },
    points: [
      { en: "See applied vs. missed feedback instantly, plus requested changes and typos.", fr: "Voir instantanément les retours appliqués ou oubliés, ainsi que les modifications demandées et les fautes." },
      { en: "Re-annotate and re-export the new round of feedback as a PDF.", fr: "Ré-annoter et réexporter la nouvelle série de retours en PDF." },
      { en: "A second tool highlights the differences between two specific documents, like two labels or two specs.", fr: "Un second outil met en évidence les différences entre deux documents précis, comme deux étiquettes ou deux cahiers des charges." },
    ],
    overview: {
      en: "Coup de Pâtes reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note had been applied meant a careful manual pass. We built them AI skills that surface it all in a few glances.",
      fr: "Coup de Pâtes relit les catalogues produits de leurs designers : une v0 arrive, ils annotent leurs retours, et la version révisée revient. Vérifier que chaque retour avait bien été appliqué demandait une relecture manuelle minutieuse. On leur a construit des skills IA qui font ressortir tout ça en quelques coups d'œil.",
    },
    results: [
      { value: { en: "2 tools", fr: "2 outils" }, label: { en: "Catalog review and document comparison", fr: "Relecture de catalogue et comparaison de documents" } },
      { value: { en: "PDF", fr: "PDF" }, label: { en: "Re-annotate and re-export in one click", fr: "Ré-annoter et réexporter en un clic" } },
    ],
  },
];

function localize(raw: RawCustomer, locale: ContentLocale): Customer {
  return {
    slug: raw.slug,
    client: raw.client,
    logo: raw.logo,
    url: raw.url,
    visuals: raw.visuals,
    sector: pick(raw.sector, locale),
    metric: pick(raw.metric, locale),
    metricLabel: pick(raw.metricLabel, locale),
    summary: pick(raw.summary, locale),
    points: raw.points.map((p) => pick(p, locale)),
    overview: pick(raw.overview, locale),
    results: raw.results.map((r) => ({ value: pick(r.value, locale), label: pick(r.label, locale) })),
    quote: raw.quote
      ? { text: pick(raw.quote.text, locale), author: pick(raw.quote.author, locale) }
      : undefined,
  };
}

export const CUSTOMER_SLUGS = CUSTOMERS_RAW.map((c) => c.slug);

export function getCustomers(locale: ContentLocale): Customer[] {
  return CUSTOMERS_RAW.map((c) => localize(c, locale));
}

export function getCustomer(slug: string, locale: ContentLocale): Customer | undefined {
  const raw = CUSTOMERS_RAW.find((c) => c.slug === slug);
  return raw ? localize(raw, locale) : undefined;
}
