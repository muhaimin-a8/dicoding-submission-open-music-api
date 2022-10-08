const response = require('../../utils/response');

module.exports = class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const songId = await this._service.addSong(req.payload);

    return response.send(h, {
      data: {songId},
      statusCode: 201,
    });
  }

  async getSongsHandler(req, h) {
    const songs = await this._service.getSongs(req.query);

    return response.send(h, {
      data: {songs},
    });
  }

  async getDetailSongByIdHandler(req, h) {
    const song = await this._service.getDetailSongById(req.params.id);

    return response.send(h, {
      data: {song},
    });
  }

  async putSongById(req, h) {
    this._validator.validateSongPayload(req.payload);
    await this._service.editSongById(req.params.id, req.payload);

    return response.send(h, {
      message: 'success to update song',
    });
  }

  async deleteSongByIdHandler(req, h) {
    await this._service.deleteSongById(req.params.id);

    return response.send(h, {
      message: 'success to delete song',
    });
  }
};
