import models from '../models'
import { updateSelf, deleteSelf } from '../authorization'
import { AuthenticationRequiredError, ForbiddenError } from '../authorization/errors'
import { withFilter } from 'graphql-subscriptions'
import pubsub from '../pupsub'

export default {
  Query: {
    userSelf: async (_, args, { user }) => {
      if (user) {
        const us = await models.User.findById(user.sub)
        return us
      }
    },

    user: async (_, { _id }) => {
      const user = await models.User.findById(_id)

      return user
    },

    // TODO unicamente admin
    allUsers: async (_, { first, skip = 0, text }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      let limit = first <= 100 ? first : 100
      const _text = text ? new RegExp(text, 'i') : null
      let query = {}

      if (_text) {
        query = {
          $or: [
            {fullname: { $regex: text, $options: 'i' }},
            {email: { $regex: text, $options: 'i' }}
          ]
        }
      }

      const users = await models.User.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
      let total = users.length

      // SI no hay consulta de texto, el total es el total absoluto
      if (!_text) {
        total = await models.User.count()
      }

      return {
        users,
        total
      }
    }

  },

  Mutation: {
    online: async (_, params, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      const u = await models.User.findById(user.sub)
      if (u) {
        u.isConnected = true
        u.connectionDate = Date.now()
        await u.save()
        pubsub.publish('onChangeConnection', {
          onChangeConnection: {
            status: true,
            user: u
          }
        })
      }
      return 'ok'
    },
    userUpdate: updateSelf({
      model: 'User',
      only: 'free pro admin'
    }).createResolver((_, args, { doc }) => doc),

    userDelete: deleteSelf({
      model: 'User',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc)
  },

  Subscription: {
    // TODO Se van a revisar el flujo de los chats
    onChangeConnection: {
      subscribe: withFilter(() => pubsub.asyncIterator('onChangeConnection'), (payload, variables, ctx) => {
        return ctx.user.role === 'admin'
      })
    }
  }
}
