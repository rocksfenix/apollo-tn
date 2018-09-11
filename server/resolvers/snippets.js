import models from '../models'
import { AuthenticationRequiredError, NotFound } from '../authorization/errors'

export default {
  Query: {
    snippets: async (_, { limit, offset }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      const snippets = await models.Snippet
        .find({ author: user.sub })
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })

      const total = await models.Snippet
        .find({ author: user.sub })
        .count()

      return {
        items: snippets,
        hasMore: offset + snippets.length < total
      }
    }
  },

  Mutation: {

    snippetCreate: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      return models.Snippet.create({ ...input, author: user.sub })
    },

    snippetUpdate: async (_, { _id, code }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      const snippet = await models.Snippet.findOne({ _id, author: user.sub })

      if (!snippet) throw new NotFound()

      snippet.code = code

      await snippet.save()

      return snippet
    },

    snippetDelete: async (_, { _id }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()

      const snippet = await models.Snippet.findOne({ _id, author: user.sub })

      if (!snippet) throw new NotFound()

      await snippet.remove()

      return snippet
    }
  }
}
