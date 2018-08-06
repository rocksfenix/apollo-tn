import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../errors'

export default {
  Query: {
    allLessons: async (_, { first, skip = 0, text }, { user = {} }) => {
      // TODO separar isPublished para role !== admin
      let limit = first <= 100 ? first : 100
      const _text = text ? new RegExp(text, 'i') : null
      let query = {}

      if (_text) {
        query = {
          $or: [
            {title: { $regex: _text, $options: 'i' }},
            {description: { $regex: _text, $options: 'i' }},
            {transcription: { $regex: _text, $options: 'i' }},
            {tech: { $regex: _text, $options: 'i' }}
          ]
        }
      }

      const lessons = await models.Lesson.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
      let total = lessons.length

      // SI no hay consulta de texto, el total es el total absoluto
      if (!_text) {
        total = await models.Lesson.count()
      }

      return {
        lessons,
        total
      }
    },
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

    lessonUpdate: async (_, { input }, { doc }) => {
      const lesson = await models.Lesson.findById(input._id).populate('author lessons')

      if (!lesson) throw new NotFound()

      Object.keys(input).forEach(key => {
        lesson[key] = input[key]
      })

      await lesson.save()

      return lesson
    },
    
    // UpdateSelf({
    //   model: 'Lesson',
    //   populate: 'author',
    //   only: 'admin'
    // }).createResolver((_, args, { doc }) => doc),

    lessonDelete: DeleteSelf({
      model: 'Lesson',
      only: 'admin',
      populate: 'author'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
