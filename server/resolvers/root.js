// import { GetSelf, CreateSelf, DeleteSelf } from '../authorization'
import models from '../models'

export default {
  Search: {
    __resolveType (obj, context, info) {
      console.log(obj.__typename);
      
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

      // console.log(courses)
      return result
    }
  },

  Mutation: {}
}
