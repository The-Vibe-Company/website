import type { PipelineStep, PipelineContext } from './types'
import { VALID_TYPES } from '@/lib/ai/prompts'

export const validateStep: PipelineStep = {
  name: 'validate',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw } = context
    const errors: string[] = []

    if (!raw.title?.trim()) errors.push('title is required')
    if (!raw.markdown?.trim()) errors.push('markdown body is required')
    if (!raw.type || !VALID_TYPES.includes(raw.type)) {
      errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`)
    }
    if (!raw.summary?.trim()) errors.push('summary is required')

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`)
    }

    return context
  },
}
