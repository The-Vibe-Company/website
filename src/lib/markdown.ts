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
  // GFM allows blank header cells — the usual shape for comparison tables whose
  // top-left corner is empty — so only require a real multi-column header that
  // labels at least one column.
  if (headerCells.length < 2 || headerCells.every((cell) => !cell.trim())) return false

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

/* -----------------------------------------------------------------------------
   Container directives

   Block-level components written in the article Markdown, rendered on the
   server to plain HTML (no client JS, no layout shift):

     :::name{key="value"}
     ...Markdown...
     :::

   Supported names: `summary`, `picker`, `compare`, `agency`, `callout`.
   Directives do not nest. An unknown name, or a block with no closing fence,
   falls back to ordinary Markdown so a typo never swallows the article.
   ----------------------------------------------------------------------------- */

const DIRECTIVE_OPEN = /^:::([a-z][a-z-]*)(?:\{(.*)\})?\s*$/
const DIRECTIVE_CLOSE = /^:::\s*$/
const DIRECTIVE_NAMES = new Set(['summary', 'picker', 'compare', 'agency', 'callout'])

const ICON_PATHS: Record<string, string> = {
  check: '<path d="M3.5 8.5l3 3 6-7" />',
  cross: '<path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />',
  arrow: '<path d="M2.5 8h10M9 4.5L12.5 8 9 11.5" />',
  info: '<circle cx="8" cy="8" r="6" /><path d="M8 7.25V11M8 5h.01" />',
  list: '<path d="M5.5 4.5h8M5.5 8h8M5.5 11.5h8M2.5 4.5h.01M2.5 8h.01M2.5 11.5h.01" />',
  compass: '<circle cx="8" cy="8" r="6" /><path d="M10.25 5.75L9 9 5.75 10.25 7 7z" />',
}

function icon(name: keyof typeof ICON_PATHS): string {
  return (
    `<svg class="prose-vibe-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" ` +
    `stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`
  )
}

function slugifyAnchor(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function safeAnchor(value: string | undefined): string | null {
  if (!value) return null
  const anchor = value.trim().replace(/^#/, '')
  return /^[a-z0-9][a-z0-9-]*$/.test(anchor) ? anchor : null
}

/** A logo path for `:::agency{logo="..."}`: a site-relative image file, never a remote URL. */
function safeLogoUrl(value: string | undefined): string | null {
  const url = value?.trim()
  if (!url) return null
  return /^\/(?!\/)[^\s"'<>]+\.(?:svg|png|webp|avif|jpe?g)$/i.test(url) ? url : null
}

/**
 * The square mark before a name: the company logo when one is known, else its
 * initial on an ink tile. `alt` names the logo where it stands for the company
 * (agency card); repeated small marks next to the visible name stay decorative.
 */
function avatar(label: string, size?: 'sm', logo?: string | null, alt?: string): string {
  const modifier = size ? ` prose-vibe-avatar--${size}` : ''
  if (logo) {
    const pixels = size === 'sm' ? 22 : 44
    const hidden = alt ? '' : ' aria-hidden="true"'
    return (
      `<span class="prose-vibe-avatar prose-vibe-avatar--logo${modifier}"${hidden}>` +
      `<img src="${escapeAttribute(logo)}" alt="${escapeAttribute(alt ?? '')}" width="${pixels}" height="${pixels}" loading="lazy" decoding="async" />` +
      `</span>`
    )
  }
  const initial = escapeHtml(label.trim().charAt(0).toUpperCase())
  return `<span class="prose-vibe-avatar${modifier}" aria-hidden="true">${initial}</span>`
}

/** Anchor → logo for every `:::agency` block of a document, so chips can reuse the card logos. */
type AgencyLogos = Map<string, string>

function collectAgencyLogos(lines: string[]): AgencyLogos {
  const logos: AgencyLogos = new Map()
  let inCode = false
  for (const line of lines) {
    if (CODE_FENCE.test(line)) inCode = !inCode
    const match = inCode ? null : line.match(DIRECTIVE_OPEN)
    if (match?.[1] !== 'agency') continue
    const attrs = parseDirectiveAttributes(match[2] ?? '')
    const name = attrs.name?.trim()
    const logo = safeLogoUrl(attrs.logo)
    if (name && logo) logos.set(safeAnchor(attrs.id) ?? slugifyAnchor(name), logo)
  }
  return logos
}

function kicker(title: string | undefined, iconName: keyof typeof ICON_PATHS): string {
  if (!title) return ''
  return `<p class="prose-vibe-kicker">${icon(iconName)}<span>${renderInlineMarkdown(title)}</span></p>`
}

/** `[Label](#anchor)` → { label, anchor }, the only link shape directives accept for jumps. */
function parseAnchorLink(text: string): { label: string; anchor: string } | null {
  const match = text.trim().match(/^\[([^\]]+)\]\(#([^)\s]+)\)$/)
  if (!match) return null
  const anchor = safeAnchor(match[2])
  return anchor ? { label: match[1], anchor } : null
}

function listItems(lines: string[]): string[] {
  return lines.filter((line) => /^[-*]\s+/.test(line)).map((line) => line.replace(/^[-*]\s+/, '').trim())
}

function nonListMarkdown(lines: string[]): string {
  return lines.filter((line) => !/^[-*]\s+/.test(line)).join('\n')
}

function renderSummaryDirective(attrs: Record<string, string>, lines: string[], logos: AgencyLogos): string {
  const chips = listItems(lines)
    .map((item) => {
      const link = parseAnchorLink(item)
      if (!link) return `<li><span class="prose-vibe-chip">${renderInlineMarkdown(item)}</span></li>`
      return (
        `<li><a class="prose-vibe-chip" href="#${link.anchor}">` +
        `${avatar(link.label, 'sm', logos.get(link.anchor))}<span>${renderInlineMarkdown(link.label)}</span></a></li>`
      )
    })
    .join('')
  const label = attrs.title ? ` aria-label="${escapeAttribute(attrs.title)}"` : ''

  return (
    `<aside class="prose-vibe-brief"${label}>` +
    kicker(attrs.title, 'list') +
    renderMarkdown(nonListMarkdown(lines)) +
    (chips ? `<ul class="prose-vibe-chips">${chips}</ul>` : '') +
    `</aside>`
  )
}

function renderPickerDirective(attrs: Record<string, string>, lines: string[], logos: AgencyLogos): string {
  const rows = listItems(lines)
    .map((item) => {
      const [situation, target] = item.split(/\s+→\s+/)
      const link = target ? parseAnchorLink(target) : null
      const pick = link
        ? `<a class="prose-vibe-picker__pick" href="#${link.anchor}">${avatar(link.label, 'sm', logos.get(link.anchor))}<span>${renderInlineMarkdown(link.label)}</span></a>`
        : target
          ? `<span class="prose-vibe-picker__pick">${renderInlineMarkdown(target)}</span>`
          : ''
      return (
        `<li><span class="prose-vibe-picker__case">${renderInlineMarkdown(situation)}</span>` +
        (pick ? `<span class="prose-vibe-picker__arrow">${icon('arrow')}</span>${pick}` : '') +
        `</li>`
      )
    })
    .join('')
  const label = attrs.title ? ` aria-label="${escapeAttribute(attrs.title)}"` : ''

  return (
    `<section class="prose-vibe-picker" data-surface="inverse"${label}>` +
    kicker(attrs.title, 'compass') +
    `<ul class="prose-vibe-picker__list">${rows}</ul>` +
    `</section>`
  )
}

function renderCompareCell(cell: string, attrs: Record<string, string>): string {
  const value = cell.trim()
  if (value === '[x]') {
    return (
      `<span class="prose-vibe-mark prose-vibe-mark--yes">${icon('check')}` +
      `<span class="prose-vibe-sr">${escapeHtml(attrs.yes || 'Yes')}</span></span>`
    )
  }
  if (value === '[ ]') {
    return (
      `<span class="prose-vibe-mark prose-vibe-mark--no">` +
      `<span class="prose-vibe-sr">${escapeHtml(attrs.no || 'No')}</span></span>`
    )
  }
  return renderInlineMarkdown(value)
}

function renderCompareDirective(attrs: Record<string, string>, lines: string[], logos: AgencyLogos): string {
  const start = lines.findIndex((_line, index) => isMarkdownTableStart(lines, index))
  if (start === -1) return renderMarkdown(lines.join('\n'))

  const rows: string[][] = [splitMarkdownTableRow(lines[start])]
  let index = start + 2
  while (index < lines.length && lines[index].trim().includes('|')) {
    rows.push(splitMarkdownTableRow(lines[index]))
    index += 1
  }

  const [header, ...body] = rows
  const columnCount = header.length
  const normalize = (cells: string[]) =>
    Array.from({ length: columnCount }, (_item, cellIndex) => cells[cellIndex] ?? '')
  const isMarkColumn = header.map((_cell, column) =>
    body.some((row) => ['[x]', '[ ]'].includes((row[column] ?? '').trim())),
  )

  const head = normalize(header)
    .map((cell, column) => {
      const kind = column === 0 ? ' class="prose-vibe-compare__lead"' : isMarkColumn[column] ? ' class="prose-vibe-compare__mark-col"' : ''
      return `<th scope="col"${kind}>${renderInlineMarkdown(cell)}</th>`
    })
    .join('')
  const bodyHtml = body
    .map((row) => {
      const cells = normalize(row)
        .map((cell, column) => {
          if (column === 0) {
            const link = parseAnchorLink(cell)
            const label = link ? link.label : cell
            const name = link
              ? `<a href="#${link.anchor}">${renderInlineMarkdown(label)}</a>`
              : renderInlineMarkdown(label)
            return `<th scope="row" class="prose-vibe-compare__lead"><span class="prose-vibe-compare__name">${avatar(label, 'sm', link ? logos.get(link.anchor) : null)}${name}</span></th>`
          }
          const kind = isMarkColumn[column] ? ' class="prose-vibe-compare__mark-col"' : ''
          return `<td${kind}>${renderCompareCell(cell, attrs)}</td>`
        })
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  const caption = attrs.caption ? `<caption class="prose-vibe-sr">${escapeHtml(attrs.caption)}</caption>` : ''
  const region = attrs.caption ? ` role="region" aria-label="${escapeAttribute(attrs.caption)}" tabindex="0"` : ''
  const legend = attrs.yes || attrs.legend
    ? `<figcaption class="prose-vibe-compare__legend">` +
      `<span><span class="prose-vibe-mark prose-vibe-mark--yes">${icon('check')}</span>${escapeHtml(attrs.yes || '')}</span>` +
      (attrs.no ? `<span><span class="prose-vibe-mark prose-vibe-mark--no"></span>${escapeHtml(attrs.no)}</span>` : '') +
      (attrs.legend ? `<span class="prose-vibe-compare__note">${renderInlineMarkdown(attrs.legend)}</span>` : '') +
      `</figcaption>`
    : ''

  return (
    `<figure class="prose-vibe-compare">` +
    `<div class="prose-vibe-compare__scroll"${region}>` +
    `<table>${caption}<thead><tr>${head}</tr></thead><tbody>${bodyHtml}</tbody></table>` +
    `</div>${legend}</figure>`
  )
}

function renderAgencyDirective(attrs: Record<string, string>, lines: string[]): string {
  const name = attrs.name?.trim()
  if (!name) return renderMarkdown(lines.join('\n'))

  const anchor = safeAnchor(attrs.id) ?? slugifyAnchor(name)
  const facts: string[] = []
  const verdict: string[] = []
  const rest: string[] = []

  for (const line of lines) {
    const item = line.match(/^[-*]\s+\*\*(.+?)\*\*\s*:\s*(.+)$/)
    if (!item) {
      rest.push(line)
      continue
    }
    const [, label, value] = item
    const text = renderInlineMarkdown(value.trim())
    if (attrs.choose && label === attrs.choose) {
      verdict.push(
        `<div class="prose-vibe-agency__choose"><p class="prose-vibe-kicker">${icon('check')}<span>${escapeHtml(label)}</span></p><p>${text}</p></div>`,
      )
    } else if (attrs.avoid && label === attrs.avoid) {
      verdict.push(
        `<div class="prose-vibe-agency__avoid"><p class="prose-vibe-kicker">${icon('cross')}<span>${escapeHtml(label)}</span></p><p>${text}</p></div>`,
      )
    } else {
      facts.push(`<div><dt>${escapeHtml(label)}</dt><dd>${text}</dd></div>`)
    }
  }

  const tagline = attrs.tagline
    ? `<p class="prose-vibe-agency__tag">${renderInlineMarkdown(attrs.tagline)}</p>`
    : ''
  const extra = rest.join('\n').trim()

  return (
    `<article class="prose-vibe-agency" id="${anchor}" aria-labelledby="${anchor}-name">` +
    `<header class="prose-vibe-agency__head">${avatar(name, undefined, safeLogoUrl(attrs.logo), name)}` +
    `<div><h3 id="${anchor}-name">${escapeHtml(name)}</h3>${tagline}</div></header>` +
    (facts.length ? `<dl class="prose-vibe-agency__facts">${facts.join('')}</dl>` : '') +
    (extra ? `<div class="prose-vibe-agency__body">${renderMarkdown(extra)}</div>` : '') +
    (verdict.length ? `<div class="prose-vibe-agency__verdict">${verdict.join('')}</div>` : '') +
    `</article>`
  )
}

function renderCalloutDirective(attrs: Record<string, string>, lines: string[]): string {
  const label = attrs.title ? ` aria-label="${escapeAttribute(attrs.title)}"` : ''
  return (
    `<aside class="prose-vibe-callout"${label}>` +
    kicker(attrs.title, 'info') +
    renderMarkdown(lines.join('\n')) +
    `</aside>`
  )
}

function renderDirective(
  name: string,
  attrs: Record<string, string>,
  lines: string[],
  logos: AgencyLogos,
): string {
  switch (name) {
    case 'summary':
      return renderSummaryDirective(attrs, lines, logos)
    case 'picker':
      return renderPickerDirective(attrs, lines, logos)
    case 'compare':
      return renderCompareDirective(attrs, lines, logos)
    case 'agency':
      return renderAgencyDirective(attrs, lines)
    default:
      return renderCalloutDirective(attrs, lines)
  }
}

const CODE_FENCE = /^```/

/** Index of the closing `:::` for a directive opened at `start`, or -1. Fenced code is skipped. */
function findDirectiveEnd(lines: string[], start: number): number {
  let inCode = false
  for (let index = start + 1; index < lines.length; index += 1) {
    if (CODE_FENCE.test(lines[index])) {
      inCode = !inCode
      continue
    }
    if (inCode) continue
    if (DIRECTIVE_CLOSE.test(lines[index])) return index
    if (DIRECTIVE_OPEN.test(lines[index])) return -1
  }
  return -1
}

function isDirectiveStart(lines: string[], index: number): boolean {
  const match = lines[index]?.match(DIRECTIVE_OPEN)
  return Boolean(match && DIRECTIVE_NAMES.has(match[1]) && findDirectiveEnd(lines, index) !== -1)
}

/**
 * The same article with directives flattened to plain Markdown, for readers that
 * get the raw text (the `/md` agent endpoint): fences become a bold label or a
 * `###` heading and comparison marks become words.
 */
export function directivesToPlainMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const output: string[] = []
  let index = 0
  let inCode = false

  while (index < lines.length) {
    if (CODE_FENCE.test(lines[index])) inCode = !inCode
    if (inCode || !isDirectiveStart(lines, index)) {
      output.push(lines[index])
      index += 1
      continue
    }

    const [, name, rawAttrs = ''] = lines[index].match(DIRECTIVE_OPEN) ?? []
    const attrs = parseDirectiveAttributes(rawAttrs)
    const end = findDirectiveEnd(lines, index)
    const inner = lines.slice(index + 1, end)

    if (name === 'agency' && attrs.name) {
      output.push(`### ${attrs.name}`, '')
      if (attrs.tagline) output.push(`*${attrs.tagline}*`, '')
    } else if (attrs.title) {
      output.push(`**${attrs.title}**`, '')
    }

    for (const line of inner) {
      if (name === 'compare' && line.includes('|')) {
        output.push(
          line
            .replace(/\|\s*\[x\]\s*(?=\|)/g, `| ${attrs.yes || 'Yes'} `)
            .replace(/\|\s*\[ \]\s*(?=\|)/g, `| ${attrs.no || 'No'} `),
        )
      } else {
        output.push(line)
      }
    }
    if (name === 'compare' && attrs.legend) output.push('', attrs.legend)

    index = end + 1
  }

  return output.join('\n')
}

export function renderMarkdown(markdown: string): string {
  const source = markdown.replace(/\r\n?/g, '\n').trim()

  if (!source) return ''

  const lines = source.split('\n')
  const blocks: string[] = []
  let index = 0
  let agencyLogos: AgencyLogos | undefined

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (isDirectiveStart(lines, index)) {
      const [, name, rawAttrs = ''] = line.match(DIRECTIVE_OPEN) ?? []
      const end = findDirectiveEnd(lines, index)
      agencyLogos ??= collectAgencyLogos(lines)
      blocks.push(renderDirective(name, parseDirectiveAttributes(rawAttrs), lines.slice(index + 1, end), agencyLogos))
      index = end + 1
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
      !isDirectiveStart(lines, index) &&
      !isMarkdownTableStart(lines, index)
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push(renderParagraph(paragraphLines))
  }

  return blocks.join('\n')
}
