const ClientError = require('../../exceptions/ClientError');
const fs = require('fs');
const path = require('path');

module.exports = class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getDetailSongByIdHandler = this.getDetailSongByIdHandler.bind(this);
    this.putSongById = this.putSongById.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);

    this._renderSuccessResponse = this._renderSuccessResponse.bind(this);
    this._renderFailedResponse = this._renderFailedResponse.bind(this);
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const {title, year, genre, performer, duration, albumId} = req.payload;
      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      return this._renderSuccessResponse(h, {
        data: {songId},
        statusCode: 201,
      });
    } catch (e) {
      return this._renderFailedResponse({h: h, e: e});
    }
  }

  async getSongsHandler(req, h) {
    try {
      const {title, performer} = req.query;
      const songs = await this._service.getSongs({title, performer});

      return this._renderSuccessResponse(h, {
        data: {songs},
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  async getDetailSongByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const song = await this._service.getDetailSongById(id);

      return this._renderSuccessResponse(h, {
        data: {song},
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  async putSongById(req, h) {
    try {
      const {id} = req.params;
      this._validator.validateSongPayload(req.payload);
      const {title, year, genre, performer, duration, albumId} = req.payload;
      await this._service.editSongById(id, {
        title, year, genre, performer, duration, albumId,
      });

      return this._renderSuccessResponse(h, {
        msg: 'success to update song',
      });
    } catch (e) {
      return this._renderFailedResponse({h, e});
    }
  }

  async deleteSongByIdHandler(req, h) {
    try {
      const {id} = req.params;
      await this._service.deleteSongById(id);

      return this._renderSuccessResponse(h, {
        msg: 'success to delete song',
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
