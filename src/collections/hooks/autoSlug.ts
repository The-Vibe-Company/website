import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Auto-generates a URL-safe slug from title if not provided.
 * For 'daily' type content, prepends the current date (YYYY-MM-DD).
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

  if (data.type === 'daily') {
    const today = new Date().toISOString().slice(0, 10)
    data.slug = `${today}-${base}`
  } else {
    data.slug = base
  }

  return data
}
