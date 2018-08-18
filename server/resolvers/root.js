import models from '../models'
import { AuthenticationRequiredError } from '../authorization/errors'

export default {
  Search: {
    __resolveType (obj, context, info) {
      if (obj.__typename === 'Course') {
        return 'Course'
      }

      if (obj.__typename === 'Lesson') {
        return 'Lesson'
      }

      return null
    }
  },
  Query: {
    // Solo usuarios Authentificados
    search: async (_, { text }, { doc, user }) => {
      if (!user) throw new AuthenticationRequiredError()
      const title = new RegExp(text, 'i')
      const query = {
        $or: [
          {title: { $regex: title }},
          {description: { $regex: title }},
          {transcription: { $regex: title }},
          {tech: { $regex: title }}
        ]
      }
      const courses = await models.Course.find(query).populate('lessons author')

      const lessons = await models.Lesson.find(query).populate('author')

      const result = [
        ...courses,
        ...lessons
      ]

      // console.log(courses)
      return result
    }
  },

  Mutation: {}
}
