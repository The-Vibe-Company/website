import type { SerializedEditorState } from 'lexical'

type LexicalRootNode = NonNullable<SerializedEditorState['root']>

function createParagraphNode(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    textFormat: 0,
    textStyle: '',
    children: text
      ? [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ]
      : [],
  }
}

export function createEmptyLexicalState(): SerializedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [createParagraphNode('')],
    },
  }
}

export function textToLexicalState(body: string): SerializedEditorState {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: paragraphs.length
        ? paragraphs.map((paragraph) => createParagraphNode(paragraph))
        : createEmptyLexicalState().root.children,
    },
  }
}

export function isLexicalState(value: unknown): value is SerializedEditorState {
  if (!value || typeof value !== 'object') return false

  const root = (value as { root?: unknown }).root
  if (!root || typeof root !== 'object') return false

  const lexicalRoot = root as Partial<LexicalRootNode>

  return lexicalRoot.type === 'root' && Array.isArray(lexicalRoot.children)
}

export function normalizeLexicalState(value: unknown): SerializedEditorState {
  if (isLexicalState(value)) {
    return value
  }

  if (typeof value === 'string') {
    return textToLexicalState(value)
  }

  return createEmptyLexicalState()
}
