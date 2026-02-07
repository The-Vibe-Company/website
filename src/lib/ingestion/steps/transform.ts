import type { PipelineStep, PipelineContext } from './types'
import { markdownToLexical } from '../markdown-to-lexical'

/**
 * Transforms markdown content to Lexical editor state
 * and generates a URL slug.
 */
export const transformStep: PipelineStep = {
  name: 'transform',
  async execute(context: PipelineContext): Promise<PipelineContext> {
    const { raw } = context

    // Generate slug
    const base = raw.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (raw.type === 'daily') {
      const today = new Date().toISOString().slice(0, 10)
      context.slug = `${today}-${base}`
    } else {
      context.slug = base
    }

    // Transform markdown to Lexical
    context.lexicalBody = await markdownToLexical(raw.markdown)

    return context
  },
}
