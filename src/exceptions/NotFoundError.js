const ClientError = require('./ClientError');

module.exports = class InvariantError extends ClientError {
  constructor(msg) {
    super(msg, 404);
    this.name = 'NotFoundError';
  }
};
