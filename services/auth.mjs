import Boom from '@hapi/boom'
import prisma from '../prisma.mjs'
import { addDays } from 'date-fns'

const validate = async function (token, request, h) {
  let isValid = false
  let credentials = null

  const authToken = await prisma.authToken.findFirst({ where: { token }})

  if (+addDays(new Date(authToken.updatedAt), 1) - Date.now() > 0) {
    isValid = true
  }

  if (isValid) {
    const user =  await prisma.user.findFirst({ where: { id: authToken.ownerId } })
    delete user.password
    credentials = { user, token: authToken.token }
  }

  return {
    isValid,
    credentials
  }
}

const authenticate = async function (request, h) {
  const authorization = request.headers.authorization

  if (!authorization) {
    throw Boom.unauthorized('authorization is empty', 'simple')
  }

  const { isValid, credentials, response } = await validate(authorization, request, h)

  if (response !== undefined) {
    return h.response(response).takeover()
  }

  if (!isValid) {
    return h.unauthenticated(
      Boom.unauthorized('Bad token', 'simple'),
      credentials ? { credentials } : null
    )
  }

  if (!credentials || typeof credentials !== 'object') {
    throw Boom.badImplementation(
      'Bad credentials object received for Basic auth validation'
    )
  }

  return h.authenticated({ credentials })
}

const implementation = function (server, options) {
  // Hoek.assert(options, 'Missing basic auth strategy options')
  // Hoek.assert(
  //   typeof options.validate === 'function',
  //   'options.validate must be a valid function in basic scheme'
  // )

  // const settings = Hoek.clone(options)
  const scheme = {
    validate,
    authenticate,
  }

  return scheme
}

export const plugin = {
  name: 'auth',
  requirements: {
    hapi: '>=20.0.0',
  },

  register(server, options) {
    server.auth.scheme('simple', implementation)
  },
}
