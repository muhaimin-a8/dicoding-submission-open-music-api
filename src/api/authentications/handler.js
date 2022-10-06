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

    return this._renderResponse(h, {
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

    return this._renderResponse(h, {
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

    return this._renderResponse(h, {
      msg: 'Success to delete refresh token',
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
