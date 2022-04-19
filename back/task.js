const Boom = require('boom');
const Joi = require('@hapi/joi');
const UUID = require("uuid");
const server = require('./index');


const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(':memory:');

db.run("CREATE TABLE todo (id, state, description, dateAdded)");

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
    handler({ query }, request, h) {

      try {
        let result = [];
        console.log(query);
        console.log(query.orderBy);
        let order = '';
        if (query.orderBy == 'DATE_ADDED')
          order = 'dateAdded';
        else
          order = 'description';

        return new Promise(function (resolve, reject) {
          db.all('SELECT * FROM todo  WHERE state = ? ORDER BY ? ASC',
            [query.filter, order],
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                rows.forEach((row) => { result.push(row) });
                resolve(result);
              }
            });

        });
      } catch (err) {
        Boom.badImplementation(err);
      }
    },
    description: 'Array properties',
    tags: ['api', 'todo']
  },
  create: {
    // auth: 'jwt',
    handler(request, h) {
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
    },
    description: 'Create new todo',
    tags: ['api', 'todo']
  },
  update: {
    // auth: 'jwt',
    // Arrumar
    handler(request, h) {
      try {
        sql = '';
        datas = [];

        if (request.payload.description) {
          sql = 'UPDATE todo SET description = COALESCE(?,description) WHERE id = ?';
          datas = [request.payload.description, request.params.id];
        } else if (request.payload.state) {
          sql = 'UPDATE todo SET state = COALESCE(?,state)  WHERE id = ?';
          datas = [request.payload.state, request.params.id];
        } else { }

        db.run(sql,
          datas,
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
    },
    description: 'Get algebraic remainder',
    notes: 'Pass two numbers as a & b and returns remainder',
    tags: ['api'],

  },
  remove: {
    // auth: 'jwt',
    handler(request, h) {
      try {
        db.run("DELETE FROM todo WHERE id = ?",
          [request.params.id],
          function (err) {
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
};

module.exports = taskApi;