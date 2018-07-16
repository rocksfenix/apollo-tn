import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    // TODO De lo contrario enviar solo las isPublished
    // TODO LessonsByText
    // TODO LessonsByTech

    lessons: async (_, args, { user = {} }) => {
      // Si no es admin

      let role = user.role ? user.role : 'public'

      if (role !== 'admin') {
        const lessons = await models.Lesson.find({ isPublished: true }).populate('author')
        return lessons.map(lesson => lesson.getDataByRole(role))
      }

      if (user.role === 'admin') {
        // A los admin enviar todas las lecciones
        return models.Lesson.find().populate('author')
      }
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
