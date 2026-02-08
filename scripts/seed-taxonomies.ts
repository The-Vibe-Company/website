/**
 * Seeds the Domains collection with initial values.
 *
 * Usage: npx tsx scripts/seed-taxonomies.ts
 *
 * Safe to re-run — skips records that already exist (matched by slug).
 *
 * Note: Content types are now static config in src/lib/content-types.ts
 * and no longer need seeding.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const DOMAINS = [
  {
    name: 'Development',
    slug: 'dev',
    shortLabel: 'Dev',
    color: '#2563eb',
    colorDark: '#60a5fa',
    sortOrder: 1,
  },
  {
    name: 'Design',
    slug: 'design',
    shortLabel: 'Design',
    color: '#7c3aed',
    colorDark: '#a78bfa',
    sortOrder: 2,
  },
  {
    name: 'Operations',
    slug: 'ops',
    shortLabel: 'Ops',
    color: '#059669',
    colorDark: '#34d399',
    sortOrder: 3,
  },
  {
    name: 'Business',
    slug: 'business',
    shortLabel: 'Business',
    color: '#0891b2',
    colorDark: '#22d3ee',
    sortOrder: 4,
  },
  {
    name: 'AI & Automation',
    slug: 'ai-automation',
    shortLabel: 'AI',
    color: '#d97706',
    colorDark: '#fbbf24',
    sortOrder: 5,
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    shortLabel: 'Marketing',
    color: '#e11d48',
    colorDark: '#fb7185',
    sortOrder: 6,
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding domains...')
  for (const d of DOMAINS) {
    const existing = await payload.find({
      collection: 'domains',
      where: { slug: { equals: d.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  [skip] ${d.name} (already exists)`)
      continue
    }
    await payload.create({ collection: 'domains', data: d })
    console.log(`  [created] ${d.name}`)
  }

  console.log('\nDone! Domain seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
