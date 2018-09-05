import models from '../models'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'

export default {
  Query: {
    history: async (_, { limit, offset }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      // Tenemos que retornar todo el history con limit de items
      const watched = await models.Watched
        .find({ author: user.sub })
        .limit(limit)
        .skip(offset)
        .sort({ watchedAt: -1 })

      const total = await models.Watched.find({ author: user.sub }).count()

      console.log(total, offset, offset + watched.length)
      return {
        items: watched,
        hasMore: offset + watched.length < total
      }
    }
  },
  Mutation: {
    watchedCreate: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      const { course, lesson } = input

      // Primero revisamos si no existe otro watched con la misma info
      const w = await models.Watched.findOne({ course, lesson, author: user.sub })

      if (w) {
        // Si ya existe actualizmos su watchedAt
        w.watchedAt = Date.now()
        await w.save()
        return w
      }

      const watched = await models.Watched.create({ ...input, author: user.sub })

      return watched
    },

    watchedUpdate: async (_, { course, lesson }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      const w = await models.Watched.findOne({ course, lesson, author: user.sub })
      w.watchedAt = Date.now()
      await w.save()
      return w
    }
  }
}
