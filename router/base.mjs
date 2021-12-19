export default function (server) {
  server.route({
    method: 'GET',
    path: '/ping',
    handler: function (request, h) {
      return 'pong'
    },
  })
  return server
}
