const postProps = require('../properties/postProps');
const postService = require('../services/postService');

module.exports = function (fastify) {
  // create
  fastify.post('/post', {
    schema: {
      description: 'Create post',
      summary: 'Create post',
      tags: ['post'],
      body: {
        type: 'object',
        properties: postProps.createRequest,
        required: ['channel_id', 'time'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: postProps.createResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: postProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { channel_id, time } = req.body

      return await postService.create(channel_id, time)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get all
  fastify.get('/post', {
    schema: {
      description: 'Get all posts',
      summary: 'Get all posts',
      tags: ['post'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: postProps.getAllResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: postProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      return await postService.getAll()
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // get one
  fastify.get('/post/:id', {
    schema: {
      description: 'Get post by id',
      summary: 'Get post by id',
      tags: ['post'],
      params: {
        type: 'object',
        properties: { id: { type: "string" } },
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: postProps.getOneResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: postProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const id = req.params.id

      return await postService.getOne(Number(id))
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // edit
  fastify.patch('/post', {
    schema: {
      description: 'Edit post',
      summary: 'Edit post',
      tags: ['post'],
      body: {
        type: 'object',
        properties: postProps.editRequest,
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: postProps.editResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: postProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { id, channel_id, time, text, photo, status } = req.body

      return await postService.edit(id, channel_id, time, text, photo, status)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // delete
  fastify.delete('/post/:id', {
    schema: {
      description: 'Delete post by id',
      summary: 'Delete post by id',
      tags: ['post'],
      params: {
        type: 'object',
        properties: { id: { type: "string" } },
        required: ['id'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: postProps.deleteResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: postProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const id = req.params.id

      return await postService.delete(Number(id))
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

};

