import type { CollectionConfig } from 'payload'
import { autoSlug } from './hooks/autoSlug'
import { autoPublishedAt } from './hooks/autoPublishedAt'
import { deduplicateContent } from './hooks/deduplicateContent'
import { revalidateContent } from './hooks/revalidateContent'

export const DOMAIN_OPTIONS = [
  { label: 'Development', value: 'dev' },
  { label: 'Design', value: 'design' },
  { label: 'Operations', value: 'ops' },
  { label: 'Business', value: 'business' },
  { label: 'AI & Automation', value: 'ai-automation' },
  { label: 'Marketing', value: 'marketing' },
] as const

export const CONTENT_TYPE_OPTIONS = [
  { label: 'Daily Learning', value: 'daily' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Article', value: 'article' },
  { label: 'Tool Focus', value: 'tool-focus' },
  { label: 'Concept Focus', value: 'concept-focus' },
] as const

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'In Review', value: 'review' },
  { label: 'Published', value: 'published' },
  { label: 'Updated', value: 'updated' },
  { label: 'Archived', value: 'archived' },
] as const

export const Content: CollectionConfig = {
  slug: 'content',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'domain', 'publishedAt'],
    listSearchableFields: ['title', 'summary', 'slug'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [autoSlug, deduplicateContent],
    beforeChange: [autoPublishedAt],
    afterChange: [revalidateContent],
  },
  fields: [
    // Core content
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left empty',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description for listings and SEO',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short excerpt for cards (<160 chars)',
      },
      maxLength: 160,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    // Taxonomy
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [...CONTENT_TYPE_OPTIONS],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [...STATUS_OPTIONS],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'domain',
      type: 'select',
      hasMany: true,
      options: [...DOMAIN_OPTIONS],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tools',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
    },
    {
      name: 'concepts',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Concept tags (e.g., "prompt-engineering", "vibe-coding")',
      },
    },
    {
      name: 'complexity',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'tutorial',
      },
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'fr',
      options: [
        { label: 'Francais', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Author
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    // Computed
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Estimated reading time in minutes',
      },
    },
    // Source tracking
    {
      name: 'source',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Notion', value: 'notion' },
            { label: 'CLI', value: 'cli' },
            { label: 'Slack', value: 'slack' },
            { label: 'Browser Extension', value: 'browser' },
            { label: 'Meeting', value: 'meeting' },
          ],
          defaultValue: 'manual',
        },
        {
          name: 'externalId',
          type: 'text',
          index: true,
          admin: {
            description: 'ID from the source system (e.g., Notion page ID)',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Original source URL',
          },
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'Last sync from external source',
          },
        },
      ],
    },
    // Dates
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // AI metadata
    {
      name: 'aiMetadata',
      type: 'group',
      admin: {
        description: 'Auto-generated by AI enrichment pipeline',
      },
      fields: [
        {
          name: 'qualityScore',
          type: 'number',
          min: 0,
          max: 1,
          admin: {
            description: '0-1 quality score. 0.7+ = publishable',
            step: 0.01,
          },
        },
        {
          name: 'autoTags',
          type: 'text',
          hasMany: true,
        },
        {
          name: 'autoSummary',
          type: 'textarea',
        },
        {
          name: 'detectedLanguage',
          type: 'select',
          options: [
            { label: 'Francais', value: 'fr' },
            { label: 'English', value: 'en' },
          ],
        },
        {
          name: 'enrichedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
}
