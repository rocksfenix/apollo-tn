import models from '../models'
import { updateSelf, deleteSelf } from '../authorization'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'
import { withFilter } from 'graphql-subscriptions'
import pubsub from '../pupsub'
import { GraphQLUpload } from 'apollo-upload-server'
import uploadImage from '../util/upload-image'

export default {
  Upload: GraphQLUpload,
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
    // Se dispara cuando un usuario este en la pagina
    // de /app modifica el documento para validar
    // que el usuario esta conectado
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

    userUpdate: async (obj, { input }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      let _id = user.sub

      // Si userId se pasa y user.role es admin se setea el usuario
      if (input._id && user.role === 'admin') {
        _id = input._id
      }

      console.log(input, _id)

      const member = await models.User.findById(_id)

      if (!member) throw new NotFound()

      console.log(member)

      Object.keys(input).forEach(key => {
        member[key] = input[key]
      })

      await member.save()

      return member
    },

    userDelete: deleteSelf({
      model: 'User',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    uploadAvatar: async (obj, { file, userId }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      let _id = user.sub

      // Si userId se pasa y user.role es admin se setea el usuario
      if (userId && user.role === 'admin') {
        _id = userId
      }

      const member = await models.User.findById(_id)

      if (!member) throw new NotFound()

      const sizes = [
        { size: 30, suffix: 's30' },
        { size: 50, suffix: 's50' },
        { size: 100, suffix: 's100' },
        { size: 300, suffix: 's300' },
        { size: 500, suffix: 's500' }
      ]

      const avatar = await uploadImage(file, sizes, 'avatar', member._id)

      member.avatar = avatar

      await member.save()

      return member
    }
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
