const ClientError = require('../../exceptions/ClientError');
const fs = require('fs');
const path = require('path');

module.exports = class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumById = this.putAlbumById.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    this._renderSuccessResponse = this._renderSuccessResponse.bind(this);
    this._renderFailedResponse = this._renderFailedResponse.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const {name, year} = req.payload;
      const albumId = await this._service.addAlbum({name, year});

      return this._renderSuccessResponse(h, {
        data: {albumId},
        statusCode: 201,
      });
    } catch (e) {
      return this._renderFailedResponse({h: h, e: e});
    }
  }

  async getAlbumsByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const album = await this._service.getAlbumById(id);

      return this._renderSuccessResponse(h, {
        data: {album},
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  async putAlbumById(req, h) {
    try {
      const {id} = req.params;
      this._validator.validateAlbumPayload(req.payload);
      const {name, year} = req.payload;
      await this._service.editAlbumById(id, {name, year});

      return this._renderSuccessResponse(h, {
        msg: 'success to update album',
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  async deleteAlbumByIdHandler(req, h) {
    try {
      const {id} = req.params;
      await this._service.deleteAlbumById(id);

      return this._renderSuccessResponse(h, {
        msg: 'success to delete album',
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  _renderSuccessResponse(h, {msg, data, statusCode = 200}) {
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

  _renderFailedResponse({h, e}) {
    if (e instanceof ClientError) {
      const res = h.response({
        status: 'fail',
        message: e.message,
      });
      res.code(e.statusCode);
      return res;
    }

    const res = h.response({
      status: 'error',
      message: 'Sorry, there is a failure on our server',
    });
    res.code(500);

    // write error log file
    const logsDir = '../../../logs';
    const dateTime = new Date().toLocaleString('ind', {
      timeZone: 'Asia/Jakarta',
    });

    fs.mkdirSync(path.resolve(__dirname, logsDir), {recursive: true});
    fs.writeFileSync(
        `${path.resolve(__dirname, logsDir)}/error.log`,
        `${dateTime} : ${e.message} \n`,
        {flag: 'a+'},
    );

    console.log(e);
    return res;
  };
};
