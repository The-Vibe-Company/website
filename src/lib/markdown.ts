function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;')
}

function applyLexicalTextFormat(text: string, format: unknown): string {
  if (typeof format !== 'number' || !text) return text

  let result = text

  if (format & 16) result = '`' + result + '`'
  if (format & 4) result = '~~' + result + '~~'
  if (format & 2) result = '*' + result + '*'
  if (format & 1) result = '**' + result + '**'

  return result
}

function renderLexicalInline(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as Record<string, unknown>
  const children = Array.isArray(value.children) ? value.children : []

  if (value.type === 'text') {
    return applyLexicalTextFormat(String(value.text ?? ''), value.format)
  }

  if (value.type === 'linebreak') {
    return '\n'
  }

  const childText = children.map(renderLexicalInline).join('')

  if (value.type === 'link' && typeof value.url === 'string') {
    return `[${childText || value.url}](${value.url})`
  }

  return childText
}

function renderLexicalBlock(node: unknown, depth = 0): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as Record<string, unknown>
  const type = typeof value.type === 'string' ? value.type : ''
  const children = Array.isArray(value.children) ? value.children : []

  if (type === 'root') {
    return children.map((child) => renderLexicalBlock(child, depth)).filter(Boolean).join('\n\n')
  }

  if (type === 'paragraph') {
    return children.map(renderLexicalInline).join('').trim()
  }

  if (type === 'heading') {
    const tag = typeof value.tag === 'string' ? value.tag : 'h2'
    const level = Number.parseInt(tag.replace('h', ''), 10)
    const safeLevel = Number.isNaN(level) ? 2 : Math.min(Math.max(level, 1), 6)
    const content = children.map(renderLexicalInline).join('').trim()
    return `${'#'.repeat(safeLevel)} ${content}`.trim()
  }

  if (type === 'quote') {
    const content = children.map((child) => renderLexicalBlock(child, depth)).filter(Boolean).join('\n\n')
    return content
      .split('\n')
      .map((line) => (line ? `> ${line}` : '>'))
      .join('\n')
  }

  if (type === 'list') {
    const listType = value.listType === 'number' ? 'ordered' : value.listType
    return children
      .map((child, index) => renderLexicalListItem(child, listType === 'number', depth, index))
      .filter(Boolean)
      .join('\n')
  }

  if (type === 'listitem') {
    return renderLexicalListItem(value, false, depth, 0)
  }

  if (type === 'code') {
    const language = typeof value.language === 'string' ? value.language : ''
    const content = children.map(renderLexicalInline).join('')
    return `\`\`\`${language}\n${content}\n\`\`\``
  }

  return children.map((child) => renderLexicalBlock(child, depth)).filter(Boolean).join('\n\n')
}

function renderLexicalListItem(
  node: unknown,
  ordered: boolean,
  depth: number,
  index: number,
): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as Record<string, unknown>
  const children = Array.isArray(value.children) ? value.children : []
  const marker = ordered ? `${index + 1}.` : '-'
  const indent = '  '.repeat(depth)
  const parts = children
    .map((child) => {
      if (!child || typeof child !== 'object') return ''
      const childType = (child as Record<string, unknown>).type

      if (childType === 'list') {
        return renderLexicalBlock(child, depth + 1)
      }

      return renderLexicalBlock(child, depth)
    })
    .filter(Boolean)

  if (parts.length === 0) {
    return `${indent}${marker}`
  }

  const [first, ...rest] = parts
  const lines = [`${indent}${marker} ${first}`]

  for (const part of rest) {
    lines.push(part)
  }

  return lines.join('\n')
}

export function normalizeMarkdownBody(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  return renderLexicalBlock(value).trim()
}

export function renderInlineMarkdown(text: string): string {
  let html = escapeHtml(text)

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>')

  return html
}

function renderParagraph(lines: string[]): string {
  const html = lines.map((line) => renderInlineMarkdown(line)).join('<br />')
  return `<p>${html}</p>`
}

export function renderMarkdown(markdown: string): string {
  const source = markdown.replace(/\r\n?/g, '\n').trim()

  if (!source) return ''

  const lines = source.split('\n')
  const blocks: string[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    const codeFence = line.match(/^```(\w+)?\s*$/)
    if (codeFence) {
      const language = codeFence[1] ?? ''
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !/^```/.test(lines[index])) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) index += 1

      blocks.push(
        `<pre><code${language ? ` class="language-${escapeAttribute(language)}"` : ''}>${escapeHtml(
          codeLines.join('\n'),
        )}</code></pre>`,
      )
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2].trim())}</h${level}>`)
      index += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push(`<blockquote>${renderMarkdown(quoteLines.join('\n'))}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(`<li>${renderInlineMarkdown(lines[index].replace(/^[-*]\s+/, '').trim())}</li>`)
        index += 1
      }

      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${renderInlineMarkdown(lines[index].replace(/^\d+\.\s+/, '').trim())}</li>`)
        index += 1
      }

      blocks.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    const paragraphLines: string[] = []

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push(renderParagraph(paragraphLines))
  }

  return blocks.join('\n')
}
