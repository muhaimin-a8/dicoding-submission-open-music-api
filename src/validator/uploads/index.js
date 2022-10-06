const InvariantError = require('../../exceptions/InvariantError');
const {CoverAlbumPayloadSchema} = require('./schema');

const UploadsValidator = {
  validateCoverAlbumPayloadSchema: (headers) => {
    const res= CoverAlbumPayloadSchema.validate(headers);

    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = UploadsValidator;
