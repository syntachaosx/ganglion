import prisma from '../prisma.mjs'
import userServer from '../services/user.mjs'
import Joi from 'joi'
import Boom from '@hapi/boom'
import _ from 'lodash'

export default function (server) {
  server.route({
    method: 'GET',
    path: '/users',
    handler: async function (request, h) {
      const { skip, take, user_name } = request.query
      const where = _.pickBy({ user_name }, (v) => v !== undefined)

      return await prisma.user.findMany({
        select: { id: true, nick_name: true, user_name: true, createdAt: true },
        orderBy: {
          id: 'asc',
        },
        where,
        skip,
        take
      })
    },
    options: {
      validate: {
        failAction: async function (request, h, err) {
          return err
        },
        query: {
          user_name: Joi.string().max(255),
          skip: Joi.number().default(0).min(0),
          take: Joi.number().default(10).min(1).max(100),
        }
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/user',
    handler: async function (request, h) {
      try {
        return await userServer.create(request.payload)
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
          password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,60}$')),
          repeat_password: Joi.ref('password'),
        }).with('password', 'repeat_password'),
      },
    },
  })

  server.route({
    method: 'PUT',
    path: '/user/{id}',
    handler: async function (request, h) {
      const { id } = request.params
      const payload = _.pickBy(request.payload, (v) => v !== undefined)

      try {
        return await userServer.update(id, payload)
      } catch (error) {
        throw Boom.boomify(error, { statusCode: error.statusCode })
      }
    },
    options: {
      validate: {
        failAction: async function (request, h, err) {
          return err
        },
        params: {
          id: Joi.number().required()
        },
        payload: {
          nick_name: Joi.string().min(1).max(15),
          password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,60}$')),
        }
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/user/{id}',
    handler: async function (request, h) {
      const { id } = request.params

      try {
        return await userServer.remove(id)
      } catch (error) {
        throw Boom.boomify(error, { statusCode: error.statusCode })
      }
    },
    options: {
      validate: {
        failAction: async function (request, h, err) {
          return err
        },
        params: {
          id: Joi.number().required()
        }
      }
    }
  })

  return server
}
