import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { getVideoProvider, getYouTubeId } from '../lib/video'

export const Sermons: CollectionConfig = {
  slug: 'sermons',
  admin: {
    useAsTitle: 'title',
    group: 'Media',
    defaultColumns: ['title', 'speaker', 'series', 'date', 'status'],
  },
  access: { read: () => true },
  versions: { drafts: true },
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
    {
      name: 'speaker',
      type: 'relationship',
      relationTo: 'speakers',
      required: true,
    },
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'scripture',
      type: 'text',
      admin: {
        description: 'Optional scripture reference for the sermon',
      },
    },
    { name: 'summary', type: 'textarea' },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'Link URL Youtube, Facebook, Vimeo, etc.',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) return value
            if (getVideoProvider(value) !== 'youtube') return value
            const id = getYouTubeId(value)
            return id ? `https://www.youtube.com/watch?v=${id}` : value
          },
        ],
      },
    },
    { name: 'audio', type: 'upload', relationTo: 'media' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'studyGuide', type: 'upload', relationTo: 'media' },
    {
      name: 'studyNotes',
      type: 'richText',
      admin: {
        description: 'study notes for the sermon',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: ['draft', 'published', 'archived'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
