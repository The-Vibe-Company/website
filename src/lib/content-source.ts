import { cache } from 'react'
import fs from 'fs'
import path from 'path'

import {
  CONTENT_TYPES,
  getContentTypeByUrlSlug,
  getUrlSlugForDbType,
  type ContentTypeConfig,
} from '@/lib/content-types'
import { getOptimizedImageUrl } from '@/lib/image-variants'
import { parseFrontmatter } from '@/lib/parse-frontmatter'

export type ContentLanguage = 'fr' | 'en'

export type SkillKind = 'native' | 'external'

export interface SkillInstallCommand {
  label: string
  command: string
}

export interface SkillMeta {
  kind: SkillKind
  author?: string
  authorUrl?: string
  allowedTools?: string[]
  trigger?: string
  creatorNote?: string
  sourceUrl?: string
  sourcePath?: string
  installCommands?: SkillInstallCommand[]
}

export interface ContentEntry {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  type: string
  publishedAt: string
  language: ContentLanguage
  complexity?: string
  topics?: string[]
  featuredImage?: {
    url: string
    sourceUrl?: string
    alt?: string
    sizes?: {
      card?: {
        url: string
      }
    }
  } | null
  ogImage?: {
    url: string
    sourceUrl: string
    alt?: string
  } | null
  skill?: SkillMeta
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

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
      const coverImage = data.coverImage || data.image || ''
      const optimizedCoverImage = coverImage ? getOptimizedImageUrl(coverImage) : ''
      const coverAlt = data.coverAlt || data.imageAlt || title
      const ogImage = data.ogImage || ''
      const optimizedOgImage = ogImage ? getOptimizedImageUrl(ogImage) : ''
      const topics = (data.topics || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      const language: ContentLanguage = data.language === 'fr' ? 'fr' : 'en'

      const skill = type.slug === 'skill' ? parseSkillMeta(data) : undefined

      return {
        id: `${type.slug}:${slug}`,
        slug,
        title,
        summary,
        body,
        type: type.slug,
        publishedAt,
        language,
        complexity: data.complexity || undefined,
        topics,
        featuredImage: coverImage
          ? {
              url: optimizedCoverImage,
              sourceUrl: coverImage,
              alt: coverAlt,
              sizes: {
                card: {
                  url: optimizedCoverImage,
                },
              },
            }
          : null,
        ogImage: ogImage
          ? {
              url: optimizedOgImage,
              sourceUrl: ogImage,
              alt: coverAlt,
            }
          : null,
        skill,
      }
    })
}

function parseSkillMeta(data: Record<string, string>): SkillMeta {
  const kind: SkillKind = data.kind === 'external' ? 'external' : 'native'

  const allowedTools = stripYamlBrackets(data.allowedTools || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  let installCommands: SkillInstallCommand[] | undefined
  if (data.installCommands) {
    try {
      const parsed = JSON.parse(data.installCommands)
      if (Array.isArray(parsed)) {
        installCommands = parsed
          .filter((entry): entry is SkillInstallCommand =>
            typeof entry === 'object' &&
            entry !== null &&
            typeof entry.label === 'string' &&
            typeof entry.command === 'string',
          )
      }
    } catch {
      installCommands = undefined
    }
  }

  return {
    kind,
    author: data.author || undefined,
    authorUrl: normalizeExternalUrl(data.authorUrl),
    allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
    trigger: data.trigger || undefined,
    creatorNote: data.creatorNote || undefined,
    sourceUrl: normalizeExternalUrl(data.sourceUrl),
    sourcePath: data.sourcePath || undefined,
    installCommands,
  }
}

function normalizeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function stripYamlBrackets(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1)
  }
  return trimmed
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
