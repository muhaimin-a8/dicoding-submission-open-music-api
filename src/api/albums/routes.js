const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, h) => handler.postAlbumHandler(req, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, h) => handler.getAlbumsByIdHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req, h) => handler.putAlbumById(req, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req, h) => handler.deleteAlbumByIdHandler(req, h),
  },
];

module.exports = routes;
