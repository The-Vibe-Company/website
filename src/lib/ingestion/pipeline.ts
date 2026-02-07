import type { Payload } from 'payload'
import type { IngestionAdapter } from './adapters/types'
import type { PipelineStep, PipelineContext, PipelineResult } from './steps/types'
import { validateStep } from './steps/validate'
import { deduplicateStep } from './steps/deduplicate'
import { transformStep } from './steps/transform'
import { resolveRelationsStep } from './steps/resolve-relations'
import { persistStep } from './steps/persist'
import { logStep } from './steps/log'

/**
 * Ingestion pipeline orchestrator.
 * Runs source-agnostic steps in order: validate → deduplicate → transform → resolve → persist → log
 */
export class IngestionPipeline {
  private steps: PipelineStep[]

  constructor(steps?: PipelineStep[]) {
    this.steps = steps ?? [
      validateStep,
      deduplicateStep,
      transformStep,
      resolveRelationsStep,
      persistStep,
      logStep,
    ]
  }

  async execute(
    adapter: IngestionAdapter,
    rawPayload: unknown,
    payload: Payload,
  ): Promise<PipelineResult> {
    const startTime = Date.now()

    // Create ingestion log
    const log = await payload.create({
      collection: 'ingestion-logs',
      data: {
        sourceType: adapter.name,
        status: 'received',
        rawPayload: rawPayload as Record<string, unknown>,
      },
    })

    try {
      // Extract content from source
      const raw = await adapter.extract(rawPayload)

      // Update log with title
      await payload.update({
        collection: 'ingestion-logs',
        id: log.id,
        data: {
          status: 'processing',
          contentTitle: raw.title,
          externalId: raw.externalId,
        },
      })

      // Validate via adapter
      const validation = adapter.validate(raw)
      if (!validation.valid) {
        throw new Error(`Adapter validation failed: ${validation.errors.join('; ')}`)
      }

      // Inject source type into metadata
      raw.metadata = { ...raw.metadata, sourceType: adapter.name }

      // Build pipeline context
      let context: PipelineContext = {
        raw,
        payload,
        logId: log.id,
        stepLog: [],
      }

      // Execute each step
      for (const step of this.steps) {
        const stepStart = Date.now()
        context = await step.execute(context)
        context.stepLog.push({
          step: step.name,
          durationMs: Date.now() - stepStart,
          result: 'ok',
        })
      }

      const totalMs = Date.now() - startTime
      await payload.update({
        collection: 'ingestion-logs',
        id: log.id,
        data: { processingTimeMs: totalMs },
      })

      return {
        success: true,
        content: context.content,
        logId: log.id,
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      const totalMs = Date.now() - startTime

      // Check if it's a dedup situation from the hook
      const isDuplicate = errorMessage.startsWith('DUPLICATE:')

      await payload.update({
        collection: 'ingestion-logs',
        id: log.id,
        data: {
          status: isDuplicate ? 'duplicate' : 'failed',
          error: errorMessage,
          processingTimeMs: totalMs,
        },
      })

      return {
        success: false,
        error: errorMessage,
        logId: log.id,
      }
    }
  }
}

/** Default pipeline instance */
export const defaultPipeline = new IngestionPipeline()
