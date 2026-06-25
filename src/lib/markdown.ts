import { getOptimizedImageUrl } from '@/lib/image-variants'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;')
}

function escapeEscapedAttribute(value: string): string {
  return value.replace(/"/g, '&quot;')
}

function escapeImageUrl(value: string): string {
  return escapeAttribute(value.trim())
}

function isSafeInternalMarkdownUrl(value: string): boolean {
  return /^\/(?!\/)[^\s]*$/.test(value)
}

function isSafeMarkdownImageUrl(value: string): boolean {
  return /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value)
}

function isSafeMarkdownAudioUrl(value: string): boolean {
  return /^\/(?!\/)[^\s]*\.(?:mp3|wav|m4a|aac|ogg|flac)$/i.test(value.trim())
}

function parseDirectiveAttributes(value: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const pattern = /(\w+)="([^"]*)"/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(value))) {
    attrs[match[1]] = match[2]
  }

  return attrs
}

function parseMarkdownImage(line: string): { alt: string; src: string; title?: string } | null {
  const match = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*$/)
  if (!match) return null

  const [, alt, src, title] = match
  return { alt, src, title }
}

/**
 * Removes the first standalone Markdown image in the body that points at `coverSrc`
 * (the article's frontmatter cover), so the cover can be rendered once at the top of
 * the page instead of mid-article. Returns the cleaned body and the image's optional
 * caption (its Markdown title) so it can be reused under the relocated cover.
 */
export function extractCoverImage(
  body: string,
  coverSrc: string,
): { body: string; caption?: string } {
  if (!coverSrc) return { body }

  const lines = body.split('\n')
  const index = lines.findIndex((line) => {
    const image = parseMarkdownImage(line)
    return image?.src === coverSrc
  })

  if (index === -1) return { body }

  const caption = parseMarkdownImage(lines[index])?.title
  lines.splice(index, 1)

  // Collapse the blank line left behind so paragraphs stay tidy.
  if (lines[index]?.trim() === '' && lines[index - 1]?.trim() === '') {
    lines.splice(index, 1)
  }

  return { body: lines.join('\n'), caption }
}

function renderMarkdownImage(line: string): string | null {
  const image = parseMarkdownImage(line)
  if (!image) return null
  if (!isSafeMarkdownImageUrl(image.src)) return null

  const alt = escapeHtml(image.alt)
  const src = escapeImageUrl(getOptimizedImageUrl(image.src))
  const caption = image.title ? `<figcaption>${escapeHtml(image.title)}</figcaption>` : ''

  return (
    `<figure class="prose-vibe-image">` +
    `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />` +
    `${caption}</figure>`
  )
}

function renderMarkdownAudio(line: string): string | null {
  const match = line.match(/^::audio\{(.+)\}\s*$/)
  if (!match) return null

  const attrs = parseDirectiveAttributes(match[1])
  const src = attrs.src?.trim()
  const title = attrs.title?.trim()
  if (!src || !title || !isSafeMarkdownAudioUrl(src)) return null

  const type = src.toLowerCase().endsWith('.mp3')
    ? 'audio/mpeg'
    : src.toLowerCase().endsWith('.ogg')
      ? 'audio/ogg'
      : src.toLowerCase().endsWith('.wav')
        ? 'audio/wav'
        : 'audio/mp4'
  const audioBars = '<span></span>'.repeat(48)

  return (
    `<figure class="prose-vibe-audio" style="--audio-progress: 0%">` +
    `<figcaption class="prose-vibe-audio__title">${escapeHtml(title)}</figcaption>` +
    `<button type="button" class="prose-vibe-audio__load" data-audio-src="${escapeAttribute(src)}" data-audio-type="${type}" aria-label="Play ${escapeAttribute(title)}">` +
    `<span class="prose-vibe-audio__play-icon" aria-hidden="true"></span>` +
    `<span class="prose-vibe-audio__load-text">Play</span>` +
    `</button>` +
    `<div class="prose-vibe-audio__timeline">` +
    `<div class="prose-vibe-audio__wave" role="slider" tabindex="0" aria-label="Seek ${escapeAttribute(title)}" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0" aria-valuetext="0:00">` +
    `<div class="prose-vibe-audio__wave-bars" aria-hidden="true">${audioBars}</div>` +
    `<div class="prose-vibe-audio__wave-progress" aria-hidden="true">${audioBars}</div>` +
    `</div>` +
    `<div class="prose-vibe-audio__time" aria-hidden="true">` +
    `<span class="prose-vibe-audio__current">0:00</span>` +
    `<span class="prose-vibe-audio__duration">0:00</span>` +
    `</div>` +
    `</div>` +
    `<button type="button" class="prose-vibe-audio__rewind" aria-label="Back 10 seconds">↺</button>` +
    `<audio preload="none" class="prose-vibe-audio__player" hidden>` +
    `Your browser does not support the audio element.` +
    `</audio>` +
    `</figure>`
  )
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
  const fields = value.fields as { url?: unknown } | undefined
  const url =
    typeof value.url === 'string' ? value.url : typeof fields?.url === 'string' ? fields.url : null

  if (value.type === 'link' && url) {
    return `[${childText || url}](${url})`
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
      .map((child, index) => renderLexicalListItem(child, listType === 'ordered', depth, index))
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

  if (type === 'upload') {
    const upload = value.value as { url?: unknown; alt?: unknown; filename?: unknown } | undefined
    const url = typeof upload?.url === 'string' ? upload.url : null
    if (!url) return ''

    const alt =
      typeof upload?.alt === 'string' && upload.alt.trim()
        ? upload.alt.trim()
        : typeof upload?.filename === 'string'
          ? upload.filename
          : 'Image'

    return `![${alt}](${url})`
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

  if (value && typeof value === 'object' && 'root' in value) {
    return renderLexicalBlock((value as { root: unknown }).root).trim()
  }

  return renderLexicalBlock(value).trim()
}

export function renderInlineMarkdown(text: string): string {
  let html = escapeHtml(text)
  const codePlaceholders: string[] = []
  const linkPlaceholders: string[] = []

  html = html.replace(/`([^`]+)`/g, (_match, code: string) => {
    const placeholder = `@@CODESPAN${codePlaceholders.length}@@`
    codePlaceholders.push(`<code>${code}</code>`)
    return placeholder
  })
  html = html.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|\/(?!\/))[^)\s]+)\)/g,
    (_match, label: string, url: string) => {
      const href = escapeEscapedAttribute(url)
      const safeLabel = label.replace(/@@CODESPAN(\d+)@@/g, (_token, index: string) => {
        return codePlaceholders[Number(index)] ?? ''
      })
      const placeholder = `@@LINK${linkPlaceholders.length}@@`

      let link = ''
      if (isSafeInternalMarkdownUrl(url)) {
        link = `<a href="${href}">${safeLabel}</a>`
      } else {
        link = `<a href="${href}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`
      }

      linkPlaceholders.push(link)
      return placeholder
    },
  )
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>')
  html = html.replace(/@@CODESPAN(\d+)@@/g, (_match, index: string) => {
    return codePlaceholders[Number(index)] ?? ''
  })
  html = html.replace(/@@LINK(\d+)@@/g, (_match, index: string) => {
    return linkPlaceholders[Number(index)] ?? ''
  })

  return html
}

function renderParagraph(lines: string[]): string {
  const html = lines.map((line) => renderInlineMarkdown(line)).join('<br />')
  return `<p>${html}</p>`
}

function splitMarkdownTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let current = ''
  let escaped = false

  for (const char of trimmed) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      current += char
      continue
    }

    if (char === '|') {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

function isMarkdownTableSeparator(line: string): boolean {
  const cells = splitMarkdownTableRow(line)
  if (cells.length < 2) return false

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))
}

function isMarkdownTableStart(lines: string[], index: number): boolean {
  const header = lines[index]?.trim()
  const separator = lines[index + 1]?.trim()
  if (!header || !separator || !header.includes('|')) return false

  const headerCells = splitMarkdownTableRow(header)
  if (headerCells.length < 2 || headerCells.some((cell) => !cell.trim())) return false

  return isMarkdownTableSeparator(separator)
}

function renderMarkdownTable(rows: string[][]): string {
  const [header, ...body] = rows
  const columnCount = header.length
  const normalizeCells = (cells: string[]) =>
    Array.from({ length: columnCount }, (_item, index) => cells[index] ?? '')

  const headHtml = normalizeCells(header)
    .map((cell) => `<th scope="col">${renderInlineMarkdown(cell)}</th>`)
    .join('')
  const bodyHtml = body
    .map((row) => {
      const cells = normalizeCells(row)
        .map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`)
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return (
    `<div class="prose-vibe-table-wrap">` +
    `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>` +
    `</div>`
  )
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

    if (isMarkdownTableStart(lines, index)) {
      const rows: string[][] = [splitMarkdownTableRow(lines[index])]
      index += 2

      while (index < lines.length && lines[index].trim().includes('|')) {
        rows.push(splitMarkdownTableRow(lines[index]))
        index += 1
      }

      blocks.push(renderMarkdownTable(rows))
      continue
    }

    const image = renderMarkdownImage(line)
    if (image) {
      const images = [image]
      index += 1

      while (index < lines.length) {
        if (!lines[index].trim()) {
          index += 1
          continue
        }

        const nextImage = renderMarkdownImage(lines[index])
        if (!nextImage) break

        images.push(nextImage)
        index += 1
      }

      if (images.length === 1) {
        blocks.push(images[0])
      } else {
        blocks.push(`<div class="prose-vibe-gallery">${images.join('')}</div>`)
      }

      continue
    }

    const audio = renderMarkdownAudio(line)
    if (audio) {
      blocks.push(audio)
      index += 1
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
      !/^\d+\.\s+/.test(lines[index]) &&
      !/^::audio\{/.test(lines[index]) &&
      !isMarkdownTableStart(lines, index)
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push(renderParagraph(paragraphLines))
  }

  return blocks.join('\n')
}
