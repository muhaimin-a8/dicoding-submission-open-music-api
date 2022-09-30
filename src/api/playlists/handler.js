module.exports = class PlaylistsHandler {
  constructor(playlistservice, validator) {
    this._playlistsService = playlistservice;
    this._validator = validator;
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePostPlaylistPayload(req.payload);
    const {id: credentialId} = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(req.payload.name, credentialId);

    return this._renderResponse(h, {
      data: {playlistId},
      statusCode: 201,
    });
  }

  async getPlaylistsHandler(req, h) {
    const playlists = await this._playlistsService.getPlaylists(req.auth.credentials.id);
    console.log(playlists);
    return this._renderResponse(h, {
      data: {playlists},
    });
  }

  async deletePlaylistHandler(req, h) {
    await this._playlistsService.verifyPlaylistOwner(req.params.id, req.auth.credentials.id);
    await this._playlistsService.deletePlaylistById(req.params.id);

    return this._renderResponse(h, {
      msg: 'Succes to delete playlist',
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
