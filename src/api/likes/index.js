const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, {albumLikesService, albumsService}) => {
    const exportsHandler = new UploadsHandler(albumLikesService, albumsService);
    server.route(routes(exportsHandler));
  },
};
