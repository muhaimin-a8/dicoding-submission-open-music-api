const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivities({playlistId, songId, userId, action}) {
    const id = `activities-${nanoid(16)}`;
    const res = await this._pool.query({
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    });

    if (!res.rowCount) {
      throw new InvariantError('cannot add new activities');
    }
  }

  async getActivities(playListId) {
    const res = await this._pool.query({
      text: 'SELECT * FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playListId],
    });

    return res.rows;
  }
};
