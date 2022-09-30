const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const {nanoid} = require('nanoid');
const {mapDBToPlaylistModel, mapDBToDetailSongOnPlaylistModel} = require('../../utils/playlists');

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

  async deletePlaylistById(id) {
    const res = await this._pool.query({
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!res.rowCount) {
      throw new NotFoundError('failed to delete playlist. id not found');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const res = await this._pool.query({
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    });

    if (!res.rowCount) {
      throw new NotFoundError('playlist not found');
    }

    if (res.rows[0].owner !== owner) {
      throw new AuthorizationError('can not access this resource');
    }
  }

  async addSongToPlaylists(playlistId, {songId}) {
    const id = `playlist_song-${nanoid(16)}`;

    const res = await this._pool.query({
      text: 'INSERT INTO playlist_songs VALUES ($1, $2,$3) RETURNING id',
      values: [id, playlistId, songId],
    });

    if (!res.rowCount) {
      throw new InvariantError('failed to add song to playlist');
    }
  }

  async getSongsOnPlaylist(playlistId, owner) {
    const playlist = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
            FULL OUTER JOIN users ON users.id = playlists.owner WHERE playlists.id = $1`,
      values: [playlistId],
    });

    const songs = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
            INNER JOIN playlist_songs ps 
                   ON songs.id = ps.song_id
            INNER JOIN playlists
                ON playlists.id = ps.playlist_id
            WHERE playlist_id = $1 AND playlists.owner = $2`,
      values: [playlistId, owner],
    });

    playlist.rows[0].songs = songs.rows;

    return playlist.rows[0];
  }
};
