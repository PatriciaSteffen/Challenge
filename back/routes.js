const taskApi = require('./task');

const routes = [
  {
    method: 'GET',
    path: '/todos',
    options: taskApi.get
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