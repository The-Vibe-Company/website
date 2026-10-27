export type ContentLocale = "fr" | "en";

/** A string available in both languages. */
type L = { en: string; fr: string };

/** The longer copy under the product shot: why we built it, how it works, who it serves. */
interface RawStory {
  why: L;
  how: L[];
  audience: L;
}

export interface ProjectStory {
  why: string;
  how: string[];
  audience: string;
}

function pick(value: L, locale: ContentLocale): string {
  return value[locale] ?? value.en;
}

interface RawProject {
  slug: string;
  name: string;
  logo: string;
  /** Product screenshot for the shared project template (optional). */
  cover?: string;
  /** Optional phone screenshot shown next to the cover on the project page. */
  mobileCover?: string;
  accent: string;
  url: string;
  repositoryUrl: string;
  tag: L;
  date: L;
  status: L;
  description: L;
  story?: RawStory;
}

export interface Project {
  slug: string;
  name: string;
  logo: string;
  /** Product screenshot for the shared project template (optional). */
  cover?: string;
  /** Optional phone screenshot shown next to the cover on the project page. */
  mobileCover?: string;
  accent: string;
  url: string;
  repositoryUrl: string;
  tag: string;
  date: string;
  status: string;
  description: string;
  story?: ProjectStory;
}

const PROJECTS_RAW: RawProject[] = [
  {
    slug: "vanish",
    name: "Vanish",
    logo: "/projects/vanish-favicon.svg",
    cover: "/projects/vanish-home.png",
    accent: "#10b981",
    url: "https://vanish.sh",
    repositoryUrl: "https://github.com/The-Vibe-Company/vanish",
    tag: { en: "File sharing", fr: "Partage de fichiers" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "Vanish is a temporary upload service: send a file, get a public link, and let it expire automatically.",
      fr: "Vanish est un service d’upload temporaire. Envoyez un fichier, récupérez un lien public, et laissez-le expirer automatiquement.",
    },
    story: {
      why: {
        en: "An agent has just finished an HTML report, a small demo or a deck, and someone needs to see it. Deploying an app for that is too much. Sending an attachment is too little. Vanish handles that last step, between the agent finishing the work and a person actually seeing it.",
        fr: "Un agent vient de finir un rapport HTML, une petite démo ou une présentation, et quelqu’un doit la voir. Déployer une app pour ça, c’est trop. L’envoyer en pièce jointe, c’est trop peu. Vanish s’occupe de cette dernière étape, entre l’agent qui a terminé et la personne qui doit voir le résultat.",
      },
      how: [
        {
          en: "One command, npx vanish-cli site ./demo, publishes a static folder and returns a real public URL. Single files work too: a screenshot without an account, a PDF or a deck once you sign in.",
          fr: "Une seule commande, npx vanish-cli site ./demo, publie un dossier statique et renvoie une vraie URL publique. Un fichier seul passe aussi : une capture sans compte, un PDF ou une présentation une fois connecté.",
        },
        {
          en: "Nothing is transformed: HTML stays HTML, Markdown stays Markdown, and every file is served as it is.",
          fr: "Rien n’est transformé : le HTML reste du HTML, le Markdown reste du Markdown, et chaque fichier est servi tel quel.",
        },
        {
          en: "Links expire on their own: after 24 hours without an account, 48 hours with a free account. The Pro plan keeps them for up to a year and lets you pick the address.",
          fr: "Les liens disparaissent tout seuls : au bout de 24 heures sans compte, 48 heures avec un compte gratuit. L’offre Pro permet de les garder jusqu’à un an et de choisir l’adresse.",
        },
        {
          en: "The skills shipped for agents ask before publishing anything that looks like a secret, customer data or a private document.",
          fr: "Les skills fournis aux agents demandent confirmation avant de publier ce qui ressemble à un secret, à des données client ou à un document privé.",
        },
        {
          en: "The code is MIT licensed and runs on Cloudflare, so you can read every line and host the whole thing yourself.",
          fr: "Le code est sous licence MIT et tourne sur Cloudflare : on peut en lire chaque ligne et tout héberger soi-même.",
        },
      ],
      audience: {
        en: "For anyone who puts Claude Code, Codex or a plain script to work and wants to share the result with a client or a colleague without setting up a deployment pipeline. Audits, prototypes, reports, decks: anything that deserves better than an attachment.",
        fr: "Pour celles et ceux qui font travailler Claude Code, Codex ou un simple script, et qui veulent partager le résultat avec un client ou un collègue sans monter de pipeline de déploiement. Audits, prototypes, rapports, présentations : tout ce qui mérite mieux qu’une pièce jointe.",
      },
    },
  },
  {
    // Shipped as "The Companion" until Sep 2026, renamed Skillpack. The old
    // /portfolio/the-companion URL is redirected in next.config.ts.
    slug: "skillpack",
    name: "Skillpack",
    logo: "/projects/skillpack-favicon.svg",
    cover: "/projects/skillpack-home.png",
    accent: "#f97316",
    url: "https://skillpack.app/",
    repositoryUrl: "https://github.com/The-Vibe-Company/skillpack",
    tag: { en: "Skill library", fr: "Bibliothèque de skills" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "Skillpack is a shared skill library for teams. Package your colleagues' best prompts as reusable skills, browse what the team has built, and use them in your AI for anything.",
      fr: "Skillpack est une bibliothèque de skills partagée pour les équipes. On empaquette les meilleurs prompts de ses collègues en skills réutilisables, on parcourt ce que l’équipe a construit, et on les utilise dans son IA pour tout.",
    },
    story: {
      why: {
        en: "Every project we run relies on skills: ready-to-use instructions and tools we give the AI for one specific task. The trouble is that they don't travel. The code review checklist sits in a gist, the deploy skill was pasted in Slack, and every agent runs a different copy. Skillpack, first shipped as Companion, exists so that one good skill helps the whole team.",
        fr: "Chaque projet qu’on mène s’appuie sur des skills : des consignes et des outils prêts à l’emploi qu’on donne à l’IA pour une tâche précise. Le problème, c’est qu’ils ne circulent pas. La checklist de revue de code dort dans un gist, le skill de déploiement a été collé dans Slack, et chaque agent tourne avec une copie différente. Skillpack, d’abord sorti sous le nom de Companion, existe pour qu’un bon skill profite à toute l’équipe.",
      },
      how: [
        {
          en: "You write a SKILL.md file or upload a package. Skillpack checks the archive, the manifest, the dependencies and the declared secrets before anything ships.",
          fr: "On écrit un fichier SKILL.md ou on importe un paquet. Skillpack vérifie l’archive, le manifeste, les dépendances et les secrets déclarés avant toute publication.",
        },
        {
          en: "Every published version is immutable. A skill stays personal, or it is shared with the whole organization so every member can use it and improve it.",
          fr: "Chaque version publiée est figée. Un skill reste personnel, ou il est partagé avec toute l’organisation pour que chacun puisse l’utiliser et l’améliorer.",
        },
        {
          en: "One command, skillpack install, puts an exact version into Claude Code, Codex or OpenCode, and a lockfile records which version was installed.",
          fr: "Une commande, skillpack install, installe une version précise dans Claude Code, Codex ou OpenCode, et un fichier de verrouillage garde la trace de la version installée.",
        },
        {
          en: "Agents can report each time a skill is used, and anyone can opt out, so you can see which skills actually earn their place.",
          fr: "Les agents peuvent signaler chaque utilisation d’un skill, et chacun peut le refuser, pour voir quels skills servent vraiment.",
        },
      ],
      audience: {
        en: "For teams that use coding agents every day and want one source of truth for their skills. Skillpack is open source: you can host it yourself or use skillpack.app. It is also where The Vibe Company keeps and shares its own skills.",
        fr: "Pour les équipes qui utilisent des agents de code tous les jours et veulent une seule source de vérité pour leurs skills. Skillpack est open source : on peut l’héberger soi-même ou utiliser skillpack.app. C’est aussi là que The Vibe Company range et partage ses propres skills.",
      },
    },
  },
  {
    slug: "vibedrift",
    name: "VibeDrift",
    logo: "/projects/vibedrift-favicon.svg",
    cover: "/projects/vibedrift-home.png",
    accent: "#facc15",
    url: "https://www.vibedrift.dev",
    repositoryUrl: "https://github.com/The-Vibe-Company/vibe-drift-tracker",
    tag: { en: "Dev analytics", fr: "Analytics développeur" },
    date: { en: "Feb 2026", fr: "févr. 2026" },
    status: { en: "Live", fr: "En ligne" },
    description: {
      en: "VibeDrift tracks real developer activity and turns it into useful metrics to understand flow and friction.",
      fr: "VibeDrift suit l’activité réelle des développeurs et la transforme en métriques utiles pour comprendre le flow et les frictions.",
    },
    story: {
      why: {
        en: "You start a session with a clear goal, open Claude Code, and 47 prompts later you have refactored half the codebase and added three features nobody asked for. We wanted to see that moment coming instead of noticing it afterwards. VibeDrift measures that drift, commit by commit.",
        fr: "On commence une session avec un objectif clair, on ouvre Claude Code, et 47 prompts plus tard on a refactoré la moitié du code et ajouté trois fonctionnalités que personne n’a demandées. On voulait voir ce moment arriver plutôt que le constater après coup. VibeDrift mesure cette dérive, commit par commit.",
      },
      how: [
        {
          en: "A VS Code extension quietly counts the prompts you send to Claude Code while you work.",
          fr: "Une extension VS Code compte discrètement les prompts envoyés à Claude Code pendant que vous codez.",
        },
        {
          en: "It combines them with git metadata (lines changed, files touched, branch) to compute a drift score that updates live.",
          fr: "Elle les croise avec les métadonnées git (lignes modifiées, fichiers touchés, branche) pour calculer un score de dérive mis à jour en direct.",
        },
        {
          en: "Many prompts for few lines push the score up, many lines per prompt bring it down. A single prompt is never penalized, and the score resets to zero at every commit.",
          fr: "Beaucoup de prompts pour peu de lignes font monter le score, beaucoup de lignes par prompt le font baisser. Un prompt seul n’est jamais pénalisé, et le score repart à zéro à chaque commit.",
        },
        {
          en: "A commit with no prompts stays out of the stats, and a prompt that produces no code produces no drift: asking a question costs nothing.",
          fr: "Un commit sans prompt reste hors des statistiques, et un prompt qui ne produit pas de code ne crée pas de dérive : poser une question ne coûte rien.",
        },
        {
          en: "Each commit saves a snapshot of the session with a drift level, from \"very-low\" to \"vibe-drift\", and the history lives on vibedrift.dev.",
          fr: "Chaque commit enregistre un instantané de la session avec un niveau de dérive, de « very-low » à « vibe-drift », et l’historique se consulte sur vibedrift.dev.",
        },
      ],
      audience: {
        en: "For developers who code with Claude Code and want to know when they are focused and when they are going in circles. Setup takes four steps: create an account, generate an API key, install the extension, paste the key into VS Code.",
        fr: "Pour les développeurs qui codent avec Claude Code et veulent savoir quand ils sont concentrés et quand ils tournent en rond. L’installation tient en quatre étapes : créer un compte, générer une clé d’API, installer l’extension, coller la clé dans VS Code.",
      },
    },
  },
  {
    slug: "granite",
    name: "Granite",
    logo: "/projects/granite-favicon.png",
    cover: "/projects/granite-home.png",
    accent: "#62D1AF",
    url: "https://github.com/The-Vibe-Company/Granite",
    repositoryUrl: "https://github.com/The-Vibe-Company/Granite",
    tag: { en: "Agent OS", fr: "OS pour agents" },
    date: { en: "Apr 2026", fr: "avr. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "Granite is the personal OS your agent runs on: markdown notes, a SQLite index, and a typed contract system that turns local files into a navigable company memory.",
      fr: "Granite est l’OS personnel sur lequel tourne votre agent. Des notes markdown, un index SQLite et un système de contrats typés qui transforme vos fichiers locaux en une mémoire d’entreprise navigable.",
    },
    story: {
      why: {
        en: "Agents don't lack tools, they lack memory. Every new session, you explain again who the clients are, what was decided and how the team works. Granite gives them a memory they can't make up: files you can read, link and version. We run the company's own memory on it: the clients, the method, the decisions.",
        fr: "Les agents ne manquent pas d’outils, ils manquent de mémoire. À chaque nouvelle session, il faut leur réexpliquer qui sont les clients, ce qui a été décidé et comment l’équipe travaille. Granite leur donne une mémoire qu’ils ne peuvent pas inventer : des fichiers qu’on peut lire, relier et versionner. La mémoire de l’entreprise elle-même tourne dessus : les clients, la méthode, les décisions.",
      },
      how: [
        {
          en: "Every note is a markdown file with YAML frontmatter. The files are the source of truth, and you can open the folder in any editor.",
          fr: "Chaque note est un fichier markdown avec un en-tête YAML. Les fichiers font foi, et on peut ouvrir le dossier dans n’importe quel éditeur.",
        },
        {
          en: "A SQLite index, rebuilt from the files at any time, powers full-text search, backlinks and typed queries.",
          fr: "Un index SQLite, reconstruit à partir des fichiers à tout moment, sert la recherche plein texte, les liens retour et les requêtes typées.",
        },
        {
          en: "Types are contracts: source, note, synthesis and output, plus person, organization, meeting and learning with the founder-os template. An agent knows how to treat each kind of document.",
          fr: "Les types sont des contrats : source, note, synthèse et sortie, plus personne, organisation, réunion et apprentissage avec le modèle founder-os. Un agent sait ainsi comment traiter chaque document.",
        },
        {
          en: "An MCP server plugs Granite into Claude Code, Cursor or any compatible agent. At the start of each session, granite_wakeup loads a compressed snapshot of the whole vault in about 350 tokens.",
          fr: "Un serveur MCP branche Granite sur Claude Code, Cursor ou tout agent compatible. Au début de chaque session, granite_wakeup charge un résumé compressé de tout le coffre en environ 350 tokens.",
        },
        {
          en: "No LLM inside and no embeddings: your agent brings the intelligence, Granite holds the ground truth.",
          fr: "Pas de LLM à l’intérieur, ni d’embeddings : l’intelligence vient de votre agent, Granite garde la vérité de terrain.",
        },
      ],
      audience: {
        en: "For founders, consultants and teams who work with agents and want a memory that stays local, readable and under their control. Granite installs with npm install -g granite-mem, is MIT licensed, and also works without an agent, with a web interface and a graph of your notes.",
        fr: "Pour les fondateurs, les consultants et les équipes qui travaillent avec des agents et veulent une mémoire locale, lisible et sous leur contrôle. Granite s’installe avec npm install -g granite-mem, il est sous licence MIT, et il fonctionne aussi sans agent, avec une interface web et un graphe de vos notes.",
      },
    },
  },
  {
    slug: "vibedeck",
    name: "VibeDeck",
    logo: "/projects/vibedeck-favicon.svg",
    cover: "/projects/vibedeck-home.png",
    accent: "#f5a623",
    url: "https://vibedeck.thevibecompany.co",
    repositoryUrl: "https://github.com/The-Vibe-Company/VibeDeck",
    tag: { en: "Local dashboard", fr: "Dashboard local" },
    date: { en: "Jul 2026", fr: "juil. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "VibeDeck gathers your favorite sites, feeds and media into a dashboard of panels you compose freely. Everything stays on your machine: no account, no server, no tracking.",
      fr: "VibeDeck rassemble vos sites, flux et médias favoris dans un dashboard de panneaux que vous composez librement. Tout reste sur votre machine : sans compte, sans serveur, sans tracking.",
    },
    story: {
      why: {
        en: "Keeping up with the news often means juggling twenty tabs, scattered RSS feeds and live sites. VibeDeck started as a monitoring app for journalists: everything you follow on one screen, without what you read ever leaving your machine.",
        fr: "Faire sa veille, c’est souvent jongler entre vingt onglets, des flux RSS éparpillés et des sites en direct. VibeDeck est d’abord une application de veille pensée pour les journalistes : tout ce qu’on suit sur un seul écran, sans que ce qu’on lit quitte jamais la machine.",
      },
      how: [
        {
          en: "Each panel is either a Feed, which merges several sources into one timeline, or a Web page, which keeps a live stream, a site or a tool visible inside the app.",
          fr: "Chaque panneau est soit un « Fil », qui fusionne plusieurs sources en une seule chronologie, soit une « Page web », qui garde un direct, un site ou un outil visible dans l’application.",
        },
        {
          en: "Panels sit side by side or stacked, and you resize and rearrange them with the mouse or the keyboard, across up to nine tabs.",
          fr: "Les panneaux se placent côte à côte ou l’un au-dessus de l’autre, se redimensionnent et se réorganisent à la souris ou au clavier, sur jusqu’à neuf onglets.",
        },
        {
          en: "Thirty publications are recognized out of the box, twenty French and ten English-language, and any RSS, Atom or sitemap feed can be added from a single URL.",
          fr: "Trente publications sont reconnues d’emblée, vingt françaises et dix anglophones, et n’importe quel flux RSS, Atom ou sitemap s’ajoute à partir d’une simple URL.",
        },
        {
          en: "New stories land at the top without moving what you are reading, and each one is marked new, seen or opened.",
          fr: "Les nouveaux articles arrivent en haut sans bousculer la lecture en cours, et chacun est marqué nouveau, vu ou ouvert.",
        },
        {
          en: "Search works offline across every feed, combining keywords with local semantic search.",
          fr: "La recherche fonctionne hors ligne dans tous les fils, en combinant mots-clés et recherche sémantique locale.",
        },
      ],
      audience: {
        en: "For journalists, monitoring teams and anyone who follows the news closely. VibeDeck is free, open source under the MIT license, and available for macOS and Windows. Everything is stored locally in SQLite: no account, no cloud, no data collection.",
        fr: "Pour les journalistes, les équipes de veille et tous ceux qui suivent l’actualité de près. VibeDeck est gratuit, open source sous licence MIT, et disponible pour macOS et Windows. Tout est stocké localement dans SQLite : pas de compte, pas de cloud, pas de collecte.",
      },
    },
  },
  {
    slug: "bruno",
    name: "Bruno",
    logo: "/projects/bruno-favicon.png",
    cover: "/projects/bruno-home.png",
    mobileCover: "/projects/bruno-mobile.png",
    accent: "#f27313",
    url: "https://github.com/The-Vibe-Company/bruno",
    repositoryUrl: "https://github.com/The-Vibe-Company/bruno",
    tag: { en: "Team to-do", fr: "To-do d’équipe" },
    date: { en: "Sep 2026", fr: "sept. 2026" },
    status: { en: "Internal tool", fr: "Outil interne" },
    description: {
      en: "Bruno is the to-do we run the company on, on web and iPhone. Capture an idea by voice in seconds, sort what's on fire from what can wait, and let Bruno nudge you instead of waiting to be opened.",
      fr: "Bruno est la to-do sur laquelle tourne l’entreprise, sur le web et sur iPhone. On capture une idée à la voix en quelques secondes, on sépare ce qui brûle de ce qui peut attendre, et c’est Bruno qui vient vous relancer au lieu d’attendre qu’on l’ouvre.",
    },
    story: {
      why: {
        en: "Our old to-do had three problems. Capturing an idea cost too much: take out the phone, open the tool, find the right list, type. Nobody opened it. And nothing told what was on fire from what could wait. We built Bruno to fix those three problems, and only those.",
        fr: "Notre ancienne to-do avait trois défauts. Capturer une idée coûtait trop cher : sortir le téléphone, ouvrir l’outil, trouver la bonne liste, taper. Personne ne l’ouvrait. Et rien ne distinguait ce qui brûle de ce qui peut attendre. On a construit Bruno pour régler ces trois problèmes, et seulement ceux-là.",
      },
      how: [
        {
          en: "Capture without friction: on iPhone, you dictate an idea in a few seconds and it lands in Bruno, wherever you are.",
          fr: "Capturer sans friction : sur iPhone, on dicte une idée en quelques secondes et elle atterrit dans Bruno, où qu’on soit.",
        },
        {
          en: "The to-do comes to you: a morning summary of what you committed to, reminders during the day, a review in the evening. Nobody is expected to remember to open the app.",
          fr: "La to-do vient vous voir : un point le matin sur ce à quoi on s’est engagé, des rappels dans la journée, un bilan le soir. On ne compte sur personne pour penser à ouvrir l’app.",
        },
        {
          en: "Four sections, no more: To sort, On fire, Coming up and Ideas. A task can only go On fire with one owner and a commitment.",
          fr: "Quatre sections, pas une de plus : À trier, Sur le feu, À venir et Idées. Une tâche n’entre Sur le feu qu’avec un responsable et un engagement.",
        },
        {
          en: "No priority scale: priority is the position in the list, and everyone knows how to read a stack.",
          fr: "Pas d’échelle de priorité : la priorité, c’est la position dans la liste, et tout le monde sait lire une pile.",
        },
        {
          en: "On the web, the list is projected for the team's morning meeting.",
          fr: "Sur le web, la liste est projetée pendant le point d’équipe du matin.",
        },
      ],
      audience: {
        en: "Bruno is the company's tool, not the one for detailed client work: coordination, commitments, what's on fire and ideas. It is an internal tool, not a product for sale, but its code is public on GitHub for anyone curious about how a small team designed its own to-do.",
        fr: "Bruno est l’outil de la boîte, pas celui du travail client détaillé : la coordination, les engagements, ce qui brûle et les idées. C’est un outil interne, pas un produit à vendre, mais son code est public sur GitHub pour qui veut voir comment une petite équipe a conçu sa propre to-do.",
      },
    },
  },
  {
    slug: "armada",
    name: "Armada",
    logo: "/projects/armada-favicon.svg",
    cover: "/projects/armada-home.png",
    accent: "#b6f15a",
    url: "https://armada.thevibecompany.co",
    repositoryUrl: "https://github.com/The-Vibe-Company/armada",
    tag: { en: "Agent fleet", fr: "Flotte d’agents" },
    date: { en: "Sep 2026", fr: "sept. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "Armada runs a fleet of coding agents on one project. Each ticket goes to its own agent, a coordinator merges the green pull requests, and a live dashboard shows the whole fleet, from the first question to the merge.",
      fr: "Armada fait tourner une flotte d’agents de code sur un même projet. Chaque ticket part chez son propre agent, un coordinateur merge les pull requests au vert, et un dashboard en direct montre toute la flotte, de la première question jusqu’au merge.",
    },
    story: {
      why: {
        en: "Running one coding agent is easy. Running ten on the same project, without conflicts, forgotten pull requests or losing track of who does what, is another story. Armada imposes one method and makes the whole fleet visible.",
        fr: "Faire tourner un agent de code, c’est facile. En faire tourner dix sur le même projet, sans conflits, sans pull requests oubliées et sans perdre le fil de qui fait quoi, c’est une autre histoire. Armada impose une méthode et rend toute la flotte visible.",
      },
      how: [
        {
          en: "First, every open decision is grilled and answered before a line of code is written. The answers become one spec: the goal, the decisions, what stays out.",
          fr: "D’abord, chaque décision ouverte est passée au crible et tranchée avant la première ligne de code. Les réponses deviennent une spec : l’objectif, les décisions, ce qui reste hors périmètre.",
        },
        {
          en: "The spec is cut into tickets in Linear, each small enough for one agent. Armada ranks the ready ones by what they unlock.",
          fr: "La spec est découpée en tickets dans Linear, chacun assez petit pour un seul agent. Armada classe ceux qui sont prêts selon ce qu’ils débloquent.",
        },
        {
          en: "One worker agent claims each ticket, reports every phase, and hands back its pull request only when every required check is green.",
          fr: "Un agent prend chaque ticket, rend compte de chaque étape et ne rend sa pull request que lorsque toutes les vérifications requises sont au vert.",
        },
        {
          en: "A coordinator checks the hand-back and merges. Workers never merge.",
          fr: "Un coordinateur vérifie ce qui lui est rendu et merge. Les agents ne mergent jamais eux-mêmes.",
        },
        {
          en: "A live dashboard routes questions and approvals to a human, explains CI failures, and checks deployments after each merge.",
          fr: "Un dashboard en direct remonte les questions et les validations à un humain, explique les échecs de CI et vérifie les déploiements après chaque merge.",
        },
      ],
      audience: {
        en: "For teams already using coding agents who want to go from one agent to a fleet without losing control. Workers run on your own machine, on Conductor Cloud or in Claude Code, tickets live in Linear and code on GitHub. Armada is open source under the MIT license and installs with npm, on Node 22 or later.",
        fr: "Pour les équipes qui utilisent déjà des agents de code et veulent passer d’un agent à une flotte sans perdre le contrôle. Les agents tournent sur votre propre machine, sur Conductor Cloud ou dans Claude Code, les tickets vivent dans Linear et le code sur GitHub. Armada est open source sous licence MIT et s’installe avec npm, à partir de Node 22.",
      },
    },
  },
  {
    slug: "aeom",
    name: "AEOM",
    logo: "/projects/aeom-favicon.svg",
    cover: "/projects/aeom-home.png",
    accent: "#ff5a3c",
    url: "https://all-eyes-on-me-three.vercel.app",
    repositoryUrl: "https://github.com/The-Vibe-Company/all-eyes-on-me",
    tag: { en: "Frontend design", fr: "Design de front" },
    date: { en: "Oct 2026", fr: "oct. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "AEOM (All Eyes On Me) is the designer of a product coded by agents. It walks your app like a user, judges every screen against your taste, and rebuilds what gets in the way so the frontend looks like someone designed it.",
      fr: "AEOM (All Eyes On Me) est le designer d’un produit codé par des agents. Il parcourt votre app comme un utilisateur, juge chaque écran selon votre goût, et refait ce qui gêne pour que le front ait l’air d’avoir été dessiné par quelqu’un.",
    },
    story: {
      why: {
        en: "Agents code fast, but the frontend they produce often looks generic: screens that work without anyone having thought them through. AEOM plays the designer that a product coded by agents is missing.",
        fr: "Les agents codent vite, mais le front qu’ils produisent a souvent l’air générique : des écrans qui marchent sans que personne les ait vraiment pensés. AEOM joue le rôle du designer qui manque à un produit codé par des agents.",
      },
      how: [
        {
          en: "It walks your app like a user, replaying three to five key journeys in a real browser, on phone and desktop.",
          fr: "Il parcourt votre app comme un utilisateur, en rejouant trois à cinq parcours clés dans un vrai navigateur, sur téléphone et sur ordinateur.",
        },
        {
          en: "It runs twenty-seven concrete checks, from contrast to keyboard focus to tap target size, and judge agents score every screen against design principles.",
          fr: "Il mesure vingt-sept points concrets, du contraste au focus clavier en passant par la taille des zones à toucher, et des juges évaluent chaque écran selon des principes de design.",
        },
        {
          en: "When the frontend has no direction of its own, it proposes several art directions drawn from your product's world, and you choose.",
          fr: "Quand le front n’a pas de direction propre, il propose plusieurs directions artistiques tirées de l’univers de votre produit, et c’est vous qui choisissez.",
        },
        {
          en: "It redoes what gets in the way, page by page, never adds a feature, and keeps a change only if fewer things fail than before.",
          fr: "Il refait ce qui gêne, page par page, sans jamais ajouter de fonctionnalité, et ne garde une modification que si moins de choses échouent qu’avant.",
        },
        {
          en: "It then writes down the standard of your frontend and holds every new pull request to it with /aeom review.",
          fr: "Il écrit ensuite le standard de votre front et y tient chaque nouvelle pull request avec /aeom review.",
        },
      ],
      audience: {
        en: "For teams building with Claude Code who want a frontend that looks like someone designed it. AEOM is a Claude Code skill, open source under the MIT license and still pre-alpha: it has been run on two real projects on top of demo apps.",
        fr: "Pour les équipes qui construisent avec Claude Code et veulent un front qui a l’air d’avoir été dessiné par quelqu’un. AEOM est un skill Claude Code, open source sous licence MIT et encore en pré-alpha : il a déjà tourné sur deux vrais projets, en plus d’applications de démo.",
      },
    },
  },
  {
    // The open-source engine the company grew out of, rebuilt as V2. No
    // cover: its page draws the web app in code (QuivrFeedMock) and adds
    // QuivrSections under the shared template.
    slug: "quivr",
    name: "Quivr",
    logo: "/projects/quivr-favicon.svg",
    accent: "#5b3fd6",
    url: "https://github.com/The-Vibe-Company/quivr",
    repositoryUrl: "https://github.com/The-Vibe-Company/quivr",
    tag: { en: "Search & monitoring", fr: "Recherche et veille" },
    date: { en: "Oct 2026", fr: "oct. 2026" },
    status: { en: "Open source", fr: "Open source" },
    description: {
      en: "Quivr follows news, emails and social posts as they arrive, makes them searchable in seconds, and alerts you when a topic you follow comes up.",
      fr: "Quivr suit les articles, les e-mails et les posts au fil de l’eau, les indexe pour qu’on les retrouve en quelques secondes, et vous prévient quand un sujet que vous suivez apparaît.",
    },
  },
];

function localize(raw: RawProject, locale: ContentLocale): Project {
  return {
    slug: raw.slug,
    name: raw.name,
    logo: raw.logo,
    cover: raw.cover,
    mobileCover: raw.mobileCover,
    accent: raw.accent,
    url: raw.url,
    repositoryUrl: raw.repositoryUrl,
    tag: pick(raw.tag, locale),
    date: pick(raw.date, locale),
    status: pick(raw.status, locale),
    description: pick(raw.description, locale),
    story: raw.story
      ? {
          why: pick(raw.story.why, locale),
          how: raw.story.how.map((step) => pick(step, locale)),
          audience: pick(raw.story.audience, locale),
        }
      : undefined,
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
