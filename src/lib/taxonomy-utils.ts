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
