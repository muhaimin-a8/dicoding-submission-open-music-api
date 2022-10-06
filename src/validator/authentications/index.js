const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const res = PostAuthenticationPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const res = PutAuthenticationPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const res = DeleteAuthenticationPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
