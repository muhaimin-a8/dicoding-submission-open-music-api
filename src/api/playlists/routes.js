const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, h) => handler.postPlaylistHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (req, h) => handler.getPlaylistsHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (req, h) => handler.deletePlaylistHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
