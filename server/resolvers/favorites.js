import { getSelf, createSelf, updateSelf, deleteSelf } from '../authorization'
export default {
  Query: {
    favorites: getSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    })
      .createResolver((_, args, { doc }) => doc)
  },

  Mutation: {
    favoriteCreate: createSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc),

    favoriteUpdate: updateSelf({
      model: 'Favorite',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc),

    favoriteDelete: deleteSelf({
      model: 'Favorie',
      only: 'pro free admin',
      populate: 'author lesson course'
    }).createResolver((_, args, { doc }) => doc)
  }
}
