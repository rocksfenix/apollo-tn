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

    user: GetSingle({
      model: 'User',
      only: 'pro free admin'
    })
      .createResolver((_, args, { doc }) => doc),

    users: GetAll({
      model: 'User',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc)

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
