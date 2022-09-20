module.exports = class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumById = this.putAlbumById.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    this._renderResponse = this._renderResponse.bind(this);
  }

  async postAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    const {name, year} = req.payload;
    const albumId = await this._service.addAlbum({name, year});

    return this._renderResponse(h, {
      data: {albumId},
      statusCode: 201,
    });
  }

  async getAlbumsByIdHandler(req, h) {
    const {id} = req.params;
    const album = await this._service.getAlbumById(id);

    return this._renderResponse(h, {
      data: {album},
    });
  }

  async putAlbumById(req, h) {
    const {id} = req.params;
    this._validator.validateAlbumPayload(req.payload);
    const {name, year} = req.payload;
    await this._service.editAlbumById(id, {name, year});

    return this._renderResponse(h, {
      msg: 'success to update album',
    });
  }

  async deleteAlbumByIdHandler(req, h) {
    const {id} = req.params;
    await this._service.deleteAlbumById(id);

    return this._renderResponse(h, {
      msg: 'success to delete album',
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
