const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {playlistsService, exportsService, validator}) => {
    server.route(routes(new ExportsHandler(
        playlistsService, exportsService, validator,
    )));
  },
};
