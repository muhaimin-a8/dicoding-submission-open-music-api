const {
  PostPlaylistPayloadSchema,
  PostSongOnPlaylistPayloadSchema,
  DeleteSongOnPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const res = PostPlaylistPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
  validatePostSongOnPlaylistPayload: (payload) => {
    const res = PostSongOnPlaylistPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
  validateDeleteSongOnPlaylistPayload: (payload) => {
    const res = DeleteSongOnPlaylistPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
