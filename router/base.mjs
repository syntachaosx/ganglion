export default function (server) {
  server.route({
    method: 'GET',
    path: '/test',
    handler: function (request, h) {
      return 'hello, world!'
    },
  })
  return server
}
