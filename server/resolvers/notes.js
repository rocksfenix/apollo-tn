import models from '../models'
import { GetSelf, CreateSelf, UpdateSelf, DeleteSelf, GetSingle } from '../authorization'

export default {
  Query: {
    // Regresa todas las notas propias
    notes: GetSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course'
    })
      .createResolver((_, args, { doc }) => doc),

    // Filtrar por tag
    notesByTags: GetSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course',
      query: ({ tags }) => ({ tags: { $in: tags } })
    })
      .createResolver((_, args, { doc }) => doc),

    // Filtrar por texto -buscar en text
    notesByText: GetSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course',
      query: ({ text }) => ({ $text: { $search: text } })
    })
      .createResolver((_, args, { doc }) => doc),

    // Nota spor cursoId
    notesByCourse: GetSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course',
      query: ({ courseId }) => ({ course: courseId })
    })
      .createResolver((_, args, { doc }) => doc),

    tagsByUser: GetSingle({
      model: 'User',
      only: 'pro free admin'
      // populate: 'lesson course',
      // query: ({ courseId }) => ({ course: courseId })
    })
      .createResolver((_, args, { doc }) => doc.tags)

  },

  Mutation: {
    noteCreate: CreateSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course'
    }).createResolver(
      async (_, args, { doc, user }) => {
        // Parsear las tags y agregar en caso de que
        // estas aun no existan en el user
        if (args.input.tags) {
          await models.User.findByIdAndUpdate(user._id,
            { $addToSet: { tags: { $each: args.input.tags } } },
            { new: true }
          )
        }
        return doc
      }
    ),

    noteUpdate: UpdateSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course'
    }).createResolver(
      async (_, args, { doc, user }) => {
        // Parsear las tags y agregar en caso de que
        // estas aun no existan en el user
        if (args.input.tags) {
          await models.User.findByIdAndUpdate(user._id,
            { $addToSet: { tags: { $each: args.input.tags } } },
            { new: true }
          )
        }
        return doc
      }
    ),

    noteDelete: DeleteSelf({
      model: 'Note',
      only: 'pro free admin',
      populate: 'lesson course'
    }).createResolver((_, args, { doc }) => doc)
  }
}
