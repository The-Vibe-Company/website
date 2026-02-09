import type { CollectionConfig } from 'payload'
import { autoSlug } from './hooks/autoSlug'
import { revalidateContent } from './hooks/revalidateContent'

export const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'shortLabel', 'color', 'sortOrder'],
    group: 'Taxonomies',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [autoSlug],
    afterChange: [revalidateContent],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name, e.g. "Development"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug, e.g. "dev". Auto-generated if empty.',
      },
    },
    {
      name: 'shortLabel',
      type: 'text',
      required: true,
      admin: {
        description: 'Short label for filter pills, e.g. "Dev"',
      },
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: {
        description: 'Hex color for light mode, e.g. "#2563eb"',
      },
    },
    {
      name: 'colorDark',
      type: 'text',
      admin: {
        description: 'Hex color for dark mode, e.g. "#60a5fa". Falls back to light color if empty.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Order in the filter bar (lower = first)',
      },
    },
  ],
}
