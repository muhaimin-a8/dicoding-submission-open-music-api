const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

module.exports = class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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
    try {
      const res = await this._cacheService.get(`album-likes:${albumId}`);

      return {
        type: 'cache',
        data: parseInt(res),
      };
    } catch (e) {
      const res = await this._pool.query({
        text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      });

      await this._cacheService.set(`album-likes:${albumId}`, res.rowCount);
      return {
        type: 'db',
        data: res.rowCount,
      };
    }
  }

  async _deleteLike(albumId, userId) {
    const res = await this._pool.query({
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    });

    if (!res.rowCount) {
      throw new NotFoundError('failed to unlike album');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async _checkIsLiked(albumId, userId) {
    const res = await this._pool.query({
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    });

    return !res.rowCount;
  }
};

