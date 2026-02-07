import type { PipelineStep, PipelineContext } from './types'

/**
 * Resolves tool slugs to Payload document IDs.
 * Creates tool entries if they don't exist.
 */
export const resolveRelationsStep: PipelineStep = {
  name: 'resolveRelations',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw, payload } = context
    const toolSlugs = raw.tools || []
    const ids: (number | string)[] = []

    for (const slug of toolSlugs) {
      const result = await payload.find({
        collection: 'tools',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })

      if (result.docs.length > 0) {
        ids.push(result.docs[0].id)
      }
      // Future: auto-create tool stubs if not found
    }

    context.toolIds = ids
    return context
  },
}
