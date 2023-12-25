const userProps = require('../properties/userProps');
const userService = require('../services/userService');

module.exports = function (fastify) {
  // authorize
  fastify.post('/authorize', {
    schema: {
      description: 'authorize request',
      tags: ['user'],
      summary: 'authorize request',
      body: {
        type: 'object',
        properties: userProps.authorizeRequest,
        required: ['telegram_id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: userProps.authorizeResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: userProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { telegram_id } = req.body

      return await userService.authorize(telegram_id)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get all
  fastify.get('/user', {
    schema: {
      description: 'Get all users',
      summary: 'Get all users',
      tags: ['user'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: userProps.getAllResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: userProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      return await userService.getAll()
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get one
  fastify.get('/user/:id', {
    schema: {
      description: 'Get user by id',
      summary: 'Get user by id',
      tags: ['user'],
      params: {
        type: 'object',
        properties: { id: { type: "string" } },
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: userProps.getOneResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: userProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const accountId = req.params.id

      return await userService.getOne(Number(accountId))
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // edit user
  fastify.patch('/user', {
    schema: {
      description: 'Edit user',
      summary: 'Edit user',
      tags: ['user'],
      body: {
        type: 'object',
        properties: userProps.editRequest,
        required: ['telegram_id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: userProps.editResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: userProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { telegram_id, config, first_name, last_name, username, tg_api } = req.body

      return await userService.edit(telegram_id, config, first_name, last_name, username, tg_api)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

};

