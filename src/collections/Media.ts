import type { CollectionConfig } from 'payload';

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
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}