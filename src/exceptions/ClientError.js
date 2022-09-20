module.exports = class ClientError extends Error {
  constructor(msg, code = 400) {
    super(msg);
    this.statusCode = code;
    this.name = 'ClientError';
  }
};
