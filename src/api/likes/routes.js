const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.postAlbumLikeHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.getAlbumLikesHandler(req, h),
  },
];

module.exports = routes;
