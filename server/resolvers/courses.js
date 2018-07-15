import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    // # TODO Si no es admin unicamente enviar los cursos isPublished
    courses: async (_, args, { user }) => {
      const courses = await models.Course.find().populate('author lessons')
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
