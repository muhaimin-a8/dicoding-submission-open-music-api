const response = require('../../utils/response');

class ExportsHandler {
  constructor(playlistsService, exportsService, validator) {
    this._playlistsService = playlistsService;
    this._exportsService = exportsService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(req, h) {
    this._validator.validateExportSongsPayload(req.payload);
    const {id: credentialId} = req.auth.credentials;
    const {targetEmail} = req.payload;

    await this._playlistsService.verifyPlaylistAccess(req.params.playlistId, credentialId);

    await this._exportsService.sendMessage('export:playlist', JSON.stringify({
      userId: credentialId,
      targetEmail: targetEmail,
    }));

    return response.send(h, {
      message: 'Your request in queue',
      statusCode: 201,
    });
  }
}

module.exports = ExportsHandler;
