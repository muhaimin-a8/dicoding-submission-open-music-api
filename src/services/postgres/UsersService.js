const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcryptjs');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({username, password, fullname}) {
    await this._verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPass = await bcrypt.hash(password, 10);

    const res = await this._pool.query({
      // eslint-disable-next-line max-len
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPass, fullname],
    });

    if (!res.rowCount) {
      throw new InvariantError('Failed to add new user');
    }

    return res.rows[0].id;
  }

  async _verifyNewUsername(username) {
    const res = await this._pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    });

    if (res.rowCount > 0) {
      throw new InvariantError('Failed to add new user. Username already used');
    }
  }

  async verifyUserIfExists(userId) {
    const res = await this._pool.query({
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    });

    if (!res.rowCount) {
      throw new NotFoundError('User not fund');
    }
  }

  async verifyUserCredential({username, password}) {
    const res = await this._pool.query({
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    });
    if (!res.rowCount) {
      throw new AuthenticationError('Invalid credentials');
    }

    const {id, password: hashedPass} = res.rows[0];

    if (!await bcrypt.compare(password, hashedPass)) {
      throw new AuthenticationError('Invalid credentials');
    }

    return id;
  }
}

module.exports = UsersService;
