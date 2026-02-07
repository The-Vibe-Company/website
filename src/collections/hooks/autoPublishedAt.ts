import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Auto-sets publishedAt when content status changes to 'published'.
 * Only sets it once (doesn't overwrite if already set).
 */
export const autoPublishedAt: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (!data) return data

  const isPublishing = data.status === 'published'
  const wasAlreadyPublished = originalDoc?.status === 'published'
  const hasPublishedAt = data.publishedAt || originalDoc?.publishedAt

  if (isPublishing && !wasAlreadyPublished && !hasPublishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  // Also compute reading time from body if available
  if (data.body && (operation === 'create' || data.body !== originalDoc?.body)) {
    const { estimateReadingTime } = await import('../../lib/reading-time')
    data.readingTime = estimateReadingTime(data.body)
  }

  return data
}
