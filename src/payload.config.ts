import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Content } from './collections/Content'
import { Tools } from './collections/Tools'
import { ApiKeys } from './collections/ApiKeys'
import { IngestionLog } from './collections/IngestionLog'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        {
          path: '@/components/admin/GenerateNavLink',
          exportName: 'GenerateNavLink',
        },
      ],
    },
  },
  collections: [Users, Media, Content, Tools, ApiKeys, IngestionLog],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
    // Search plugin: auto-indexes content and tools for fast search
    searchPlugin({
      collections: ['content', 'tools'],
      defaultPriorities: {
        content: 10,
        tools: 20,
      },
      beforeSync: ({ originalDoc, searchDoc }) => {
        const doc = originalDoc || {}
        return {
          ...searchDoc,
          excerpt: doc.summary ?? doc.description ?? '',
        }
      },
    }),

    // SEO plugin: auto-generates meta title, description, OG image for content & tools
    seoPlugin({
      collections: ['content', 'tools'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const title = doc?.title ?? doc?.name ?? ''
        return `${title} | The Vibe Company`
      },
      generateDescription: ({ doc }) => {
        return (doc?.summary ?? doc?.description ?? '') + ''
      },
      generateURL: ({ doc, collectionSlug }) => {
        if (collectionSlug === 'content') {
          return `https://thevibecompany.co/resources/${doc?.type}/${doc?.slug}`
        }
        if (collectionSlug === 'tools') {
          return `https://thevibecompany.co/resources/tools/${doc?.slug}`
        }
        return `https://thevibecompany.co/${doc?.slug}`
      },
    }),

    // Vercel Blob storage: CDN-backed media storage (only if token is configured)
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
