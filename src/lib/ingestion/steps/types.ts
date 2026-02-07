import type { Payload } from 'payload'
import type { RawContent } from '../adapters/types'

/**
 * Context passed through each pipeline step.
 * Steps can read and modify the context.
 */
export interface PipelineContext {
  /** Raw extracted content from the adapter */
  raw: RawContent
  /** Payload instance for DB operations */
  payload: Payload
  /** Ingestion log ID for tracking */
  logId: number | string
  /** Generated slug */
  slug?: string
  /** Transformed Lexical body */
  lexicalBody?: unknown
  /** Resolved tool IDs */
  toolIds?: (number | string)[]
  /** Created/updated content document */
  content?: Record<string, unknown>
  /** Step execution log entries */
  stepLog: Array<{ step: string; durationMs: number; result: string }>
  /** Whether this is an update to existing content (dedup found match) */
  existingId?: number | string
}

/**
 * Interface for pipeline steps.
 */
export interface PipelineStep {
  name: string
  execute(context: PipelineContext): Promise<PipelineContext>
}

export interface PipelineResult {
  success: boolean
  content?: Record<string, unknown>
  error?: string
  logId?: number | string
}
