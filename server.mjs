import Hapi from '@hapi/hapi'
import config from './config.mjs'

const server = Hapi.server(
  config.server || {
    port: 3000,
    host: 'localhost',
  }
)

const init = async () => {
  await server.register(await import('./router/index.mjs'))

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
