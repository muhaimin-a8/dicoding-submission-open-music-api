require('dotenv').config();
const Hapi = require('@hapi/hapi');

const AlbumsService = require('./services/postgres/AlbumsService');
const albumsPlugin = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

const SongsService = require('./services/postgres/SongsService');
const songsPlugin = require('./api/songs');
const SongsValidator = require('./validator/songs');

const UsersService = require('./services/postgres/UsersService');
const usersPlugin = require('./api/users');
const UsersValidator = require('./validator/users');

const authenticationsPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlistsPlugin = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');

const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');

const ClientError = require('./exceptions/ClientError');
const fs = require('fs');
const path = require('path');
const Jwt = require('@hapi/jwt');

const init = async ()=>{
  const songsService = new SongsService();
  const usersService = new UsersService();
  const collaborationService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },

  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  await server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) =>({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService: new AuthenticationsService(),
        usersService: new UsersService(),
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService: new CollaborationsService(),
        playlistsService: playlistsService,
        validator: CollaborationsValidator,
      },
    },
  ]);


  server.ext('onPreResponse', (req, h) =>{
    const {response} = req;

    if (response instanceof ClientError) {
      const res = h.response({
        status: 'fail',
        message: response.message,
      });
      res.code(response.statusCode);
      return res;
    }

    if (response.isServer) {
      const res = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server',
      });
      res.code(500);

      console.log(response);

      // write error log file
      const logsDir = './../logs';
      const dateTime = new Date().toLocaleString('ind', {
        timeZone: 'Asia/Jakarta',
      });

      fs.mkdirSync(path.resolve(__dirname, logsDir), {recursive: true});
      fs.writeFileSync(
          `${path.resolve(__dirname, logsDir)}/error.log`,
          `${dateTime} : ${response.message} \n`,
          {flag: 'a+'},
      );

      return res;
    }

    return response.continue || response;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
