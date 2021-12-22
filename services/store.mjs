import prisma from '../prisma.mjs'

export default {
  userStore: (user_id) => {
    return {
      set: async function (name, content) {
        await prisma.userData.update({
          where: {
            ownerId: user_id,
            name,
          },
          data: {
            content,
          },
        })
        return [name, content]
      },
      get: async function (name) {
        const data = await prisma.userData.findFirst({
          where: {
            ownerId: user_id,
            name,
          },
        })
        if (data) return data.content
        return null
      },
    }
  },
  botUserStore: ({ user_id, bot_id }) => {
    return {
      set: async function (name, content) {
        await prisma.botUserData.update({
          where: {
            userId: user_id,
            botId: bot_id,
            name,
          },
          data: {
            content,
          },
        })
        return [name, content]
      },
      get: async function (name) {
        const data = await prisma.userData.findFirst({
          where: {
            userId: user_id,
            botId: bot_id,
            name,
          },
        })
        if (data) return data.content
        return null
      },
    }
  },
}
