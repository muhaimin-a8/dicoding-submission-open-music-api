const response = require('../../utils/response');

module.exports = class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postCollaborationHandler(req, h) {
    this._validator.validatePostCollaborationPayload(req.payload);

    const {id: credentialId} = req.auth.credentials;
    const {playlistId, userId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersService.verifyUserIfExists(userId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return response.send(h, {
      data: {collaborationId},
      statusCode: 201,
    });
  }

  async deleteCollaborationHandler(req, h) {
    this._validator.validateDeleteCollaborationPayload(req.payload);

    const {id: credentialId} = req.auth.credentials;
    const {playlistId, userId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return response.send(h, {
      message: 'success to delete collaboration',
    });
  }
};
