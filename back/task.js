const Boom = require('boom');
const Joi = require('@hapi/joi');
const UUID = require("uuid");
const server = require('./index');
const { boolean } = require('joi');


const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(':memory:');

db.run("CREATE TABLE todo (id, state, description, dateAdded)");

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
    // auth: false,
    handler({ query }, request, h) {

      try {
        let result = [];
        let data = [];
        let sql = '';

        console.log(query.filter);
        console.log(query.orderBy);
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
        console.log(data);
        console.log(sql);

        return new Promise(function (resolve, reject) {
          db.all(sql,
            [],
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
    description: 'Get items',
    notes: 'Get items from todo list',
    tags: ['api'],
  },
  create: {
    // auth: 'jwt',
    
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
        description: Joi.string().required().note('Text to store in list')
      })
    },
    description: 'Add todo',
    notes: 'Add an item to the list',
    tags: ['api'],
  },
  update: {
    // auth: 'jwt',
    // Arrumar
    /* validate: {
       payload: Joi.object({
         state: Joi.string(),
         description: Joi.string()
       }).options({ stripUnknown: true }),
       params: Joi.object({
         id: Joi.string().required(),
       }).options({ stripUnknown: true }),
     },*/
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
    description: 'Update item',
    notes: 'Update an item from the todo list',
    tags: ['api'],

  },
  remove: {
    // auth: 'jwt',
    /*validate: {
      params: Joi.object({
        id: Joi.string().required()
      }).options({ stripUnknown: true })
    },*/
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
    description: 'Delete item',
    notes: 'Delete an item from the todo list',
    tags: ['api'],
  },
};

module.exports = taskApi;