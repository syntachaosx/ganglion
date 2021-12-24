import store from '../services/store.mjs'
import user from '../services/user.mjs'
import Joi from 'joi'

export default function (server) {
  server.route({
    method: 'GET',
    path: '/me',
    handler: async function (request, h) {
      const { id } = request.auth.credentials.user
      const us = store.userStore(id)
      const settings = await us.get('settings')
      return {
        user: request.auth.credentials.user,
        settings: settings ? JSON.parse(settings) : {},
      }
    },
    options: {
      auth: 'simple',
    },
  })

  server.route({
    method: 'PUT',
    path: '/me/password',
    handler: async function (request, h) {
      const { id } = request.auth.credentials.user
      const { passowrd } = request.payload
      await user.resetPassword(id, passowrd)
      return 'ok'
    },
    options: {
      auth: 'simple',
      validate: {
        failAction: async function (request, h, err) {
          return err
        },
        payload: Joi.string()
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{6,60}$')),
      },
    },
  })

  return server
}
