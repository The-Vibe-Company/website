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

interface RawVisual {
  src: string;
  alt: L;
  width: number;
  height: number;
  placement: "aside" | "wide";
}

interface RawCustomer {
  slug: string;
  client: string;
  logo: string;
  url?: string;
  visuals: RawVisual[];
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

export interface CustomerVisual {
  src: string;
  alt: string;
  width: number;
  height: number;
  placement: "aside" | "wide";
}

export interface Customer {
  slug: string;
  client: string;
  logo: string;
  url?: string;
  visuals: CustomerVisual[];
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
    visuals: [
      {
        src: "/images/clients/monka/monka-mobile.png",
        alt: {
          en: "Monka mobile app showing a caregiver questionnaire and personalized action plan",
          fr: "Application mobile Monka avec le questionnaire aidant et le plan d’action personnalisé",
        },
        width: 1320,
        height: 2868,
        placement: "aside",
      },
      {
        src: "/images/clients/monka/lifeline.png",
        alt: {
          en: "Lifeline care-coordination CRM for Monka nurses",
          fr: "CRM Lifeline utilisé par les infirmières de coordination Monka",
        },
        width: 3016,
        height: 1650,
        placement: "wide",
      },
    ],
    sector: { en: "Healthcare · Caregiver support", fr: "Santé · Accompagnement des aidants" },
    metric: { en: "2 months", fr: "2 mois" },
    metricLabel: {
      en: "from scratch to live on iOS and Android",
      fr: "pour aller en prod",
    },
    summary: {
      en: "Monka helps people who care for a loved one. They came to us with an ambitious roadmap and a deadline they couldn't miss. In two months we rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, and shipped the year of features they had planned.",
      fr: "Monka accompagne les personnes qui prennent soin d’un proche. En deux mois, on a mis en production leur application mobile et Lifeline, le CRM des infirmières de coordination, dans un environnement HDS sécurisé.",
    },
    points: [
      {
        en: "A 150-question caregiver assessment that turns into a prioritized to-do list, plus a directory of health professionals.",
        fr: "Une application mobile pour les aidants, avec un questionnaire et un plan d’action personnalisé.",
      },
      {
        en: "Lifeline, a dashboard for the coordinating nurses: appointments, follow-up reports, shared documents.",
        fr: "Lifeline, un CRM pour les infirmières de coordination qui centralise les aidants, les rendez-vous, les comptes rendus de bilan, les questionnaires et les données de santé.",
      },
      {
        en: "The 12 months of features on their roadmap, built and shipped in two.",
        fr: "Un environnement HDS sécurisé, mis en place et déployé selon les bonnes pratiques.",
      },
    ],
    overview: {
      en: "Monka helps people who care for a loved one in a difficult situation. They came to us with an ambitious roadmap and a hard deadline they couldn't miss. In two months, we rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, keeping their existing API and clearing their technical debt along the way.",
      fr: "Monka accompagne les personnes qui prennent soin d’un proche. En deux mois, on a construit et mis en production leur application mobile et Lifeline, le CRM des infirmières de coordination, dans un environnement HDS sécurisé.",
    },
    results: [
      { value: { en: "2 months", fr: "2 mois" }, label: { en: "From first line to the App Store", fr: "Pour aller en prod" } },
      { value: { en: "iOS + Android", fr: "Mobile + Web" }, label: { en: "Live on the App Store", fr: "Application aidant et CRM Lifeline" } },
      { value: { en: "Every day", fr: "HDS" }, label: { en: "New caregivers onboarded", fr: "Environnement sécurisé en production" } },
      { value: { en: "Daily", fr: "Au quotidien" }, label: { en: "Used by health professionals", fr: "Utilisé par des professionnels de santé" } },
    ],
    quote: {
      text: {
        en: "Travailler avec The Vibe Company est très différent d'une relation classique avec une agence. Ils ne se contentent pas d'exécuter un brief : ils challengent, structurent, prototypent et construisent avec nous. Ils apportent à la fois une vraie vision produit, une forte expertise IA et un pragmatisme rare pour transformer des sujets complexes en solutions concrètes, utiles et rapidement déployées chez Monka.",
        fr: "Travailler avec The Vibe Company est très différent d'une relation classique avec une agence. Ils ne se contentent pas d'exécuter un brief : ils challengent, structurent, prototypent et construisent avec nous. Ils apportent à la fois une vraie vision produit, une forte expertise IA et un pragmatisme rare pour transformer des sujets complexes en solutions concrètes, utiles et rapidement déployées chez Monka.",
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
      fr: "LocService est une plateforme de location immobilière entre particuliers qui traite plusieurs centaines de tickets support par jour. On lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau, adaptée au profil et à l'historique du client.",
    },
    points: [
      { en: "Connected to their internal APIs to pull real customer context.", fr: "Connecté à leurs API internes pour récupérer le vrai contexte client." },
      { en: "Classification rules so the same question gets the right answer per customer type.", fr: "Des règles de classification pour que la même question ait la bonne réponse selon le type de client." },
      { en: "Hundreds of tickets a day, our drafts used on 87% of them.", fr: "Des centaines de tickets par jour, nos brouillons utilisés sur 87% d'entre eux." },
    ],
    overview: {
      en: "LocService handles several hundred customer-support tickets a day. We built an assistant that reads all their past tickets and internal documentation to draft the answer for each new ticket, tailored to the customer's profile and history.",
      fr: "LocService est une plateforme de location immobilière entre particuliers qui traite plusieurs centaines de tickets support par jour. On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau ticket, adaptée au profil et à l'historique du client.",
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
      { en: "Multimodal search: ask a question, get every relevant article, image, and video across the archive.", fr: "Recherche multimodale : posez une question, obtenez tous les articles, images et vidéos pertinents." },
      { en: "Topic watch that follows a subject and surfaces what matters.", fr: "Un outil de veille efficace, personnalisable et boosté par l’IA." },
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
    client: "Coup de Pates",
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
      en: "Coup de Pates reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note had been applied meant a careful manual pass. We built them AI skills that surface it all in a few glances.",
      fr: "Coup de Pates fournit des produits surgelés aux professionnels des métiers de bouche. On a construit un outil qui vérifie en un coup d’œil les annotations appliquées à un PDF, compare deux PDF et contrôle la conformité d’un document à une charte ou à un document de référence.",
    },
    points: [
      { en: "See applied vs. missed feedback instantly, plus requested changes and typos.", fr: "Vérifier que les annotations et les demandes faites sur un PDF ont bien été appliquées." },
      { en: "Re-annotate and re-export the new round of feedback as a PDF.", fr: "Comparer deux PDF et faire ressortir leurs différences." },
      { en: "A second tool highlights the differences between two specific documents, like two labels or two specs.", fr: "Contrôler qu’un document respecte une charte ou les conditions d’un document de référence." },
    ],
    overview: {
      en: "Coup de Pates reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note had been applied meant a careful manual pass. We built them AI skills that surface it all in a few glances.",
      fr: "Coup de Pates est un fournisseur de produits surgelés pour les professionnels des métiers de bouche. Son outil permet de vérifier en un coup d’œil qu’un PDF respecte les annotations et les demandes formulées, de comparer deux PDF et de contrôler qu’un document respecte une charte ou un document de référence.",
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
    visuals: raw.visuals.map((visual) => ({
      src: visual.src,
      alt: pick(visual.alt, locale),
      width: visual.width,
      height: visual.height,
      placement: visual.placement,
    })),
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
