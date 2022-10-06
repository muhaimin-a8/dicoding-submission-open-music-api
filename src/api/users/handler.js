module.exports = class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const userId = await this._service.addUser(req.payload);

    return this._renderResponse(h, {
      data: {userId},
      statusCode: 201,
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
