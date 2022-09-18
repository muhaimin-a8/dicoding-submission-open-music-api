const {SongPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
  validateSongPayload: (payload) =>{
    const res = SongPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = SongsValidator;
