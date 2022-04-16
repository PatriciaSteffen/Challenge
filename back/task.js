const Boom = require('boom');
const { cache } = require('joi');
const UUID = require("uuid");
const server = require('./index');


const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(':memory:');

db.run("CREATE TABLE todo (id, state, description, dateAdde)");

const Task = [{
  "id": UUID.v1(),
  "state": "INCOMPLETE",
  "description": "Buy milk",
  "dateAdded": Date.now()
},
{
  "id": UUID.v1(),
  "state": "COMPLETE",
  "description": "Play with doge",
  "dateAdded": Date.now()
},
{
  "id": UUID.v1(),
  "state": "COMPLETE",
  "description": "Limpar ",
  "dateAdded": Date.now()
}
];

function getData(sql) {

  let result = [];
  return new Promise(function (resolve, reject) {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => { result.push(row) });
        resolve(result);
      }
    });
  });
}

const taskApi = {
  all: {
    // auth: false,
    handler(request, h) {

      try {
        return getData('SELECT * FROM todo');

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  },
  create: {
    // auth: 'jwt',
    async handler(request, h) {
      try {
        db.run('INSERT INTO todo VALUES (?, ?, ?, ?)',
          [
            UUID.v4(),
            "INCOMPLETE",
            request.payload.description,
            Date.now()
          ],
          (err) => {

            if (err) {
              throw err;
            }

            return ({ status: 'ok' });
          });

        return getData('SELECT * FROM todo');

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  },
  get: {
    auth: false,
    async handler(request, h) {
      try {
        const task = request.params.task;

        return await Task.findOne({
          _id: task.id
        });

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  },
  update: {
    // auth: 'jwt',
    // Arrumar
    async handler(request, h) {
      try {
        objIndex = Task.findIndex((obj => obj.id == request.params.id));

        //Update object's name property.
        if (request.payload.state)
          Task[objIndex].state = request.payload.state
        if (request.payload.description)
          Task[objIndex].description = request.payload.description

        return Task

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  },
  remove: {
    // auth: 'jwt',
    async handler(request, h) {
      try {
        const result = [];
        db.run(
          'DELETE FROM todo WHERE id = ?',
          request.params.id,
          function (err, result) {
            if (err) {
              reject(err);
            }
            return result
          });

        return get('SELECT * FROM todo');

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  }
};

module.exports = taskApi;