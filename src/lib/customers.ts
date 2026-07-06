export interface CustomerStat {
  value: string;
  label: string;
}

export interface Customer {
  slug: string;
  client: string;
  /** Colored logo used on cards and the case page. */
  logo: string;
  sector: string;
  /** Headline metric shown on the card. */
  metric: string;
  metricLabel: string;
  /** Short story shown on the card. */
  summary: string;
  /** Bullets shown on the card. */
  points: string[];
  /** Longer intro shown at the top of the case page. */
  overview: string;
  /** Result stats shown on the case page. */
  results: CustomerStat[];
  /** Product screenshots. Empty until we have real assets. */
  visuals: { src: string; alt: string }[];
  /** Client testimonial, shown on the case page when available. */
  quote?: { text: string; author: string };
  /** Live product, opened from the case page when available. */
  url?: string;
}

export const CUSTOMERS: Customer[] = [
  {
    slug: "monka",
    client: "Monka",
    logo: "/images/clients/monka-color.webp",
    sector: "Healthcare · Caregiver support",
    metric: "2 months",
    metricLabel: "from scratch to live on iOS and Android",
    summary:
      "Monka helps people who care for a loved one. They were years into their product, with heavy tech debt and a deadline they could not miss. We rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, in two months.",
    points: [
      "A 150-question caregiver assessment that turns into a prioritized to-do list, plus a directory of health professionals.",
      "Lifeline, a dashboard for the coordinating nurses: appointments, follow-up reports, shared documents.",
      "Further in two months than the product's previous four years.",
    ],
    overview:
      "Monka helps people who care for a loved one in a difficult situation. They had spent years building their product and were carrying heavy technical debt, with a hard deadline they could not miss. In two months, we rebuilt their mobile app and their care-coordination tool from scratch, fully vibe-coded, keeping their existing API.",
    results: [
      { value: "2 months", label: "From first line to the App Store" },
      { value: "iOS + Android", label: "Live on the App Store" },
      { value: "Every day", label: "New caregivers onboarded" },
      { value: "Daily", label: "Used by health professionals" },
    ],
    visuals: [],
    quote: {
      text: "The Vibe Company nous a permis d'accélérer très concrètement chez Monka. Une équipe smart, pragmatique, vraiment AI-native, capable de transformer des sujets complexes en outils utiles, livrés vite et state of the art.",
      author: "Étienne, Monka",
    },
    url: "https://www.monka.care",
  },
  {
    slug: "locservice",
    client: "LocService",
    logo: "/images/clients/locservice.png",
    sector: "Rentals · Customer support",
    metric: "87%",
    metricLabel: "of support tickets answered with our AI drafts",
    summary:
      "LocService handles several hundred support tickets a day. We read all their past tickets and internal docs to draft the answer for each new one, tailored to the customer's profile and history.",
    points: [
      "Connected to their internal APIs to pull real customer context.",
      "Classification rules so the same question gets the right answer per customer type.",
      "Hundreds of tickets a day, our drafts used on 87% of them.",
    ],
    overview:
      "LocService handles several hundred customer-support tickets a day. We built an assistant that reads all their past tickets and internal documentation to draft the answer for each new ticket, tailored to the customer's profile and history.",
    results: [
      { value: "87%", label: "Of tickets answered with our AI drafts" },
      { value: "Hundreds", label: "Of tickets handled per day" },
    ],
    visuals: [],
    url: "https://www.locservice.fr",
  },
  {
    slug: "afp",
    client: "AFP",
    logo: "/images/clients/afp.svg",
    sector: "News · Journalism",
    metric: "90M documents",
    metricLabel: "of text, image, and video, made searchable by AI",
    summary:
      "AFP is one of the world's largest news agencies. As part of a France 2030 project, we're building AI tools that help their journalists work faster, on top of a corpus of 90 million documents: articles, images, video, and wires.",
    points: [
      "Multimodal search: ask a question, get every relevant article, image, and video across the archive.",
      "Topic watch that follows a subject and surfaces what matters.",
      "A writing assistant for documentary research, fact-checking, and feedback.",
    ],
    overview:
      "AFP is one of the world's largest news agencies. As part of a two-year France 2030 project, we're building AI tools that help their journalists work faster, on top of a corpus of 90 million documents: articles, images, video, and wires.",
    results: [
      { value: "90M", label: "Documents made searchable" },
      { value: "2 years", label: "France 2030 project" },
      { value: "3 tools", label: "Watch, multimodal search, writing assistant" },
    ],
    visuals: [],
    url: "https://www.afp.com",
  },
  {
    slug: "coup-de-pates",
    client: "Coup de Pâtes",
    logo: "/images/clients/coup-de-pates.svg",
    sector: "Food · Design review",
    metric: "At a glance",
    metricLabel: "which catalog feedback was applied, which wasn't",
    summary:
      "Coup de Pâtes reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note was actually applied was slow and tedious. We built them AI skills that surface it all in a few glances.",
    points: [
      "See applied vs. missed feedback instantly, plus requested changes and typos.",
      "Re-annotate and re-export the new round of feedback as a PDF.",
      "A second tool highlights the differences between two specific documents, like two labels or two specs.",
    ],
    overview:
      "Coup de Pâtes reviews product catalogs from their designers: a v0 comes in, they mark up their feedback, and the revised version comes back. Checking that every note was actually applied was slow and tedious. We built them AI skills that surface it all in a few glances.",
    results: [
      { value: "2 tools", label: "Catalog review and document comparison" },
      { value: "PDF", label: "Re-annotate and re-export in one click" },
    ],
    visuals: [],
    url: "https://www.coupdepates.fr",
  },
];

export function getCustomer(slug: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.slug === slug);
}
