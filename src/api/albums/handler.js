const ClientError = require('../../exceptions/ClientError');
const fs = require('fs');
const path = require('path');

module.exports = class AlbumsHandler {
  constructor(service, validator) {
    this._servide = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);

    this._renderSuccessResponse = this._renderSuccessResponse.bind(this);
    this._renderFailedResponse = this._renderFailedResponse.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const {name, year} = req.payload;
      const albumId = await this._servide.addAlbum({name, year});

      return this._renderSuccessResponse({
        h: h,
        msg: 'Success to add new Album',
        data: {albumId},
        statusCode: 201,
      });
    } catch (e) {
      return this._renderFailedResponse({h: h, e: e});
    }
  }

  _renderSuccessResponse({h, msg, data, statusCode = 200}) {
    const res = h.response({
      status: 'success',
      message: msg,
      data: data,
    });
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
