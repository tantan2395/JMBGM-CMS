import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Series: CollectionConfig = {
  slug: 'series',
  admin: { useAsTitle: 'title', group: 'Media' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [({ value, data }) => value || slugify(data?.title)],
      },
    },
    { name: 'description', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'startDate', type: 'date' },
    {
      name: 'studyGuide',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'PDF study guide for the series',
      },
    },
  ],
}
