import { GetSelf, CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    issues: GetSelf({
      model: 'Issue',
      only: 'pro free admin',
      populate: 'author'
    })
      .createResolver((_, args, { doc }) => doc)
    // # Get Issues by customer only admin
    // # Get AllIsues by Status only admin
  },

  Mutation: {
    issueCreate: CreateSelf({
      model: 'Issue',
      only: 'pro free admin',
      populate: 'author'
    }).createResolver((_, args, { doc }) => doc),

    issueUpdate: UpdateSelf({
      model: 'Issue',
      only: 'pro free admin',
      populate: 'author'
    }).createResolver((_, args, { doc }) => doc),

    issueDelete: DeleteSelf({
      model: 'Issue',
      only: 'pro free admin',
      populate: 'author'
    }).createResolver((_, args, { doc }) => doc)
  }
}
