const response = require('../../utils/response');

module.exports = class LikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;
  }

  async postAlbumLikeHandler(req, h) {
    await this._albumsService.verifyAlbumIsExists(req.params.id);
    await this._albumLikesService.addLike(req.params.id, req.auth.credentials.id);

    return response.send(h, {
      message: 'success to like album',
      statusCode: 201,
    });
  }

  async getAlbumLikesHandler(req, h) {
    const likes = await this._albumLikesService.getLikesCount(req.params.id);

    if (likes.type === 'cache') {
      return response.send(h, {
        data: {
          likes: likes.data,
        },
      },
      {
        name: 'X-data-source',
        value: 'cache',
      },
      );
    } else {
      return response.send(h, {
        data: {
          likes: likes.data,
        },
      });
    }
  }
};
