import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Checks for duplicate content based on source.externalId + source.type.
 * If a duplicate exists, throws a descriptive error with the existing ID
 * so the ingestion pipeline can handle it (update instead of create).
 */
export const deduplicateContent: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (!data) return data
  if (operation !== 'create') return data

  const externalId = data.source?.externalId
  const sourceType = data.source?.type

  if (!externalId || !sourceType) return data

  const existing = await req.payload.find({
    collection: 'content',
    where: {
      and: [
        { 'source.externalId': { equals: externalId } },
        { 'source.type': { equals: sourceType } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs.length > 0) {
    const existingDoc = existing.docs[0]
    throw new Error(
      `DUPLICATE:${existingDoc.id}:Content from ${sourceType} with externalId "${externalId}" already exists (slug: ${existingDoc.slug})`,
    )
  }

  return data
}
