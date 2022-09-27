const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, h) => handler.postAuthenticationHandler(req, h),
  },
];

module.exports = routes;
