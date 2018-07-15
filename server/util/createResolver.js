import models from '../models'

// constructor de resolvers
// name, model, hooks, safe quien puede
// name = 'notes'
// Tenemops que recibir un nombre singulare
// si recibimos en plural

createResolver('note', {
  get: 'all',
  create: 'self || admin',
  update: 'self || admin',
  delete: 'self || admin'
})

const createResolver = (name) => {
  const nameUp = 'Notes'
  const singleName = 'note'
  const pluralName = 'notes'

  const Create = async (_, { args }) => {

  }

  return {
    Query: {
      [singleName + 'Create']: Create
    },
    Mutation: {

    }
  }
}

export default createResolver
