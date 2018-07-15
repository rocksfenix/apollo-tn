import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    skills: async (_, args, ctx) => {
      // TODO Uniamente enviar skills isPublished
      const skills = await models.Skill.find().populate('author courses')

      const popule = await models.Skill.populate(skills,
        { path: 'courses.lessons', model: 'Lesson' })

      const popule2 = await models.Skill.populate(popule,
        { path: 'courses.lessons.author', model: 'User' }
      )
      return popule2
    }
  },

  Mutation: {
    skillCreate: CreateSelf({
      model: 'Skill',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    skillUpdate: UpdateSelf({
      model: 'Skill',
      populate: 'author courses',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    skillDelete: DeleteSelf({
      model: 'Skill',
      only: 'admin',
      populate: 'author courses'
    })
      .createResolver((_, args, { doc }) => doc)
  }
}
