const Joi = require('joi');

const ExportSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().max(50).email({tlds: true}).required(),
});

module.exports = ExportSongsPayloadSchema;
