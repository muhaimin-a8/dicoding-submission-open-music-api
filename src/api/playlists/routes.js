const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, h) => handler.postPlaylistHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
