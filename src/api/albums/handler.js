const response = require('../../utils/response');

module.exports = class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    const albumId = await this._service.addAlbum(req.payload);

    return response.send(h, {
      data: {albumId},
      statusCode: 201,
    });
  }

  async getAlbumsByIdHandler(req, h) {
    const album = await this._service.getAlbumById(req.params.id);

    return response.send(h, {
      data: {album},
    });
  }

  async putAlbumById(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    await this._service.editAlbumById(req.params.id, req.payload);

    return response.send(h, {
      message: 'success to update album',
    });
  }

  async deleteAlbumByIdHandler(req, h) {
    await this._service.deleteAlbumById(req.params.id);

    return response.send(h, {
      message: 'success to delete album',
    });
  }
};
