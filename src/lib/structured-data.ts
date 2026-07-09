import {
  SITE_COUNTRY,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_FOUNDING_YEAR,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_SAME_AS,
  SITE_URL,
  absoluteUrl,
} from "./site";

/**
 * schema.org structured data injected as JSON-LD.
 * Invisible to visitors, read by Google and AI assistants (ChatGPT, Perplexity,
 * Claude) to understand who The Vibe Company is and to disambiguate the brand
 * from the many other "Vibe" companies.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/favicon.svg"),
  description: SITE_DESCRIPTION,
  email: SITE_EMAIL,
  foundingDate: SITE_FOUNDING_YEAR,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_LOCALITY,
    addressCountry: SITE_COUNTRY,
  },
  sameAs: SITE_SAME_AS,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/resources/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
