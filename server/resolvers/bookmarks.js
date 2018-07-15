import { GetSelf, CreateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    bookmarks: GetSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  },

  Mutation: {
    bookmarkCreate: CreateSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc),

    bookmarkDelete: DeleteSelf({
      model: 'Bookmark',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
