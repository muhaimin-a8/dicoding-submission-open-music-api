const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToSongModel} = require('../../utils/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = `song-${nanoid(16)}`;
    const res = await this._pool.query({
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    });

    if (!res.rows[0].id) {
      throw new InvariantError('Failed to add new song');
    }
    return res.rows[0].id;
  }

  async getSongs() {
    const res = await this._pool.query('SELECT * FROM songs');
    return res.rows.map(mapDBToSongModel);
  }

  //
  // async getAlbumById(id) {
  //   const res = await this._pool.query({
  //     text: 'SELECT * FROM albums WHERE id = $1',
  //     values: [id],
  //   });
  //
  //   if (!res.rows.length) {
  //     throw new NotFoundError('album can not be found');
  //   }
  //
  //   return res.rows[0];
  // }
  //
  // async editAlbumById(id, {name, year}) {
  //   const res = await this._pool.query({
  //     // eslint-disable-next-line max-len
  //     text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
  //     values: [name, year, id],
  //   });
  //
  //   if (!res.rows.length) {
  //     throw new NotFoundError('failed to update album. Id can not be found');
  //   }
  // }
  //
  // async deleteAlbumById(id) {
  //   const res = await this._pool.query({
  //     text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
  //     values: [id],
  //   });
  //
  //   if (!res.rows.length) {
  //     throw new NotFoundError('failed to delete album. Id can not be found');
  //   }
  // }
}

module.exports = SongsService;
