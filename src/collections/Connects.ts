import type { CollectionConfig } from 'payload'
import { CONNECT_CATEGORIES } from '../lib/constants/connect'
import { ensureHttps } from '../lib/urls'

export const Connects: CollectionConfig = {
  slug: 'connects',

  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },

  versions: {
    drafts: true,
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'order', 'isActive', 'updatedAt'],
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
      admin: {
        description: 'URL-friendly identifier for the Learn More page.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return String(data.name)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on directory cards and social sharing.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [...CONNECT_CATEGORIES],
      admin: {
        description: 'Life-stage / ministry demographic used to filter the directory.',
      },
    },
    {
      name: 'schedule',
      type: 'text',
      admin: {
        description: 'Meeting cadence shown on cards (e.g. Fridays · 7:00 PM).',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Featured Image',
      admin: {
        description: 'Displayed on the Connect card and detail page.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon / Emoji',
      admin: {
        description: 'Optional emoji shown as a badge on the card',
      },
    },
    {
      name: 'googleFormUrl',
      type: 'text',
      required: true,
      label: 'Google Form URL',
      admin: {
        description: 'Registration / interest form. Protocol is added automatically if omitted.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => ensureHttps(value),
        ],
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
}
