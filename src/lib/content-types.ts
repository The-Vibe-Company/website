/**
 * Static content type definitions.
 * These are fixed at build time — no DB queries needed.
 */

export interface ContentTypeConfig {
  slug: string
  name: string
  singularLabel: string
  pluralLabel: string
  description: string
  renderStyle: 'timeline' | 'grid'
  prependDateToSlug: boolean
  sortOrder: number
  showInNav: boolean
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  {
    slug: 'daily',
    name: 'Daily Learning',
    singularLabel: 'Learning',
    pluralLabel: 'Learnings',
    description: "Journal d'apprentissage quotidien",
    renderStyle: 'timeline',
    prependDateToSlug: true,
    sortOrder: 1,
    showInNav: true,
  },
  {
    slug: 'tutorial',
    name: 'Tutorial',
    singularLabel: 'Tutorial',
    pluralLabel: 'Tutorials',
    description: 'Guides step-by-step',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 2,
    showInNav: true,
  },
  {
    slug: 'article',
    name: 'Article',
    singularLabel: 'Article',
    pluralLabel: 'Articles',
    description: 'Contenu long-form et approfondi',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 3,
    showInNav: true,
  },
  {
    slug: 'tool-focus',
    name: 'Tool Focus',
    singularLabel: 'Focus',
    pluralLabel: 'Focus',
    description: 'Reviews approfondies des outils',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 4,
    showInNav: true,
  },
  {
    slug: 'concept-focus',
    name: 'Concept Focus',
    singularLabel: 'Concept',
    pluralLabel: 'Concepts',
    description: 'Explications pédagogiques des concepts',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 5,
    showInNav: true,
  },
]

/** All content type slugs (for Payload select field options) */
export const CONTENT_TYPE_SLUGS = CONTENT_TYPES.map((ct) => ct.slug)

/** Lookup map for O(1) access by slug */
const bySlug = new Map(CONTENT_TYPES.map((ct) => [ct.slug, ct]))

/** Get a content type config by slug. Returns undefined if not found. */
export function getContentTypeConfig(slug: string): ContentTypeConfig | undefined {
  return bySlug.get(slug)
}

/** Get all content type configs, sorted by sortOrder. */
export function getAllContentTypeConfigs(): ContentTypeConfig[] {
  return CONTENT_TYPES
}

/** Get only content types that should appear in navigation. */
export function getNavContentTypes(): ContentTypeConfig[] {
  return CONTENT_TYPES.filter((ct) => ct.showInNav)
}
