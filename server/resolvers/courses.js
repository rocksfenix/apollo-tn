import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    courses: async (_, args, { user = {} }) => {
      const role = user.role ? user.role : 'public'
      let query = role !== 'admin' ? { isPublished: true } : {}
      let courses = await models.Course.find(query).populate('author lessons')

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return courses.map(c => c.getDataByRole(role))
      }

      return courses
    }
  },

  Mutation: {
    courseCreate: CreateSelf({
      model: 'Course',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    courseUpdate: UpdateSelf({
      model: 'Course',
      populate: 'author lessons',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    courseDelete: DeleteSelf({
      model: 'Course',
      only: 'admin',
      populate: 'author lessons'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
