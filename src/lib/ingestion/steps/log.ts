import type { PipelineStep, PipelineContext } from './types'

/**
 * Updates the ingestion log with the final result.
 */
export const logStep: PipelineStep = {
  name: 'log',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { payload, logId, content, existingId, stepLog } = context

    await payload.update({
      collection: 'ingestion-logs',
      id: logId,
      data: {
        status: 'success',
        content: content?.id ? Number(content.id) || content.id : undefined,
        pipelineLog: {
          steps: stepLog,
          action: existingId ? 'updated' : 'created',
        },
      },
    })

    return context
  },
}
