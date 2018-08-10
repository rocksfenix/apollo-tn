import models from '../models'
import { GetAll, GetSingle, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    userSelf: async (_, args, { user }) => {
      // console.log(user.sub)
      if (user) {
        const us = await models.User.findById(user.sub)
        // console.log(us)
        return us
      }
    },

    // user: GetSingle({
    //   model: 'User',
    //   only: 'pro free admin'
    // })
    //   .createResolver((_, args, { doc }) => doc),

    user: async (_, { _id }) => {
      const user = await models.User.findById(_id)

      return user
    },

    allUsers: async (_, { first, skip = 0, text }, { doc }) => {
      // TODO unicamente admin
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
    userUpdate: UpdateSelf({
      model: 'User',
      only: 'free pro admin'
    }).createResolver((_, args, { doc }) => doc),

    userDelete: DeleteSelf({
      model: 'User',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc)
  }
}
