import models from '../models'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'
import { withFilter } from 'graphql-subscriptions'
import pubsub from '../pupsub'
// import agents from '../agents'

export default {
  Query: {
    agentAvailable: async () => {
      // Se dispara cuando un usuario solicita soporte
      // ya sea entrando a una pagina de soporte /app etc.
      // Obtenemos el listado de administradores activos
      // y se ordenan por conversationsActives
      const agents = await models.User
        .find({ role: 'admin', isConnected: true }, null, { sort: 'conversationsActives' })

      // El primero es el mas desocupado
      return agents[0]
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
    },

    chats: async (_, { status }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()
      // TODO - filtrar por todos o por los mios

      const chats = await models.User.find({
        hasConversationActive: true,
        agentChat: user.sub
      })

      console.log('chats', chats)
      return chats
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

      const _user = await models.User.findById(user.sub)

      if (!_user) throw new NotFound()

      _user.hasConversationActive = true
      _user.conversationChanged = Date.now()
      _user.agentChat = agent

      _user.save()

      pubsub.publish('newChat', {
        agent,
        newChat: _user
      })

      return 'ok'
    },

    // el _id es el del usuario que se cerrara la
    // seccion solo el admin puede cerrar una seccion
    // de lo contrario toma el user.sub para cerrarla
    closeChat: async (_, { _id }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      let id = user.role === 'admin' ? _id : user.sub

      const u = await models.User.findById(id)

      if (!u) throw new NotFound()

      u.hasConversationActive = false
      u.conversationChanged = Date.now()

      u.save()

      return u
    },

    // Solo los usuarios admin, puede setear su isConnected
    // para dar soporte a travez del chat, se dispara
    // el evento agentConnected para notificar a los usuarios
    availability: async (_, { connection }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      // user.sub correponde al agente que se acaba de conectar
      const _user = await models.User.findById(user.sub)

      _user.isConnected = connection
      _user.connectionDate = Date.now()
      await _user.save()

      pubsub.publish('agentConnected', {
        agentConnected: _user
      })

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
