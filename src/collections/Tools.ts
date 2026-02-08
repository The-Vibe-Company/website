import type { CollectionConfig } from 'payload'
import { DOMAIN_OPTIONS } from './Content'
import { autoSlug } from './hooks/autoSlug'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'rating', 'status', 'website'],
    listSearchableFields: ['name', 'description', 'slug'],
  },
  hooks: {
    beforeValidate: [autoSlug],
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
  fields: [
    {
      name: 'name',
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
        description: 'Auto-generated from name if left empty',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'AI / LLM', value: 'ai-llm' },
        { label: 'Development', value: 'development' },
        { label: 'Design', value: 'design' },
        { label: 'Productivity', value: 'productivity' },
        { label: 'Deployment', value: 'deployment' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Communication', value: 'communication' },
      ],
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
      name: 'pricing',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Freemium', value: 'freemium' },
        { label: 'Paid', value: 'paid' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        position: 'sidebar',
        step: 0.5,
        description: 'Rating out of 5',
      },
    },
    // Review content
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Detailed tool description and usage guide',
      },
    },
    {
      name: 'pros',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Advantages of this tool',
      },
    },
    {
      name: 'cons',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Disadvantages of this tool',
      },
    },
    {
      name: 'verdict',
      type: 'textarea',
      admin: {
        description: 'Short editorial opinion',
      },
    },
    // Relations
    {
      name: 'relatedTools',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      admin: {
        description: 'Similar or complementary tools',
      },
    },
    // Stack tracking
    {
      name: 'costPerMonth',
      type: 'number',
      admin: {
        position: 'sidebar',
        step: 0.01,
        description: 'Monthly cost in EUR',
      },
    },
    {
      name: 'licensesCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Number of active licenses',
      },
    },
    {
      name: 'leverageScore',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
        step: 5,
        description: 'How well we leverage this tool (0-100%)',
      },
    },
    {
      name: 'isInStack',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this tool in Our Stack section',
      },
    },
    // Metadata
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
  ],
}
