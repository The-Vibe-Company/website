import type { CollectionConfig } from 'payload'

import { CONTENT_TYPES } from '@/lib/content-types'
import { normalizeLexicalState } from '@/lib/lexical'
import { autoPublishedAt } from './hooks/autoPublishedAt'
import { autoSlug } from './hooks/autoSlug'
import { revalidateContent } from './hooks/revalidateContent'

export const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const Content: CollectionConfig = {
  slug: 'content',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'status', 'publishedAt'],
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
    beforeValidate: [autoSlug],
    beforeChange: [autoPublishedAt],
    afterChange: [revalidateContent],
  },
  fields: [
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
        description: 'Auto-generated from the title if left empty.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: CONTENT_TYPES.map((type) => ({
        label: type.singularLabel,
        value: type.slug,
      })),
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
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Short intro used in listings.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      hooks: {
        afterRead: [
          ({ value }) => {
            return normalizeLexicalState(value)
          },
        ],
        beforeValidate: [
          ({ value }) => {
            return normalizeLexicalState(value)
          },
        ],
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
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
  ],
}
