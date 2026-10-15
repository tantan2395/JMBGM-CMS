import * as migration_20261008_080506_media_collections from './20261008_080506_media_collections';

export const migrations = [
  {
    up: migration_20261008_080506_media_collections.up,
    down: migration_20261008_080506_media_collections.down,
    name: '20261008_080506_media_collections'
  },
];
