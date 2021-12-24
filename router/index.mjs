import base from './base.mjs'
import user from './user.mjs'
import auth from './auth.mjs'
import me from './me.mjs'

export const plugin = {
  name: 'routes',
  register: async function (server, options) {

    const routes = [base, user, auth, me]
    routes.reduce((server, route) => route(server), server)
  },
}
