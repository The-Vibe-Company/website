import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

let cachedEditorConfig: SanitizedServerEditorConfig | null = null

async function getEditorConfig(): Promise<SanitizedServerEditorConfig> {
  if (cachedEditorConfig) return cachedEditorConfig

  const payload = await getPayload({ config: configPromise })
  cachedEditorConfig = await editorConfigFactory.default({
    config: payload.config,
  })
  return cachedEditorConfig
}

/**
 * Converts a markdown string into a Lexical editor state using Payload's built-in converter.
 * Properly handles headings, lists, code blocks, links, bold, italic, etc.
 */
export async function markdownToLexical(
  markdown: string,
): Promise<SerializedEditorState> {
  const editorConfig = await getEditorConfig()
  return convertMarkdownToLexical({ editorConfig, markdown })
}
