import type { CollectionAfterChangeHook } from 'payload'
import { triggerDeploy } from '@/lib/trigger-deploy'

/**
 * Triggers a Vercel deploy hook when published content changes.
 * Only rebuilds when:
 * - A document is saved with status 'published'
 * - A previously published document is modified (including unpublishing)
 */
export const revalidateContent: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
}) => {
  const isPublished = doc?.status === 'published'
  const wasPublished = previousDoc?.status === 'published'

  if (isPublished || wasPublished) {
    try {
      await triggerDeploy()
    } catch {
      // Deploy hook errors should never break the save operation
    }
  }

  return doc
}
