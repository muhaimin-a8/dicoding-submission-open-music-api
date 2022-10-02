const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const res = await this._pool.query({
      text: 'INSERT INTO authentications VALUES ($1) RETURNING token',
      values: [token],
    });

    if (!res.rowCount) {
      throw new InvariantError('failed to add new refreshToken');
    }
  }

  async verifyRefreshToken(token) {
    const res = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });

    if (!res.rowCount) {
      throw new InvariantError('Invalid refresh token');
    }
  }

  async deleteRefreshToken(token) {
    await this._pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    });
  }
}

module.exports = AuthenticationsService;
