require('dotenv').config();
const Hapi = require('@hapi/hapi');

const AlbumsService = require('./services/postgres/AlbumsService');
const albumsPlugin = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

const SongsService = require('./services/postgres/SongsService');
const songsPlugin = require('./api/songs');
const SongsValidator = require('./validator/songs');

const ClientError = require('./exceptions/ClientError');
const fs = require('fs');
const path = require('path');

const init = async ()=>{
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },

  });

  await server.register({
    plugin: albumsPlugin,
    options: {
      service: new AlbumsService(),
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songsPlugin,
    options: {
      service: new SongsService(),
      validator: SongsValidator,
    },
  });

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
