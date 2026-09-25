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

/** One engagement inside a client that trusted us with several. */
interface RawProject {
  name: L;
  summary: L;
  points: L[];
  visual?: RawVisual;
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
  /** When set, the case page tells each project in turn instead of one list. */
  projects?: RawProject[];
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

export interface CustomerProject {
  name: string;
  summary: string;
  points: string[];
  visual?: CustomerVisual;
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
  projects?: CustomerProject[];
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
    metric: { en: "165 questions", fr: "165 questions" },
    metricLabel: {
      en: "in a caregiver assessment that turns into a personal action plan",
      fr: "pour un bilan aidant qui devient un plan d’action personnalisé",
    },
    summary: {
      en: "Monka had signed its customers but had no tool that could deliver the service. In two months we shipped the caregiver app, Lifeline, the CRM for their coordinating nurses, and the API that ties them together.",
      fr: "Monka avait signé ses clients sans outil capable de délivrer le service. En deux mois, on a livré l’app des aidants, Lifeline, le CRM des infirmières de coordination, et l’API qui relie le tout.",
    },
    points: [
      {
        en: "A caregiver app: a 165-question assessment that leads to an action plan, the circle of close ones, a chat with the nurse, and appointment booking.",
        fr: "Une app pour les aidants : un bilan de 165 questions qui débouche sur un plan d’action, le cercle des proches, un chat avec l’infirmière et la prise de rendez-vous.",
      },
      {
        en: "Lifeline, the CRM for coordinating nurses: caregiver follow-up, agenda, conversations, questionnaires, and reports.",
        fr: "Lifeline, le CRM des infirmières de coordination : suivi des aidants, agenda, discussions, questionnaires et comptes rendus.",
      },
      {
        en: "A versioned clinical engine that evolves the care framework (12 versions so far) without breaking the app.",
        fr: "Un moteur clinique versionné, qui fait évoluer le référentiel (12 versions à ce jour) sans casser l’app.",
      },
      {
        en: "A partner API with signed webhooks, so insurers can follow the people they cover.",
        fr: "Une API partenaire avec webhooks signés, pour que les assureurs suivent leurs bénéficiaires.",
      },
    ],
    overview: {
      en: "Monka supports people who care for a loved one. They had already signed their customers, with no tool able to deliver the service. We took over their existing API and CRM, and in two months put into production the caregiver app, Lifeline for the coordinating nurses, and the clinical engine that turns each assessment into an action plan, with encrypted, GDPR-compliant health data. Since then, we ship a new version roughly every two days.",
      fr: "Monka accompagne les personnes qui prennent soin d’un proche. Ils avaient déjà signé leurs clients, sans outil capable de délivrer le service. On a repris leur API et leur ancien CRM, et en deux mois on a mis en production l’app des aidants, Lifeline pour les infirmières de coordination, et le moteur clinique qui transforme chaque bilan en plan d’action, avec des données de santé chiffrées et conformes RGPD. Depuis, on livre une nouvelle version tous les deux jours environ.",
    },
    results: [
      { value: { en: "2 months", fr: "2 mois" }, label: { en: "To go live", fr: "Pour aller en prod" } },
      { value: { en: "165", fr: "165" }, label: { en: "Questions in the caregiver assessment", fr: "Questions dans le bilan aidant" } },
      { value: { en: "90", fr: "90" }, label: { en: "App releases in six months", fr: "Versions de l’app livrées en six mois" } },
      { value: { en: "12", fr: "12" }, label: { en: "Versions of the clinical framework", fr: "Versions du référentiel clinique" } },
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
    slug: "coup-de-pates",
    client: "Coup de Pates",
    logo: "/images/clients/coup-de-pates.svg",
    url: "https://www.coupdepates.fr",
    visuals: [],
    sector: { en: "Food · CSR and quality", fr: "Agroalimentaire · RSE et qualité" },
    metric: { en: "2 projects", fr: "2 projets" },
    metricLabel: {
      en: "a CSR app for the teams, and AI skills for quality control",
      fr: "une app RSE pour les équipes, et des skills IA pour le contrôle qualité",
    },
    summary: {
      en: "Coup de Pates supplies frozen products to food professionals. We built them Ensemble, the app that brings employees together around events like a step challenge, and a library of AI skills that checks their product documents.",
      fr: "Coup de Pates fournit des produits surgelés aux professionnels des métiers de bouche. On leur a construit Ensemble, l’app qui rassemble les collaborateurs autour d’événements comme un challenge de pas, et une bibliothèque de skills IA qui vérifie leurs documents produit.",
    },
    points: [
      {
        en: "Ensemble: an iOS and Android app to run internal life, launched with an inter-team step challenge.",
        fr: "Ensemble : une app iOS et Android pour animer la vie interne, lancée avec un challenge de pas entre équipes.",
      },
      {
        en: "Document control: AI skills that check a corrected label or specification against every annotation, and flag each gap.",
        fr: "Contrôle documentaire : des skills IA qui vérifient qu’une étiquette ou un cahier des charges corrigé respecte les annotations, et relèvent chaque écart.",
      },
    ],
    overview: {
      en: "Coup de Pates supplies frozen products to food professionals. They trusted us with two very different jobs: bringing their CSR commitment to life for their teams, and making the review of their product documents, done by hand until then, reliable.",
      fr: "Coup de Pates fournit des produits surgelés aux professionnels des métiers de bouche. Ils nous ont confié deux sujets très différents : faire vivre leur engagement RSE auprès de leurs équipes, et fiabiliser le contrôle de leurs documents produit, qui se faisait à la main.",
    },
    results: [
      { value: { en: "iOS + Android", fr: "iOS + Android" }, label: { en: "Ensemble, for every employee", fr: "Ensemble, pour tous les collaborateurs" } },
      { value: { en: "3 skills", fr: "3 skills" }, label: { en: "To compare, check, and cross-check product documents", fr: "Pour comparer, vérifier et recouper les documents produit" } },
      { value: { en: "72", fr: "72" }, label: { en: "Changes flagged between two versions of one specification", fr: "Modifications relevées entre deux versions d’un cahier des charges" } },
    ],
    projects: [
      {
        name: { en: "Ensemble, the employee app", fr: "Ensemble, l’app des collaborateurs" },
        summary: {
          en: "A platform for running internal events, to make the CSR commitment part of everyday life.",
          fr: "Une plateforme d’animation d’événements internes, pour faire vivre l’engagement RSE au quotidien.",
        },
        points: [
          {
            en: "An iOS and Android app reserved for employees, on a work or personal phone.",
            fr: "Une app iOS et Android réservée aux collaborateurs, sur mobile pro ou perso.",
          },
          {
            en: "A first event: an inter-team step-counting challenge.",
            fr: "Un premier événement : un challenge inter-équipes de comptage de pas.",
          },
          {
            en: "A platform built to last beyond a single challenge.",
            fr: "Une plateforme pensée pour durer au-delà d’un seul challenge.",
          },
        ],
        visual: {
          src: "/images/coup-de-pates-ensemble/app-accueil.webp",
          alt: {
            en: "The home screen of the Coup de Pates Ensemble app on a phone, surrounded by photos of employees and the company's premises",
            fr: "L’écran d’accueil de l’application Coup de Pates Ensemble sur un téléphone, entouré de photos de collaborateurs et des locaux de Coup de Pates",
          },
          width: 1500,
          height: 952,
          placement: "wide",
        },
      },
      {
        name: { en: "Document control", fr: "Contrôle documentaire" },
        summary: {
          en: "A library of AI skills for the quality and marketing teams, which checks product documents for them.",
          fr: "Une bibliothèque de skills IA pour les équipes qualité et marketing, qui vérifie les documents produit à leur place.",
        },
        points: [
          {
            en: "Check that a corrected label or catalogue follows every annotation, even boxes drawn in PowerPoint.",
            fr: "Vérifier qu’une étiquette ou un catalogue corrigé respecte chaque annotation, même dessinée dans PowerPoint.",
          },
          {
            en: "Flag everything that changed between two versions of a specification: 72 changes on a single document.",
            fr: "Relever tout ce qui a changé entre deux versions d’un cahier des charges : 72 modifications sur un seul document.",
          },
          {
            en: "Make sure the development sheet, specification, label, and technical sheet all say the same thing.",
            fr: "Contrôler que la fiche de développement, le cahier des charges, l’étiquette et la fiche technique disent la même chose.",
          },
          {
            en: "A side-by-side before/after viewer with every gap clickable, a report, and a PDF export.",
            fr: "Un lecteur avant / après avec chaque écart cliquable, un rapport en français et un export PDF.",
          },
        ],
      },
    ],
  },
];

function localizeVisual(visual: RawVisual, locale: ContentLocale): CustomerVisual {
  return {
    src: visual.src,
    alt: pick(visual.alt, locale),
    width: visual.width,
    height: visual.height,
    placement: visual.placement,
  };
}

function localize(raw: RawCustomer, locale: ContentLocale): Customer {
  return {
    slug: raw.slug,
    client: raw.client,
    logo: raw.logo,
    url: raw.url,
    visuals: raw.visuals.map((visual) => localizeVisual(visual, locale)),
    sector: pick(raw.sector, locale),
    metric: pick(raw.metric, locale),
    metricLabel: pick(raw.metricLabel, locale),
    summary: pick(raw.summary, locale),
    points: raw.points.map((p) => pick(p, locale)),
    overview: pick(raw.overview, locale),
    results: raw.results.map((r) => ({ value: pick(r.value, locale), label: pick(r.label, locale) })),
    projects: raw.projects?.map((project) => ({
      name: pick(project.name, locale),
      summary: pick(project.summary, locale),
      points: project.points.map((point) => pick(point, locale)),
      visual: project.visual ? localizeVisual(project.visual, locale) : undefined,
    })),
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
