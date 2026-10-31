import { CLIENTS } from "@/components/home/Clients";
import { getCustomers } from "@/lib/customers";
import { absoluteUrl, SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Schema.org JSON-LD for the site. The Organization and WebSite nodes are
 * emitted on every page by the locale layout; pages add their own
 * BreadcrumbList, Article and FAQPage nodes.
 *
 * Structured data only restates what the pages already say. Free text that
 * comes from page copy (article summaries, company-page FAQ answers) goes
 * through `isPublishable` first: client names, pricing, certifications and
 * grant programmes stay out of the markup, even where the visible page
 * mentions them. Article FAQs are published editorial answers (client examples
 * link to public case studies, amounts are official scheme rates), so they go
 * through the narrower `isPublishableInArticleFaq`: only certifications and
 * the grant programme are kept out.
 */

type JsonLdNode = Record<string, unknown>;

const SCHEMA_CONTEXT = "https://schema.org";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const STAN_GIRARD: JsonLdNode = {
  "@type": "Person",
  "@id": `${SITE_URL}/#stan-girard`,
  name: "Stan Girard",
  sameAs: [
    "https://www.linkedin.com/in/stan-girard/",
    "https://x.com/_stangirard",
    "https://github.com/StanGirard",
  ],
};

/** Author of the Victor's Story series, which he writes in the first person. */
const VICTOR_NIVAULT: JsonLdNode = {
  "@type": "Person",
  name: "Victor Nivault",
  jobTitle: "Builder",
  worksFor: { "@type": "Organization", name: SITE_NAME },
  sameAs: ["https://www.linkedin.com/in/victor-nivault-698a77217"],
};

const VICTOR_STORY_SERIES = "victor-story";

const ANTOINE_DEWEZ: JsonLdNode = {
  "@type": "Person",
  "@id": `${SITE_URL}/#antoine-dewez`,
  name: "Antoine Dewez",
  sameAs: [
    "https://www.linkedin.com/in/antoine-dewez-367774157",
    "https://x.com/AntoineZewed",
  ],
};

const LOGO: JsonLdNode = {
  "@type": "ImageObject",
  url: absoluteUrl(SITE_LOGO.path),
  width: SITE_LOGO.width,
  height: SITE_LOGO.height,
};

/** The publisher as it is referenced from other nodes. */
const PUBLISHER: JsonLdNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO,
};

const ORGANIZATION_DESCRIPTION = {
  fr: "Agence IA native à Paris : agents IA, intégration de LLM et automatisation, du cadrage à la mise en production.",
  en: "AI-native agency in Paris: AI agents, LLM integration and automation, from scoping to production.",
};

/**
 * The company as an AI agency: an Organization that is also a
 * ProfessionalService. It only states facts we can source: no contact
 * details, commercial terms, ratings or certifications.
 */
export function organizationNode(locale: string): JsonLdNode {
  return {
    ...PUBLISHER,
    "@type": ["Organization", "ProfessionalService"],
    description: locale === "fr" ? ORGANIZATION_DESCRIPTION.fr : ORGANIZATION_DESCRIPTION.en,
    image: LOGO.url,
    founder: [STAN_GIRARD, ANTOINE_DEWEZ],
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    areaServed: [{ "@type": "Country", name: "France" }],
    knowsAbout: [
      "Artificial intelligence",
      "AI agents",
      "Large language models",
      "Generative AI",
      "AI automation",
      "Model Context Protocol",
    ],
    sameAs: [
      "https://www.linkedin.com/company/thevibeco",
      "https://www.ycombinator.com/companies/the-vibe-company",
      "https://github.com/The-Vibe-Company",
      "https://x.com/thevibecompany",
      // Quivr pivoted into The Vibe Company.
      "https://github.com/QuivrHQ",
      "https://www.linkedin.com/company/getquivr",
    ],
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["fr", "en"],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** The site-wide graph, on every page, in the page's language. */
export function siteGraph(locale: string): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [organizationNode(locale), websiteNode()],
  };
}

/**
 * A page of the site, attached to the WebSite and about the Organization, so
 * it extends the site graph instead of declaring a second company.
 */
export function webPageNode({
  url,
  name,
  description,
  language,
}: {
  url: string;
  name: string;
  description: string;
  language: string;
}): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    ...(isPublishable(description) ? { description } : {}),
    inLanguage: language,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
}

/**
 * A service the company provides, in a city or, without one, in France. No
 * offer, price or rating; the description only when it is publishable.
 */
export function serviceNode({
  url,
  name,
  serviceType,
  city,
  description,
}: {
  url: string;
  name: string;
  serviceType: string;
  city?: string;
  description?: string;
}): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    name,
    serviceType,
    ...(description && isPublishable(description) ? { description } : {}),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: city ? { "@type": "City", name: city } : { "@type": "Country", name: "France" },
    url,
  };
}

export type Crumb = { name: string; url: string };

/** The trail from the home page to the current page, all absolute URLs. */
export function breadcrumbList(crumbs: Crumb[]): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function articleSchema({
  url,
  title,
  summary,
  publishedAt,
  language,
  imageUrl,
  series,
}: {
  url: string;
  title: string;
  summary?: string;
  publishedAt: string;
  language: string;
  imageUrl?: string;
  /** Victor's Story articles are Victor's; every other article is Stan's. */
  series?: string;
}): JsonLdNode {
  // The content has no separate update date, so the publication date stands
  // for both.
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: title,
    ...(summary && isPublishable(summary) ? { description: summary } : {}),
    datePublished: publishedAt,
    dateModified: publishedAt,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    inLanguage: language,
    author: series === VICTOR_STORY_SERIES ? VICTOR_NIVAULT : STAN_GIRARD,
    publisher: PUBLISHER,
  };
}

export type FaqItem = { question: string; answer: string };

/**
 * FAQPage markup for a FAQ that is visible on the page, word for word. Entries
 * that fail `isPublishable` are left out; with none left, there is no markup.
 */
export function faqPageSchema(
  items: FaqItem[],
  publishable: (text: string) => boolean = isPublishable,
): JsonLdNode | null {
  const kept = items.filter(
    (item) => publishable(item.question) && publishable(item.answer),
  );
  if (kept.length === 0) return null;

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: kept.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * FAQPage markup for an article's `## FAQ` section: every visible question,
 * word for word, except entries that name a certification or the grant
 * programme (see `isPublishableInArticleFaq`).
 */
export function articleFaqPageSchema(markdown: string): JsonLdNode | null {
  return faqPageSchema(extractMarkdownFaq(markdown), isPublishableInArticleFaq);
}

/** Restated in no markup at all: certifications and the grant programme. */
const CERTIFICATION_PATTERNS: RegExp[] = [/\bSOC\s?2\b/i, /\bISO\b/, /\bMediaGen\b/i];

/** Whether an article FAQ question or answer can be restated in structured data. */
export function isPublishableInArticleFaq(text: string): boolean {
  return !CERTIFICATION_PATTERNS.some((pattern) => pattern.test(text));
}

const FAQ_HEADING = /^##\s+(faq|questions fréquentes|frequently asked questions)\s*$/i;

/**
 * The FAQ section of an article, as the reader sees it. Two shapes exist in
 * `content/articles`: a `### Question` heading followed by answer paragraphs,
 * or a `**Question**` line with the answer on the lines below.
 */
export function extractMarkdownFaq(markdown: string): FaqItem[] {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => FAQ_HEADING.test(line.trim()));
  if (start === -1) return [];

  const items: { question: string; answer: string[] }[] = [];
  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    if (/^#{1,2}\s/.test(line)) break;

    const heading = line.match(/^###\s+(.+)$/);
    const bold = line.match(/^\*\*(.+)\*\*$/);
    if (heading || bold) {
      items.push({ question: (heading ?? bold)![1], answer: [] });
    } else if (items.length > 0) {
      items[items.length - 1].answer.push(raw);
    }
  }

  return items
    .map((item) => ({
      question: markdownToText(item.question),
      answer: item.answer
        .join("\n")
        .split(/\n\s*\n/)
        .map((paragraph) => markdownToText(paragraph))
        .filter(Boolean)
        .join("\n"),
    }))
    .filter((item) => item.question && item.answer);
}

/** Inline Markdown to the text it renders: links, emphasis and code marks dropped. */
function markdownToText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(\S(?:.*?\S)?)\*/g, "$1")
    .replace(/(^|[^\w])_(\S(?:.*?\S)?)_(?![\w])/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CLIENT_NAMES = [
  ...new Set([
    ...CLIENTS.map((client) => client.name),
    ...getCustomers("en").map((customer) => customer.client),
  ]),
];

const RESTRICTED_PATTERNS: RegExp[] = [
  ...CERTIFICATION_PATTERNS,
  /[€$£]/,
  /\b(prix|tarifs?|tarification|forfaits?|euros?|dollars?|pric(e|es|ed|ing))\b/i,
  ...CLIENT_NAMES.map((name) => new RegExp(`\\b${escapeRegExp(name)}\\b`, "i")),
];

/** Whether page copy can be restated in structured data. */
export function isPublishable(text: string): boolean {
  return !RESTRICTED_PATTERNS.some((pattern) => pattern.test(text));
}
