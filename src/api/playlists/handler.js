module.exports = class PlaylistsHandler {
  constructor(playlistservice, songsService, validator) {
    this._playlistsService = playlistservice;
    this._songsService = songsService;
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
      msg: 'Success to delete playlist',
    });
  }

  async postSongToPlaylistsHandler(req, h) {
    this._validator.validatePostSongOnPlaylistPayload(req.payload);

    await this._playlistsService.verifyPlaylistOwner(req.params.id, req.auth.credentials.id);
    await this._songsService.verifySongIsExists(req.payload.songId);
    await this._playlistsService.addSongToPlaylists(req.params.id, req.payload);

    return this._renderResponse(h, {
      msg: 'success to add song on playlist',
      statusCode: 201,
    });
  }

  async getSongsOnPlaylistsHandler(req, h) {
    await this._playlistsService.verifyPlaylistOwner(req.params.id, req.auth.credentials.id);
    const playlist = await this._playlistsService.getSongsOnPlaylist(req.params.id, req.auth.credentials.id);

    return this._renderResponse(h, {
      data: {playlist},
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
