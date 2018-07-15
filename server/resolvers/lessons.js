import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    lessons: async (_, args, ctx) => {
      // Si es admin enviar todas,
      // TODO De lo contrario enviar solo las isPublished
      // TODO LessonsByText
      // TODO LessonsByTech
      const lessons = await models.Lesson.find().populate('author')
      return lessons
    }
  },

  Mutation: {
    lessonCreate: CreateSelf({
      model: 'Lesson',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    lessonUpdate: UpdateSelf({
      model: 'Lesson',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    lessonDelete: DeleteSelf({
      model: 'Lesson',
      only: 'admin',
      populate: 'author'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
