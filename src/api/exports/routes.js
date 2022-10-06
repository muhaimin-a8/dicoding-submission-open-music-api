const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (req, h) => handler.postExportPlaylistHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
