/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INT',
      allowNull: true,
    },
    albumId: {
      type: 'VARCHAR(30)',
      allowNull: true,
    },
  });

  pgm.addConstraint('songs', 'fk_songs_albums', {
    foreignKeys: {
      columns: ['albumId'],
      references: 'albums(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
