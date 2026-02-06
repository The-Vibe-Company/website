export interface LexicalNode {
  type: string
  version?: number
  children?: LexicalNode[]
  text?: string
  format?: number | string
  mode?: string
  style?: string
  detail?: number
  direction?: string | null
  indent?: number
}

export interface LexicalRoot {
  root: LexicalNode
}

/**
 * Converts a markdown string into a basic Lexical rich text structure.
 * For now, wraps the entire markdown in a single paragraph text node.
 * This will be enhanced later with proper markdown parsing.
 */
export function markdownToLexical(markdown: string): LexicalRoot {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: null,
      children: [
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: null,
          children: [
            {
              type: 'text',
              version: 1,
              text: markdown,
              format: 0,
              mode: 'normal',
              style: '',
              detail: 0,
            },
          ],
        },
      ],
    },
  }
}
