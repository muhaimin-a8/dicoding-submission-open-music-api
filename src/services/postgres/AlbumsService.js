const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({name, year}) {
    const id = nanoid(16);
    const query ={
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const res = await this._pool.query(query);

    if (!res.rows[0].id) {
      throw new InvariantError('Failed to add new album');
    }
    return res.rows[0].id;
  }
}

module.exports = AlbumsService;
