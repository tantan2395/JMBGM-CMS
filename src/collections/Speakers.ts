import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  admin: { useAsTitle: 'name', group: 'Media' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [({ value, data }) => value || slugify(data?.name)],
      },
    },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
