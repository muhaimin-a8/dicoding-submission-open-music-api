const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (req, h) => handler.postUploadCoverAlbumHandler(req, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
];

module.exports = routes;
