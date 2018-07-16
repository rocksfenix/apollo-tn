import models from '../models'
import { CreateSelf, UpdateSelf, DeleteSelf } from '../authorization'

export default {
  Query: {
    skills: async (_, args, { user = {} }) => {
      // TODO Uniamente enviar skills isPublished
      const role = user.role ? user.role : 'public'
      let query = role !== 'admin' ? { isPublished: true } : {}
      const skillsUnpopulated = await models.Skill.find(query).populate('author courses')

      const popule = await models.Skill.populate(skillsUnpopulated,
        { path: 'courses.lessons', model: 'Lesson' })

      const skills = await models.Skill.populate(popule,
        { path: 'courses.lessons.author', model: 'User' }
      )

      if (role !== 'admin') {
        return skills.map(c => c.getDataByRole(role))
      }

      return skills
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
