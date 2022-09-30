const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {nanoid} = require('nanoid');

module.exports = class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const res = await this._pool.query({
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    });

    if (!res.rowCount) {
      throw new InvariantError('Failed to add new playlist');
    }

    return res.rows[0].id;
  }
};
