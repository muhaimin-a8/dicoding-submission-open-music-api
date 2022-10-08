const response = require('../../utils/response');

module.exports = class PlaylistsHandler {
  constructor(playlistsService, activitiesService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._activitiesService = activitiesService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePostPlaylistPayload(req.payload);
    const {id: credentialId} = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(req.payload.name, credentialId);

    return response.send(h, {
      data: {playlistId},
      statusCode: 201,
    });
  }

  async getPlaylistsHandler(req, h) {
    const playlists = await this._playlistsService.getPlaylists(req.auth.credentials.id);

    return response.send(h, {
      data: {playlists},
    });
  }

  async deletePlaylistByIdHandler(req, h) {
    const {id: playlistId} = req.params;
    const {id: credentialId} = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return response.send(h, {
      message: 'Success to delete playlist',
    });
  }

  async postSongOnPlaylistsHandler(req, h) {
    this._validator.validatePostSongOnPlaylistPayload(req.payload);
    const {id: playlistId} = req.params;
    const {id: credentialId} = req.auth.credentials;
    const {songId} = req.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.verifySongIsExists(songId);
    await this._playlistsService.addSongToPlaylists(playlistId, songId);

    // store activities
    await this._activitiesService.addActivities({
      playlistId, songId, userId: credentialId, action: 'add',
    });

    return response.send(h, {
      message: 'success to add song on playlist',
      statusCode: 201,
    });
  }

  async getSongsOnPlaylistsHandler(req, h) {
    const {id: playlistId} = req.params;
    const {id: credentialId} = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistsService.getSongsOnPlaylist(playlistId, credentialId);

    return response.send(h, {
      data: {playlist},
    });
  }

  async deleteSongOnPlaylistHandler(req, h) {
    this._validator.validateDeleteSongOnPlaylistPayload(req.payload);
    const {id: playlistId} = req.params;
    const {id: credentialId} = req.auth.credentials;
    const {songId} = req.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.verifySongIsExists(songId);
    await this._playlistsService.deleteSongOnPlaylist(songId);

    // store activities
    await this._activitiesService.addActivities({
      playlistId, songId, userId: credentialId, action: 'delete',
    });

    return response.send(h, {
      message: 'success to delete song on playlist',
    });
  }

  async getActivitiesOnPlaylistHandler(req, h) {
    const {id: playlistId} = req.params;
    const {id: credentialId} = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._activitiesService.getActivities(playlistId);

    return response.send(h, {
      data: {
        playlistId, activities,
      },
    });
  }
};
