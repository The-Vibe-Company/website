import type { PipelineStep, PipelineContext } from './types'

/**
 * Checks if content with the same source externalId already exists.
 * If it does, sets context.existingId so the persist step does an update instead of create.
 */
export const deduplicateStep: PipelineStep = {
  name: 'deduplicate',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw, payload } = context

    if (!raw.externalId) return context

    const existing = await payload.find({
      collection: 'content',
      where: {
        and: [
          { 'source.externalId': { equals: raw.externalId } },
          { 'source.type': { equals: raw.metadata?.sourceType ?? 'manual' } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      context.existingId = existing.docs[0].id
    }

    return context
  },
}
