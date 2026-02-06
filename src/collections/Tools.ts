import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'website'],
  },
  access: {
    read: () => true,
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
      required: true,
      unique: true,
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
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Detailed tool description and usage guide',
      },
    },
  ],
}
