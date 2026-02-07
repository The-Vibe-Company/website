import type { CollectionConfig } from 'payload'
import { hashApiKey } from '../lib/auth/api-key-hash'

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'source', 'keyPrefix', 'active', 'lastUsedAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // On create: hash the key, store prefix, remove plaintext
        if (operation === 'create' && data?.key) {
          data.keyHash = hashApiKey(data.key)
          data.keyPrefix = data.key.substring(0, 12) + '...'
          delete data.key
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive name (e.g., "Notion Webhook", "CLI Tool")',
      },
    },
    {
      name: 'key',
      type: 'text',
      admin: {
        description:
          'Paste your API key here on create. It will be hashed and the plaintext removed. You won\'t be able to see it again.',
        condition: (data) => !data?.id,
      },
    },
    {
      name: 'keyHash',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'keyPrefix',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'First characters of the key for identification',
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
      name: 'permissions',
      type: 'json',
      admin: {
        description: 'Granular permissions for this key (future use)',
      },
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
        position: 'sidebar',
      },
    },
  ],
}
