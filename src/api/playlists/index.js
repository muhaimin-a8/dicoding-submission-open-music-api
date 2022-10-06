const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    activitiesService,
    songsService,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
        playlistsService,
        activitiesService,
        songsService,
        validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
