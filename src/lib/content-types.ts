/**
 * Static content type definitions.
 * These are fixed at build time — no DB queries needed.
 */

export interface ContentTypeConfig {
  slug: string
  urlSlug: string
  collection: 'content' | 'tools'
  name: string
  singularLabel: string
  pluralLabel: string
  description: string
  renderStyle: 'timeline' | 'grid' | 'list'
  prependDateToSlug: boolean
  sortOrder: number
  showInNav: boolean
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  {
    slug: 'daily',
    urlSlug: 'learnings',
    collection: 'content',
    name: 'Daily Learning',
    singularLabel: 'Learning',
    pluralLabel: 'Learnings',
    description: 'Daily learning journal',
    renderStyle: 'timeline',
    prependDateToSlug: true,
    sortOrder: 1,
    showInNav: true,
  },
  {
    slug: 'tutorial',
    urlSlug: 'tutorials',
    collection: 'content',
    name: 'Tutorial',
    singularLabel: 'Tutorial',
    pluralLabel: 'Tutorials',
    description: 'Step-by-step guides',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 2,
    showInNav: true,
  },
  {
    slug: 'article',
    urlSlug: 'articles',
    collection: 'content',
    name: 'Article',
    singularLabel: 'Article',
    pluralLabel: 'Articles',
    description: 'Long-form, in-depth content',
    renderStyle: 'list',
    prependDateToSlug: false,
    sortOrder: 3,
    showInNav: true,
  },
  {
    slug: 'tool-focus',
    urlSlug: 'focus',
    collection: 'content',
    name: 'Tool Focus',
    singularLabel: 'Focus',
    pluralLabel: 'Focus',
    description: 'In-depth tool reviews',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 4,
    showInNav: true,
  },
  {
    slug: 'concept-focus',
    urlSlug: 'concepts',
    collection: 'content',
    name: 'Concept Focus',
    singularLabel: 'Concept',
    pluralLabel: 'Concepts',
    description: 'Concept breakdowns and explanations',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 5,
    showInNav: true,
  },
  {
    slug: 'tools',
    urlSlug: 'tools',
    collection: 'tools',
    name: 'Tools',
    singularLabel: 'Tool',
    pluralLabel: 'Tools',
    description: 'Every tool we use to ship AI-native software.',
    renderStyle: 'grid',
    prependDateToSlug: false,
    sortOrder: 6,
    showInNav: true,
  },
]

/** All content type slugs (for Payload select field options) */
export const CONTENT_TYPE_SLUGS = CONTENT_TYPES.filter((ct) => ct.collection === 'content').map((ct) => ct.slug)

/** Lookup map for O(1) access by DB slug */
const bySlug = new Map(CONTENT_TYPES.map((ct) => [ct.slug, ct]))

/** Lookup map for O(1) access by URL slug */
const byUrlSlug = new Map(CONTENT_TYPES.map((ct) => [ct.urlSlug, ct]))

/** Get a content type config by DB slug. Returns undefined if not found. */
export function getContentTypeConfig(slug: string): ContentTypeConfig | undefined {
  return bySlug.get(slug)
}

/** Get a content type config by URL slug. Returns undefined if not found. */
export function getContentTypeByUrlSlug(urlSlug: string): ContentTypeConfig | undefined {
  return byUrlSlug.get(urlSlug)
}

/** Maps a DB type value to its URL slug. Falls back to the input if not found. */
export function getUrlSlugForDbType(dbType: string): string {
  return bySlug.get(dbType)?.urlSlug ?? dbType
}

/** Get all content type configs, sorted by sortOrder. */
export function getAllContentTypeConfigs(): ContentTypeConfig[] {
  return CONTENT_TYPES
}

/** Get only content types that should appear in navigation. */
export function getNavContentTypes(): ContentTypeConfig[] {
  return CONTENT_TYPES.filter((ct) => ct.showInNav)
}
