const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Boom = require('boom');


const server = Hapi.server({
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',
  routes: { cors: true },
});

const init = async () => {
  try {
    await server.register([
      require('vision'),
      require('inert'),
      {
        plugin: require('hapi-swaggered'),
        options: {
          info: {
            title: 'Challenge API Documentation',
            version: '1.0.0'
          }
        }
      },
      {
        plugin: require('hapi-swaggered-ui'),
        options: {
          path: '/docs',
          swaggerOptions: {
            validatorUrl: null
          }
        }
      }
    ]);

    routes.forEach((route) => {
      server.route(route);
    });

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);

  } catch (err) {
    console.log(err);
    Boom.badImplementation(err);
  }
};

init();

module.exports = server;