/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'playlists(id)',
      foreignKeys: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'songs(id)',
      foreignKeys: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
