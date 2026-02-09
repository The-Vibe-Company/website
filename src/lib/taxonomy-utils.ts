/**
 * Pure utility functions for taxonomy data.
 * These are safe to use in both server and client components.
 * Server-only functions (getDomains, getDomainBySlug) remain in taxonomy.ts.
 */

import { getContentTypeConfig } from '@/lib/content-types'

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
  const cfg = getContentTypeConfig(slug)
  return cfg?.singularLabel ?? slug
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
