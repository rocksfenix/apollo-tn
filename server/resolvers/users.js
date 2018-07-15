import models from '../models'
// import formatErrors from '../util/formatErrors'
import auth from '../middlewares/auth'
import { GetAll, GetSingle, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
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
    createUser: async (_, args, ctx, info) => {
      const user = await models.User.create(args.user)
      const token = auth.getToken(user)

      return {
        success: user._id && user,
        errors: [],
        token,
        user
      }
    },

    userUpdate: UpdateSelf({
      model: 'User',
      only: 'free pro admin'
    }).createResolver((_, args, { doc }) => doc),

    userDelete: DeleteSelf({
      model: 'User',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    login: async (_, { email, password }) => {
      const user = await models.User.findOne({ email })

      if (!user) {
        return {
          success: false,
          errors: [{
            message: 'El usuario es invalido',
            path: 'user'
          }]
        }
      }

      const isValid = await user.checkPassword(password)

      if (!isValid) {
        return {
          success: false,
          errors: [{
            message: 'Pass invalido',
            path: 'password'
          }]
        }
      }

      return {
        success: true,
        errors: [],
        user,
        token: auth.getToken(user)
      }
    }
  }
}
