const Boom = require('boom');
const UUID = require("uuid");

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

const taskApi = {
  all: {
    // auth: false,
    handler(request, h) {
      try {
        return Task;

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  },
  create: {
    // auth: 'jwt',
    async handler(request, h) {
      try {
        Task.push({
          id: UUID.v4(),
          state: "INCOMPLETE",
          description: request.payload.description,
          dateAdded: Date.now()
        });
        return Task;
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
        objIndex = Task.findIndex((obj => obj.id == request.params.id));

        Task.splice(objIndex,1);

        return Task

      } catch (err) {
        Boom.badImplementation(err);
      }
    }
  }
};

module.exports = taskApi;