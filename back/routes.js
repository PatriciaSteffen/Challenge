const taskApi = require('./task');
const UUID = require("uuid");

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return { success: true };
    }
  },
  /*
  {
    method: 'POST',
    path: '/api/register',
    options: api.register
  },
  {
    method: 'GET',
    path: '/api/confirmation',
    options: api.confirmation
  },
  {
    method: 'POST',
    path: '/api/login',
    options: api.login
  },*/
  {
    method: 'GET',
    path: '/todos',
    options: taskApi.all
  },
  {
    method: 'PUT',
    path: '/todos',
    options: taskApi.create
  },
  {
    method: 'PATCH',
    path: '/todo/{id}',
    options: taskApi.update
  },
  {
    method: 'DELETE',
    path: '/todo/{id}',
    options: taskApi.remove
  },
];

module.exports = routes;