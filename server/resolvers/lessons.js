import models from '../models'
import { createSelf, deleteSelf } from '../authorization'
import uploadImage from '../util/upload-image'
import { GraphQLUpload } from 'apollo-upload-server'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'

export default {
  Upload: GraphQLUpload,
  Query: {
    allLessons: async (_, { first, skip = 0, text }, { user = {} }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

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
      let role = user.role ? user.role : 'public'

      if (role !== 'admin') {
        const lessons = await models.Lesson.find({ isPublished: true }).populate('author')
        return lessons.map(lesson => lesson.getDataByRole(role))
      }

      if (user.role === 'admin') {
        // A los admin enviar todas las lecciones
        return models.Lesson.find().populate('author')
      }
    },

    lesson: async (_, { slug }, { user = {} }) => {
      // TODO al obtener el curso obtener si el usuaro ya tiene lecciones
      // vistas de ese curso y señalizar
      const role = user.role ? user.role : 'public'

      let query = { slug }

      if (role !== 'admin') {
        query.isPublished = true
      }

      let lesson = await models.Lesson.findOne(query).populate('author')

      console.log(lesson)

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return lesson.getDataByRole(role)
      }

      return lesson
    }
  },

  Mutation: {
    lessonCreate: createSelf({
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

    lessonDelete: deleteSelf({
      model: 'Lesson',
      only: 'admin',
      populate: 'author'
    })
      .createResolver((_, args, { doc }) => doc),

    uploadScreenshot: async (obj, { file, lessonSlug }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const lesson = await models.Lesson.findOne({ slug: lessonSlug })

      if (!lesson) throw new NotFound()

      // Pasamos 3 valores, el file, un array con los tamaños y el folder S3
      // cover.s800
      const sizes = [
        { size: 30, suffix: 's30' },
        { size: 50, suffix: 's50' },
        { size: 100, suffix: 's100' },
        { size: 300, suffix: 's300' },
        { size: 500, suffix: 's500' },
        { size: 800, suffix: 's800' }
      ]

      const screenshot = await uploadImage(file, sizes, 'screenshot', lesson.slug)

      lesson.screenshot = screenshot

      await lesson.save()

      return lesson
    }
  }
}
