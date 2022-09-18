const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/songs/{id}',
  //   handler: handler.getAlbumsByIdHandler,
  // },
  // {
  //   method: 'PUT',
  //   path: '/songs/{id}',
  //   handler: handler.putAlbumById,
  // },
  // {
  //   method: 'DELETE',
  //   path: '/songs/{id}',
  //   handler: handler.deleteAlbumByIdHandler,
  // },
];

module.exports = routes;
