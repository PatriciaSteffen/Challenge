'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Catbox = require('@hapi/catbox');
const CatboxMemory = require('@hapi/catbox-memory');

const fs = require('fs');
const util = require('util');


const readFile = util.promisify(fs.readFile);

const cacheClient = new Catbox.Client(CatboxMemory);


//start happi server and define port
const server = new Hapi.Server({
    port: 3000,
    host: 'localhost',

});

async function bracketQueryHandler(req) {
    const date = new Date;
    await cacheClient.start();
    const key = { id: 'x', segment: 'test' };
    await cacheClient.set(key, 'y', 0);

    // get item from cache segment
    const cached = await cacheClient.get(key);


    if (cached) {
        return `From cache: ${cached.item['dateAdded']}`;
    }

    // fill cache with item
    await cacheClient.set(key, { id: 'my example', state: 'INCOMPLETO', description: "lkjnvs", dateAdded: date }, 5000);

    return 'my example';
}

server.route([
    {
        method: 'GET',
        path: '/',
        config: {
            handler: async (request, h) => { return await bracketQueryHandler(request) }
        },
    },

    //Get list of TODOS 
    {
        method: 'GET', // PUT
        path: '/todos/',
        config: {
            handler: async (request, reply) => {

                const books = await readFile('./data.json', 'utf8');
                return h.response(JSON.parse(books));
            }
        },
    },


    //Get list of TODOS by Index
    {
        method: 'GET',
        path: '/todos/{index}',
        handler: (request, reply) => {
            //query to findone and specific one by index 
            return request.params.index;
            result.exec((err, res) => {
                if (res) {
                    reply(res)
                } else {
                    reply().code(404)
                }
            })
        }
    },

    // Create TODO
    {
        method: 'POST',
        path: '/api/v1/todolist',
        handler: function (request, reply) {
            //sort it by last index and only the last one 
            var last_index = Task.find().sort({ index: -1 }).limit(1);

            last_index.exec(function (err, res) {
                // Create the new Index by geting the last index +1 
                new_Index = res[0]["index"] + 1
                // make newTask OBJ
                newTask = new Task({
                    'task': request.payload.task,
                    'owner': request.payload.owner,
                    'index': new_Index
                })
                // save it reply to user
                newTask.save(function (err, newTask) {
                    reply(newTask).code(201);
                })
            })
            var newTask = { "task": request.payload.task, "owner": request.payload.owner }
            TodoList.push(newTask).

                reply(TodoList).code(201)
        }
    },


    //Edit a TODO
    {
        method: 'PUT',
        path: '/api/v1/todolist/{index}',
        handler: (request, reply) => {
            //new updated data
            var updatData = {
                "task": request.payload.task,
                "owner": request.payload.owner,
                "index": request.params.index
            }
            // find the one with index and update the data and show the result 
            Task.findOneAndUpdate({ "index": request.params.index },
                updatData,
                { new: true },
                (err, doc) => {
                    reply(doc)
                });
        }
    },

    //remove a TODO
    {
        method: 'DELETE',
        path: '/api/v1/todolist/{index}',
        handler: (request, reply) => {

            Task.findOneAndRemove({ "index": request.params.index }, (err, res) => {
                reply().code(204)
            })
        }
    }
])



const init = async () => {

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();