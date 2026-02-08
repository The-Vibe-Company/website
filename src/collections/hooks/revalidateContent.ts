import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidates ISR-cached frontend pages when content changes.
 * Triggered after any create/update on the content collection.
 * Content type is now a slug string (select field), so we can use it directly.
 */
export const revalidateContent: CollectionAfterChangeHook = async ({
  doc,
}) => {
  try {
    const typeSlug = typeof doc.type === 'string' ? doc.type : ''

    revalidatePath('/resources')
    if (typeSlug) {
      revalidatePath(`/resources/${typeSlug}`)
    }
    if (typeSlug && doc.slug) {
      revalidatePath(`/resources/${typeSlug}/${doc.slug}`)
    }

    revalidateTag('content', 'default')
    revalidateTag('resources', 'default')
  } catch {
    // Revalidation errors shouldn't break the save operation
  }

  return doc
}
