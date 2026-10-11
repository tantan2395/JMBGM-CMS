import type { CollectionConfig } from 'payload';
import { slugify } from '../lib/slugify';

//1. Media (Uploads: Images, Audio, PDFs)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'filename', group: 'Media' },
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    mimeTypes: [
      'image/*',
      'audio/*',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'center' },
      { name: 'card', width: 768, height: 432, position: 'center' },
      { name: 'hero', width: 1600, height: 900, position: 'center' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text'},
    { name: 'credit', type: 'text'},
  ],
}

//2. Speakers
export const Speakers: CollectionConfig = {
  slug: 'speakers',
  admin: { useAsTitle: 'name', group: 'Media' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name:'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.name)
        ],
      },
    },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}

//3. Series
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
//4. Sermons
  export const Sermons: CollectionConfig = {
    slug: 'sermons',
    admin: { useAsTitle: 'title', group: 'Media',
      defaultColumns: ['title', 'speaker', 'series', 'date', 'status']
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
      {
        name: 'summary', type: 'textarea',
      },
      {
        name: 'tags',
        type: 'array',
        fields: [
          { name: 'tag', type: 'text' },
        ],
      },
      //external video or link video
      {
        name: 'videoUrl',
        type: 'text',
        admin: {
          description: 'Link URL Youtube, Facebook, Vimeo, etc.',
        },
        hooks: {
          beforeChange: [
            ({ value}) => {
              if (!value) return value
              if (/youte\be\.com|youtu\.be/.test(value)) {
                const id = value.split('youtu.be/')[1]?.split(/[?&]/)[0]
                return id ? `https://www.youtube.com/watch?v=${id}` : value
              }
                return value
            },
          ],
        },
      },
      //Uploaded asstes
      { name: 'audio', type: 'upload', relationTo: 'media' },
      { name: 'thumbnail', type: 'upload', relationTo: 'media' },
      { name: 'studyGuide', type: 'upload', relationTo: 'media' },

      //Study notes
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