import type { PipelineStep, PipelineContext } from './types'

/**
 * Persists content to Payload CMS.
 * Creates new content or updates existing (if dedup found a match).
 */
export const persistStep: PipelineStep = {
  name: 'persist',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw, payload, slug, lexicalBody, toolIds, existingId } = context

    const sourceType = raw.metadata?.sourceType ?? 'manual'

    const contentData = {
      title: raw.title,
      slug: existingId ? undefined : slug, // Don't change slug on update
      type: raw.type,
      status: 'draft' as const,
      summary: raw.summary,
      body: lexicalBody,
      domain: raw.domain,
      tools: toolIds,
      concepts: raw.concepts,
      language: raw.language ?? 'fr',
      source: {
        type: sourceType as string,
        externalId: raw.externalId,
        url: raw.sourceUrl,
        lastSyncedAt: new Date().toISOString(),
      },
    }

    if (existingId) {
      // Update existing content
      const updated = await payload.update({
        collection: 'content',
        id: existingId,
        data: contentData,
      })
      context.content = updated as unknown as Record<string, unknown>
    } else {
      // Create new content
      const created = await payload.create({
        collection: 'content',
        data: {
          ...contentData,
          slug: slug!,
        },
      })
      context.content = created as unknown as Record<string, unknown>
    }

    return context
  },
}
