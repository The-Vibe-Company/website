import type { CollectionBeforeValidateHook } from 'payload'

function formatSlugDate(value?: string): string {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }
  return date.toISOString().slice(0, 10)
}

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

  const typeSlug = typeof data.type === 'string' ? data.type : originalDoc?.type
  if (typeSlug === 'daily') {
    const datePrefix = formatSlugDate(
      typeof data.publishedAt === 'string' ? data.publishedAt : originalDoc?.publishedAt,
    )
    data.slug = `${datePrefix}-${base}`
    return data
  }

  data.slug = base

  return data
}
