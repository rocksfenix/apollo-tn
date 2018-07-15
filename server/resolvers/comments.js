import { GetAll, CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    comments: GetAll({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc)
    // TODO getCommentsByLesson
  },

  Mutation: {
    commentCreate: CreateSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc),

    commentUpdate: UpdateSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc),

    commentDelete: DeleteSelf({
      model: 'Comment',
      populate: 'author lesson',
      only: 'pro free admin'
    }).createResolver((_, args, { doc }) => doc)
  }
}
