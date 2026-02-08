import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getContentTypeConfig } from '@/lib/content-types'

/**
 * Domain queries — these are still DB-managed taxonomies.
 * React cache() deduplicates calls within a single server render.
 */

export const getDomains = cache(async () => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'domains',
    sort: 'sortOrder',
    limit: 100,
  })
  return result.docs
})

export const getDomainBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'domains',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
})

/**
 * Extracts the type slug from a content type field.
 * Now that type is a select field, it's always a string slug.
 */
export function getTypeSlug(type: unknown): string {
  if (!type) return ''
  if (typeof type === 'string') return type
  // Legacy: populated relationship object
  if (typeof type === 'object' && type !== null && 'slug' in type) {
    return (type as { slug: string }).slug
  }
  return ''
}

/**
 * Gets the display label for a content type.
 * Looks up from static config by slug.
 */
export function getTypeLabel(type: unknown): string {
  const slug = getTypeSlug(type)
  if (!slug) return ''
  const config = getContentTypeConfig(slug)
  return config?.singularLabel ?? slug
}

/**
 * Extracts domain data from a populated or unpopulated domain field.
 * Returns an array of domain objects with slug, shortLabel, and color.
 */
export function normalizeDomains(
  domains: unknown,
): Array<{ id: string; slug: string; shortLabel: string; color: string; colorDark?: string | null }> {
  if (!domains || !Array.isArray(domains)) return []
  return domains
    .map((d) => {
      if (typeof d === 'object' && d !== null && 'slug' in d) {
        return d as { id: string; slug: string; shortLabel: string; color: string; colorDark?: string | null }
      }
      return null
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
}
