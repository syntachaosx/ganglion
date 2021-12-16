import base from './base.mjs'

export const plugin = {
  name: 'routes',
  register: async function (server, options) {

    const routes = [base]
    routes.reduce((server, route) => route(server), server)
  },
}
