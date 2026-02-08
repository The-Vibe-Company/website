import type { CollectionConfig } from 'payload'
import { autoSlug } from './hooks/autoSlug'

export const ContentTypes: CollectionConfig = {
  slug: 'content-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'pluralLabel', 'sortOrder'],
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
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name, e.g. "Daily Learning"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug, e.g. "daily". Auto-generated if empty.',
      },
    },
    {
      name: 'pluralLabel',
      type: 'text',
      required: true,
      admin: {
        description: 'Plural label for nav tabs and page headings, e.g. "Learnings"',
      },
    },
    {
      name: 'singularLabel',
      type: 'text',
      required: true,
      admin: {
        description: 'Singular label for badges, e.g. "Learning"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Shown on the listing page header',
      },
    },
    {
      name: 'renderStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Timeline (grouped by date)', value: 'timeline' },
        { label: 'Grid (card layout)', value: 'grid' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How content of this type is rendered on the listing page',
      },
    },
    {
      name: 'prependDateToSlug',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prepend YYYY-MM-DD to content slugs of this type',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Order in the TypeNav (lower = first)',
      },
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this type in the top navigation bar',
      },
    },
  ],
}
