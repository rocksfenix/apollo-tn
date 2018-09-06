import { GraphQLUpload } from 'apollo-upload-server'
import models from '../models'
import uploadImage from '../util/upload-image'
import { createSelf, deleteSelf } from '../authorization'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'

export default {
  Upload: GraphQLUpload,
  Query: {
    allCourses: async (_, { first, skip = 0, text }, { user }) => {
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
            {tech: { $regex: _text, $options: 'i' }}
          ]
        }
      }

      const courses = await models.Course
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

      let total = courses.length

      // Si no hay consulta de texto, el total es la cantidad en Coleccion
      if (!_text) {
        total = await models.Course.count()
      }

      return {
        courses,
        total
      }
    },

    // Solo da los cursos que esten publicados
    // Aunque sea admin
    courses: async (_, args, { user = {} }) => {
      const role = user.role ? user.role : 'public'
      // let query = role !== 'admin' ? { isPublished: true } : {}
      let courses = await models.Course
        .find({ isPublished: true })
        .populate('author lessons')

      return courses.map(c => c.getDataByRole(role))
    },

    course: async (_, { slug }, { user = {} }) => {
      // TODO al obtener el curso obtener si el usuaro ya tiene lecciones
      // vistas de ese curso y señalizar
      const role = user.role ? user.role : 'public'

      let query = { slug }

      if (role !== 'admin') {
        query.isPublished = true
      }

      let course = await models.Course.findOne(query).populate('author lessons')

      if (user.sub) {
        // Buscamos las watched de ese curso y usuario
        const watched = await models.Watched.find({ course: course._id, author: user.sub })

        const result = course.lessons.map(lesson => {
          if (watched.filter(l => l.lesson === lesson._id).length) {
            lesson.isWatched = true
          }

          return lesson
        })
        course.lessons = result
      }

      // if (role !== 'admin') {
      //   return course.getDataByRole(role)
      // }

      return course
    }
  },

  Mutation: {
    courseCreate: createSelf({
      model: 'Course',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    courseUpdate: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const course = await models.Course.findById(input._id) // .populate('author lessons')

      if (!course) throw new NotFound()

      Object.keys(input).forEach(key => {
        course[key] = input[key]
      })

      await course.save()

      const coursePopulate = await models.Course.populate(course,
        { path: 'lessons', model: 'Lesson' }
      )
      // popular las lecciones
      return coursePopulate
    },

    courseDelete: deleteSelf({
      model: 'Course',
      only: 'admin',
      populate: 'author lessons'
    })
      .createResolver((_, args, { doc }) => doc),

    uploadCover: async (_, { file, courseSlug }, { user }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const course = await models.Course.findOne({ slug: courseSlug })

      if (!course) throw new NotFound()

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

      const cover = await uploadImage(file, sizes, 'cover', course.slug)

      course.cover = cover

      await course.save()

      return 'ok'
    }
  }
}
