// import { GetSelf, CreateSelf, DeleteSelf } from '../authorization'
import models from '../models'

export default {
  Search: {
    __resolveType (obj, context, info) {
      if (obj.__typename === 'course') {
        return 'Course'
      }

      if (obj.__typename === 'lesson') {
        return 'Lesson'
      }

      return null
    }
  },
  Query: {
    search: async (_, { text }, { doc, user }) => {
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

      console.log(result.length)
      return result
    }
  },

  Mutation: {}
}
