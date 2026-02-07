import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidates ISR-cached frontend pages when content changes.
 * Triggered after any create/update on the content collection.
 */
export const revalidateContent: CollectionAfterChangeHook = async ({
  doc,
}) => {
  try {
    // Revalidate specific content paths
    revalidatePath('/resources')
    if (doc.type) {
      revalidatePath(`/resources/${doc.type}`)
    }
    if (doc.type && doc.slug) {
      revalidatePath(`/resources/${doc.type}/${doc.slug}`)
    }

    // Revalidate by tag for broader cache busting
    revalidateTag('content', 'default')
    revalidateTag('resources', 'default')
  } catch {
    // Revalidation errors shouldn't break the save operation
  }

  return doc
}
