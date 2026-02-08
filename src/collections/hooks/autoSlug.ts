import type { CollectionBeforeValidateHook } from 'payload'
import { getContentTypeConfig } from '@/lib/content-types'

/**
 * Auto-generates a URL-safe slug from title if not provided.
 * For content types with prependDateToSlug enabled, prepends YYYY-MM-DD.
 * Works for both Content (title) and Tools (name) collections.
 */
export const autoSlug: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (!data) return data

  const titleField = data.title ?? data.name
  const slugField = data.slug

  // Only generate slug on create, or if slug is empty
  const shouldGenerate =
    operation === 'create'
      ? !slugField && titleField
      : !slugField && !originalDoc?.slug && titleField

  if (!shouldGenerate) return data

  const base = String(titleField)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Check if the content type has prependDateToSlug enabled (static lookup, no DB)
  const typeSlug = typeof data.type === 'string' ? data.type : undefined
  const contentType = typeSlug ? getContentTypeConfig(typeSlug) : undefined
  const shouldPrependDate = contentType?.prependDateToSlug === true

  if (shouldPrependDate) {
    const today = new Date().toISOString().slice(0, 10)
    data.slug = `${today}-${base}`
  } else {
    data.slug = base
  }

  return data
}
