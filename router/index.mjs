import base from './base.mjs'
import user from './user.mjs'
import auth from './auth.mjs'

export const plugin = {
  name: 'routes',
  register: async function (server, options) {

    const routes = [base, user, auth]
    routes.reduce((server, route) => route(server), server)
  },
}
