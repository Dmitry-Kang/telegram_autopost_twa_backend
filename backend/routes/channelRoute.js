const channelProps = require('../properties/channelProps');
const channelService = require('../services/channelService');

module.exports = function (fastify) {
  // create
  fastify.post('/channel', {
    schema: {
      description: 'Create channel',
      tags: ['channel'],
      body: {
        type: 'object',
        properties: channelProps.createRequest,
        required: ['user_id', 'channel_id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: channelProps.createResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: channelProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { user_id, channel_name, channel_id } = req.body

      return await channelService.create(user_id, channel_name, channel_id)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get all
  fastify.get('/channel', {
    schema: {
      description: 'Get all channels',
      tags: ['channel'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: channelProps.getAllResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: channelProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      return await channelService.getAll()
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get one
  fastify.get('/channel/:id', {
    schema: {
      description: 'Get channel by id',
      tags: ['channel'],
      params: {
        type: 'object',
        properties: { id: { type: "string" } },
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: channelProps.getOneResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: channelProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const id = req.params.id

      return await channelService.getOne(id)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // edit
  fastify.patch('/channel', {
    schema: {
      description: 'Edit channel',
      tags: ['channel'],
      body: {
        type: 'object',
        properties: channelProps.editRequest,
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: channelProps.editResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: channelProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { id, channel_name, channel_id, username, config, status, reason } = req.body

      return await channelService.edit(id, channel_name, channel_id, username, config, status, reason)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // delete
  fastify.delete('/channel/:id', {
    schema: {
      description: 'Delete channel by id',
      tags: ['channel'],
      params: {
        type: 'object',
        properties: { id: { type: "string" } },
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: channelProps.deleteResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: channelProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const id = req.params.id

      return await channelService.delete(id)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

};

