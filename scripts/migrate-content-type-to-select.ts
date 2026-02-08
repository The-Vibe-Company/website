/**
 * Migrates Content.type from relationship (content-types ID) to select (slug string).
 *
 * Run BEFORE deploying the schema change:
 *   npx tsx scripts/migrate-content-type-to-select.ts
 *
 * What it does:
 * 1. Reads all content-types to build an ID → slug lookup
 * 2. Updates every content doc: replaces the relationship ID with the slug string
 *
 * Safe to re-run — already-migrated docs (where type is a slug string) are skipped.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const KNOWN_SLUGS = new Set(['daily', 'tutorial', 'article', 'tool-focus', 'concept-focus'])

async function migrate() {
  const payload = await getPayload({ config })

  // Step 1: Build ID → slug map from the content-types collection
  // (This collection still exists in the DB even though it's removed from the Payload config.
  //  We query the raw DB to read it.)
  console.log('Building content-type ID → slug map...')

  let idToSlug: Map<string, string>
  try {
    const types = await payload.find({
      collection: 'content-types' as 'content',
      limit: 100,
    })
    idToSlug = new Map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      types.docs.map((t: any) => [String(t.id), String(t.slug)]),
    )
    console.log(`  Found ${idToSlug.size} content types:`, [...idToSlug.values()])
  } catch {
    console.log('  content-types collection not found, assuming already removed from config.')
    console.log('  Will only validate existing data.')
    idToSlug = new Map()
  }

  // Step 2: Iterate all content docs and migrate
  console.log('\nMigrating content docs...')
  let migrated = 0
  let skipped = 0
  let errors = 0
  let page = 1
  const limit = 100

  while (true) {
    const result = await payload.find({
      collection: 'content',
      limit,
      page,
      sort: 'id',
    })

    for (const doc of result.docs) {
      const currentType = doc.type

      // Already a slug string? Skip.
      if (typeof currentType === 'string' && KNOWN_SLUGS.has(currentType)) {
        skipped++
        continue
      }

      // Extract the ID (could be number, string, or populated object)
      let typeId: string
      if (typeof currentType === 'object' && currentType !== null && 'id' in currentType) {
        typeId = String((currentType as { id: string | number }).id)
      } else if (typeof currentType === 'number' || typeof currentType === 'string') {
        typeId = String(currentType)
      } else {
        console.error(`  [ERROR] Doc ${doc.id} "${doc.title}": unexpected type value:`, currentType)
        errors++
        continue
      }

      const slug = idToSlug.get(typeId)
      if (!slug) {
        console.error(`  [ERROR] Doc ${doc.id} "${doc.title}": type ID "${typeId}" not found in content-types`)
        errors++
        continue
      }

      try {
        await payload.update({
          collection: 'content',
          id: doc.id,
          data: { type: slug } as Record<string, unknown>,
        })
        migrated++
        console.log(`  [migrated] ${doc.id} "${doc.title}": ${typeId} → ${slug}`)
      } catch (err) {
        console.error(`  [ERROR] Doc ${doc.id}: update failed:`, err)
        errors++
      }
    }

    if (!result.hasNextPage) break
    page++
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`)
  process.exit(errors > 0 ? 1 : 0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
