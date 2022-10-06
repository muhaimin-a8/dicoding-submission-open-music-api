const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthenticationError;
