/**
 * Static content type definitions.
 * These are fixed at build time — no DB queries needed.
 */

export interface ContentTypeConfig {
  slug: string
  urlSlug: string
  name: string
  singularLabel: string
  pluralLabel: string
  description: string
  renderStyle: 'timeline' | 'grid' | 'list'
  sortOrder: number
  showInNav: boolean
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  {
    slug: 'daily',
    urlSlug: 'learnings',
    name: 'Learning',
    singularLabel: 'Learning',
    pluralLabel: 'Learnings',
    description: 'Short learnings, notes, and practical takeaways.',
    renderStyle: 'timeline',
    sortOrder: 1,
    showInNav: true,
  },
  {
    slug: 'article',
    urlSlug: 'articles',
    name: 'Article',
    singularLabel: 'Article',
    pluralLabel: 'Articles',
    description: 'Longer articles and deeper write-ups.',
    renderStyle: 'list',
    sortOrder: 2,
    showInNav: true,
  },
]

/** All content type slugs (for Payload select field options) */
export const CONTENT_TYPE_SLUGS = CONTENT_TYPES.map((ct) => ct.slug)

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
