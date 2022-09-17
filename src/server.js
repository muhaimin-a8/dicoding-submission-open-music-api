require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgres/AlbumsService');
const albumsPlugin = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

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

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
