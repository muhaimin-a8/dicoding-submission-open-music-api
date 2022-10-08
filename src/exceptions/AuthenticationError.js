const ClientError = require('./ClientError');

module.exports = class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
};
