import { GetSelf, CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    favorites: GetSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  },

  Mutation: {
    favoriteCreate: CreateSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc),

    favoriteUpdate: UpdateSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc),

    favoriteDelete: DeleteSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc)
  }
}
