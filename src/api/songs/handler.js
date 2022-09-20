module.exports = class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getDetailSongByIdHandler = this.getDetailSongByIdHandler.bind(this);
    this.putSongById = this.putSongById.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);

    this._renderResponse = this._renderResponse.bind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const songId = await this._service.addSong(req.payload);

    return this._renderResponse(h, {
      data: {songId},
      statusCode: 201,
    });
  }

  async getSongsHandler(req, h) {
    const {title, performer} = req.query;
    const songs = await this._service.getSongs({title, performer});

    return this._renderResponse(h, {
      data: {songs},
    });
  }

  async getDetailSongByIdHandler(req, h) {
    const {id} = req.params;
    const song = await this._service.getDetailSongById(id);

    return this._renderResponse(h, {
      data: {song},
    });
  }

  async putSongById(req, h) {
    const {id} = req.params;
    this._validator.validateSongPayload(req.payload);
    const {title, year, genre, performer, duration, albumId} = req.payload;
    await this._service.editSongById(id, {
      title, year, genre, performer, duration, albumId,
    });

    return this._renderResponse(h, {
      msg: 'success to update song',
    });
  }

  async deleteSongByIdHandler(req, h) {
    const {id} = req.params;
    await this._service.deleteSongById(id);

    return this._renderResponse(h, {
      msg: 'success to delete song',
    });
  }

  _renderResponse(h, {msg, data, statusCode = 200}) {
    const resObj = {
      status: 'success',
      message: msg,
      data: data,
    };

    if (msg === null) {
      delete resObj['message'];
    }

    if (data === null) {
      delete resObj['data'];
    }

    const res = h.response(resObj);
    res.code(statusCode);

    return res;
  }
};
