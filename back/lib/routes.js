const api = require('./api');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { success: true };
        }
    },
    {
        method: 'GET',
        path: '/api',
        handler: (request, h) => {
            return { success: true };
        }
    },
    {
        method: 'GET',
        path: '/api/task',
        options: api.all
    },
    {
        method: 'POST',
        path: '/api/task',
        options: api.create
    },
    {
        method: 'GET',
        path: '/api/task/{task}',
        options: api.get
    },
    {
        method: 'PUT',
        path: '/api/task/{task}',
        options: api.update
    },
    {
        method: 'DELETE',
        path: '/api/task/{task}',
        options: api.remove
    },
];

module.exports = routes;