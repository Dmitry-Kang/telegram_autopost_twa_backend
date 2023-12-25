const fastify = require('fastify')()
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie')
const regularFunctions = require('./regularFunctions')

const start = async () => {
    try {
        await fastify.register(require('@fastify/cors'), {
          origin: '*',
          methods: 'GET,PUT,POST,DELETE',
        })
        await fastify.register(fastifyCookie)
        // await fastify.register(fastifySession, {
        //   secret: process.env.BACKEND_CLIENT_SESSION_SECRET,
        //   cookieName: 'session',
        //   cookie: { secure: false, maxAge: 7 * 24 * 3600 * 1000 } // Настройки куки (secure: true включает HTTPS)
        // })
        await fastify.register(require('@fastify/swagger'))
        await fastify.register(require('@fastify/swagger-ui'), {
            routePrefix: '/documentation',
            uiConfig: {
              // docExpansion: 'full',
              // deepLinking: false,
              defaultModelsExpandDepth: -1,
            },
            uiHooks: {
              onRequest: function (request, reply, next) { next() },
              preHandler: function (request, reply, next) { next() }
            },
            staticCSP: false,
            transformStaticCSP: (header) => header,
            transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
            transformSpecificationClone: true,
            
          })
          
          // Routes
          const userRoutes = require('./routes/userRoute')
          userRoutes(fastify)
          const channelRoutes = require('./routes/channelRoute')
          channelRoutes(fastify)
          const postRoutes = require('./routes/postRoute')
          postRoutes(fastify)

          console.log(`Server is running at ${3000}`)
          fastify.listen({ port: 3000, host:"0.0.0.0" }, err => {
            if (err) throw err

            // регулярные функции
            setInterval(async () => {
              await regularFunctions.regularGeneratePosts()
              await regularFunctions.postInTelegram()
              // yourFunctionToRunEvery10Minutes();
            }, 10000); 
          });
          
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start()

