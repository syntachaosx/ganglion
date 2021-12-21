import prisma from '../prisma.mjs'
import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

async function encrypt(plainText) {
  return await bcrypt.hash(plainText, 10)
}

async function create(payload) {
  const { user_name, password } = payload
  const user = await prisma.user.findUnique({ where: { user_name } })
  if (user) throw Boom.badRequest('unavailable user_name')

  const hashText = await encrypt(password)
  const result = await prisma.user.create({
    data: { nick_name: user_name, user_name, password: hashText },
  })
  return _.omit(result, ['password'])
}

async function update(id, payload) {
  const { password, ...data } = payload
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw Boom.badRequest('unavailable user_id')
  if (password) {
    const hashText = await encrypt(password)
    data.password = hashText
  }

  const result = await prisma.user.update({ where: { id }, data })
  return _.omit(result, ['password'])
}

async function remove(id) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw Boom.badRequest('unavailable user_id')

  const result = await prisma.user.delete({ where: { id } })
  return _.omit(result, ['password'])
}

async function verify(user_name, password) {
  const user = await prisma.user.findUnique({ where: { user_name } })
  if (!user) throw Boom.badRequest('unavailable user_name')

  const isMatch = await bcrypt.compare(password, user.password)
  return {
    isMatch,
    user,
  }
}

async function createAuthToken(userId) {
  return await prisma.authToken.create({
    data: { ownerId: userId, token: uuidv4() },
  })
}

async function flashToken(token) {
  await prisma.authToken.updateMany({
    where: { token },
    data: { updatedAt: new Date() },
  })
  return prisma.authToken.findFirst({ where: { token } })
}

export default {
  create,
  update,
  remove,
  verify,
  createAuthToken,
  flashToken,
}
