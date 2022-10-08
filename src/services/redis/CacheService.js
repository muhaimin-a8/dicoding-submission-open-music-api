const redis = require('redis');
const config = require('../../utils/config');

module.exports = class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.server,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const res = await this._client.get(key);
    if (res === null) throw new Error('cache not found');

    return res;
  }

  delete(key) {
    return this._client.del(key);
  }
};
