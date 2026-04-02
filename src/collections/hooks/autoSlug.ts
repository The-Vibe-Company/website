import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Auto-generates a URL-safe slug from title if not provided.
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

  data.slug = base

  return data
}
