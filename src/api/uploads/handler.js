const response = require('../../utils/response');

module.exports = class UploadsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postUploadCoverAlbumHandler(req, h) {
    this._validator.validateCoverAlbumPayloadSchema(req.payload);

    const url = await this._storageService.writeFile(req.payload.cover, req.payload.cover.hapi );
    await this._albumsService.addCover(req.params.id, url);

    return response.send(h, {
      message: 'success to upload cover',
      statusCode: 201,
    });
  }
};
