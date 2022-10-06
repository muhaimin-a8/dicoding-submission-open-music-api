const Joi = require('joi');

const CoverAlbumPayloadSchema = Joi.object({
  cover: Joi.any().required(),
});

module.exports = {CoverAlbumPayloadSchema};
