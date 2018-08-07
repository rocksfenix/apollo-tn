import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../errors'

export default {
  Query: {
    allCourses: async (_, { first, skip = 0, text }, { user = {} }) => {
      // TODO separar isPublished para role !== admin
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

      const courses = await models.Course.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
      let total = courses.length

      // SI no hay consulta de texto, el total es el total absoluto
      if (!_text) {
        total = await models.Course.count()
      }

      return {
        courses,
        total
      }
    },

    courses: async (_, args, { user = {} }) => {
      const role = user.role ? user.role : 'public'
      let query = role !== 'admin' ? { isPublished: true } : {}
      let courses = await models.Course.find(query).populate('author lessons')

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return courses.map(c => c.getDataByRole(role))
      }

      return courses
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

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return course.getDataByRole(role)
      }

      return course
    }
  },

  Mutation: {
    courseCreate: CreateSelf({
      model: 'Course',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    courseUpdate: async (_, { input }, { doc }) => {
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

    courseDelete: DeleteSelf({
      model: 'Course',
      only: 'admin',
      populate: 'author lessons'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
