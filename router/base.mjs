import Boom from '@hapi/boom'
import store from '../services/store.mjs'
import bot from '../services/bot.mjs'

export default function (server) {
  server.route({
    method: 'GET',
    path: '/ping',
    handler: function (request, h) {
      return 'pong'
    },
  })

  server.route({
    method: 'POST',
    path: '/console',
    handler: async function (request, h) {
      const { id } = request.auth.credentials.user
      const us = store.userStore(id)
      const access_console = await us.get('access_console')
      if (access_console !== '1') throw Boom.forbidden()
      const { cmd, name, ...payload } = request.payload

      switch (cmd) {
        case 'call_bot': {
          const abot = await bot.init(id, name)
          return await abot.run(payload.message)
        }
        default:
          return request.payload
      }
    },
    options: {
      auth: 'simple',
    },
  })

  return server
}
