import { createSelf, updateSelf, deleteSelf } from '../authorization'

export default {
  Query: {
    comments: () => {}
    // TODO getCommentsByLesson
  },

  Mutation: {
    commentCreate: createSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc),

    commentUpdate: updateSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc),

    commentDelete: deleteSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc)
  }
}
