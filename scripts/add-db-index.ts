/**
 * One-shot script to add a composite index for content listing queries.
 * Run with: bun scripts/add-db-index.ts
 *
 * This creates a partial index on (status, type, published_at DESC)
 * filtered to status = 'published', which covers all frontend listing queries.
 *
 * NOTE: Verify column names match your DB schema before running.
 * Payload CMS with postgres adapter uses snake_case column names.
 */
import 'dotenv/config'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const { default: postgres } = await import('postgres')
const sql = postgres(DATABASE_URL)

try {
  console.log('Creating composite index on content table...')
  await sql.unsafe(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_status_type_publishedat
    ON content (status, type, "published_at" DESC)
    WHERE status = 'published'
  `)
  console.log('Index created successfully.')
} catch (error) {
  console.error('Failed to create index:', error)
  process.exit(1)
} finally {
  await sql.end()
}
