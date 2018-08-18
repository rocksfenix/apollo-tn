import models from '../models'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'
import { withFilter } from 'graphql-subscriptions'
import pubsub from '../pupsub'
import agents from '../agents'

export default {
  Query: {
    agentAvailable: async () => {
      // console.log('************** AGENT AVALABLES', agents.list())
      // De momento es publica ya que posiblemente se implemente en chat
      // publico, se realizaran pruebas despues
      // TODO se haria logia de obtener el agente menos ocupado
      // de momento listamos el primero
      // const agent = agents.list()[0] ? agents.list()[0] : 'no-available-at-this-moment'

      const _id = agents.list()[0]

      if (!_id) return null

      const agent = await models.User.findById(_id)

      return agent
    },

    messages: async (_, { sender, receiver }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()

      const query = {
        $or: [
          {sender: sender, receiver: receiver},
          {sender: receiver, receiver: sender}
        ]
      }

      const messages = await models.Message.find(query).limit(20).sort({ createdAt: 1 })

      return messages
    }
  },

  Mutation: {
    messageCreate: async (_, { text, receiver }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()

      const message = await models.Message.create({
        receiver,
        text,
        sender: user.sub
      })

      pubsub.publish('newMessage', {
        newMessage: message
      })

      return message
    },

    newChat: async (_, { agent }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()

      const User = await models.User.findById(user.sub)

      if (!user) throw new NotFound()

      pubsub.publish('newChat', {
        agent,
        newChat: User
      })

      return 'ok'
    },

    availability: async (_, { connection }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      if (connection) {
        agents.add(user.sub)
        // user.sub correponde al agente que se acaba de conectar
        const User = await models.User.findById(user.sub)
        pubsub.publish('agentConnected', {
          agentConnected: User
        })
      }

      if (!connection) agents.remove(user.sub)

      return 'ok'
    }
  },

  Subscription: {
    // TODO Se van a revisar el flujo de los chats
    newMessage: {
      subscribe: withFilter(() => pubsub.asyncIterator('newMessage'), (payload, variables, ctx) => {
        return (
          payload.newMessage.receiver === ctx.user.sub ||
          payload.newMessage.sender === ctx.user.sub
        )
      })
    },

    newChat: {
      subscribe: withFilter(() => pubsub.asyncIterator('newChat'), (payload, variables, ctx) => {
        return ctx.user.sub === payload.agent && ctx.user.role === 'admin'
      })
    },

    agentConnected: {
      subscribe: withFilter(() => pubsub.asyncIterator('agentConnected'), (payload, variables, ctx) => {
        // Solo usuarios autentificados
        return typeof ctx.user.sub === 'string'
      })
    }
  }
}
