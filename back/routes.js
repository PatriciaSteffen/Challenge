const taskApi = require('./task');
const UUID = require("uuid");

const routes = [
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
    options: taskApi.get,
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
    options: taskApi.remove,
  },
];

module.exports = routes;