import base from './base.mjs'
import user from './user.mjs'

export const plugin = {
  name: 'routes',
  register: async function (server, options) {

    const routes = [base, user]
    routes.reduce((server, route) => route(server), server)
  },
}
