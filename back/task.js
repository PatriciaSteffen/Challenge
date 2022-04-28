const Boom = require('boom');
const Joi = require('joi');
const UUID = require("uuid");

const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(':memory:');

db.run("CREATE TABLE todo (id, state, description, dateAdded)");
db.run("CREATE TABLE users (id, name, surname, password, dateAdded)");

function getData(sql, id) {
  return new Promise(function (resolve, reject) {
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


const taskApi = {
  get: {
    handler({ query }) {
      try {
        let result = [];
        let data = [];
        let sql = '';

        if (query.filter == '') {
          if (query.orderBy == 'description') {
            sql = 'SELECT * FROM todo ORDER BY description';
          }
          else {
            sql = 'SELECT * FROM todo ORDER BY dateAdded';
          }
        }
        else if (query.filter == 'COMPLETE') {
          data = [query.filter];

          if (query.orderBy == 'description') {
            sql = 'SELECT * FROM todo WHERE state = ? ORDER BY description';
          }
          else {
            sql = 'SELECT * FROM todo WHERE state = ? ORDER BY dateAdded';
          }
        }
        else {
          data = [query.filter];
          if (query.orderBy == 'description') {
            sql = 'SELECT * FROM todo WHERE state = ? ORDER BY description';
          }
          else {
            sql = 'SELECT * FROM todo WHERE state = ? ORDER BY dateAdded';
          }
        }

        return new Promise(function (resolve, reject) {
          db.all(sql,
            data,
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
    validate: {
      query: Joi.object({
        filter: Joi.string().optional().allow(""),
        orderBy: Joi.string().optional().allow(""),
      }),
    },
    description: 'Get items',
    notes: 'Get items from todo list',
    tags: ['api'],

  },
  create: {
    handler(request, h) {
      const id = UUID.v4();

      db.run('INSERT INTO todo VALUES (?, ?, ?, ?)',
        [
          id,
          "INCOMPLETE",
          request.payload.description,
          Date.now()
        ],
        (err) => {

          if (err) {
            throw err;
          }
        });

      return getData('SELECT * FROM todo WHERE id = ?', id);

    },
    validate: {
      payload: Joi.object({
        description: Joi.string().required()
      })
    },
    description: 'Add todo',
    notes: 'Add an item to the list',
    tags: ['api'],
  },
  update: {
    handler(request, h) {
      try {
        return new Promise(function (resolve, reject) {
          if (request.payload) {
            db.all('SELECT * FROM todo WHERE id = ?', [request.params.id], (err, rows) => {
              if (rows.length == 0) {
                resolve(Boom.notFound());
              }
              else {
                if (rows[0].state == "COMPLETE") {
                  resolve(Boom.badRequest());
                }
                else {
                  let sql = '';
                  let datas = [];
                  if (request.payload.description) {
                    sql = 'UPDATE todo SET description = COALESCE(?,description) WHERE id = ?';
                    datas = [request.payload.description, request.params.id];
                  } else if (request.payload.state) {
                    sql = 'UPDATE todo SET state = COALESCE(?,state) WHERE id = ?';
                    datas = [request.payload.state, request.params.id];
                  }
                  db.run(sql,
                    datas,
                    (err) => {
                      if (err) {
                        throw err;
                      }
                    });
                  resolve(getData('SELECT * FROM todo WHERE id = ?', request.params.id));
                }
              }
            });
          } else {
            resolve(Boom.badData());
          }
        });
      } catch (err) {
        Boom.badImplementation(err);
      }
    },
    validate: {
      params: Joi.object({
        description: Joi.string().optional().allow(""),
        state: Joi.string().optional().allow(""),
        id: Joi.string().required()
      }),
    },
    description: 'Update item',
    notes: 'Update an item from the todo list',
    tags: ['api'],

  },
  remove: {
    handler(request, res) {
      try {
        return new Promise(function (resolve, reject) {
          db.all('SELECT * FROM todo WHERE id = ? ', [request.params.id], (err, rows) => {
            if (rows.length == 0) {
              resolve(Boom.notFound());
            }
            else {
              db.run('DELETE FROM todo WHERE id = ?',
                [request.params.id],
                (err) => {
                  if (err) {
                    throw err;
                  }
                });
              resolve(null);
            }
          });
        });
      } catch (err) {
        Boom.badImplementation(err);
      }
    },
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
    },
    description: 'Delete item',
    notes: 'Delete an item from the todo list',
    tags: ['api'],

  },
};

module.exports = taskApi;