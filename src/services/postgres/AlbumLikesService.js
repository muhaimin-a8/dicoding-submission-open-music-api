const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

module.exports = class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(albumId, userId) {
    if (await this._checkIsLiked(albumId, userId)) {
      const id = `like-${nanoid(16)}`;
      const res = await this._pool.query({
        text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      });

      if (!res.rowCount) {
        throw new NotFoundError('failed to like album. Id can not be found');
      }
    } else {
      await this._deleteLike(albumId, userId);
    }
  }

  async getLikesCount(albumId) {
    const res = await this._pool.query({
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    });

    return res.rowCount;
  }

  async _deleteLike(albumId, userId) {
    const res = await this._pool.query({
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    });

    if (!res.rowCount) {
      throw new NotFoundError('failed to unlike album');
    }
  }

  async _checkIsLiked(albumId, userId) {
    const res = await this._pool.query({
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    });

    return !res.rowCount;
  }
};

