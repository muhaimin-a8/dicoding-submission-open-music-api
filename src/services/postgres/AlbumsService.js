const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({name, year}) {
    const id = nanoid(16);
    const res = await this._pool.query({
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    });

    if (!res.rows[0].id) {
      throw new InvariantError('Failed to add new album');
    }
    return res.rows[0].id;
  }

  async getAlbumById(id) {
    const res = await this._pool.query({
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    });

    if (!res.rows.length) {
      throw new NotFoundError('album can not be found');
    }

    return res.rows[0];
  }
}

module.exports = AlbumsService;
