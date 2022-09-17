const {AlbumPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) =>{
    const res = AlbumPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = AlbumsValidator;
