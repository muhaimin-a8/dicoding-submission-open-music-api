const response = require('../../utils/response');

module.exports = class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationHandler(req, h) {
    this._validator.validatePostAuthenticationPayload(req.payload);

    const id = await this._usersService.verifyUserCredential(req.payload);

    // generate Jwt access and refresh token
    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});

    // store Jwt refreshToken to database
    await this._authenticationsService.addRefreshToken(refreshToken);

    return response.send(h, {
      data: {accessToken, refreshToken},
      statusCode: 201,
    });
  }

  async putAuthenticationHandler(req, h) {
    this._validator.validatePutAuthenticationPayload(req.payload);
    const {refreshToken} = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const {id} = await this._tokenManager.verifyRefreshToken(refreshToken);

    const newAccessToken = await this._tokenManager.generateAccessToken(id);

    return response.send(h, {
      data: {
        accessToken: newAccessToken,
      },
    });
  }

  async deleteAuthenticationHandler(req, h) {
    this._validator.validateDeleteAuthenticationPayload(req.payload);
    const {refreshToken} = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return response.send(h, {
      message: 'Success to delete refresh token',
    });
  }
};
