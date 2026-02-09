import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

// Re-export pure utility functions from taxonomy-utils (client-safe)
export { getTypeSlug, getTypeLabel, normalizeDomains } from './taxonomy-utils'

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
