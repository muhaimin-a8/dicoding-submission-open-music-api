const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {token} = require('@hapi/jwt');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const res = await this._pool.query({
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    });
    console.log(res);
  }

  async verifyRefreshToken(token) {
    const res = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });
    console.log(token);
    if (!res.rowCount) {
      throw new InvariantError('Invalid refresh token');
    }

    return res.rows[0].id;
  }
}

module.exports = AuthenticationsService;
