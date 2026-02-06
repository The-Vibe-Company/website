import type { CollectionConfig } from 'payload'

export const IngestionLog: CollectionConfig = {
  slug: 'ingestion-logs',
  admin: {
    useAsTitle: 'sourceType',
    defaultColumns: ['sourceType', 'status', 'contentTitle', 'createdAt'],
  },
  fields: [
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Notion', value: 'notion' },
        { label: 'CLI', value: 'cli' },
        { label: 'Slack', value: 'slack' },
        { label: 'Browser Extension', value: 'browser' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Received', value: 'received' },
        { label: 'Processing', value: 'processing' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'contentTitle',
      type: 'text',
    },
    {
      name: 'content',
      type: 'relationship',
      relationTo: 'content',
      admin: {
        description: 'Link to created/updated content (if successful)',
      },
    },
    {
      name: 'externalId',
      type: 'text',
      admin: {
        description: 'ID from the source system',
      },
    },
    {
      name: 'rawPayload',
      type: 'json',
      admin: {
        description: 'Raw incoming payload for debugging',
      },
    },
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Error message if ingestion failed',
      },
    },
    {
      name: 'processingTimeMs',
      type: 'number',
    },
  ],
}
