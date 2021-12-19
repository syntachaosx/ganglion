import prisma from '../prisma.mjs'

export default function (server) {
  server.route({
    method: 'GET',
    path: '/users',
    handler: async function (request, h) {
      return await prisma.user.findMany()
    },
  })
  return server
}
