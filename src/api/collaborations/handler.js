module.exports = class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postCollaborationHandler(req, h) {
    this._validator.validatePostCollaborationPayload(req.payload);

    const {id: credentialId} = req.auth.credentials;
    const {playlistId, userId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return this._renderResponse(h, {
      data: {collaborationId},
      statusCode: 201,
    });
  }

  async deleteCollaborationHandler(req, h) {
    this._validator.validateDeleteCollaborationPayload(req.payload);

    const {id: credentialId} = req.auth.credentials;
    const {playlistId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, credentialId);

    return this._renderResponse(h, {
      msg: 'success to add collaboration',
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
