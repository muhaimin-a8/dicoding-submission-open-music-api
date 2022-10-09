const InvariantError = require('../../exceptions/InvariantError');
const {ImageHeadersSchema} = require('./schema');

const UploadsValidator = {
  validateImageHeadersPayloadSchema: (headers) => {
    const res= ImageHeadersSchema.validate(headers);

    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = UploadsValidator;
