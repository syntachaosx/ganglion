import Hapi from '@hapi/hapi'
import config from './config.mjs'
import Joi from 'joi'
import HapiPino from 'hapi-pino'
import * as auth from './services/auth.mjs'
import * as router from './router/index.mjs'

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  debug: process.env.NODE_ENV !== 'production' ? { request: ['error'] } : {},
  ...config.server,
})

const init = async () => {
  await server.register({
    plugin: HapiPino,
    options: {
      logEvents: ['response', 'onPostStart'],
    },
  })
  await server.validator(Joi)
  await server.register(auth.plugin)
  server.auth.strategy('simple', 'simple')
  await server.register(router.plugin)
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
