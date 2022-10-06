const ExportSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportSongsPayload: (payload) => {
    const res= ExportSongsPayloadSchema.validate(payload);

    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = ExportsValidator;
