/* eslint-disable camelcase */

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
    album_id: {
      type: 'VARCHAR(30)',
      allowNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
