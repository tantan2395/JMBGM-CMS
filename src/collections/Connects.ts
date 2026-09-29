import type { CollectionConfig } from 'payload';

export const Connects: CollectionConfig = {
  slug: 'connects',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'isActive', 'updatedAt'],
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
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'text',
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
        description: 'Optional emoji shown on the card',
      },
    },

    {
      name: 'googleFormUrl',
      type: 'text',
      required: true,
      label: 'Google Form URL',
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
};