import type { PipelineStep, PipelineContext } from './types'
import { CONTENT_TYPE_SLUGS } from '@/lib/content-types'

/**
 * Resolves domain slugs to their CMS relationship IDs.
 */
async function resolveDomainIds(
  payload: PipelineContext['payload'],
  domainSlugs: string[],
): Promise<(string | number)[]> {
  if (domainSlugs.length === 0) return []
  const result = await payload.find({
    collection: 'domains',
    where: { slug: { in: domainSlugs } },
    limit: 100,
  })
  return result.docs.map((d) => d.id)
}

/**
 * Persists content to Payload CMS.
 * Creates new content or updates existing (if dedup found a match).
 */
export const persistStep: PipelineStep = {
  name: 'persist',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw, payload, slug, lexicalBody, toolIds, existingId } = context

    const sourceType = raw.metadata?.sourceType ?? 'manual'

    // Validate content type slug
    if (!CONTENT_TYPE_SLUGS.includes(raw.type)) {
      throw new Error(`Unknown content type: "${raw.type}"`)
    }
    const domainIds = await resolveDomainIds(payload, raw.domain ?? [])

    const contentData = {
      title: raw.title,
      slug: existingId ? undefined : slug, // Don't change slug on update
      type: raw.type,
      status: 'draft' as const,
      summary: raw.summary,
      body: lexicalBody,
      domain: domainIds,
      tools: toolIds,
      concepts: raw.concepts,
      language: raw.language ?? 'fr',
      source: {
        type: sourceType as string,
        externalId: raw.externalId,
        url: raw.sourceUrl,
        lastSyncedAt: new Date().toISOString(),
      },
      ...(raw.metadata?.aiGenerated
        ? {
            aiMetadata: {
              qualityScore: raw.metadata.qualityScore as number,
              autoSummary: raw.summary,
              autoTags: [...(raw.concepts ?? []), ...(raw.domain ?? [])],
              detectedLanguage: raw.language ?? 'fr',
              enrichedAt: new Date().toISOString(),
            },
          }
        : {}),
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
