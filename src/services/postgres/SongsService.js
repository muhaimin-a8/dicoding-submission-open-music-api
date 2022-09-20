const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToDetailSongModel} = require('../../utils/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = `song-${nanoid(16)}`;
    const res = await this._pool.query({
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    });

    if (!res.rows[0].id) {
      throw new InvariantError('Failed to add new song');
    }
    return res.rows[0].id;
  }

  async getSongs({title = '', performer = ''}) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const res = await this._pool.query(query);
    return res.rows;
  }

  async getDetailSongById(id) {
    const res = await this._pool.query({
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    });

    if (!res.rowCount) {
      throw new NotFoundError(`song with id: ${id} can not be found`);
    }

    return res.rows.map(mapDBToDetailSongModel)[0];
  }

  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const res = await this._pool.query({
      // eslint-disable-next-line max-len
      text: 'UPDATE songs SET title = $1, year = $2 , genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    });

    if (!res.rowCount) {
      throw new NotFoundError('failed to update song. Id can not be found');
    }
  }

  async deleteSongById(id) {
    const res = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!res.rowCount) {
      throw new NotFoundError('failed to delete song. Id can not be found');
    }
  }
}

module.exports = SongsService;
