import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Connects } from './collections/Connects'
import { Pages } from './collections/Pages'
import { Announcements } from './collections/Announcements'
import { StoryChapters } from './collections/StoryChapters'
import { Sermons } from './collections/Sermons'
import { Outreaches } from './collections/Outreaches'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function formatDatabaseUri(uri?: string): string {
  if (!uri) return ''
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) return uri
  if (/([?&])sslmode=[^&]+/i.test(uri)) {
    return uri.replace(/([?&])sslmode=[^&]+/i, '$1sslmode=no-verify')
  }
  return uri.includes('?') ? `${uri}&sslmode=no-verify` : `${uri}?sslmode=no-verify`
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Connects, Pages, Announcements, StoryChapters, Sermons, Outreaches],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || 'jmbgm-app-development-secret-key-32-chars-long',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: formatDatabaseUri(process.env.DATABASE_URI),
    },
  }),
  sharp,
})
