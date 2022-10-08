const response = require('../../utils/response');

module.exports = class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const userId = await this._service.addUser(req.payload);

    return response.send(h, {
      data: {userId},
      statusCode: 201,
    });
  }
};
