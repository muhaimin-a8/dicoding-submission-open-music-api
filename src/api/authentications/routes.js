const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, h) => handler.postAuthenticationHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (req, h) => handler.putAuthenticationHandler(req, h),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (req, h) => handler.deleteAuthenticationHandler(req, h),
  },
];

module.exports = routes;
