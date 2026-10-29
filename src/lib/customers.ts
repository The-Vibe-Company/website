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
  /** Optional: a confidential engagement can go without a headline figure. */
  metric?: L;
  metricLabel?: L;
  /** Search snippet (≤155 chars); falls back to the summary. */
  metaTitle?: L;
  metaDescription?: L;
  summary: L;
  points: L[];
  overview: L;
  /** Optional: how we approached the work, shown above the "what we did" list. */
  approach?: L;
  /** Optional: a guide on the site that tells the case in more depth. */
  related?: { href: L; title: L };
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
  metric?: string;
  metricLabel?: string;
  metaTitle?: string;
  metaDescription: string;
  summary: string;
  points: string[];
  overview: string;
  approach?: string;
  related?: { href: string; title: string };
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
    metaTitle: {
      fr: "Monka : app aidants et CRM en 2 mois",
      en: "Monka: caregiver app and CRM in 2 months",
    },
    metaDescription: {
      en: "Monka: caregiver app, Lifeline and nurses' CRM shipped in 2 months, plus the API that ties them together.",
      fr: "Monka : app aidants, Lifeline et CRM infirmières livrés en 2 mois, avec l'API qui relie le tout.",
    },
    summary: {
      en: "Monka supports people who care for a loved one, alongside coordinating nurses. To keep up with their growth, we shipped in two months the caregiver app, Lifeline, the CRM for their nurses, and the API that ties them together.",
      fr: "Monka accompagne les personnes qui prennent soin d’un proche, avec des infirmières de coordination. Pour suivre leur croissance, on a livré en deux mois l’app des aidants, Lifeline, le CRM de leurs infirmières, et l’API qui relie le tout.",
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
      en: "Monka supports people who care for a loved one, with coordinating nurses and partner insurers. To keep pace with their growth, we took over their existing API and CRM, and in two months put into production the caregiver app, Lifeline for the coordinating nurses, and the clinical engine that turns each assessment into an action plan, with encrypted, GDPR-compliant health data. Since then, we ship a new version roughly every two days.",
      fr: "Monka accompagne les personnes qui prennent soin d’un proche, avec des infirmières de coordination et des assureurs partenaires. Pour tenir le rythme de leur croissance, on a repris leur API et leur CRM existants, et en deux mois on a mis en production l’app des aidants, Lifeline pour les infirmières de coordination, et le moteur clinique qui transforme chaque bilan en plan d’action, avec des données de santé chiffrées et conformes RGPD. Depuis, on livre une nouvelle version tous les deux jours environ.",
    },
    results: [
      { value: { en: "2 months", fr: "2 mois" }, label: { en: "To go live", fr: "Pour aller en prod" } },
      { value: { en: "165", fr: "165" }, label: { en: "Questions in the caregiver assessment", fr: "Questions dans le bilan aidant" } },
      { value: { en: "90", fr: "90" }, label: { en: "App releases in six months", fr: "Versions de l’app livrées en six mois" } },
      { value: { en: "12", fr: "12" }, label: { en: "Versions of the clinical framework", fr: "Versions du référentiel clinique" } },
    ],
    quote: {
      text: {
        en: "Working with The Vibe Company is very different from a typical agency relationship. They don't just execute a brief: they challenge, structure, prototype and build with us. They bring a real product vision, deep AI expertise and a rare pragmatism to turn complex problems into concrete, useful solutions, deployed quickly at Monka.",
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
    sector: { en: "News · MediaGen (France 2030)", fr: "Presse · MediaGen (France 2030)" },
    metric: { en: "3 AI tools", fr: "3 outils IA" },
    metricLabel: {
      en: "for newsrooms, within MediaGen, AFP's France 2030 generative AI project",
      fr: "pour les rédactions, dans MediaGen, le projet France 2030 d’IA générative de l’AFP",
    },
    metaTitle: {
      fr: "AFP : IA générative pour les rédactions",
      en: "AFP: generative AI tools for newsrooms",
    },
    metaDescription: {
      en: "With AFP, we're building MediaGen (€4M France 2030): trustworthy generative AI for newsrooms, under journalists' control.",
      fr: "Avec l'AFP, on construit MediaGen (France 2030, 4 M€) : IA générative de confiance pour les rédactions, sous contrôle journalistique.",
    },
    summary: {
      en: "With AFP, we're building MediaGen, a €4M France 2030 project backed by Bpifrance: trustworthy generative AI tools for newsrooms, always under journalists' control. We're part of the technical consortium alongside Kairntech and Dawex.",
      fr: "Avec l’AFP, on construit MediaGen, un projet France 2030 de 4 M€ soutenu par Bpifrance : des outils d’IA générative de confiance pour les rédactions, toujours sous le contrôle des journalistes. On fait partie du consortium technique, aux côtés de Kairntech et Dawex.",
    },
    points: [
      {
        en: "Augmented news monitoring: gather and analyze media, social networks, and press releases in real time.",
        fr: "Veille augmentée : centraliser et analyser en temps réel les médias, les réseaux sociaux et les communiqués.",
      },
      {
        en: "Multimodal search: explore and make the most of text, photo, and video archives.",
        fr: "Recherche multimodale : explorer et valoriser les archives texte, photo et vidéo.",
      },
      {
        en: "Content production help: turn one story into several formats and spot biases that could hurt its quality.",
        fr: "Aide à la production : décliner une même information en plusieurs formats et repérer les biais qui nuiraient à sa qualité.",
      },
    ],
    overview: {
      en: "MediaGen is one of the few France 2030 projects dedicated to the media. Led by AFP and backed by Bpifrance, it brings together a French consortium, Quivr/The Vibe Company, Kairntech, and Dawex, to build over 24 months generative AI tools that serve reliable information, under journalists' control. Some components will be released under an open license.",
      fr: "MediaGen est l’un des rares projets France 2030 consacrés aux médias. Porté par l’AFP et soutenu par Bpifrance, il réunit un consortium français, Quivr/The Vibe Company, Kairntech et Dawex, pour construire en 24 mois des outils d’IA générative au service d’une information fiable, sous le contrôle des journalistes. Une partie des composants sera publiée en licence libre.",
    },
    results: [
      { value: { en: "€4M", fr: "4 M€" }, label: { en: "France 2030 project, backed by Bpifrance", fr: "Projet France 2030, soutenu par Bpifrance" } },
      { value: { en: "24 months", fr: "24 mois" }, label: { en: "To deliver three tools to newsrooms", fr: "Pour livrer trois outils aux rédactions" } },
      { value: { en: "90M", fr: "90M" }, label: { en: "Archive documents made searchable", fr: "Documents d’archives rendus explorables" } },
      { value: { en: "Open source", fr: "Open source" }, label: { en: "Some components released under an open license", fr: "Une partie des composants en licence libre" } },
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
    metaTitle: {
      fr: "LocService : IA pour le support client",
      en: "LocService: AI for support ticket replies",
    },
    metaDescription: {
      en: "LocService: we read past tickets and internal docs to draft each support answer, tailored to the customer's history.",
      fr: "LocService : on lit tickets et docs internes pour rédiger chaque réponse support, adaptée au profil et à l'historique client.",
    },
    summary: {
      en: "LocService handles several hundred support tickets a day. We read all their past tickets and internal docs to draft the answer for each new one, tailored to the customer's profile and history.",
      fr: "LocService est une plateforme de location immobilière entre particuliers qui traite plusieurs centaines de tickets support par jour. On lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau, adaptée au profil et à l'historique du client.",
    },
    points: [
      { en: "Connected to their internal APIs to pull real customer context.", fr: "Connecté à leurs API internes pour récupérer le vrai contexte client." },
      { en: "Classification rules so the same question gets the right answer per customer type.", fr: "Des règles de classification pour que la même question ait la bonne réponse selon le type de client." },
      { en: "Hundreds of tickets a day, our drafts used on 87% of them.", fr: "Des centaines de tickets par jour, nos brouillons utilisés sur 87% d'entre eux." },
      {
        en: "A human sends every reply: a support agent reviews the draft, fixes it if needed, then sends it.",
        fr: "Un humain envoie chaque réponse : un agent du support relit le brouillon, le corrige si besoin, puis l'envoie.",
      },
      {
        en: "One simple measure, checked day to day: is the draft used? Not a score on a test set chosen in advance.",
        fr: "Une mesure simple, suivie au quotidien : le brouillon est-il utilisé ? Pas un score sur un jeu de test choisi à l'avance.",
      },
    ],
    overview: {
      en: "LocService is a peer-to-peer property rental platform that handles several hundred customer-support tickets a day. We built an assistant that reads all their past tickets and internal documentation to draft the answer for each new ticket, tailored to the customer's profile and history. The AI prepares, a person sends: the support team stays in charge of every reply.",
      fr: "LocService est une plateforme de location immobilière entre particuliers qui traite plusieurs centaines de tickets support par jour. On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau ticket, adaptée au profil et à l'historique du client. L'IA prépare, l'humain envoie : l'équipe support garde la main sur chaque réponse.",
    },
    approach: {
      en: "We did not build a chatbot that answers customers on its own. On a support desk where the right answer depends on each customer's file, an AI mistake shows right away, and it goes out with LocService's name on it. So the assistant does the research and the writing, and the team keeps the decision. What made the drafts right was not a clever prompt: it was the real customer context pulled from their systems, and rules that recognize the case before drafting.",
      fr: "On n'a pas construit un chatbot qui répond seul aux clients. Sur un support où la bonne réponse dépend du dossier de chacun, une erreur de l'IA se voit tout de suite, et elle part avec le nom de LocService dessus. L'assistant fait donc le travail de recherche et de rédaction, et l'équipe garde la décision. Ce qui rend les brouillons justes, ce n'est pas un prompt astucieux : c'est le vrai contexte client récupéré dans leurs systèmes, et des règles qui reconnaissent le cas avant de rédiger.",
    },
    related: {
      href: { en: "/resources/articles/ai-customer-support-agent", fr: "/resources/articles/agent-ia-support-client" },
      title: {
        en: "AI agents for customer support: automate without hurting service",
        fr: "Agent IA pour le support client : automatiser sans dégrader le service",
      },
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
    metaTitle: {
      fr: "Coup de Pates : app équipes et skills IA",
      en: "Coup de Pates: team app and AI skills",
    },
    metaDescription: {
      en: "Coup de Pates: Ensemble app for teams, plus AI skills that check product documents.",
      fr: "Coup de Pates : app Ensemble pour les équipes, et skills IA qui vérifient les documents produit.",
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
  {
    // Confidential engagement: no figure, result, or quote, only what Theodo
    // agreed to make public.
    slug: "theodo",
    client: "Theodo",
    // Official wordmark from theodo.com, filled with their primary red #ff512c.
    logo: "/images/clients/theodo.svg",
    url: "https://www.theodo.com",
    visuals: [],
    sector: { en: "Technical expertise · Software Factories", fr: "Expertise technique · Software Factories" },
    metric: { en: "AI Software Factories", fr: "AI Software Factories" },
    metricLabel: { en: "for hundreds of developers", fr: "pour des centaines de développeurs" },
    metaTitle: {
      fr: "Theodo : expertise Software Factories IA",
      en: "Theodo: AI Software Factories expertise",
    },
    metaDescription: {
      en: "The Vibe Company supports Theodo as a technical expert on Software Factories that help accelerate their teams.",
      fr: "The Vibe Company accompagne Theodo comme expert technique sur des Software Factories pour accélérer leurs équipes.",
    },
    summary: {
      en: "The Vibe Company supports Theodo as a technical expert on critical projects for their clients, such as building Software Factories for hundreds of developers, to help accelerate their teams.",
      fr: "The Vibe Company accompagne Theodo en tant qu’expert technique sur des projets critiques pour leurs clients, par exemple la création de Software Factories pour des centaines de développeurs, afin d’accélérer leurs équipes.",
    },
    points: [
      {
        en: "Technical expertise embedded in Theodo's teams, on critical projects for their clients.",
        fr: "Une expertise technique intégrée aux équipes de Theodo, sur des projets critiques pour leurs clients.",
      },
      {
        en: "Industrializing AI-assisted development at scale: Software Factories for hundreds of developers.",
        fr: "L’industrialisation du développement assisté par IA à grande échelle : des Software Factories pour des centaines de développeurs.",
      },
      {
        en: "Standardized tools, agents, and skills, so every team starts from the same foundation.",
        fr: "Des outils, des agents et des skills standardisés, pour que chaque équipe parte de la même base.",
      },
      {
        en: "Support and training for the teams, so they adopt these practices and move faster.",
        fr: "L’accompagnement et la formation des équipes, pour qu’elles adoptent ces pratiques et avancent plus vite.",
      },
    ],
    overview: {
      en: "Theodo delivers critical projects for its clients, and brings in The Vibe Company as a technical expert embedded in its teams. The challenge: industrialize AI-assisted development at scale, across the teams that deliver those projects. Together, we build Software Factories for hundreds of developers: standardized tools, agents, and skills, plus the support and training that help every team adopt them and move faster.",
      fr: "Theodo mène des projets critiques pour ses clients, et fait appel à The Vibe Company comme expert technique intégré à ses équipes. L’enjeu : industrialiser le développement assisté par IA à grande échelle, pour les équipes qui mènent ces projets. Ensemble, on construit des Software Factories pour des centaines de développeurs : des outils, des agents et des skills standardisés, et l’accompagnement et la formation qui permettent à chaque équipe de les adopter et d’avancer plus vite.",
    },
    approach: {
      en: "A Software Factory is the common base every development team works from: the same tools, the same agents, the same skills, and the rules that come with them. Without it, each team cobbles together its own way of using AI, and good practices stay stuck in a single repository. Security is one of the areas where that shared base pays off fastest, because a rule forgotten in one repository is enough to open a door. Both founders of The Vibe Company came through Theodo themselves.",
      fr: "Une Software Factory, c’est la base commune sur laquelle travaillent toutes les équipes de développement : les mêmes outils, les mêmes agents, les mêmes skills, et les règles qui vont avec. Sans elle, chaque équipe bricole son propre usage de l’IA, et les bonnes pratiques restent coincées dans un seul dépôt. La sécurité est un des domaines où cette base commune paie le plus vite, parce qu’une règle oubliée dans un seul dépôt suffit à ouvrir une porte. Les deux fondateurs de The Vibe Company sont eux-mêmes passés par Theodo.",
    },
    results: [],
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
    metric: raw.metric ? pick(raw.metric, locale) : undefined,
    metricLabel: raw.metricLabel ? pick(raw.metricLabel, locale) : undefined,
    metaTitle: raw.metaTitle ? pick(raw.metaTitle, locale) : undefined,
    metaDescription: pick(raw.metaDescription ?? raw.summary, locale),
    summary: pick(raw.summary, locale),
    points: raw.points.map((p) => pick(p, locale)),
    overview: pick(raw.overview, locale),
    approach: raw.approach ? pick(raw.approach, locale) : undefined,
    related: raw.related
      ? { href: pick(raw.related.href, locale), title: pick(raw.related.title, locale) }
      : undefined,
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
