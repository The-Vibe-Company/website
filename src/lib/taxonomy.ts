import { getPayload } from 'payload'
import config from '@payload-config'

export async function getContentTypes() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'content-types',
    where: { showInNav: { equals: true } },
    sort: 'sortOrder',
    limit: 100,
  })
  return result.docs
}

export async function getAllContentTypes() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'content-types',
    sort: 'sortOrder',
    limit: 100,
  })
  return result.docs
}

export async function getContentTypeBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'content-types',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getDomains() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'domains',
    sort: 'sortOrder',
    limit: 100,
  })
  return result.docs
}

export async function getDomainBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'domains',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

/**
 * Extracts the type slug from a populated or unpopulated content type field.
 */
export function getTypeSlug(type: unknown): string {
  if (!type) return ''
  if (typeof type === 'string') return type
  if (typeof type === 'object' && type !== null && 'slug' in type) {
    return (type as { slug: string }).slug
  }
  return ''
}

/**
 * Extracts the type label from a populated content type field.
 */
export function getTypeLabel(type: unknown): string {
  if (!type) return ''
  if (typeof type === 'string') return type
  if (typeof type === 'object' && type !== null) {
    const t = type as { singularLabel?: string; pluralLabel?: string; name?: string }
    return t.singularLabel || t.pluralLabel || t.name || ''
  }
  return ''
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
