const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToAlbumSongModel} = require('../../utils/albums');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;
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
    const album = await this._pool.query({
      text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
      values: [id],
    });

    if (!album.rows.length) {
      throw new NotFoundError('album can not be found');
    }

    album.rows[0].songs = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [album.rows[0].id],
    }).rows;

    return album.rows.map(mapDBToAlbumSongModel)[0];
  }

  async editAlbumById(id, {name, year}) {
    const res = await this._pool.query({
      // eslint-disable-next-line max-len
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    });

    if (!res.rows.length) {
      throw new NotFoundError('failed to update album. Id can not be found');
    }
  }

  async deleteAlbumById(id) {
    const res = await this._pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!res.rows.length) {
      throw new NotFoundError('failed to delete album. Id can not be found');
    }
  }

  async addCover(albumId, cover) {
    const res = await this._pool.query({
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, albumId],
    });
    if (!res.rowCount) {
      throw new NotFoundError('failed to add cover. Id can not be found');
    }
  }

  async verifyAlbumIsExists(id) {
    const res= await this._pool.query({
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    });

    if (!res.rowCount) {
      throw new NotFoundError('album not found');
    }
  }
}

module.exports = AlbumsService;
