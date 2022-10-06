/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      foreignKeys: true,
      notNull: true,
      reference: 'playlists(id)',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      foreignKeys: true,
      reference: 'users(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
