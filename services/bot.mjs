import bots from '../bot/index.mjs'
import prisma from '../prisma.mjs'
import store from './store.mjs'

const init = async function (user_id, bot_name) {
  const botSchema = bots[bot_name]
  if (!botSchema) return 'invalid bot'

  const botUser = await prisma.user.findFirst({
    where: {
      user_name: bot_name,
      role: 'Bot',
    },
  })
  const stateStore = store.botUserStore({ user_id, bot_id: botUser.id })

  return {
    async run(message) {
      const [method, ...params] = message.split(' ')
      if (botSchema[method]) return await botSchema[method](params, stateStore)
      return 'invalid action'
    },
  }
}

export default {
  init,
}
