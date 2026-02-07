import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

/**
 * Fetches all blocks for a page, handling pagination.
 */
async function getAllBlocks(
  client: Client,
  blockId: string,
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(
      ...response.results.filter(
        (b): b is BlockObjectResponse => 'type' in b,
      ),
    )
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

/**
 * Converts Notion rich text annotations to markdown.
 */
function richTextToMarkdown(richText: RichTextItemResponse[]): string {
  return richText
    .map((item) => {
      let text = item.plain_text

      if (item.annotations.code) text = `\`${text}\``
      if (item.annotations.bold) text = `**${text}**`
      if (item.annotations.italic) text = `*${text}*`
      if (item.annotations.strikethrough) text = `~~${text}~~`

      if (item.type === 'text' && item.text.link) {
        text = `[${text}](${item.text.link.url})`
      }

      return text
    })
    .join('')
}

/**
 * Converts a single Notion block to markdown.
 */
function blockToMarkdown(
  block: BlockObjectResponse,
  indent: number = 0,
): string {
  const prefix = '  '.repeat(indent)
  const type = block.type

  switch (type) {
    case 'paragraph': {
      const b = block as BlockObjectResponse & { paragraph: { rich_text: RichTextItemResponse[] } }
      return prefix + richTextToMarkdown(b.paragraph.rich_text)
    }
    case 'heading_1': {
      const b = block as BlockObjectResponse & { heading_1: { rich_text: RichTextItemResponse[] } }
      return `# ${richTextToMarkdown(b.heading_1.rich_text)}`
    }
    case 'heading_2': {
      const b = block as BlockObjectResponse & { heading_2: { rich_text: RichTextItemResponse[] } }
      return `## ${richTextToMarkdown(b.heading_2.rich_text)}`
    }
    case 'heading_3': {
      const b = block as BlockObjectResponse & { heading_3: { rich_text: RichTextItemResponse[] } }
      return `### ${richTextToMarkdown(b.heading_3.rich_text)}`
    }
    case 'bulleted_list_item': {
      const b = block as BlockObjectResponse & { bulleted_list_item: { rich_text: RichTextItemResponse[] } }
      return `${prefix}- ${richTextToMarkdown(b.bulleted_list_item.rich_text)}`
    }
    case 'numbered_list_item': {
      const b = block as BlockObjectResponse & { numbered_list_item: { rich_text: RichTextItemResponse[] } }
      return `${prefix}1. ${richTextToMarkdown(b.numbered_list_item.rich_text)}`
    }
    case 'to_do': {
      const b = block as BlockObjectResponse & { to_do: { rich_text: RichTextItemResponse[]; checked: boolean } }
      const checkbox = b.to_do.checked ? '[x]' : '[ ]'
      return `${prefix}- ${checkbox} ${richTextToMarkdown(b.to_do.rich_text)}`
    }
    case 'toggle': {
      const b = block as BlockObjectResponse & { toggle: { rich_text: RichTextItemResponse[] } }
      return `${prefix}> ${richTextToMarkdown(b.toggle.rich_text)}`
    }
    case 'code': {
      const b = block as BlockObjectResponse & { code: { rich_text: RichTextItemResponse[]; language: string } }
      const lang = b.code.language === 'plain text' ? '' : b.code.language
      return `\`\`\`${lang}\n${richTextToMarkdown(b.code.rich_text)}\n\`\`\``
    }
    case 'quote': {
      const b = block as BlockObjectResponse & { quote: { rich_text: RichTextItemResponse[] } }
      return `> ${richTextToMarkdown(b.quote.rich_text)}`
    }
    case 'callout': {
      const b = block as BlockObjectResponse & { callout: { rich_text: RichTextItemResponse[]; icon?: { emoji?: string } } }
      const emoji = b.callout.icon?.emoji ?? ''
      return `> ${emoji} ${richTextToMarkdown(b.callout.rich_text)}`
    }
    case 'divider':
      return '---'
    case 'image': {
      const b = block as BlockObjectResponse & {
        image: { type: string; file?: { url: string }; external?: { url: string }; caption: RichTextItemResponse[] }
      }
      const url = b.image.type === 'file' ? b.image.file?.url : b.image.external?.url
      const caption = richTextToMarkdown(b.image.caption)
      return `![${caption}](${url ?? ''})`
    }
    case 'bookmark': {
      const b = block as BlockObjectResponse & { bookmark: { url: string; caption: RichTextItemResponse[] } }
      const caption = richTextToMarkdown(b.bookmark.caption) || b.bookmark.url
      return `[${caption}](${b.bookmark.url})`
    }
    case 'embed': {
      const b = block as BlockObjectResponse & { embed: { url: string } }
      return `[Embed](${b.embed.url})`
    }
    case 'table_of_contents':
      return '' // Skip TOC blocks
    case 'column_list':
    case 'column':
      return '' // Handled by children
    default:
      return ''
  }
}

/**
 * Recursively converts all Notion blocks (including children) to markdown.
 */
export async function blocksToMarkdown(
  client: Client,
  blockId: string,
  depth: number = 0,
): Promise<string> {
  const blocks = await getAllBlocks(client, blockId)
  const lines: string[] = []

  for (const block of blocks) {
    const line = blockToMarkdown(block, depth)
    if (line) lines.push(line)

    // Recursively process children
    if (block.has_children) {
      const childContent = await blocksToMarkdown(client, block.id, depth + 1)
      if (childContent) lines.push(childContent)
    }
  }

  return lines.join('\n\n')
}
