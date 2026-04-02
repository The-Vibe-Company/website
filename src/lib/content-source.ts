import { cache } from 'react'
import fs from 'fs'
import path from 'path'

import {
  CONTENT_TYPES,
  getContentTypeByUrlSlug,
  getUrlSlugForDbType,
  type ContentTypeConfig,
} from '@/lib/content-types'

export interface ContentEntry {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  type: string
  publishedAt: string
  complexity?: string
  featuredImage?: null
}

type Frontmatter = Record<string, string>

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function parseFrontmatter(raw: string): { body: string; data: Frontmatter } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { body: raw.trim(), data: {} }
  }

  const [, frontmatter, body] = match
  const data: Frontmatter = {}

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    data[key] = value
  }

  return { body: body.trim(), data }
}

function readDirectoryEntries(type: ContentTypeConfig): ContentEntry[] {
  const directory = path.join(CONTENT_ROOT, getUrlSlugForDbType(type.slug))

  if (!fs.existsSync(directory)) return []

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(directory, file)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data, body } = parseFrontmatter(raw)
      const slug = data.slug || file.replace(/\.md$/, '')
      const title = data.title || slug
      const publishedAt = data.publishedAt || new Date().toISOString().slice(0, 10)
      const summary = data.summary || body.split('\n').find(Boolean)?.trim() || ''

      return {
        id: `${type.slug}:${slug}`,
        slug,
        title,
        summary,
        body,
        type: type.slug,
        publishedAt,
        complexity: data.complexity || undefined,
        featuredImage: null,
      }
    })
}

function sortByPublishedAtDesc(items: ContentEntry[]): ContentEntry[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export const getAllContent = cache((): ContentEntry[] => {
  const entries = CONTENT_TYPES.flatMap((type) => readDirectoryEntries(type))
  return sortByPublishedAtDesc(entries)
})

export const getContentCounts = cache((): Record<string, number> => {
  const counts: Record<string, number> = {}

  for (const item of getAllContent()) {
    counts[item.type] = (counts[item.type] || 0) + 1
  }

  return counts
})

export const getContentByType = cache((type: string): ContentEntry[] => {
  return getAllContent().filter((item) => item.type === type)
})

export const getContentByTypeUrlSlug = cache((typeUrlSlug: string): ContentEntry[] => {
  const contentType = getContentTypeByUrlSlug(typeUrlSlug)
  if (!contentType) return []
  return getContentByType(contentType.slug)
})

export const getContentItem = cache((type: string, slug: string): ContentEntry | null => {
  return getAllContent().find((item) => item.type === type && item.slug === slug) ?? null
})

export const getRelatedContent = cache((type: string, slug: string, limit = 3): ContentEntry[] => {
  return getContentByType(type)
    .filter((item) => item.slug !== slug)
    .slice(0, limit)
})

export const searchContent = cache((query: string): ContentEntry[] => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return getAllContent().filter((item) => {
    const haystack = `${item.title}\n${item.summary}\n${item.body}`.toLowerCase()
    return haystack.includes(normalized)
  })
})
