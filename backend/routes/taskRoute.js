const taskProps = require('../properties/taskProps');
const taskService = require('../services/taskService');

module.exports = function (fastify) {

  // test
  fastify.put('/test', {
    schema: {
      description: 'Get user tasks',
      tags: ['task'],
      summary: 'Get accounts with tasks to execute',
      body: {
        type: 'object',
        properties: taskProps.baltazarRequest,
        required: ['message'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: taskProps.baltazarResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: taskProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    const { message } = req.body
    try {
      return await taskService.getTest(message)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // test2
  fastify.get('/test2', {
    schema: {
      description: 'test2',
      tags: ['task'],
      summary: 'test2',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: taskProps.getTasksResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: taskProps.responseError,
        }
      },
    },
  }, async (req, reply) => {

    try {
      return await taskService.getTest2()
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

  // check ai tasks
  fastify.get('/check', {
    schema: {
      description: 'Check ai tasks',
      tags: ['task'],
      summary: 'Check ai tasks',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: taskProps.checkAiTasksResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: taskProps.responseError,
        }
      },
    },
  }, async (req, reply) => {

    try {
      return await taskService.checkTasks()
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  }),

  // baltazar
  fastify.put('/baltazar', {
    schema: {
      description: 'baltazar request',
      tags: ['task'],
      summary: 'baltazar request',
      body: {
        type: 'object',
        properties: taskProps.baltazarRequest,
        required: ['message'],
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: taskProps.baltazarResponse,
        },
        400: {
          description: 'Failure response',
          type: 'object',
          properties: taskProps.responseError,
        }
      },
    },
  }, async (req, reply) => {
    try {
      const { message } = req.body

      return await taskService.putBaltazar(message)
    } catch(e) {
      reply.code(400)
      return { message:`${e.message} ${e.stack}` }
    }
  })

};

