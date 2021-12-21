import userServer from '../services/user.mjs'
import Joi from 'joi'
import Boom from '@hapi/boom'
import _ from 'lodash'

export default function (server) {
  server.route({
    method: 'POST',
    path: '/login',
    handler: async function (request, h) {
      try {
        const { user_name, password } = request.payload
        const { isMatch, user } = await userServer.verify(user_name, password)
        if (!isMatch) throw Boom.badRequest('unmatched user_name or password')

        const result = await userServer.createAuthToken(user.id)
        return { token: result.token, user: _.omit(user, ['password']) }
      } catch (error) {
        throw Boom.boomify(error, { statusCode: error.statusCode })
      }
    },
    options: {
      validate: {
        failAction: async function (request, h, err) {
          return err
        },
        payload: Joi.object({
          user_name: Joi.string().required().min(1).max(15),
          password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,60}$')),
        }),
      },
    },
  })

  server.route({
    method: 'POST',
    path: '/authToken',
    handler: async function (request, h) {
      try {
        const user = request.auth.credentials.user

        const result = await userServer.createAuthToken(user.id)
        return { token: result.token }
      } catch (error) {
        throw Boom.boomify(error, { statusCode: error.statusCode })
      }
    },
    options: {
      auth: 'simple',
    },
  })

  server.route({
    method: 'POST',
    path: '/authToken/flash',
    handler: async function (request, h) {
      try {
        const token = request.auth.credentials.token
        const result = await userServer.flashToken(token)
        return result
      } catch (error) {
        throw Boom.boomify(error, { statusCode: error.statusCode })
      }
    },
    options: {
      auth: 'simple',
    },
  })

  return server
}
