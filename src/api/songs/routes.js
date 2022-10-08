const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (req, h) => handler.postSongHandler(req, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (req, h) => handler.getSongsHandler(req, h),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (req, h) => handler.getDetailSongByIdHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (req, h) => handler.putSongById(req, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (req, h) => handler.deleteSongByIdHandler(req, h),
  },
];

module.exports = routes;
