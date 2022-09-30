const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {nanoid} = require('nanoid');
const {mapDBToPlaylistModel} = require('../../utils/playlists');

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

  async getPlaylists(owner) {
    const res = await this._pool.query({
      text: `SELECT playlists.id as playlist_id, playlists.name as name, playlists.owner as owner FROM playlists 
            LEFT JOIN users ON playlists.owner = users.id
             WHERE playlists.owner = $1 OR users.id = $1`,
      values: [owner],
    });
    return res.rows.map(mapDBToPlaylistModel);
  }
};
