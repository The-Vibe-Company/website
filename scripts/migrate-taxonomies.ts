/**
 * Migrates existing Content and Tools records from string-based
 * type/domain values to relationship IDs.
 *
 * Prerequisites: Run seed-taxonomies.ts first to populate the lookup collections.
 *
 * Usage: npx tsx scripts/migrate-taxonomies.ts
 *
 * Safe to re-run — skips records already converted to relationship IDs.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

async function migrate() {
  const payload = await getPayload({ config })

  // Build lookup maps: slug → ID
  const contentTypes = await payload.find({
    collection: 'content-types',
    limit: 100,
  })
  const typeMap = new Map<string, string | number>()
  for (const ct of contentTypes.docs) {
    typeMap.set(ct.slug, ct.id)
  }

  const domains = await payload.find({
    collection: 'domains',
    limit: 100,
  })
  const domainMap = new Map<string, string | number>()
  for (const d of domains.docs) {
    domainMap.set(d.slug, d.id)
  }

  console.log(`Loaded ${typeMap.size} content types, ${domainMap.size} domains\n`)

  // Migrate Content collection
  console.log('Migrating content records...')
  let page = 1
  let hasMore = true
  let contentMigrated = 0
  let contentSkipped = 0

  while (hasMore) {
    const result = await payload.find({
      collection: 'content',
      limit: 50,
      page,
      sort: 'createdAt',
    })

    for (const doc of result.docs) {
      const updates: Record<string, unknown> = {}

      // Migrate type: string slug → relationship ID
      if (typeof doc.type === 'string') {
        const typeId = typeMap.get(doc.type)
        if (typeId) {
          updates.type = typeId
        } else {
          console.warn(`  [warn] content "${doc.title}": unknown type "${doc.type}"`)
        }
      }

      // Migrate domain: string[] → ID[]
      if (Array.isArray(doc.domain) && doc.domain.length > 0 && typeof doc.domain[0] === 'string') {
        const domainIds = (doc.domain as string[])
          .map((slug) => domainMap.get(slug))
          .filter((id): id is string | number => id != null)
        if (domainIds.length > 0) {
          updates.domain = domainIds
        }
      }

      if (Object.keys(updates).length > 0) {
        await payload.update({
          collection: 'content',
          id: doc.id,
          data: updates,
        })
        contentMigrated++
      } else {
        contentSkipped++
      }
    }

    hasMore = result.hasNextPage
    page++
  }
  console.log(`  Migrated: ${contentMigrated}, Skipped: ${contentSkipped}\n`)

  // Migrate Tools collection (domain only — type doesn't exist on tools)
  console.log('Migrating tools records...')
  page = 1
  hasMore = true
  let toolsMigrated = 0
  let toolsSkipped = 0

  while (hasMore) {
    const result = await payload.find({
      collection: 'tools',
      limit: 50,
      page,
      sort: 'createdAt',
    })

    for (const doc of result.docs) {
      // Migrate domain: string[] → ID[]
      if (Array.isArray(doc.domain) && doc.domain.length > 0 && typeof doc.domain[0] === 'string') {
        const domainIds = (doc.domain as string[])
          .map((slug) => domainMap.get(slug))
          .filter((id): id is string | number => id != null)
        if (domainIds.length > 0) {
          await payload.update({
            collection: 'tools',
            id: doc.id,
            data: { domain: domainIds },
          })
          toolsMigrated++
        } else {
          toolsSkipped++
        }
      } else {
        toolsSkipped++
      }
    }

    hasMore = result.hasNextPage
    page++
  }
  console.log(`  Migrated: ${toolsMigrated}, Skipped: ${toolsSkipped}\n`)

  console.log('Migration complete!')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
