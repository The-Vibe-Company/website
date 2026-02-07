import type { CollectionConfig } from 'payload'

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive name for this API key (e.g., "Notion Webhook", "CLI Tool")',
      },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The API key value. Generate a secure random string.',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Notion', value: 'notion' },
        { label: 'CLI', value: 'cli' },
        { label: 'Slack', value: 'slack' },
        { label: 'Browser Extension', value: 'browser' },
        { label: 'Meeting Transcriber', value: 'meeting' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'lastUsedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
