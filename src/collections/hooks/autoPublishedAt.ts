import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Auto-sets publishedAt when content status changes to 'published'.
 * Only sets it once (doesn't overwrite if already set).
 */
export const autoPublishedAt: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const isPublishing = data.status === 'published'
  const wasAlreadyPublished = originalDoc?.status === 'published'
  const hasPublishedAt = data.publishedAt || originalDoc?.publishedAt

  if (isPublishing && !wasAlreadyPublished && !hasPublishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}
