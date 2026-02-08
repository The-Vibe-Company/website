/**
 * Seeds the ContentTypes and Domains collections with initial values
 * matching the previously-hardcoded taxonomy data.
 *
 * Usage: npx tsx scripts/seed-taxonomies.ts
 *
 * Safe to re-run — skips records that already exist (matched by slug).
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const CONTENT_TYPES = [
  {
    name: 'Daily Learning',
    slug: 'daily',
    pluralLabel: 'Learnings',
    singularLabel: 'Learning',
    description: "Journal d'apprentissage quotidien",
    renderStyle: 'timeline' as const,
    prependDateToSlug: true,
    sortOrder: 1,
    showInNav: true,
  },
  {
    name: 'Tutorial',
    slug: 'tutorial',
    pluralLabel: 'Tutorials',
    singularLabel: 'Tutorial',
    description: 'Guides step-by-step',
    renderStyle: 'grid' as const,
    prependDateToSlug: false,
    sortOrder: 2,
    showInNav: true,
  },
  {
    name: 'Article',
    slug: 'article',
    pluralLabel: 'Articles',
    singularLabel: 'Article',
    description: 'Contenu long-form et approfondi',
    renderStyle: 'grid' as const,
    prependDateToSlug: false,
    sortOrder: 3,
    showInNav: true,
  },
  {
    name: 'Tool Focus',
    slug: 'tool-focus',
    pluralLabel: 'Focus',
    singularLabel: 'Focus',
    description: 'Reviews approfondies des outils',
    renderStyle: 'grid' as const,
    prependDateToSlug: false,
    sortOrder: 4,
    showInNav: true,
  },
  {
    name: 'Concept Focus',
    slug: 'concept-focus',
    pluralLabel: 'Concepts',
    singularLabel: 'Concept',
    description: 'Explications pédagogiques des concepts',
    renderStyle: 'grid' as const,
    prependDateToSlug: false,
    sortOrder: 5,
    showInNav: true,
  },
]

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

  console.log('Seeding content types...')
  for (const ct of CONTENT_TYPES) {
    const existing = await payload.find({
      collection: 'content-types',
      where: { slug: { equals: ct.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  [skip] ${ct.name} (already exists)`)
      continue
    }
    await payload.create({ collection: 'content-types', data: ct })
    console.log(`  [created] ${ct.name}`)
  }

  console.log('\nSeeding domains...')
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

  console.log('\nDone! Taxonomy seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
