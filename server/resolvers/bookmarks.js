import { getSelf, createSelf, deleteSelf } from '../authorization'

export default {
  Query: {
    bookmarks: getSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  },

  Mutation: {
    bookmarkCreate: createSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc),

    bookmarkDelete: deleteSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
